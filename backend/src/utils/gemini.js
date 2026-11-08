const JSON_FENCE = /```(?:json)?\s*([\s\S]*?)```/i;

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

export async function generateJSON(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.includes("your_gemini")) {
    const error = new Error(
      "Add your Gemini API key to backend/.env as GEMINI_API_KEY."
    );
    error.statusCode = 500;
    throw error;
  }

  const models = unique([
    process.env.GEMINI_MODEL,
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-3.5-flash",
  ]);

  let lastError;
  for (const model of models) {
    try {
      return await generateWithModel(key, model, prompt);
    } catch (err) {
      lastError = err;
      if (/no longer available|not found|not supported/i.test(err.message)) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

async function generateWithModel(key, model, prompt) {
  const attempts = [
    {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: "minimal" },
    },
    { responseMimeType: "application/json" },
    {},
  ];

  let lastError;
  for (const options of attempts) {
    try {
      const text = await requestGemini(key, model, prompt, options);
      return parseModelJSON(text);
    } catch (err) {
      lastError = err;
      if (/invalid argument|thinking|mime|responseMimeType/i.test(err.message)) continue;
      if (err.code === "PARSE") continue;
      throw err;
    }
  }
  throw lastError;
}

async function requestGemini(key, model, prompt, options) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const generationConfig = {
    temperature: 0.4,
    maxOutputTokens: 8192,
  };
  if (options.responseMimeType) {
    generationConfig.responseMimeType = options.responseMimeType;
  }
  if (options.thinkingConfig) {
    generationConfig.thinkingConfig = options.thinkingConfig;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      payload?.error?.message ||
      "Gemini request failed. Check your API key and model name.";
    const error = new Error(message);
    error.statusCode = 502;
    throw error;
  }

  const candidate = payload?.candidates?.[0];
  const text = candidate?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    const reason = candidate?.finishReason || payload?.promptFeedback?.blockReason;
    const error = new Error(
      reason
        ? `Gemini returned no text (${reason}). Try again.`
        : "Gemini returned an empty response."
    );
    error.statusCode = 502;
    throw error;
  }

  return text;
}

function parseModelJSON(text) {
  const fenced = text.match(JSON_FENCE);
  const raw = (fenced ? fenced[1] : text).trim();
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        /* fall through */
      }
    }
    const error = new Error("Gemini returned text that was not valid JSON. Try again.");
    error.statusCode = 502;
    error.code = "PARSE";
    throw error;
  }
}
