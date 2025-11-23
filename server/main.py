from fastapi import FastAPI

from app.api.v1.endpoints.meals import router as meals_router
from app.db.session import engine
from app.db.base import Base
from app.models import Meal  # noqa: F401 – make sure model is registered


app = FastAPI(title="Homee + Supabase (meals listings)")


@app.on_event("startup")
async def on_startup():
    # Create tables in Supabase for dev
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
async def root():
    return {"message": "Homecook meals API is live!"}


app.include_router(meals_router, prefix="/api/v1")
