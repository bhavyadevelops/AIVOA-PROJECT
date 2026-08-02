# API Routers

This directory contains FastAPI route handlers for all API endpoints.

## Overview

Routers are organized by functionality:
- `health.py` - Health check endpoint
- `complaints.py` - Complaint-related operations

Each router is a FastAPI `APIRouter` that defines endpoints and their logic.

## Files

### `health.py`
**Purpose**: Service health check endpoint

**Code Explanation**:
```python
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
```

**Key Points**:
- Simple GET endpoint at `/healthz`
- Returns JSON with status and message
- Used by load balancers and monitoring systems
- Pydantic model ensures response structure

**Usage**:
```bash
curl http://localhost:8000/api/healthz
# Response: {"status":"ok","message":"AIVOA Complaint Management System is operational"}
```

### `complaints.py`
**Purpose**: Complaint-related API endpoints

**Key Components**:

#### Pydantic Models (Request/Response Schemas)

**ExtractComplaintRequest**:
```python
class ExtractComplaintRequest(BaseModel):
    text: str
    document_name: Optional[str] = None
    document_type: Optional[str] = None
```
- Input for complaint extraction
- `text` is required (complaint content)
- Document metadata is optional

**ComplaintField**:
```python
class ComplaintField(BaseModel):
    complaintSource: str = ""
    customerName: str = ""
    productName: str = ""
    strength: str = ""
    batch: str = ""
    manufacturingDate: str = ""
    expiryDate: str = ""
    quantity: str = ""
    complaintType: str = ""
    complaintDate: str = ""
    description: str = ""
    severity: str = ""
    priority: str = ""
```
- Represents extracted complaint data
- All fields default to empty string
- Matches LangGraph extractor output

**RiskAssessment**:
```python
class RiskAssessment(BaseModel):
    overallRisk: str = "Low"
    severityReason: str = ""
    priorityReason: str = ""
    patientSafety: str = ""
    productQuality: str = ""
    recommendedActions: list[str] = []
    confidenceNotes: str = ""
```
- Represents AI risk analysis
- Default to "Low" risk
- Array for recommended actions

**ExtractComplaintResponse**:
```python
class ExtractComplaintResponse(BaseModel):
    complaint: ComplaintField
    riskAssessment: RiskAssessment
    missingFields: list[str]
    processingStage: str
    summary: str
```
- Complete extraction response
- Includes all LangGraph outputs
- Processing stage for UI progress

**CreateComplaintRequest**:
```python
class CreateComplaintRequest(BaseModel):
    complaint: ComplaintField
    riskAssessment: RiskAssessment
    document_name: Optional[str] = None
    document_type: Optional[str] = None
```
- Input for saving complaint to database
- Includes extracted data and risk assessment

**ComplaintResponse**:
```python
class ComplaintResponse(BaseModel):
    id: int
    complaint: dict
    riskAssessment: dict
    documentName: Optional[str]
    documentType: Optional[str]
    status: str
    createdAt: str
    updatedAt: str
```
- Database record representation
- Includes auto-generated ID and timestamps
- Dates as ISO format strings

**ChatRequest**:
```python
class ChatRequest(BaseModel):
    complaint: ComplaintField
    message: str
```
- Input for AI chat assistant
- Current complaint data and user question

**ChatResponse**:
```python
class ChatResponse(BaseModel):
    reply: str
```
- Simple text response from AI assistant

#### Endpoints

**POST /api/complaints/extract**
```python
@router.post("/extract", response_model=ExtractComplaintResponse)
async def extract_complaint(request: ExtractComplaintRequest):
    try:
        result = await process_complaint(
            text=request.text,
            document_name=request.document_name or "",
            document_type=request.document_type or ""
        )
        return ExtractComplaintResponse(
            complaint=result["complaint"],
            riskAssessment=result["risk_assessment"],
            missingFields=result["missing_fields"],
            processingStage="Completed",
            summary=result["summary"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
```

**Purpose**: Process complaint text through LangGraph workflow

**Flow**:
1. Receives text and optional document metadata
2. Calls `process_complaint()` from LangGraph
3. Runs through all 5 agents
4. Returns structured response with all outputs
5. Catches errors and returns 500 status

**Response Example**:
```json
{
  "complaint": {
    "customerName": "John Smith",
    "productName": "Product ABC",
    "batch": "B12345",
    ...
  },
  "riskAssessment": {
    "overallRisk": "High",
    "severityReason": "Based on reported severity: High",
    ...
  },
  "missingFields": ["Expiry Date"],
  "processingStage": "Completed",
  "summary": "Complaint regarding Product ABC..."
}
```

