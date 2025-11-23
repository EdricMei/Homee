from sqlalchemy import Column, Integer, String, Boolean, Text
from app.db.base import Base

class Meal(Base):
    __tablename__ = "meals"   # table name in Supabase

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)        # e.g. "Chicken Alfredo"
    description = Column(Text, nullable=True)          # e.g. "Creamy pasta"
    is_available = Column(Boolean, default=True)       # for listings visibility
