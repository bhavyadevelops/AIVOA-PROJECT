from typing import TypedDict, List, Annotated
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os

# Define the state for the complaint processing graph
class ComplaintState(TypedDict):
    text: str
    document_name: str
    document_type: str
    complaint: dict
    risk_assessment: dict
    completeness: dict
    summary: str
    missing_fields: List[str]
    processing_steps: List[str]

# Initialize Groq LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)

# Agent 1: Parser - Clean and normalize input text
def parser_agent(state: ComplaintState) -> ComplaintState:
    """Parse and clean the input text"""
    cleaned_text = state["text"].strip()
    processing_steps = state.get("processing_steps", [])
    processing_steps.append("Parsed input")
    
    return {
        **state,
        "text": cleaned_text,
        "processing_steps": processing_steps
    }

# Agent 2: Extractor - Extract complaint fields using AI
def extractor_agent(state: ComplaintState) -> ComplaintState:
    """Extract structured complaint data using AI"""
    extraction_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a pharmaceutical complaint data extraction expert. 
Extract the following fields from the complaint text and return ONLY valid JSON:
complaintSource, customerName, productName, strength, batch, manufacturingDate, expiryDate, 
quantity, complaintType, complaintDate, description, severity, priority.

Classification rules:
- severity: Classify as "High" if complaint mentions adverse reactions, patient harm, safety issues, or life-threatening conditions. Classify as "Medium" for quality issues, efficacy problems, or customer dissatisfaction. Classify as "Low" for minor issues, packaging problems, or administrative concerns.
- priority: Classify as "High" for severity "High" or urgent complaints. Classify as "Medium" for severity "Medium" or complaints requiring investigation. Classify as "Low" for severity "Low" or routine matters.

Use empty strings for unknown fields. Be precise and accurate."""),
        ("human", "{text}")
    ])
    
    chain = extraction_prompt | llm | JsonOutputParser()
    
    try:
        complaint_data = chain.invoke({"text": state["text"]})
        
        # Fallback classification if AI doesn't extract severity/priority
        if not complaint_data.get("severity") or not complaint_data.get("priority"):
            text_lower = state["text"].lower()
            
            # Classify severity
            if not complaint_data.get("severity"):
                if any(keyword in text_lower for keyword in ["adverse", "harm", "dangerous", "life-threatening", "death", "severe", "serious", "emergency"]):
                    complaint_data["severity"] = "High"
                elif any(keyword in text_lower for keyword in ["quality", "efficacy", "dissatisfaction", "concern", "problem", "issue"]):
                    complaint_data["severity"] = "Medium"
                else:
                    complaint_data["severity"] = "Low"
            
            # Classify priority
            if not complaint_data.get("priority"):
                if complaint_data.get("severity") == "High":
                    complaint_data["priority"] = "High"
                elif complaint_data.get("severity") == "Medium":
                    complaint_data["priority"] = "Medium"
                else:
                    complaint_data["priority"] = "Low"
                    
    except Exception as e:
        print(f"Extraction error: {e}")
        complaint_data = {}
    
    processing_steps = state.get("processing_steps", [])
    processing_steps.append("Extracted complaint fields")
    
    return {
        **state,
        "complaint": complaint_data,
        "processing_steps": processing_steps
    }

# Agent 3: Risk Classifier - Assess risk using AI
def risk_classifier_agent(state: ComplaintState) -> ComplaintState:
    """Classify risk level and provide assessment"""
    complaint = state.get("complaint", {})
    
    risk_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a pharmaceutical risk assessment expert. 
Analyze the complaint and provide a risk assessment in JSON format with these fields:
overallRisk (High/Medium/Low), severityReason, priorityReason, patientSafety, productQuality, 
recommendedActions (array of strings), confidenceNotes.

Consider severity and priority fields from the complaint."""),
        ("human", """Complaint: {complaint}
Description: {description}""")
    ])
    
    chain = risk_prompt | llm | JsonOutputParser()
    
    try:
        risk_data = chain.invoke({
            "complaint": str(complaint),
            "description": complaint.get("description", "")
        })
    except Exception as e:
        print(f"Risk assessment error: {e}")
        # Fallback to heuristic-based assessment
        severity = complaint.get("severity", "Low")
        priority = complaint.get("priority", "Low")
        
        risk_data = {
            "overallRisk": "High" if severity == "High" else "Medium" if priority == "High" else "Low",
            "severityReason": f"Based on reported severity: {severity}",
            "priorityReason": f"Based on reported priority: {priority}",
            "patientSafety": "Potential impact" if severity == "High" else "Minimal impact",
            "productQuality": "Under investigation",
            "recommendedActions": ["Immediate review", "Document findings"] if severity == "High" else ["Standard review"],
            "confidenceNotes": "Classification based on extracted field values"
        }
    
    processing_steps = state.get("processing_steps", [])
    processing_steps.append("Classified risk")
    
    return {
        **state,
        "risk_assessment": risk_data,
        "processing_steps": processing_steps
    }

