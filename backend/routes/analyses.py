from fastapi import APIRouter, HTTPException, Depends

from database import supabase_admin, get_current_user

router = APIRouter()


@router.get("/analyses")
async def list_analyses(user=Depends(get_current_user)):
    try:
        result = (
            supabase_admin.table("analyses")
            .select("id,job_description,match_score,created_at")
            .eq("user_id", str(user.id))
            .order("created_at", desc=True)
            .execute()
        )
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
