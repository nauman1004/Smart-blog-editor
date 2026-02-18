from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables BEFORE importing routes
load_dotenv()

from app.routes.posts import router as posts_router
from app.routes.auth import router as auth_router
from app.routes.ai import router as ai_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts_router, prefix="/api/posts", tags=["Posts"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "Smart Blog Editor Backend Running"}
