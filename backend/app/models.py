from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime


class PostCreate(BaseModel):
    title: Optional[str] = "Untitled Draft"


class PostUpdate(BaseModel):
    title: Optional[str] = None
    contentJson: Optional[Dict] = None
    contentText: Optional[str] = None


class PostResponse(BaseModel):
    id: str = Field(..., alias="_id")
    title: str
    contentJson: Dict
    contentText: str
    status: str
    createdAt: datetime
    updatedAt: datetime
