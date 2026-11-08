import { asyncHandler } from "../utils/async.js";
import { generateJSON } from "../utils/gemini.js";
import {
  bulletsPrompt,
  generatePrompt,
  skillsPrompt,
  summaryPrompt,
  tailorPrompt,
} from "../utils/prompts.js";

export const runAi = asyncHandler(async (req, res) => {
  const { action, resume, section, item } = req.body;
  if (!resume) {
    return res.status(400).json({ message: "Resume data is required." });
  }

  let result;
  switch (action) {
    case "summary":
      result = await generateJSON(summaryPrompt(resume));
      break;
    case "generate":
    case "tailor":
      if (!resume.jobDescription?.trim()) {
        return res.status(400).json({
          message: "Paste a job description first so Gemini can write the resume.",
        });
      }
      result = await generateJSON(
        action === "generate" ? generatePrompt(resume) : tailorPrompt(resume)
      );
      break;
    case "bullets":
      result = await generateJSON(bulletsPrompt(resume, section, item));
      break;
    case "skills":
      result = await generateJSON(skillsPrompt(resume));
      break;
    default:
      return res.status(400).json({ message: "Unknown AI action." });
  }

  res.json({ result });
});
