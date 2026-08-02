# AI Module - LangGraph Workflow Implementation

This directory contains the TypeScript implementation of the multi-agent AI workflow for complaint processing, inspired by LangGraph architecture.

## Overview

The AI module implements a sequential multi-agent workflow that processes complaint text through specialized nodes to extract structured data, assess risk, validate completeness, and generate summaries.

## Directory Structure

```
ai/
├── nodes/           # Individual AI processing nodes
│   ├── parse-input.ts       # Text cleaning and normalization
│   ├── extract-fields.ts     # AI-powered field extraction
│   ├── classify-risk.ts     # Risk assessment and classification
│   ├── completeness.ts       # Required field validation
│   ├── summarize.ts         # Summary generation
│   └── index.ts              # Node exports
├── prompts/         # AI prompt templates
│   ├── extraction.ts        # Field extraction prompts
│   ├── risk.ts              # Risk assessment prompts
│   ├── summary.ts           # Summary generation prompts
│   └── index.ts             # Prompt exports
├── services/        # External service integrations
│   ├── groq.ts             # Groq API integration
│   ├── parser.ts           # Fallback heuristic parser
│   ├── validators.ts       # Data validation utilities
│   └── index.ts             # Service exports
├── graph.ts         # Workflow orchestration and state management
├── state.ts         # Workflow state type definitions
├── types.ts         # AI-related type definitions
└── index.ts         # Module exports
```

## Core Concepts

### Workflow State

The workflow maintains a state object that passes through each node:

```typescript
interface ComplaintState {
  text: string;                          // Input complaint text
  documentName?: string;                // Source document name
  documentType?: string;                // Source document type
  complaint: ExtractedComplaint;        // Extracted field data
  riskAssessment: RiskAssessment;        // Risk analysis results
  completeness: CompletenessCheck;      // Validation results
  summary: string;                      // Generated summary
  missingFields: string[];              // List of missing required fields
  processingSteps: string[];            // Processing history
}
```

### Node Pattern

Each processing node follows this pattern:

```typescript
export async function nodeName(state: ComplaintState): Promise<Partial<ComplaintState>> {
  try {
    // Processing logic
    const result = await processData(state);
    
    // Return updated state
    return {
      ...state,
      relevantField: result,
      processingSteps: [...state.processingSteps, 'NodeName completed']
    };
  } catch (error) {
    // Error handling with fallback
    return handleFallback(state, error);
  }
}
```

## Processing Nodes

### 1. Parse Input Node (`parse-input.ts`)

**Purpose**: Clean and normalize input text.

**Operations**:
- Strip leading/trailing whitespace
- Remove excessive line breaks
- Normalize whitespace
- Track processing step

**Input**: Raw complaint text
**Output**: Cleaned text in state

### 2. Extract Fields Node (`extract-fields.ts`)

**Purpose**: Extract structured complaint fields using AI.

**Operations**:
- Call Groq AI with extraction prompt
- Parse JSON response
- Validate extracted fields
- Fallback to heuristic parser on failure

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

**Input**: Cleaned text
**Output**: Structured complaint data

### 3. Classify Risk Node (`classify-risk.ts`)

**Purpose**: Assess risk level based on complaint data.

**Operations**:
- Analyze severity and priority fields
- Determine overall risk level (High/Medium/Low)
- Generate risk reasoning
- Assess patient safety impact
- Determine product quality status
- Recommend actions

**Risk Logic**:
- **High Risk**: Severity = "High" OR Priority = "High"
- **Medium Risk**: Priority = "High" (when Severity not High)
- **Low Risk**: All other cases

**Input**: Extracted complaint data
**Output**: Risk assessment object

### 4. Completeness Node (`completeness.ts`)

**Purpose**: Validate required fields are present.

**Required Fields**:
- customerName
- productName
- batch
- expiryDate
- quantity

**Operations**:
- Check each required field
- Calculate completeness score
- Generate missing field list
- Provide validation feedback

**Scoring**:
- 100% complete: All fields present
- -20% per missing field
- Minimum score: 0%

**Input**: Extracted complaint data
**Output**: Completeness validation results

### 5. Summarize Node (`summarize.ts`)

**Purpose**: Generate human-readable complaint summary.

**Operations**:
- Combine complaint and risk data
- Generate concise summary text
- Include key information (product, customer, risk level)
- Format for quick review

**Input**: Complaint data and risk assessment
**Output**: Summary text

## Prompt Templates

### Extraction Prompts (`prompts/extraction.ts`)

**Purpose**: Guide AI to extract specific fields from complaint text.

**Template Structure**:
```typescript
const extractionPrompt = `
You are a pharmaceutical complaint data extraction expert.
Extract the following fields from the complaint text:
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

Return only valid JSON with these exact keys.
`;
```

### Risk Prompts (`prompts/risk.ts`)

**Purpose**: Guide AI to assess risk levels and provide reasoning.

