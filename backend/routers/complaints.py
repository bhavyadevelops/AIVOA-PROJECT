from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel, EmailStr
from database import get_db, Complaint
from ai.graph import process_complaint, llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import json
import PyPDF2
from docx import Document
import io

router = APIRouter()

# Pydantic models for request/response
class ExtractComplaintRequest(BaseModel):
    text: str
    document_name: Optional[str] = None
    document_type: Optional[str] = None

def extract_text_from_file(file_content: bytes, file_type: str) -> str:
    """Extract text from uploaded file based on file type"""
    try:
        if file_type == 'pdf':
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        elif file_type == 'docx':
            doc_file = io.BytesIO(file_content)
            doc = Document(doc_file)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        elif file_type == 'text':
            # For text files including EML, CSV, TXT
            try:
                text = file_content.decode('utf-8')
            except UnicodeDecodeError:
                # Try other encodings if UTF-8 fails
                text = file_content.decode('latin-1')
            
            # If it's an EML file, extract the body content
            if text.lower().startswith('from:') or 'content-type: text/plain' in text.lower():
                # Simple EML parsing - find the body after headers
                lines = text.split('\n')
                body_start = False
                extracted_text = []
                
                for line in lines:
                    if body_start:
                        # Skip MIME boundaries and content declarations
                        if not line.strip().startswith('--') and not line.strip().lower().startswith('content-'):
                            extracted_text.append(line)
                    elif line.strip() == '':
                        # Empty line might indicate end of headers
                        body_start = True
                
                if extracted_text:
                    return '\n'.join(extracted_text).strip()
            
            return text
        else:
            # Default to text decoding
            try:
                return file_content.decode('utf-8')
            except UnicodeDecodeError:
                return file_content.decode('latin-1')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from file: {str(e)}")

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

class RiskAssessment(BaseModel):
    overallRisk: str = "Low"
    severityReason: str = ""
    priorityReason: str = ""
    patientSafety: str = ""
    productQuality: str = ""
    recommendedActions: list[str] = []
    confidenceNotes: str = ""

class ExtractComplaintResponse(BaseModel):
    complaint: ComplaintField
    riskAssessment: RiskAssessment
    missingFields: list[str]
    processingStage: str
    summary: str

class CreateComplaintRequest(BaseModel):
    complaint: ComplaintField
    riskAssessment: RiskAssessment
    document_name: Optional[str] = None
    document_type: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: int
    complaint: dict
    riskAssessment: dict
    documentName: Optional[str]
    documentType: Optional[str]
    status: str
    createdAt: str
    updatedAt: str

class ChatRequest(BaseModel):
    complaint: ComplaintField
    message: str

class ChatResponse(BaseModel):
    reply: str
    updatedComplaint: Optional[ComplaintField] = None
    updatedRiskAssessment: Optional[RiskAssessment] = None

class EditComplaintRequest(BaseModel):
    complaint: ComplaintField
    editMessage: str

class EditComplaintResponse(BaseModel):
    updatedComplaint: ComplaintField
    updatedRiskAssessment: RiskAssessment
    explanation: str

