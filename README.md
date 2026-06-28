# Career Kompass MVP

An AI-powered career coach web app that analyses job descriptions against 
your CV and delivers a gap analysis, tailored CV rewrite, and prioritised 
action plan — all in one flow.

Built as a full-stack MVP using FastAPI, React, and the Anthropic Claude API.

---

## What it does

1. **JD Parser** — paste any job description and extract required skills, 
   nice-to-haves, seniority signals, and ATS keywords
2. **CV Gap Analyser** — upload your CV as a PDF and get a match score 
   per skill category with specific gaps highlighted
3. **CV Rewriter** — get your CV bullet points rewritten to mirror the 
   JD language with a before/after diff view
4. **Action Plan Generator** — receive a prioritised list of courses, 
   projects, and certifications ranked by impact vs effort

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python 3.11) |
| Frontend | React + Vite (JavaScript) |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| PDF parsing | PyMuPDF |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project structure

```
career-kompass-mvp/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── requirements.txt     # Python dependencies
│   ├── routes/              # API endpoint definitions
│   │   ├── jd.py
│   │   ├── cv.py
│   │   ├── rewrite.py
│   │   └── action_plan.py
│   └── services/            # Business logic
│       ├── claude.py        # All Claude API calls
│       └── pdf_parser.py    # PDF text extraction
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Step-by-step flow pages
│   │   └── api/             # Backend fetch calls
│   └── vite.config.js
├── CLAUDE.md                # Claude Code project briefing
└── README.md
```

---

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 18+
- An Anthropic API key (get one at console.anthropic.com)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/career-kompass-mvp.git
cd career-kompass-mvp
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows (WSL2)

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Open .env and add your Anthropic API key
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

### 4. Run locally

```bash
# Terminal 1 — Backend (from /backend)
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend (from /frontend)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

---

## Environment variables

Create a `.env` file inside the `backend/` folder:

```
ANTHROPIC_API_KEY=your-api-key-here
```

Never commit this file. It is covered by `.gitignore`.

---

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /api/parse-jd | Extract structured data from a job description |
| POST | /api/analyse-cv | Upload CV PDF and get gap analysis vs JD |
| POST | /api/rewrite-cv | Get tailored CV rewrite based on gaps |
| POST | /api/action-plan | Get prioritised action plan to close skill gaps |

Full interactive API docs available at `/docs` when running locally.

---

## Privacy and data handling

No CV data is stored server-side. All uploaded files are processed 
in memory during the request and discarded immediately after the 
response is returned. This project is designed with GDPR compliance 
in mind from day one.

---

## Roadmap

### MVP (current)
- [x] Project scaffold and architecture
- [ ] JD parser
- [ ] CV upload and gap analyser
- [ ] CV rewriter with diff view
- [ ] Action plan generator
- [ ] Results dashboard

### Version 2
- [ ] Cover letter generator
- [ ] Interview question predictor
- [ ] User accounts and saved history
- [ ] LinkedIn profile optimiser
- [ ] ATS score simulator

### Version 3
- [ ] AI career coach chat
- [ ] Job application tracking board
- [ ] Skill growth graph
- [ ] Multi-role comparison

---

## Built with

- [FastAPI](https://fastapi.tiangolo.com)
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Anthropic Claude API](https://docs.anthropic.com)
- [PyMuPDF](https://pymupdf.readthedocs.io)

---

## License

MIT