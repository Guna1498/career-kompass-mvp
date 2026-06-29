from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from database import get_current_user
from services.claude import parse_jd as _parse_jd

router = APIRouter()


class JDRequest(BaseModel):
    job_description: str


@router.post("/parse-jd")
async def parse_jd(body: JDRequest, user=Depends(get_current_user)):
    try:
        return _parse_jd(body.job_description)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