@router.post("/extract", response_model=ExtractComplaintResponse)
async def extract_complaint(
    request: Optional[ExtractComplaintRequest] = None,
    file: Optional[UploadFile] = File(None),
    document_name: Optional[str] = None
):
    """Extract complaint data using AI LangGraph workflow"""
    try:
        text = ""
        doc_name = ""
        doc_type = ""
        
        # Handle file upload
        if file:
            file_content = await file.read()
            file_extension = file.filename.split('.')[-1].lower() if file.filename else ''
            
            file_type_map = {
                'pdf': 'pdf',
                'docx': 'docx',
                'txt': 'text',
                'csv': 'text',
                'eml': 'text'
            }
            file_type = file_type_map.get(file_extension, 'text')
            
            text = extract_text_from_file(file_content, file_type)
            doc_name = document_name or file.filename
            doc_type = file_type
        elif request:
            # Handle text input
            text = request.text
            doc_name = request.document_name or ""
            doc_type = request.document_type or ""
        else:
            raise HTTPException(status_code=400, detail="Either text or file must be provided")
        
        result = await process_complaint(
            text=text,
            document_name=doc_name,
            document_type=doc_type
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



@router.post("/complaints", response_model=ComplaintResponse)
async def create_complaint(request: CreateComplaintRequest, db: Session = Depends(get_db)):
    """Save a complaint to the database"""
    try:
        print(f"Saving complaint: {request.complaint}")
        print(f"Risk assessment: {request.riskAssessment}")
        
        new_complaint = Complaint(
            complaint=request.complaint.model_dump(),
            risk_assessment=request.riskAssessment.model_dump(),
            document_name=request.document_name,
            document_type=request.document_type,
            status="Pending Triage"
        )
        
        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        
        print(f"Complaint saved with ID: {new_complaint.id}")
        
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
        print(f"Error saving complaint: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to save complaint: {str(e)}")

@router.get("/complaints/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    """Retrieve a complaint by ID"""
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

@router.post("/copilot/chat", response_model=ChatResponse)
async def copilot_chat(request: ChatRequest):
    """AI chat assistant for complaint analysis and editing"""
    try:
        complaint = request.complaint
        message = request.message
        
        # Check if this is an edit request (natural language editing)
        edit_keywords = ["sorry", "correct", "update", "change", "modify", "actually", "the batch number is", "the quantity is", "batch is", "quantity is"]
        is_edit_request = any(keyword in message.lower() for keyword in edit_keywords)
        
        if is_edit_request:
            # Use AI to parse the edit request and update complaint fields
            edit_prompt = ChatPromptTemplate.from_messages([
                ("system", """You are a pharmaceutical complaint data editing expert. 
Parse the user's edit message and identify which fields need to be updated in the complaint.
Return ONLY valid JSON with the fields that should be updated:
complaintSource, customerName, productName, strength, batch, manufacturingDate, expiryDate, 
quantity, complaintType, complaintDate, description, severity, priority.

Only include fields that are explicitly mentioned in the edit message. Use empty strings for fields not mentioned.
Be precise and extract exact values from the user's message."""),
                ("human", """Current complaint: {current_complaint}
Edit message: {edit_message}""")
            ])
            
            chain = edit_prompt | llm | JsonOutputParser()
            
            try:
                updated_fields = chain.invoke({
                    "current_complaint": complaint.model_dump(),
                    "edit_message": message
                })
                
                # Merge updated fields with current complaint
                current_dict = complaint.model_dump()
                for key, value in updated_fields.items():
                    if value and value != "":  # Only update non-empty values
                        current_dict[key] = value
                
                updated_complaint = ComplaintField(**current_dict)
                
                # Recalculate risk assessment if severity/priority changed
                if "severity" in updated_fields or "priority" in updated_fields:
                    severity = updated_complaint.severity or "Low"
                    priority = updated_complaint.priority or "Low"
                    
                    updated_risk = RiskAssessment(
                        overallRisk="High" if severity == "High" else "Medium" if priority == "High" else "Low",
                        severityReason=f"Updated based on user correction: {severity}",
                        priorityReason=f"Updated based on user correction: {priority}",
                        patientSafety="Potential impact" if severity == "High" else "Minimal impact",
                        productQuality="Under investigation",
                        recommendedActions=["Immediate review", "Document findings"] if severity == "High" else ["Standard review"],
                        confidenceNotes="Updated based on user edit"
                    )
                else:
                    updated_risk = None
                
                explanation = f"Updated {', '.join(updated_fields.keys())} based on your edit request."
                
                return ChatResponse(
                    reply=explanation,
                    updatedComplaint=updated_complaint,
                    updatedRiskAssessment=updated_risk
                )
                
            except Exception as e:
                print(f"Edit parsing error: {e}")
                # Fallback to regular chat response
                pass
        
        # Regular chat responses
        severity = complaint.severity or "Low"
        priority = complaint.priority or "Low"
        complaint_type = complaint.complaintType or "quality"
        
        if "summarize" in message.lower():
            reply = f"Complaint Summary: {complaint.description}. Product: {complaint.productName} ({complaint.strength}). Reported by {complaint.customerName}. Risk Level: {severity}."
        elif "severity" in message.lower():
            reply = f"Severity Assessment: {severity} severity based on the complaint description. This {severity} severity indicates {'immediate attention needed' if severity == 'High' else 'standard review process'}."
        elif "priority" in message.lower():
            reply = f"Priority Analysis: {priority} priority assigned. This is due to the {'severity of the issue' if severity == 'High' else 'nature of the complaint'}. Recommended actions include {'escalation to quality team' if priority == 'High' else 'standard investigation procedures'}."
        elif "next steps" in message.lower():
            reply = f"Recommended Next Steps: 1) Verify all extracted information, 2) Cross-reference batch number with production records, 3) Contact customer for additional details if needed, 4) Initiate investigation based on {severity} severity."
        else:
            ending = 'Verify the batch, expiry date, quantity, and source evidence before final disposition.' if message.endswith('?') else 'Please verify the generated fields before saving.'
            reply = f"Based on the active complaint, {severity} severity and {priority} priority are supported by the recorded {complaint_type} concern. {ending}"
        
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/edit", response_model=EditComplaintResponse)
async def edit_complaint(request: EditComplaintRequest):
    """Edit complaint using natural language - Edit Complaint Tool"""
    try:
        complaint = request.complaint
        edit_message = request.editMessage
        
        # Use AI to parse the edit request and update complaint fields
        edit_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a pharmaceutical complaint data editing expert. 
