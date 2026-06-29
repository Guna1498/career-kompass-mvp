import json
import logging
import os
import re

import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

logger = logging.getLogger("uvicorn.error")

_DEEPSEEK_KEY = os.getenv("DEEPSEEK_API_KEY", "")
_GROQ_KEY = os.getenv("GROQ_API_KEY", "")

_DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

_TIMEOUT = 45


# ── Provider calls ─────────────────────────────────────────────────────────────

def call_deepseek(prompt: str) -> str:
    if not _DEEPSEEK_KEY:
        raise ValueError("DEEPSEEK_API_KEY not configured")
    resp = httpx.post(
        _DEEPSEEK_URL,
        headers={"Authorization": f"Bearer {_DEEPSEEK_KEY}", "Content-Type": "application/json"},
        json={"model": "deepseek-chat", "messages": [{"role": "user", "content": prompt}], "temperature": 0.1},
        timeout=_TIMEOUT,
    )
    if resp.status_code == 429:
        raise Exception("DeepSeek rate limit (429)")
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def call_groq(prompt: str) -> str:
    if not _GROQ_KEY:
        raise ValueError("GROQ_API_KEY not configured")
    resp = httpx.post(
        _GROQ_URL,
        headers={"Authorization": f"Bearer {_GROQ_KEY}", "Content-Type": "application/json"},
        json={"model": "llama-3.3-70b-versatile", "messages": [{"role": "user", "content": prompt}], "temperature": 0.1},
        timeout=_TIMEOUT,
    )
    if resp.status_code == 429:
        raise Exception("Groq rate limit (429)")
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def call_ai(prompt: str) -> str:
    try:
        text = call_deepseek(prompt)
        logger.info("[AI] Provider: DeepSeek ✓")
        return text
    except Exception as e:
        logger.warning(f"[AI] DeepSeek failed ({e}), falling back to Groq")

    try:
        text = call_groq(prompt)
        logger.info("[AI] Provider: Groq (fallback) ✓")
        return text
    except Exception as e:
        logger.error(f"[AI] Groq also failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Both AI providers are unavailable. Please try again in a moment.",
        )


def _parse_json(text: str) -> dict:
    text = re.sub(r"```json\s*|\s*```", "", text).strip()
    return json.loads(text)


# ── Feature functions ──────────────────────────────────────────────────────────

def parse_jd(job_description: str) -> dict:
    prompt = f"""Analyse the following job description and return ONLY valid JSON with no preamble, no markdown, no explanation.

The JSON must have exactly these fields:
{{
  "skills_required": ["list of must-have technical and soft skills"],
  "nice_to_have": ["list of optional or preferred skills"],
  "seniority": "one of: junior / mid / senior / lead",
  "ats_keywords": ["important keywords an ATS would scan for"],
  "company_signals": "brief 1-sentence note on company culture or type inferred from the JD"
}}

Job description:
{job_description}"""
    try:
        return _parse_json(call_ai(prompt))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[parse_jd] JSON parse failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse job description. Please try again.")


def analyse_cv(cv_text: str, job_description: str) -> dict:
    prompt = f"""Compare the candidate's CV against the job description and return ONLY valid JSON with no preamble, no markdown, no explanation.

The JSON must have exactly these fields:
{{
  "match_score": <integer 0-100 reflecting overall fit>,
  "matched_skills": ["skills present in both CV and JD"],
  "missing_skills": ["skills required by JD but absent from CV"],
  "transferable_skills": ["CV skills not in JD but relevant or transferable"],
  "summary": "2-3 sentence plain-English overview of the candidate's fit"
}}

Job description:
{job_description}

CV:
{cv_text}"""
    try:
        return _parse_json(call_ai(prompt))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[analyse_cv] JSON parse failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyse CV. Please try again.")


