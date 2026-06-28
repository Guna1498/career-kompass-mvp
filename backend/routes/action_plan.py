from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.claude import action_plan as _action_plan

router = APIRouter()


class ActionPlanRequest(BaseModel):
    cv_text: str
    job_description: str
    gaps: dict


@router.post("/action-plan")
async def action_plan(body: ActionPlanRequest):
    try:
        return _action_plan(body.cv_text, body.job_description, body.gaps)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