Parse the user's edit message and identify which fields need to be updated in the complaint.
Return ONLY valid JSON with the fields that should be updated:
complaintSource, customerName, productName, strength, batch, manufacturingDate, expiryDate, 
quantity, complaintType, complaintDate, description, severity, priority.

Only include fields that are explicitly mentioned in the edit message. Use empty strings for fields not mentioned.
Be precise and extract exact values from the user's message."""),
            ("human", """Current complaint: {current_complaint}
Edit message: {edit_message}""")
        ])
        
        chain = edit_prompt | llm | JsonOutputParser()
        
        try:
            updated_fields = chain.invoke({
                "current_complaint": complaint.model_dump(),
                "edit_message": edit_message
            })
            
            # Merge updated fields with current complaint
            current_dict = complaint.model_dump()
            for key, value in updated_fields.items():
                if value and value != "":  # Only update non-empty values
                    current_dict[key] = value
            
            updated_complaint = ComplaintField(**current_dict)
            
            # Recalculate risk assessment if severity/priority changed
            severity = updated_complaint.severity or "Low"
            priority = updated_complaint.priority or "Low"
            
            updated_risk = RiskAssessment(
                overallRisk="High" if severity == "High" else "Medium" if priority == "High" else "Low",
                severityReason=f"Updated based on user correction: {severity}",
                priorityReason=f"Updated based on user correction: {priority}",
                patientSafety="Potential impact" if severity == "High" else "Minimal impact",
                productQuality="Under investigation",
                recommendedActions=["Immediate review", "Document findings"] if severity == "High" else ["Standard review"],
                confidenceNotes="Updated based on user edit"
            )
            
            explanation = f"Updated {', '.join(updated_fields.keys())} based on your edit request: '{edit_message}'"
            
            return EditComplaintResponse(
                updatedComplaint=updated_complaint,
                updatedRiskAssessment=updated_risk,
                explanation=explanation
            )
            
        except Exception as e:
            print(f"Edit parsing error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to parse edit request: {str(e)}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Edit failed: {str(e)}")