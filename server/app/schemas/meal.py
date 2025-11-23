from typing import Optional
from pydantic import BaseModel, ConfigDict

class MealBase(BaseModel):
    title: str
    description: Optional[str] = None

class MealCreate(MealBase):
    pass

class MealUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_available: Optional[bool] = None

class MealRead(MealBase):
    id: int
    is_available: bool

    # Pydantic v2 replacement for orm_mode = True
    model_config = ConfigDict(from_attributes=True)
