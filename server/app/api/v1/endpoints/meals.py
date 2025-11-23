from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.schemas.meal import MealCreate, MealRead, MealUpdate
from app.crud.meal import (
    create_meal,
    get_meals,
    get_meal,
    update_meal,
    delete_meal,
)

router = APIRouter(
    prefix="/meals",       # 👈 URL path: /api/v1/meals
    tags=["meals"],        # 👈 group name in Swagger
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=List[MealRead])
async def list_meals(db: AsyncSession = Depends(get_db)):
    return await get_meals(db)


@router.post("/", response_model=MealRead, status_code=status.HTTP_201_CREATED)
async def create_meal_endpoint(meal: MealCreate, db: AsyncSession = Depends(get_db)):
    return await create_meal(db, meal)


@router.get("/{meal_id}", response_model=MealRead)
async def get_meal_endpoint(meal_id: int, db: AsyncSession = Depends(get_db)):
    obj = await get_meal(db, meal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Meal not found")
    return obj


@router.patch("/{meal_id}", response_model=MealRead)
async def update_meal_endpoint(meal_id: int, meal: MealUpdate, db: AsyncSession = Depends(get_db)):
    obj = await update_meal(db, meal_id, meal)
    if not obj:
        raise HTTPException(status_code=404, detail="Meal not found")
    return obj


@router.delete("/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meal_endpoint(meal_id: int, db: AsyncSession = Depends(get_db)):
    ok = await delete_meal(db, meal_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Meal not found")
    return
