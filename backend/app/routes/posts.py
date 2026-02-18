from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

from app.db import posts_collection
from app.dependencies.auth import get_current_user

router = APIRouter( tags=["Posts"])


class PostCreate(BaseModel):
    title: str


class PostUpdate(BaseModel):
    title: str | None = None
    content: dict | None = None
    status: str | None = None


def serialize_post(post):
    return {
        "_id": str(post["_id"]),
        "title": post["title"],
        "content": post.get("content", {}),
        "status": post.get("status", "draft"),
        "createdAt": post.get("createdAt"),
        "updatedAt": post.get("updatedAt"),
        "userId": post.get("userId"),
    }


@router.get("/")
def get_posts(user=Depends(get_current_user)):
    posts = posts_collection.find({"userId": user["user_id"]})
    return [serialize_post(p) for p in posts]


@router.post("/")
def create_post(req: PostCreate, user=Depends(get_current_user)):
    new_post = {
        "title": req.title,
        "content": {},
        "status": "draft",
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat(),
        "userId": user["user_id"],
    }

    result = posts_collection.insert_one(new_post)
    new_post["_id"] = result.inserted_id

    return serialize_post(new_post)


@router.get("/{post_id}")
def get_post(post_id: str, user=Depends(get_current_user)):
    post = posts_collection.find_one({"_id": ObjectId(post_id), "userId": user["user_id"]})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return serialize_post(post)


@router.patch("/{post_id}")
def update_post(post_id: str, req: PostUpdate, user=Depends(get_current_user)):
    update_data = {k: v for k, v in req.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow().isoformat()

    result = posts_collection.update_one(
        {"_id": ObjectId(post_id), "userId": user["user_id"]},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")

    updated_post = posts_collection.find_one({"_id": ObjectId(post_id)})
    return serialize_post(updated_post)
