from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.meal import Meal
from app.schemas.meal import MealCreate, MealUpdate


async def create_meal(db: AsyncSession, meal_in: MealCreate) -> Meal:
    obj = Meal(
        title=meal_in.title,
        description=meal_in.description,
    )
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


async def get_meals(db: AsyncSession) -> List[Meal]:
    result = await db.execute(select(Meal))
    return result.scalars().all()


async def get_meal(db: AsyncSession, meal_id: int) -> Optional[Meal]:
    result = await db.execute(select(Meal).where(Meal.id == meal_id))
    return result.scalars().first()


async def update_meal(db: AsyncSession, meal_id: int, meal_in: MealUpdate) -> Optional[Meal]:
    obj = await get_meal(db, meal_id)
    if not obj:
        return None

    if meal_in.title is not None:
        obj.title = meal_in.title
    if meal_in.description is not None:
        obj.description = meal_in.description
    if meal_in.is_available is not None:
        obj.is_available = meal_in.is_available

    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


async def delete_meal(db: AsyncSession, meal_id: int) -> bool:
    obj = await get_meal(db, meal_id)
    if not obj:
        return False

    await db.delete(obj)
    await db.commit()
    return True