def rewrite_cv(cv_text: str, job_description: str, gaps: dict) -> dict:
    prompt = f"""You are a professional CV writer. Rewrite the candidate's COMPLETE CV to optimise it for the provided job description.

STRICT RULES:
1. Return ONLY valid JSON — no preamble, no markdown fences, no explanation, no text outside the JSON object
2. Preserve ALL factual information exactly: full name, email, phone, location, LinkedIn, GitHub, all dates, company names, job titles, degrees, institutions, project names, GPA
3. ONLY rewrite descriptive bullet points and the about/summary section — never invent experience, credentials, or skills the candidate does not have
4. Incorporate job description keywords naturally into existing bullet points where genuinely relevant
5. If a section does not exist in the CV (e.g. projects, publications), return an empty array [] for list fields or empty strings for string fields
6. Include EVERY bullet point from the original CV in the output — do not drop any
7. If the original bullet is already strong and matches the JD, the rewritten version may be identical

The JSON must have EXACTLY this structure (copy the keys verbatim):
{{
  "personal_details": {{
    "name": "candidate full name",
    "title": "professional title or headline from CV",
    "email": "email address",
    "phone": "phone number",
    "location": "city/country",
    "linkedin": "linkedin url or empty string",
    "github": "github url or empty string"
  }},
  "about_me": {{
    "original": "original about/summary paragraph from CV",
    "rewritten": "improved version weaving in JD keywords"
  }},
  "work_experience": [
    {{
      "company": "company name exactly as in CV",
      "role": "job title exactly as in CV",
      "period": "dates exactly as in CV",
      "location": "location as in CV",
      "bullets": [
        {{
          "original": "exact original bullet text",
          "rewritten": "improved bullet naturally incorporating JD keywords"
        }}
      ]
    }}
  ],
  "education": [
    {{
      "degree": "degree name exactly as in CV",
      "institution": "institution name exactly as in CV",
      "period": "dates exactly as in CV",
      "location": "location if present, else empty string"
    }}
  ],
  "projects": [
    {{
      "name": "project name exactly as in CV",
      "period": "dates if present, else empty string",
      "bullets": [
        {{
          "original": "exact original bullet",
          "rewritten": "improved bullet incorporating JD keywords"
        }}
      ]
    }}
  ],
  "skills": {{
    "original": "original skills section text from CV",
    "rewritten": "rewritten skills section incorporating relevant JD keywords"
  }},
  "keywords_added": ["each JD keyword that was added to the rewrite"],
  "summary": "1-2 sentence overview of the main improvements made"
}}

Job description:
{job_description}

CV:
{cv_text}

Gap analysis:
{json.dumps(gaps)}"""
    try:
        return _parse_json(call_ai(prompt))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[rewrite_cv] JSON parse failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to rewrite CV. Please try again.")


def generate_cover_letter(cv_text: str, job_description: str, user_name: str) -> dict:
    prompt = f"""You are a professional cover letter writer. Generate a tailored cover letter for the candidate.

STRICT RULES:
1. Return ONLY valid JSON — no preamble, no markdown fences, no explanation
2. Extract the company name directly from the job description — NEVER use [Company Name], [Hiring Manager], or any other placeholder text
3. Reference specific requirements from the job description and specific experiences from the CV
4. Sign the letter with the candidate name provided

Cover letter structure (4 paragraphs):
- Paragraph 1 (Opening): State the exact role applied for. Write a strong, specific hook about why this particular role and company appeals to the candidate.
- Paragraph 2 (Why them): Reference 2-3 specific things about the company or role pulled from the JD that appeal to the candidate.
- Paragraph 3 (Why you): Map 2-3 of the strongest matching experiences from the CV to specific JD requirements. Use concrete examples and metrics where available.
- Paragraph 4 (Closing): Express enthusiasm, state availability for interview, and include a clear call to action.

The JSON must have exactly these fields:
{{
  "cover_letter": "full cover letter as a single string. Use \\n\\n between paragraphs. Start with Dear [extracted name/team], — never use a placeholder. End with Yours sincerely,\\n\\n{user_name}",
  "subject_line": "concise email subject line, e.g. Application for Senior AI Engineer — {user_name}",
  "word_count": <integer word count of the cover_letter value>,
  "keywords_used": ["each JD keyword naturally included in the letter"]
}}

Job description:
{job_description}

CV:
{cv_text}

Candidate name: {user_name}"""
    try:
        return _parse_json(call_ai(prompt))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[generate_cover_letter] JSON parse failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate cover letter. Please try again.")


def action_plan(cv_text: str, job_description: str, gaps: dict) -> dict:
    prompt = f"""Generate a prioritised action plan to help this candidate close their skill gaps and improve their chances for the role. Return ONLY valid JSON with no preamble, no markdown, no explanation.

The JSON must have exactly these fields:
{{
  "actions": [
    {{
      "action": "specific thing to do",
      "skill_gap_addressed": "which gap this closes",
      "impact": "high or medium or low",
      "effort_hours": <estimated hours as integer>,
      "resource_url": "a real, plausible URL to a course, article, or tool",
      "suggested_weeks": <how many weeks to complete as integer>
    }}
  ],
  "total_hours": <sum of all effort_hours as integer>,
  "summary": "2-3 sentence overview of the plan"
}}

Job description:
{job_description}

CV:
{cv_text}

Gap analysis:
{json.dumps(gaps)}"""
    try:
        return _parse_json(call_ai(prompt))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[action_plan] JSON parse failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate action plan. Please try again.")