**POST /api/complaints/complaints**
```python
@router.post("/complaints", response_model=ComplaintResponse)
async def create_complaint(request: CreateComplaintRequest, db: Session = Depends(get_db)):
    try:
        new_complaint = Complaint(
            complaint=request.complaint.dict(),
            risk_assessment=request.riskAssessment.dict(),
            document_name=request.document_name,
            document_type=request.document_type,
            status="Pending Triage"
        )
        
        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        
        return ComplaintResponse(
            id=new_complaint.id,
            complaint=new_complaint.complaint,
            riskAssessment=new_complaint.risk_assessment,
            documentName=new_complaint.document_name,
            documentType=new_complaint.document_type,
            status=new_complaint.status,
            createdAt=new_complaint.created_at.isoformat(),
            updatedAt=new_complaint.updated_at.isoformat()
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save complaint: {str(e)}")
```

**Purpose**: Save complaint to database

**Flow**:
1. Receives complaint and risk assessment data
2. Gets database session via dependency injection
3. Creates Complaint ORM instance
4. Adds to session and commits
5. Refreshes to get auto-generated fields (ID, timestamps)
6. Returns created record
7. Rolls back on error

**Response Example**:
```json
{
  "id": 1,
  "complaint": { ... },
  "riskAssessment": { ... },
  "documentName": "complaint.txt",
  "documentType": "text",
  "status": "Pending Triage",
  "createdAt": "2026-08-02T10:30:00",
  "updatedAt": "2026-08-02T10:30:00"
}
```

**GET /api/complaints/complaints/{complaint_id}**
```python
@router.get("/complaints/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    return ComplaintResponse(
        id=complaint.id,
        complaint=complaint.complaint,
        riskAssessment=complaint.risk_assessment,
        documentName=complaint.document_name,
        documentType=complaint.document_type,
        status=complaint.status,
        createdAt=complaint.created_at.isoformat(),
        updatedAt=complaint.updated_at.isoformat()
    )
```

**Purpose**: Retrieve a specific complaint by ID

**Flow**:
1. Gets complaint_id from URL path
2. Queries database for matching record
3. Returns 404 if not found
4. Returns complaint data if found

**POST /api/complaints/copilot/chat**
```python
@router.post("/copilot/chat", response_model=ChatResponse)
async def copilot_chat(request: ChatRequest):
    try:
        complaint = request.complaint
        message = request.message
        
        severity = complaint.severity or "Low"
        priority = complaint.priority or "Low"
        complaint_type = complaint.complaintType or "quality"
        
        if "summarize" in message.lower():
            reply = f"Complaint Summary: {complaint.description}..."
        elif "severity" in message.lower():
            reply = f"Severity Assessment: {severity} severity based on..."
        elif "priority" in message.lower():
            reply = f"Priority Analysis: {priority} priority assigned..."
        elif "next steps" in message.lower():
            reply = f"Recommended Next Steps: 1) Verify all extracted information..."
        else:
            reply = f"Based on the active complaint, {severity} severity..."
        
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
```

**Purpose**: AI chat assistant for complaint analysis

**Flow**:
1. Receives complaint data and user message
2. Analyzes message for keywords
3. Generates contextual response based on complaint
4. Currently uses rule-based responses (not actual AI)
5. Returns response text

**Supported Keywords**:
- "summarize" → Complaint summary
- "severity" → Severity explanation
- "priority" → Priority analysis
- "next steps" → Recommended actions
- Default → General context

**Note**: This endpoint currently uses heuristic responses. For production, should integrate with actual LLM for dynamic responses.

## Error Handling

All endpoints use try-catch blocks:
- Validation errors return 422 (automatic from Pydantic)
- Not found errors return 404
- Other errors return 500 with detail message
- Database operations rollback on error

## Dependencies

```python
from database import get_db, Complaint  # Database session and model
from ai.graph import process_complaint  # LangGraph workflow
```

## Usage

Routers are registered in `main.py`:
```python
from routers import complaints, health

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(complaints.router, prefix="/api/complaints", tags=["complaints"])
```

This creates endpoints:
- GET /api/healthz
- POST /api/complaints/extract
- POST /api/complaints/complaints
- GET /api/complaints/complaints/{id}
- POST /api/complaints/copilot/chat