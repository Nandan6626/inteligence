from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.config.settings import settings
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        timestamp=datetime.now()
    )
