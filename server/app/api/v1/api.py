"""
Main API router for v1 endpoints
"""

# from fastapi import APIRouter, Depends

# from app.api.v1.endpoints import users

# api_router = APIRouter()

# # Include all endpoint routers
# api_router.include_router(users.router, prefix="/users", tags=["users"])



from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.schemas.meal import MealCreate, MealRead
from app.crud.meal import create_meal, get_meals

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/items", response_model=list[MealRead])
async def read_items(db: AsyncSession = Depends(get_db)):
    return await get_meals(db)

@router.post("/items", response_model=MealRead)
async def add_item(meal: MealCreate, db: AsyncSession = Depends(get_db)):
    return await create_meal(db, meal.title)
