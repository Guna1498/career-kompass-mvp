from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends

from database import supabase_admin, get_current_user
from services.claude import analyse_cv as _analyse_cv
from services.pdf_parser import extract_text

router = APIRouter()


@router.post("/analyse-cv")
async def analyse_cv(
    cv_file: UploadFile = File(...),
    job_description: str = Form(...),
    user=Depends(get_current_user),
):
    try:
        file_bytes = await cv_file.read()
        cv_text = extract_text(file_bytes)
        result = _analyse_cv(cv_text, job_description)

        row = supabase_admin.table("analyses").insert({
            "user_id": str(user.id),
            "job_description": job_description,
            "match_score": result["match_score"],
            "gaps": result,
        }).execute()
        result["analysis_id"] = row.data[0]["id"]
        result["cv_text"] = cv_text
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
