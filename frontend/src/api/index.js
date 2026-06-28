const BASE = "/api";

export async function parseJD(jobDescription) {
  const res = await fetch(`${BASE}/parse-jd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: jobDescription }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to parse job description");
  return res.json();
}

export async function analyseCV(file, jobDescription) {
  const form = new FormData();
  form.append("cv_file", file);
  form.append("job_description", jobDescription);
  const res = await fetch(`${BASE}/analyse-cv`, { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to analyse CV");
  return res.json();
}

export async function rewriteCV(cvText, jobDescription, gaps) {
  const res = await fetch(`${BASE}/rewrite-cv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_text: cvText, job_description: jobDescription, gaps }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to rewrite CV");
  return res.json();
}

export async function actionPlan(cvText, jobDescription, gaps) {
  const res = await fetch(`${BASE}/action-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_text: cvText, job_description: jobDescription, gaps }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to generate action plan");
  return res.json();
}
