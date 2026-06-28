# Career Kompass MVP

## Project overview
AI-powered career coach web app. Users paste a job description and upload 
their CV to receive a gap analysis, tailored CV rewrite, and prioritised 
action plan. Built as an MVP to demonstrate full-stack AI product capability.

## Tech stack
- Backend: FastAPI (Python 3.11), runs on port 8000
- Frontend: React + Vite (plain JavaScript, no TypeScript), runs on port 5173
- AI: Google Gemini API (gemini-1.5-flash)
- PDF parsing: PyMuPDF (imported as fitz)
- Environment variables: python-dotenv (key name: GEMINI_API_KEY)
- Package manager: pip (backend), npm (frontend)

## Folder structure
career-kompass-mvp/
├── backend/
│   ├── main.py              # FastAPI app entry point, CORS config
│   ├── requirements.txt
│   ├── .env                 # never commit this
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── jd.py            # JD parsing endpoint
│   │   ├── cv.py            # CV upload + gap analysis endpoint
│   │   ├── rewrite.py       # CV rewriter endpoint
│   │   └── action_plan.py   # Action plan generator endpoint
│   └── services/
│       ├── __init__.py
│       ├── claude.py        # all Anthropic API calls go here
│       └── pdf_parser.py    # PDF text extraction logic
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/      # one file per component
│   │   ├── pages/           # one file per page/step
│   │   └── api/             # all fetch calls to backend
│   ├── public/
│   └── vite.config.js
├── CLAUDE.md
└── .gitignore

## Core rules — always follow these
- Never use TypeScript, always plain JavaScript (.js and .jsx only)
- Never persist CV data server-side — process in memory only (GDPR compliance)
- Never hardcode API keys — always load from .env via python-dotenv
- All backend endpoints must return JSON
- All Anthropic API calls must go in backend/services/claude.py only
- Always enable CORS in main.py for localhost:5173 during development
- Keep React components small and single-purpose
- Always handle errors gracefully — every endpoint needs try/except
- Never commit .env, venv/, node_modules/, or __pycache__/

## API endpoints (backend)
- POST /api/parse-jd        → accepts {job_description: string}
- POST /api/analyse-cv      → accepts multipart form (cv_file + job_description)
- POST /api/rewrite-cv      → accepts {cv_text, job_description, gaps}
- POST /api/action-plan     → accepts {cv_text, job_description, gaps}
- GET  /health              → returns {status: ok}

## Claude API usage rules
- Model: always claude-sonnet-4-6
- max_tokens: 1000 for short outputs, 4000 for CV rewrites
- Always prompt Claude to return structured JSON only — no preamble, 
  no markdown backticks, no explanation outside the JSON
- Strip any accidental ```json fences before parsing responses
- Wrap every Claude API call in try/except and return a clear error message

## Frontend rules
- Vite proxy: all /api calls forward to http://localhost:8000
- User flow is strictly linear: JD input → CV upload → gap analysis → 
  CV rewrite → action plan
- Store analysis results in React state, not localStorage
- Show a loading spinner during every API call
- Show a clear error message if any API call fails

## Running the project locally
# Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm run dev

# Check API docs
open http://localhost:8000/docs

## Git conventions
- Main branch: main (only working, demo-ready code)
- Dev branch: dev (all active development)
- Commit format: feat: / fix: / chore: followed by short description
- Example: feat: add gap analyser endpoint

## What NOT to do
- Do not use TypeScript under any circumstances
- Do not install unnecessary packages — keep dependencies minimal
- Do not store user CV data anywhere after the request completes
- Do not skip error handling to save time
- Do not mix Claude API logic into route files — always use services/claude.py