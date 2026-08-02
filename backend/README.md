# Backend - FastAPI Server

This directory contains the Python FastAPI backend server for the AIVOA Complaint Management System.

## Overview

The backend is built with:
- **FastAPI**: Modern async web framework
- **LangGraph**: Multi-agent AI workflow framework
- **LangChain**: LLM integration with Groq
- **SQLAlchemy**: ORM for PostgreSQL database
- **Pydantic**: Data validation and settings

## Files

### `main.py`
**Purpose**: Entry point and FastAPI application setup

**Key Components**:
- Creates FastAPI app with CORS middleware
- Includes health and complaints routers
- Manages application lifecycle (startup/shutdown)
- Serves on port 8000 by default

**Code Explanation**:
```python
app = FastAPI(
    title="AIVOA Complaint Management API",
    description="AI-powered pharmaceutical complaint management system",
    version="1.0.0",
    lifespan=lifespan
)
```
- `lifespan` context manager handles startup/shutdown
- CORS middleware allows frontend to communicate
- Routers are included at `/api` prefix

### `database.py`
**Purpose**: Database models and connection management

**Key Components**:
- SQLAlchemy engine configuration
- Complaint model definition
- Database session management
- Initialization function

**Code Explanation**:
```python
class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint = Column(JSON, nullable=False)
    risk_assessment = Column(JSON, nullable=False)
    # ... other fields
```
- Uses JSON columns for flexible AI extraction data
- `get_db()` dependency provides database sessions
- `init_db()` creates tables on startup

### `requirements.txt`
**Purpose**: Python package dependencies

**Key Packages**:
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `langgraph`: AI agent workflows
- `langchain`: LLM integration
- `langchain-groq`: Groq API integration
- `sqlalchemy`: Database ORM
- `psycopg2-binary`: PostgreSQL driver

## Subdirectories

### `ai/`
Contains LangGraph AI agents for complaint processing.

### `routers/`
Contains FastAPI route handlers for API endpoints.

## Environment Variables

Required in `.env` file:
- `DATABASE_URL`: PostgreSQL connection string
- `GROQ_API_KEY`: Groq API key for AI inference

## Running the Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc