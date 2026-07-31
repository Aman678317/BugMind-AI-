from enum import Enum
from pydantic import BaseModel
from typing import Optional

class UserRole(str, Enum):
    admin = "admin"
    maintainer = "maintainer"
    contributor = "contributor"
    viewer = "viewer"

class UserAuthStub(BaseModel):
    id: str
    email: str
    role: UserRole
    org_id: str

# Stub dependency for FastAPI endpoints
async def get_current_user() -> UserAuthStub:
    """
    Stubbed authentication logic.
    In V1, this will validate JWTs from email/password or SSO logins.
    """
    return UserAuthStub(
        id="00000000-0000-0000-0000-000000000000",
        email="demo@example.com",
        role=UserRole.admin,
        org_id="00000000-0000-0000-0000-000000000001"
    )