**Template Structure**:
```typescript
const riskPrompt = `
You are a pharmaceutical risk assessment expert.
Analyze the complaint data and provide:
- overallRisk (High/Medium/Low)
- severityReason
- priorityReason
- patientSafety (Potential impact/Minimal impact)
- productQuality (Under investigation)
- recommendedActions (array of actions)
- confidenceNotes
`;
```

### Summary Prompts (`prompts/summary.ts`)

**Purpose**: Guide AI to generate concise summaries.

**Template Structure**:
```typescript
const summaryPrompt = `
Generate a concise summary of the complaint including:
- Product name and strength
- Customer name
- Description of the issue
- Risk level
- Key findings
`;

## Services

### Groq Service (`services/groq.ts`)

**Purpose**: Interface with Groq API for AI inference.

**Features**:
- API key management
- Request/response handling
- Error handling and retries
- Response parsing

**Configuration**:
- Model: llama-3.3-70b-versatile
- Temperature: 0 (deterministic)
- Response format: JSON

### Parser Service (`services/parser.ts`)

**Purpose**: Fallback heuristic parser when AI is unavailable.

**Features**:
- Regex-based field extraction
- Pattern matching for common formats
- Graceful degradation
- No external dependencies

**Use When**:
- Groq API is unavailable
- Rate limits are exceeded
- Network issues occur
- For testing without API calls

### Validators Service (`services/validators.ts`)

**Purpose**: Validate extracted data and AI responses.

**Features**:
- Schema validation
- Data type checking
- Required field verification
- Format validation (dates, numbers)

## Workflow Orchestration (`graph.ts`)

**Purpose**: Coordinate the sequential execution of processing nodes.

**Workflow Definition**:
```typescript
export async function processComplaint(text: string, documentName?: string, documentType?: string) {
  const initialState: ComplaintState = {
    text,
    documentName,
    documentType,
    complaint: {},
    riskAssessment: {},
    completeness: {},
    summary: '',
    missingFields: [],
    processingSteps: []
  };

  // Execute nodes sequentially
  let state = initialState;
  state = await parseInput(state);
  state = await extractFields(state);
  state = await classifyRisk(state);
  state = await checkCompleteness(state);
  state = await summarize(state);

  return state;
}
```

**Error Handling**:
- Each node has try-catch blocks
- Fallback logic for AI failures
- Graceful degradation
- Error logging for debugging

## Type Definitions

### State Types (`state.ts`)

```typescript
export interface ComplaintState {
  text: string;
  documentName?: string;
  documentType?: string;
  complaint: ExtractedComplaint;
  riskAssessment: RiskAssessment;
  completeness: CompletenessCheck;
  summary: string;
  missingFields: string[];
  processingSteps: string[];
}
```

### Data Types (`types.ts`)

```typescript
export interface ExtractedComplaint {
  complaintSource: string;
  customerName: string;
  productName: string;
  strength: string;
  batch: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: string;
  complaintType: string;
  complaintDate: string;
  description: string;
  severity: string;
  priority: string;
}

export interface RiskAssessment {
  overallRisk: 'High' | 'Medium' | 'Low';
  severityReason: string;
  priorityReason: string;
  patientSafety: string;
  productQuality: string;
  recommendedActions: string[];
  confidenceNotes: string;
}
```

## Usage Example

```typescript
import { processComplaint } from './ai';

const result = await processComplaint(
  'Customer John Smith reported issue with Product ABC...',
  'complaint.txt',
  'text'
);

console.log(result.complaint);      // Extracted fields
console.log(result.riskAssessment); // Risk analysis
console.log(result.summary);         // Generated summary
console.log(result.missingFields);   // Missing required fields
```

## Error Handling Strategy

### AI Service Failures
- Log error details
- Activate fallback parser
- Return best-effort extraction
- Notify user of degraded service

### Validation Failures
- Log validation errors
- Return partial results
- Indicate missing/invalid fields
- Provide corrective guidance

### Network Issues
- Implement retry logic
- Use cached results when available
- Provide timeout handling
- Graceful error messages

## Performance Considerations

- Sequential node execution for simplicity
- Async operations for non-blocking I/O
- Connection pooling for AI API calls
- Minimal state copying for efficiency
- Early termination on critical errors

## Testing

### Manual Testing
```typescript
// Test with sample data
const testText = 'Sample complaint text...';
const result = await processComplaint(testText);
console.log(result);
```

### Future Testing
```bash
# TODO: Add automated tests
pnpm test ai/
```

## Comparison with Python Implementation

This TypeScript implementation mirrors the Python LangGraph approach:

| Feature | Python LangGraph | TypeScript Implementation |
|---------|------------------|---------------------------|
| Framework | LangGraph library | Custom orchestration |
| State Management | Built-in | Manual state passing |
| Node Definition | Decorators | Functions |
| Type Safety | Python types | TypeScript interfaces |
| Error Handling | Built-in | Manual try-catch |

Both achieve the same workflow with equivalent functionality.

## Future Enhancements

- Add parallel node execution where possible
- Implement workflow checkpointing
- Add workflow visualization
- Support for conditional branching
- Integration with LangGraph TS when available
- Performance monitoring and metrics
- Caching for repeated extractions
