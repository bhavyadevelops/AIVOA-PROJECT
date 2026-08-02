# Artifacts Directory

This directory contains frontend and alternative backend implementations for the AIVOA Complaint Management System.

## Overview

The `artifacts/` directory houses three main components:

1. **api-server/** - Node.js/Express alternative backend implementation
2. **complaint-intake/** - React frontend application  
3. **mockup-sandbox/** - Design mockups and prototypes

## Directory Structure

```
artifacts/
├── api-server/           # Node.js/Express backend (TypeScript)
│   ├── src/
│   │   ├── ai/          # LangGraph AI workflow implementation
│   │   ├── routes/      # API route handlers
│   │   ├── lib/         # Utility libraries
│   │   └── middlewares/ # Express middleware
│   ├── package.json
│   └── tsconfig.json
├── complaint-intake/     # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── features/    # Feature modules
│   │   ├── store/       # Redux store
│   │   └── pages/       # Page components
│   ├── public/
│   │   └── fixtures/    # Test data files
│   ├── package.json
│   └── vite.config.ts
└── mockup-sandbox/      # Design prototypes
```

## Components

### api-server/ (Node.js Backend)

**Purpose**: Alternative backend implementation using Node.js, Express, and TypeScript.

**Technology Stack**:
- Node.js with TypeScript
- Express.js web framework
- LangGraph for AI workflows
- Groq SDK for AI inference
- Drizzle ORM for database access

**When to Use**:
- When you prefer JavaScript/TypeScript over Python
- For teams with Node.js expertise
- When you need better integration with Node.js ecosystem

**API Endpoints**:
- `POST /api/complaints/extract` - AI-powered complaint extraction
- `POST /api/complaints/complaints` - Save complaint to database
- `GET /api/complaints/complaints/:id` - Retrieve complaint by ID
- `POST /api/complaints/copilot/chat` - AI chat assistant
- `GET /api/healthz` - Health check

**Getting Started**:
```bash
cd artifacts/api-server
pnpm install
pnpm run dev
```

### complaint-intake/ (React Frontend)

**Purpose**: Main frontend application for complaint intake and management.

**Technology Stack**:
- React 19.1.0 with TypeScript 5.9
- Redux Toolkit for state management
- Tailwind CSS 4.1.14 for styling
- Vite 7.3.2 for build tooling
- Radix UI for accessible components
- Framer Motion for animations
- Wouter for routing

**Key Features**:
- AI-powered field extraction from text/documents
- Real-time risk assessment display
- Interactive form with validation
- AI chat assistant for guidance
- Responsive design for all devices
- File upload support (TXT, EML, CSV, PDF, DOCX)

**Getting Started**:
```bash
cd artifacts/complaint-intake
pnpm install
pnpm run dev
```

**Building for Production**:
```bash
pnpm run build
pnpm run serve
```

### mockup-sandbox/ (Design Prototypes)

**Purpose**: Contains design mockups, wireframes, and UI prototypes.

**Contents**:
- Early design concepts
- UI component prototypes
- Layout experiments
- User flow mockups

## Architecture Notes

### Backend Choice

This project provides two backend implementations:

1. **Python/FastAPI** (in `backend/` directory) - Primary implementation
2. **Node.js/Express** (in `artifacts/api-server/`) - Alternative implementation

Both implementations:
- Use LangGraph for AI agent workflows
- Integrate with Groq for AI inference
- Provide identical API endpoints
- Support the same React frontend

Choose based on your team's expertise and requirements.

### Frontend Compatibility

The React frontend in `complaint-intake/` works with either backend:
- Configure API base URL in environment variables
- Both backends provide compatible API contracts
- Same feature set regardless of backend choice

## Development Workflow

### Using Python Backend (Recommended)
```bash
# Terminal 1: Start Python backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start React frontend
cd artifacts/complaint-intake
pnpm run dev
```

### Using Node.js Backend
```bash
# Terminal 1: Start Node.js backend
cd artifacts/api-server
pnpm run dev

# Terminal 2: Start React frontend
cd artifacts/complaint-intake
pnpm run dev
```

## Shared Dependencies

Both implementations share:
- **LangGraph**: AI agent workflow framework
- **Groq SDK**: AI inference API
- **Database Schema**: PostgreSQL with identical structure
- **API Contract**: Same request/response formats

## Testing

### Frontend Testing
```bash
cd artifacts/complaint-intake
# Test with provided fixtures in public/fixtures/
```

### Backend Testing
```bash
# Python backend
cd backend
pytest tests/

# Node.js backend
cd artifacts/api-server
pnpm test
```

## Deployment

### Frontend Deployment
```bash
cd artifacts/complaint-intake
pnpm run build
# Deploy dist/ directory to hosting service
```

### Backend Deployment
Choose one backend to deploy:

**Python**:
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Node.js**:
```bash
cd artifacts/api-server
pnpm run build
pnpm start
```

## Environment Configuration

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Node.js Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/aivoa_cms
GROQ_API_KEY=your_groq_api_key_here
PORT=8000
```

### Python Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/aivoa_cms
GROQ_API_KEY=your_groq_api_key_here
```

## Support

For detailed architecture information, see the main project README.md and AGENTS.md files.