# Agent 4: Completeness Checker - Check required fields
def completeness_agent(state: ComplaintState) -> ComplaintState:
    """Check if all required fields are present"""
    complaint = state.get("complaint", {})
    
    required_fields = {
        "customerName": "Customer Name",
        "productName": "Product Name",
        "batch": "Batch Number",
        "expiryDate": "Expiry Date",
        "quantity": "Quantity"
    }
    
    missing_fields = []
    for field, label in required_fields.items():
        if not complaint.get(field):
            missing_fields.append(label)
    
    completeness_data = {
        "isComplete": len(missing_fields) == 0,
        "missingFields": missing_fields,
        "completenessScore": max(0, 100 - (len(missing_fields) * 20))
    }
    
    processing_steps = state.get("processing_steps", [])
    processing_steps.append("Checked completeness")
    
    return {
        **state,
        "completeness": completeness_data,
        "missing_fields": missing_fields,
        "processing_steps": processing_steps
    }

# Agent 5: Summarizer - Generate complaint summary
def summarizer_agent(state: ComplaintState) -> ComplaintState:
    """Generate a concise summary of the complaint"""
    complaint = state.get("complaint", {})
    risk = state.get("risk_assessment", {})
    
    summary = f"""Complaint regarding {complaint.get('productName', 'unknown product')} 
({complaint.get('strength', 'unknown strength')}). Reported by {complaint.get('customerName', 'unknown customer')}. 
{complaint.get('description', 'No description provided')}. 
Risk Level: {risk.get('overallRisk', 'Not assessed')}."""
    
    processing_steps = state.get("processing_steps", [])
    processing_steps.append("Generated summary")
    
    return {
        **state,
        "summary": summary,
        "processing_steps": processing_steps
    }

# Build the LangGraph workflow
def build_complaint_graph():
    workflow = StateGraph(ComplaintState)
    
    # Add nodes
    workflow.add_node("parser", parser_agent)
    workflow.add_node("extractor", extractor_agent)
    workflow.add_node("risk_classifier", risk_classifier_agent)
    workflow.add_node("completeness", completeness_agent)
    workflow.add_node("summarizer", summarizer_agent)
    
    # Define the flow
    workflow.set_entry_point("parser")
    workflow.add_edge("parser", "extractor")
    workflow.add_edge("extractor", "risk_classifier")
    workflow.add_edge("risk_classifier", "completeness")
    workflow.add_edge("completeness", "summarizer")
    workflow.add_edge("summarizer", END)
    
    return workflow.compile()

# Create the compiled graph
complaint_graph = build_complaint_graph()

async def process_complaint(text: str, document_name: str = "", document_type: str = ""):
    """Process a complaint through the LangGraph workflow"""
    initial_state = {
        "text": text,
        "document_name": document_name,
        "document_type": document_type,
        "complaint": {},
        "risk_assessment": {},
        "completeness": {},
        "summary": "",
        "missing_fields": [],
        "processing_steps": []
    }
    
    result = await complaint_graph.ainvoke(initial_state)
    return result