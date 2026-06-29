from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from database import supabase_admin, get_current_user
from services.claude import rewrite_cv as _rewrite_cv

router = APIRouter()


class RewriteRequest(BaseModel):
    cv_text: str
    job_description: str
    gaps: dict


@router.post("/rewrite-cv")
async def rewrite_cv(body: RewriteRequest, user=Depends(get_current_user)):
    try:
        result = _rewrite_cv(body.cv_text, body.job_description, body.gaps)
        analysis_id = body.gaps.get("analysis_id")
        if analysis_id:
            supabase_admin.table("analyses").update({"rewritten_cv": result}) \
                .eq("id", analysis_id).execute()
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
