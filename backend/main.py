from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import jd, cv, rewrite, action_plan, auth, analyses, download

app = FastAPI(title="Career Kompass API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(jd.router, prefix="/api")
app.include_router(cv.router, prefix="/api")
app.include_router(rewrite.router, prefix="/api")
app.include_router(action_plan.router, prefix="/api")
app.include_router(analyses.router, prefix="/api")
app.include_router(download.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
