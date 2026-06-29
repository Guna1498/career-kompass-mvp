from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from database import supabase, get_current_user

router = APIRouter()


class AuthRequest(BaseModel):
    email: str
    password: str


@router.post("/auth/register")
async def register(body: AuthRequest):
    try:
        result = supabase.auth.sign_up({"email": body.email, "password": body.password})
        if result.user is None:
            raise HTTPException(status_code=400, detail="Registration failed — check your email for a confirmation link.")
        return {
            "user": {"id": str(result.user.id), "email": result.user.email},
            "access_token": result.session.access_token if result.session else None,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/auth/login")
async def login(body: AuthRequest):
    try:
        result = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
        return {
            "user": {"id": str(result.user.id), "email": result.user.email},
            "access_token": result.session.access_token,
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return {"id": str(user.id), "email": user.email}
