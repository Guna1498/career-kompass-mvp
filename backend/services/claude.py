import os
import json
import re

from google import genai
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
_MODEL = "gemini-2.5-flash"


def _call(prompt: str) -> dict:
    try:
        response = _client.models.generate_content(model=_MODEL, contents=prompt)
        text = re.sub(r"```json\s*|\s*```", "", response.text).strip()
        return json.loads(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {e}")


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
    return _call(prompt)


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
    return _call(prompt)


def rewrite_cv(cv_text: str, job_description: str, gaps: dict) -> dict:
    prompt = f"""Rewrite the candidate's CV bullet points to mirror the language and keywords of the job description, addressing the identified skill gaps. Return ONLY valid JSON with no preamble, no markdown, no explanation.

The JSON must have exactly these fields:
{{
  "rewritten_sections": [
    {{"original": "original bullet or sentence", "rewritten": "improved version targeting the JD"}}
  ],
  "keywords_added": ["list of JD keywords incorporated into the rewrite"],
  "summary": "1-2 sentence note on the main improvements made"
}}

Job description:
{job_description}

CV:
{cv_text}

Gap analysis:
{json.dumps(gaps)}"""
    return _call(prompt)


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
    return _call(prompt)
