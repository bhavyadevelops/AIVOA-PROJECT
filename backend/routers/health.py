from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    message: str

@router.get("/healthz")
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="ok",
        message="AIVOA Complaint Management System is operational"
    )