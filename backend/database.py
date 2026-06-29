import os
from dataclasses import dataclass

import httpx
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client

load_dotenv()

_SUPABASE_URL = os.getenv("SUPABASE_URL", "")
_SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Auth client — used in auth.py for sign_up / sign_in_with_password
supabase = create_client(_SUPABASE_URL, _SUPABASE_KEY)

# Admin client — service role key, bypasses RLS for backend DB writes
supabase_admin = create_client(
    _SUPABASE_URL,
    os.getenv("SUPABASE_SERVICE_KEY", ""),
)

security = HTTPBearer()


@dataclass
class AuthUser:
    id: str
    email: str


def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)) -> AuthUser:
    """
    Validate the bearer JWT by calling Supabase Auth REST API directly.
    Using httpx instead of supabase.auth.get_user() avoids session-state
    contamination in the stateful supabase-py v2 SDK when running as a server.
    """
    try:
        resp = httpx.get(
            f"{_SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {creds.credentials}",
                "apikey": _SUPABASE_KEY,
            },
            timeout=10,
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    data = resp.json()
    return AuthUser(id=data["id"], email=data.get("email", ""))
