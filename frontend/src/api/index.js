const BASE = "/api";

function authHeader() {
  const token = localStorage.getItem("ck_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseError(res, fallback) {
  try {
    const body = await res.json();
    return body.detail || fallback;
  } catch {
    return fallback;
  }
}

export async function register(email, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Registration failed"));
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Login failed"));
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Session expired");
  return res.json();
}

export async function getAnalyses() {
  const res = await fetch(`${BASE}/analyses`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to load history"));
  return res.json();
}

export async function parseJD(jobDescription) {
  const res = await fetch(`${BASE}/parse-jd`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ job_description: jobDescription }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to parse job description"));
  return res.json();
}

export async function analyseCV(file, jobDescription) {
  const form = new FormData();
  form.append("cv_file", file);
  form.append("job_description", jobDescription);
  const res = await fetch(`${BASE}/analyse-cv`, {
    method: "POST",
    headers: { ...authHeader() },
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to analyse CV"));
  return res.json();
}

export async function rewriteCV(cvText, jobDescription, gaps) {
  const res = await fetch(`${BASE}/rewrite-cv`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ cv_text: cvText, job_description: jobDescription, gaps }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to rewrite CV"));
  return res.json();
}

export async function actionPlan(cvText, jobDescription, gaps) {
  const res = await fetch(`${BASE}/action-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ cv_text: cvText, job_description: jobDescription, gaps }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to generate action plan"));
  return res.json();
}

async function triggerBlobDownload(url, body, filename, fallback) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res, fallback));
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export async function downloadCVDocx(cvResult) {
  await triggerBlobDownload(
    `${BASE}/download-cv/docx`,
    cvResult,
    "rewritten_cv.docx",
    "Failed to generate Word document",
  );
}

export async function downloadCVPdf(cvResult) {
  await triggerBlobDownload(
    `${BASE}/download-cv/pdf`,
    cvResult,
    "rewritten_cv.pdf",
    "Failed to generate PDF",
  );
}
