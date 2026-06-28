from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.claude import parse_jd as _parse_jd

router = APIRouter()


class JDRequest(BaseModel):
    job_description: str


@router.post("/parse-jd")
async def parse_jd(body: JDRequest):
    try:
        return _parse_jd(body.job_description)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
