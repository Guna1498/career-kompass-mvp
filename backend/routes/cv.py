from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from services.claude import analyse_cv as _analyse_cv
from services.pdf_parser import extract_text

router = APIRouter()


@router.post("/analyse-cv")
async def analyse_cv(cv_file: UploadFile = File(...), job_description: str = Form(...)):
    try:
        file_bytes = await cv_file.read()
        cv_text = extract_text(file_bytes)
        result = _analyse_cv(cv_text, job_description)
        result["cv_text"] = cv_text
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
