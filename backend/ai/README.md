# AI Agents - LangGraph Workflow

This directory contains the LangGraph multi-agent workflow for AI-powered complaint processing.

## Overview

The AI system uses LangGraph to orchestrate 5 specialized agents that process complaint text through a defined workflow:
1. Parser Agent - Clean and normalize input
2. Extractor Agent - Extract structured data using AI
3. Risk Classifier Agent - Assess risk level
4. Completeness Agent - Validate required fields
5. Summarizer Agent - Generate summary

## Files

### `graph.py`
**Purpose**: Defines the LangGraph workflow and agent implementations

**Key Components**:

#### ComplaintState (TypedDict)
```python
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
```
- Defines the state structure passed between agents
- Holds all intermediate and final results
- Tracks processing steps for debugging

#### LLM Initialization
```python
llm = ChatGroq(
    model="gemma2-9b-it",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)
```
- Uses Groq's gemma2-9b-it model (required by assignment)
- Temperature 0 for deterministic outputs
- Fallback to heuristic logic if API key unavailable

#### Parser Agent
```python
def parser_agent(state: ComplaintState) -> ComplaintState:
    cleaned_text = state["text"].strip()
    processing_steps = state.get("processing_steps", [])
    processing_steps.append("Parsed input")
    return { **state, "text": cleaned_text, "processing_steps": processing_steps }
```
- Cleans input text (strips whitespace)
- Adds processing step to tracking
- Returns updated state

#### Extractor Agent
```python
def extractor_agent(state: ComplaintState) -> ComplaintState:
    extraction_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a pharmaceutical complaint data extraction expert..."),
        ("human", "{text}")
    ])
    chain = extraction_prompt | llm | JsonOutputParser()
    complaint_data = chain.invoke({"text": state["text"]})
    return { **state, "complaint": complaint_data, "processing_steps": [...] }
```
- Uses LangChain prompt template
- Chains: prompt → LLM → JSON parser
- Extracts 13 complaint fields from text
- Returns structured complaint data

**Extracted Fields**:
- complaintSource
- customerName
- productName
- strength
- batch
- manufacturingDate
- expiryDate
- quantity
- complaintType
- complaintDate
- description
- severity
- priority

#### Risk Classifier Agent
```python
def risk_classifier_agent(state: ComplaintState) -> ComplaintState:
    risk_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a pharmaceutical risk assessment expert..."),
        ("human", "Complaint: {complaint}")
    ])
    chain = risk_prompt | llm | JsonOutputParser()
    risk_data = chain.invoke({ "complaint": str(complaint), "description": complaint.get("description", "") })
    return { **state, "risk_assessment": risk_data, "processing_steps": [...] }
```
- Analyzes complaint for risk assessment
- Returns structured risk data with:
  - overallRisk (High/Medium/Low)
  - severityReason
  - priorityReason
  - patientSafety
  - productQuality
  - recommendedActions (array)
  - confidenceNotes
- Has fallback heuristic logic if AI fails

**Fallback Logic**:
```python
risk_data = {
    "overallRisk": "High" if severity == "High" else "Medium" if priority == "High" else "Low",
    "severityReason": f"Based on reported severity: {severity}",
    "priorityReason": f"Based on reported priority: {priority}",
    "patientSafety": "Potential impact" if severity == "High" else "Minimal impact",
    "productQuality": "Under investigation",
    "recommendedActions": ["Immediate review", "Document findings"] if severity == "High" else ["Standard review"],
    "confidenceNotes": "Classification based on extracted field values"
}
```

#### Completeness Agent
```python
def completeness_agent(state: ComplaintState) -> ComplaintState:
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
    return { **state, "completeness": completeness_data, "missing_fields": missing_fields, ... }
```
- Checks 5 required fields
- Calculates completeness score (100 - 20 points per missing field)
- Returns list of missing field labels
- Used for UI validation feedback

#### Summarizer Agent
```python
def summarizer_agent(state: ComplaintState) -> ComplaintState:
    complaint = state.get("complaint", {})
    risk = state.get("risk_assessment", {})
    summary = f"""Complaint regarding {complaint.get('productName', 'unknown product')} 
    ({complaint.get('strength', 'unknown strength')}). Reported by {complaint.get('customerName', 'unknown customer')}. 
    {complaint.get('description', 'No description provided')}. 
    Risk Level: {risk.get('overallRisk', 'Not assessed')}."""
    return { **state, "summary": summary, "processing_steps": [...] }
```
- Generates human-readable summary
- Combines complaint and risk data
- Used for quick review and chat context

#### Graph Construction
```python
def build_complaint_graph():
    workflow = StateGraph(ComplaintState)
    workflow.add_node("parser", parser_agent)
    workflow.add_node("extractor", extractor_agent)
    workflow.add_node("risk_classifier", risk_classifier_agent)
    workflow.add_node("completeness", completeness_agent)
    workflow.add_node("summarizer", summarizer_agent)
    
    workflow.set_entry_point("parser")
    workflow.add_edge("parser", "extractor")
    workflow.add_edge("extractor", "risk_classifier")
    workflow.add_edge("risk_classifier", "completeness")
    workflow.add_edge("completeness", "summarizer")
    workflow.add_edge("summarizer", END)
    
    return workflow.compile()
```
- Creates linear workflow: parser → extractor → risk → completeness → summarizer
- Each agent receives and modifies the state
- END marks workflow completion

#### Processing Function
```python
async def process_complaint(text: str, document_name: str = "", document_type: str = ""):
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
```
- Initializes empty state
- Invokes graph asynchronously
- Returns final state with all agent outputs

## Workflow Diagram

```
Input Text
    ↓
[Parser Agent] → Clean text
    ↓
[Extractor Agent] → Extract fields with AI
    ↓
[Risk Classifier Agent] → Assess risk with AI
    ↓
[Completeness Agent] → Check required fields
    ↓
[Summarizer Agent] → Generate summary
    ↓
Output: complaint, risk_assessment, summary, missing_fields
```

## Error Handling

Each agent has try-catch blocks:
- Parser: Simple string operations (no error likely)
- Extractor: Falls back to empty dict on AI failure
- Risk Classifier: Falls back to heuristic logic
- Completeness: Simple validation (no error likely)
- Summarizer: Simple string formatting (no error likely)

## Usage Example

```python
from ai.graph import process_complaint

result = await process_complaint(
    text="Customer John Smith reported issue with Product ABC...",
    document_name="complaint.txt",
    document_type="text"
)

print(result["complaint"])  # Extracted fields
print(result["risk_assessment"])  # Risk analysis
print(result["summary"])  # Generated summary
print(result["missing_fields"])  # List of missing required fields
```

## Why LangGraph?

1. **Multi-agent orchestration**: Clean separation of concerns
2. **State management**: Shared state passed between agents
3. **Visualizable**: Can render graph structure for debugging
4. **Checkpointing**: Built-in support for persistence
5. **Scalability**: Easy to add new agents or parallel paths