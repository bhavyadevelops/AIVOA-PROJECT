# AIVOA Complaint Intake System

An AI-assisted, two-panel intake workflow for capturing pharmaceutical customer complaints, assessing risk, and saving the verified record.

## Features

- **AI-Powered Extraction**: Automatically extracts complaint fields from text, emails, and documents using LangGraph
- **Risk Assessment**: Built-in risk classification with patient safety and product quality analysis
- **Real-time Validation**: Field-by-field verification with AI badges and verified states
- **Chat Assistant**: AI copilot for explaining decisions and providing recommendations
- **Responsive Design**: Works seamlessly on desktop, laptop, and tablet devices
- **Type-Safe**: Full TypeScript implementation with Pydantic validation
- **Redux State Management**: Centralized state management with Redux Toolkit

## Technology Stack

### Frontend
- React 19.1.0 with TypeScript 5.9
- Redux Toolkit for state management
- Tailwind CSS 4.1.14 for styling
- Vite 7.3.2 for build tooling
- Radix UI for accessible components
- Framer Motion 12.23.24 for animations
- Wouter for routing

### Backend
- Python 3.12+
- FastAPI 0.141.0
- LangGraph 1.2.10 for AI agent workflows
- LangChain 1.3.14 for LLM integration
- Groq SDK with llama-3.3-70b-versatile model (gemma2-9b-it was decommissioned)
- SQLAlchemy 2.0.51 with PostgreSQL
- Pydantic for validation

### Database
- PostgreSQL with JSONB for flexible schema

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 24+
- PostgreSQL database
- pnpm package manager

### Installation

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../artifacts/complaint-intake
pnpm install

# Set up environment variables
# Create backend/.env with:
# DATABASE_URL=postgresql://user:password@localhost:5432/aivoa_cms
# GROQ_API_KEY=your_groq_api_key_here
```

### Development

```bash
# Start the API server (port 8000)
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start the frontend (port 5173)
cd artifacts/complaint-intake
pnpm run dev
```

### Environment Variables

```env
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/aivoa_cms
GROQ_API_KEY=your_groq_api_key_here
```

## Project Structure

```
artifacts/
├── complaint-intake/    # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── features/    # Feature modules
│   │   ├── store/      # Redux store
│   │   └── pages/      # Page components
│   └── package.json
backend/                # Python FastAPI backend
├── ai/                 # LangGraph AI agents
│   └── graph.py       # Complaint processing workflow
├── routers/           # API endpoints
│   ├── complaints.py  # Complaint operations
│   └── health.py      # Health check
├── database.py        # SQLAlchemy models
└── main.py           # FastAPI application
```

## API Endpoints

### Health Check
- `GET /api/healthz` - Service health status

### Complaint Operations
- `POST /api/complaints/extract` - Extract complaint data using LangGraph AI
- `POST /api/complaints/complaints` - Save complaint to database
- `POST /api/complaints/copilot/chat` - AI chat assistant
- `GET /api/complaints/complaints/:id` - Retrieve complaint by ID

## LangGraph AI Workflow

The backend uses LangGraph to implement a multi-agent AI workflow:

1. **Parser Agent**: Clean and normalize input text
2. **Extractor Agent**: Extract structured complaint fields using Groq AI
3. **Risk Classifier Agent**: Assess risk level with AI
4. **Completeness Agent**: Check required fields
5. **Summarizer Agent**: Generate complaint summary

## Usage

1. **Upload Complaint**: Paste text or upload a file (TXT, EML, CSV, PDF, DOCX)
2. **AI Extraction**: Click "Extract Information" to automatically populate fields via LangGraph
3. **Review & Edit**: Verify AI-extracted data, edit as needed
4. **Risk Assessment**: Review AI-generated risk analysis
5. **Save**: Submit the verified complaint to the database

## Architecture Decisions

### FastAPI over Express
- Mandatory requirement for assignment
- Async support for better performance
- Automatic API documentation with Swagger UI
- Type hints and Pydantic validation

### LangGraph for AI Agents
- Enables multi-agent workflows
- Better state management for complex AI tasks
- Visualizable graph structure
- Built-in checkpointing and persistence

### Redux Toolkit for State Management
- Mandatory requirement for assignment
- Predictable state updates
- Excellent DevTools support
- Simplified async handling with createAsyncThunk

### JSONB Storage
Complaint and risk objects are stored as JSONB to preserve the AI extraction contract without a sprawling relational schema. This allows:
- Flexible schema evolution without migrations
- Complete AI analysis preservation
- Efficient querying with JSONB operators

## AI Resilience
The system uses Groq for AI extraction with heuristic-based fallback, ensuring service resilience when AI APIs are unavailable.

## Testing

```bash
# Manual testing with provided fixtures
# - artifacts/complaint-intake/public/fixtures/api-complaint.txt
# - artifacts/complaint-intake/public/fixtures/packaging-complaint.eml
# - artifacts/complaint-intake/public/fixtures/vague-customer-complaint.txt
```

## Deployment

### Database Setup
```bash
# Initialize database
cd backend
python -c "from database import init_db; init_db()"
```

### Production Build
```bash
# Build frontend
cd artifacts/complaint-intake
pnpm run build

# Start production servers
# Backend
cd ../../backend
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend (serve static files)
cd ../artifacts/complaint-intake
pnpm run serve
```

## Contributing

1. Run type checking before committing
2. Follow existing code style
3. Add tests for new features
4. Update documentation as needed

## License

MIT

## Support

For technical questions, see `AGENTS.md` for detailed architecture documentation.

## Assignment Compliance

This implementation follows the mandatory technology stack:
- ✅ Frontend: React UI with Redux for state management
- ✅ Backend: Python with FastAPI
- ✅ AI Agent Framework: LangGraph
- ✅ LLMs: Groq llama-3.3-70b-versatile (gemma2-9b-it was decommissioned)
- ✅ Database: PostgreSQL
- ✅ Font: Google Inter

## Bonus Features Implemented

- ✅ Complaint Completeness Checker
- ✅ AI Risk Classification
- ✅ Complaint Summary Generation
- ✅ AI Copilot Chat Assistant