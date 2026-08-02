from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from database import engine, Base
from routers import complaints, health
from ai.graph import complaint_graph

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up AIVOA Complaint Management System...")
    yield
    # Shutdown
    print("Shutting down...")
    engine.dispose()

app = FastAPI(
    title="AIVOA Complaint Management API",
    description="AI-powered pharmaceutical complaint management system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(complaints.router, prefix="/api/complaints", tags=["complaints"])

@app.get("/")
async def root():
    return {
        "message": "AIVOA Complaint Management System API",
        "version": "1.0.0",
        "status": "operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)