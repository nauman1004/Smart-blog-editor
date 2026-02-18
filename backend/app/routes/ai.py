from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from google import genai
import os

from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/ai", tags=["AI"])

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class TextRequest(BaseModel):
    text: str


@router.post("/generate")
def generate_summary(req: TextRequest, user=Depends(get_current_user)):
    try:
        prompt = f"Summarize this blog post:\n\n{req.text}"

        response = client.models.generate_content(
            model="models/gemini-2.0-flash",
            contents=prompt
        )

        return {"summary": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
