from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from database import supabase_admin, get_current_user
from services.claude import action_plan as _action_plan

router = APIRouter()


class ActionPlanRequest(BaseModel):
    cv_text: str
    job_description: str
    gaps: dict


@router.post("/action-plan")
async def action_plan(body: ActionPlanRequest, user=Depends(get_current_user)):
    try:
        result = _action_plan(body.cv_text, body.job_description, body.gaps)
        analysis_id = body.gaps.get("analysis_id")
        if analysis_id:
            supabase_admin.table("analyses").update({"action_plan": result}) \
                .eq("id", analysis_id).execute()
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
