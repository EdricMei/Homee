"""
Main API router for v1 endpoints
"""

from fastapi import APIRouter, Depends

from app.api.v1.endpoints import users

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(users.router, prefix="/users", tags=["users"])
