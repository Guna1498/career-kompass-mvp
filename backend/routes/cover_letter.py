from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from database import get_current_user
from services.claude import generate_cover_letter as _generate

router = APIRouter()


class CoverLetterRequest(BaseModel):
    cv_text: str
    job_description: str
    user_name: str


@router.post("/cover-letter")
async def cover_letter(body: CoverLetterRequest, user=Depends(get_current_user)):
    try:
        return _generate(body.cv_text, body.job_description, body.user_name)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
