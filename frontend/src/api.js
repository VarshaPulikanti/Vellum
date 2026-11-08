const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "vellum_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { ...options.headers };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Gemini is taking too long. Click Generate resume again.");
    }
    throw new Error("Could not reach the API. Is the backend running?");
  }

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!res.ok) {
      throw new Error(text || `Request failed (${res.status})`);
    }
  }
  if (!res.ok) {
    throw new Error(data.message || data.error || text || `Request failed (${res.status})`);
  }
  return data;
}

export async function register(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMe() {
  return request("/auth/me");
}

export async function fetchResumes() {
  return request("/resumes");
}

export async function fetchResume(id) {
  return request(`/resumes/${id}`);
}

export async function createResume(payload) {
  return request("/resumes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateResume(id, payload) {
  return request(`/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteResume(id) {
  return request(`/resumes/${id}`, { method: "DELETE" });
}

export async function runAi(action, resume, extra = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  try {
    return await request("/ai", {
      method: "POST",
      body: JSON.stringify({ action, resume, ...extra }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
