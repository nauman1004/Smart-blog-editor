from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId

from app.db import users_collection
from app.utils.hash import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter(tags=["Auth"])


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(req: SignupRequest):
    existing = users_collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = {
        "name": req.name,
        "email": req.email,
        "password": hash_password(req.password),
    }

    result = users_collection.insert_one(user)

    token = create_access_token({"user_id": str(result.inserted_id), "email": req.email})

    return {"token": token, "user": {"id": str(result.inserted_id), "name": req.name, "email": req.email}}


@router.post("/login")
def login(req: LoginRequest):
    user = users_collection.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"user_id": str(user["_id"]), "email": user["email"]})

    return {"token": token, "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}}
