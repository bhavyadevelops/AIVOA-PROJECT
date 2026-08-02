# AIVOA-CMS Technical Architecture & Interview Guide

## Technology Stack & Decisions

### Frontend
- **React 19.1.0**: Latest React with improved performance and automatic batching
- **TypeScript 5.9**: Type safety and better developer experience
- **Redux Toolkit**: State management as required by assignment
- **Tailwind CSS 4.1.14**: Utility-first CSS for rapid UI development
- **Vite 7.3.2**: Fast build tool with HMR
- **Wouter 3.3.5**: Lightweight routing (2KB vs React Router's 15KB)
- **Radix UI**: Headless components for accessibility
- **Framer Motion 12.23.24**: Production-ready animations

### Backend
- **Python 3.12+**: As required by assignment
- **FastAPI 0.141.0**: Modern async web framework with automatic API documentation
- **LangGraph 1.2.10**: Multi-agent AI workflow framework
- **LangChain 1.3.14**: LLM integration framework
- **Groq SDK**: Fast AI inference with Llama models
- **SQLAlchemy 2.0.51**: Type-safe ORM with PostgreSQL
- **Pydantic**: Runtime validation and settings management

### Why These Choices?

**React + Redux**: Required by assignment. Redux provides predictable state management and excellent DevTools support.

**FastAPI**: Required by assignment. Offers async support, automatic API docs (Swagger), type hints, and Pydantic validation.

**LangGraph**: Required by assignment. Enables multi-agent workflows with state management, checkpointing, and visualizable graph structure.

**Groq llama-3.3-70b-versatile**: Fast, affordable AI inference (gemma2-9b-it was decommissioned by Groq).

**PostgreSQL + SQLAlchemy**: Required by assignment. Relational database with type-safe ORM and JSONB support.

## Architecture Flow

### LangGraph AI Workflow

The backend implements a multi-agent LangGraph workflow:

1. **Parser Agent** → Text cleanup and normalization
2. **Extractor Agent** → AI extracts structured data using Groq
3. **Risk Classifier Agent** → AI assesses risk level
4. **Completeness Agent** → Validates required fields
5. **Summarizer Agent** → Generates concise summary

### Risk Classification Logic

- **High Risk**: Severity = "High" OR Priority = "High"
- **Medium Risk**: Priority = "High" (when Severity not High)
- **Low Risk**: All other cases
- **Patient Safety**: "Potential impact" for High severity, "Minimal impact" otherwise
- **Product Quality**: "Under investigation" for all cases
- **Recommended Actions**: ["Immediate review", "Document findings"] for High, ["Standard review"] otherwise

### Save Flow
1. Frontend validation (Customer Name, Product Name required)
2. Redux action dispatches async thunk
3. API call to FastAPI endpoint
4. Pydantic validation
5. Database insertion with SQLAlchemy
6. Return created record with ID and timestamps
7. Redux reducer updates state
8. Frontend toast notification and form reset

### Database Schema
```python
class Complaint(Base):
    id: Integer (primary key)
    complaint: JSON (flexible schema to preserve AI extraction contract)
    risk_assessment: JSON (risk analysis from AI)
    document_name: String (optional source document name)
    document_type: String (optional source document type)
    status: String (default: "Pending Triage")
    created_at: DateTime (with timezone)
    updated_at: DateTime (with timezone)
```

**Why JSON for complaint/risk?**
- AI extraction contracts evolve rapidly
- Avoids sprawling relational schema
- Preserves complete AI analysis for audit trail
- Allows flexible field additions without migrations

## AI Architecture

### LangGraph Implementation

The LangGraph workflow is defined in `backend/ai/graph.py`:

```python
# State definition
class ComplaintState(TypedDict):
    text: str
    complaint: dict
    risk_assessment: dict
    # ... other fields

# Graph construction
workflow = StateGraph(ComplaintState)
workflow.add_node("parser", parser_agent)
workflow.add_node("extractor", extractor_agent)
# ... add other nodes
workflow.set_entry_point("parser")
workflow.add_edge("parser", "extractor")
# ... define edges
complaint_graph = workflow.compile()
```

### Groq Integration
- **Model**: llama-3.3-70b-versatile (gemma2-9b-it was decommissioned by Groq)
- **Temperature**: 0 (deterministic outputs)
- **Response Format**: JSON (structured data extraction)
- **Fallback**: Heuristic-based parser when API key unavailable

### Extraction Prompt Engineering
```
Extract pharmaceutical complaint fields. Return only JSON using the following string keys: 
complaintSource, customerName, productName, strength, batch, manufacturingDate, expiryDate, 
quantity, complaintType, complaintDate, description. Use empty strings when unknown.
```

### Resilience Strategy
- **Primary**: Groq AI extraction
- **Fallback**: Deterministic local parser
- **Validation**: Pydantic schema validation on all outputs
- **Error Handling**: User-friendly error messages by error type

## Redux State Management

### Store Structure

```typescript
interface ComplaintState {
  complaint: Partial<ComplaintFields>;
  riskAssessment: RiskAssessment | null;
  missingFields: string[];
  aiPopulatedFields: Set<keyof ComplaintFields>;
  editedFields: Set<keyof ComplaintFields>;
  animatingFields: Set<keyof ComplaintFields>;
  isExtracting: boolean;
  isSaving: boolean;
  error: string | null;
}
```

### Async Thunks

```typescript
export const extractComplaint = createAsyncThunk(
  'complaint/extract',
  async (data: { text: string }) => {
    const response = await fetch('http://localhost:8000/api/complaints/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);
```

### Reducer Pattern

```typescript
const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    setComplaint: (state, action) => {
      state.complaint = { ...state.complaint, ...action.payload };
    },
    // ... other reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(extractComplaint.pending, (state) => {
        state.isExtracting = true;
      })
      .addCase(extractComplaint.fulfilled, (state, action) => {
        state.isExtracting = false;
        state.complaint = action.payload.complaint;
        // ... handle success
      });
  },
});
```

## Key Technical Details

### Form State Management
- **Complaint data**: Controlled inputs with Redux state
- **AI tracking**: Sets for populated, edited, animating fields
- **Animation**: Sequential field population with visual feedback
- **Badge logic**: AI badge → Verified badge on edit

### Upload Validation
- **Size limit**: 10MB (prevents DoS)
- **File types**: .txt, .eml, .csv, .pdf, .docx
- **Drag & Drop**: HTML5 drag-drop API
- **Error handling**: User-friendly alerts with specific guidance

### Error Handling Strategy
- **Service Unavailable (503)**: "AI service temporarily unavailable"
- **Authentication Error (401)**: "Invalid API key configuration"
- **Connection Error**: "Unable to connect to server"
- **General Errors**: Contextual error messages
- **React Errors**: ErrorBoundary with reload option

### Performance Optimizations
- **Redux**: Efficient state updates with selectors
- **LangGraph**: Optimized async agent execution
- **FastAPI**: Async endpoint handling
- **Animation**: CSS transitions (GPU accelerated)

## Build & Deployment

### Development
```bash
# Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd artifacts/complaint-intake
pnpm run dev
```

### Production
```bash
# Build frontend
pnpm run build

# Start production servers
# Backend
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
pnpm run serve
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/aivoa_cms
GROQ_API_KEY=your_groq_api_key_here
```

## Scalability Considerations

### Current Limitations
- **Single server**: No horizontal scaling
- **No queue**: Extraction happens synchronously
- **No rate limiting**: Vulnerable to abuse
- **No caching**: Every extraction calls AI

### Future Improvements
- **Queue system**: Celery/Redis for async extraction
- **Rate limiting**: fastapi-limiter middleware
- **Caching**: Redis for common extractions
- **Monitoring**: APM integration (New Relic, DataDog)
- **Load balancing**: Nginx + multiple server instances

## Security Considerations

### Current Implementation
- **Input validation**: Pydantic schemas on all API endpoints
- **SQL injection**: SQLAlchemy ORM prevents it
- **XSS**: React escapes by default
- **CSRF**: Not implemented (consider adding)
- **Authentication**: Not implemented (add for production)

### Recommended Additions
- **CSRF protection**: starlette CSRF middleware
- **Rate limiting**: fastapi-limiter to prevent API abuse
- **Request signing**: For API keys
- **Audit logging**: Track all complaint modifications
- **Input sanitization**: Additional security layer

## Testing Strategy

### Current State
- **No automated tests**: Need to add
- **Manual testing**: Via provided fixtures

### Recommended Tests
- **Unit tests**: Critical business logic (risk classification, validation)
- **Integration tests**: API endpoints with test database
- **E2E tests**: Playwright for critical user flows
- **Performance tests**: Load testing for extraction endpoint

## Monitoring & Observability

### Current
- **Structured logging**: Python logging module
- **Health endpoint**: `/api/healthz`

### Recommended
- **Error tracking**: Sentry integration
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry
- **Uptime monitoring**: UptimeRobot/Pingdom

## Common Interview Questions

### Technical Questions
1. **Why use JSONB instead of relational schema?**
   - Flexibility for AI contract evolution
   - Avoids migrations for field changes
   - Preserves complete AI analysis
   - Still allows JSONB queries for filtering

2. **How do you handle AI failures?**
   - Fallback to local parser
   - User-friendly error messages
   - Retry logic in frontend
   - Graceful degradation

3. **Why Redux over TanStack Query?**
   - Required by assignment
   - Predictable state management
   - Excellent DevTools support
   - Simplified async handling with createAsyncThunk

4. **How does LangGraph improve over custom AI pipeline?**
   - Multi-agent workflow orchestration
   - Built-in state management
   - Checkpointing and persistence
   - Visualizable graph structure

### Architecture Questions
1. **How would you scale this?**
   - Add message queue for async extraction
   - Implement caching for common patterns
   - Add rate limiting
   - Horizontal scaling with load balancer

2. **What are the biggest risks?**
   - AI API dependency (mitigated with fallback)
   - Database performance (indexed fields needed)
   - Frontend bundle size (code splitting)
   - Security (authentication, rate limiting)

## Performance Metrics

### Target Metrics
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **API response time**: <500ms for extraction
- **Bundle size**: <500KB gzipped
- **Lighthouse score**: >90

### Current Estimates
- **API response**: 1-2s (AI dependent)
- **UI responsiveness**: 60fps animations
- **Bundle size**: ~300KB (estimated)

## Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] CDN for static assets
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring (DataDog/New Relic) setup

### Post-deployment
- [ ] Health check endpoint working
- [ ] Database connection verified
- [ ] AI API key functional
- [ ] Error monitoring active
- [ ] Performance baselines established
- [ ] Rollback procedure tested