from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.claude import rewrite_cv as _rewrite_cv

router = APIRouter()


class RewriteRequest(BaseModel):
    cv_text: str
    job_description: str
    gaps: dict


@router.post("/rewrite-cv")
async def rewrite_cv(body: RewriteRequest):
    try:
        return _rewrite_cv(body.cv_text, body.job_description, body.gaps)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
