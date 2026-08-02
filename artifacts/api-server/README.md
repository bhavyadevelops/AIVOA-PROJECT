# API Server - Node.js/Express Backend

This directory contains the Node.js/Express alternative backend implementation for the AIVOA Complaint Management System.

## Overview

The API Server is a TypeScript-based Express application that provides RESTful API endpoints for complaint processing, AI-powered extraction, and database operations. It serves as an alternative to the Python/FastAPI backend.

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Groq SDK**: AI inference integration
- **Drizzle ORM**: Database ORM
- **Pino**: Structured logging
- **ESBuild**: Fast bundler

## Project Structure

```
api-server/
├── src/
│   ├── ai/              # LangGraph AI workflow implementation
│   │   ├── nodes/       # Individual AI agent implementations
│   │   ├── prompts/     # AI prompt templates
│   │   ├── services/    # AI service integrations (Groq, parser)
│   │   ├── graph.ts     # LangGraph workflow definition
│   │   ├── state.ts     # Workflow state types
│   │   └── types.ts     # AI-related type definitions
│   ├── routes/          # API route handlers
│   │   ├── complaints/  # Complaint-specific endpoints
│   │   │   ├── extract.ts    # Extraction endpoint
│   │   │   ├── create.ts     # Create complaint endpoint
│   │   │   ├── get.ts        # Get complaint endpoint
│   │   │   ├── chat.ts       # AI chat endpoint
│   │   │   └── index.ts      # Route aggregation
│   │   ├── health.ts    # Health check endpoint
│   │   └── index.ts     # Main router setup
│   ├── lib/             # Utility libraries
│   │   ├── complaint-ai.ts   # AI processing logic
│   │   └── logger.ts         # Logging configuration
│   ├── middlewares/     # Express middleware
│   ├── app.ts           # Express app configuration
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript output
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── build.mjs            # Build script
└── .env.example         # Environment variables template
```

## Key Features

### AI-Powered Complaint Processing
- Multi-agent LangGraph workflow for complaint analysis
- Automated field extraction from unstructured text
- Risk assessment and classification
- Completeness validation
- Summary generation

### RESTful API Endpoints
- Complaint extraction with AI
- CRUD operations for complaints
- AI chat assistant
- Health monitoring

### Type Safety
- Full TypeScript implementation
- Shared type definitions across workspace
- Runtime validation with Zod schemas

### Structured Logging
- Pino logger for performance
- Structured JSON logs
- Request/response tracking

## Installation

```bash
cd artifacts/api-server
pnpm install
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/aivoa_cms
GROQ_API_KEY=your_groq_api_key_here
PORT=8000
NODE_ENV=development
```

## Running the Server

### Development Mode
```bash
pnpm run dev
```
This builds the TypeScript code and starts the server with hot reload.

### Production Mode
```bash
pnpm run build
pnpm start
```

### Type Checking
```bash
pnpm run typecheck
```

## API Endpoints

### Health Check
- `GET /api/healthz` - Service health status

### Complaint Operations
- `POST /api/complaints/extract` - Extract complaint data using AI
- `POST /api/complaints/complaints` - Save complaint to database
- `GET /api/complaints/complaints/:id` - Retrieve complaint by ID
- `POST /api/complaints/copilot/chat` - AI chat assistant

## AI Workflow Implementation

The AI workflow is implemented in `src/ai/` using a LangGraph-inspired architecture:

### Nodes (src/ai/nodes/)
- `parse-input.ts` - Text cleaning and normalization
- `extract-fields.ts` - AI-powered field extraction
- `classify-risk.ts` - Risk assessment and classification
- `completeness.ts` - Required field validation
- `summarize.ts` - Complaint summary generation

### Prompts (src/ai/prompts/)
- `extraction.ts` - Field extraction prompt templates
- `risk.ts` - Risk assessment prompt templates
- `summary.ts` - Summary generation prompt templates

### Services (src/ai/services/)
- `groq.ts` - Groq API integration
- `parser.ts` - Fallback heuristic parser
- `validators.ts` - Data validation utilities

## Architecture

### Request Flow
1. HTTP request → Express middleware
2. Route handler → AI processing (if needed)
3. Database operations (via Drizzle ORM)
4. Response → JSON output

### AI Processing Flow
1. Input text → Parser node
2. Parser output → Extractor node (Groq AI)
3. Extractor output → Risk classifier node
4. Risk output → Completeness checker node
5. Completeness output → Summarizer node
6. Final result → API response

### Error Handling
- Graceful degradation for AI failures
- Fallback to heuristic parsing
- Structured error responses
- Request logging for debugging

## Workspace Integration

This package is part of a monorepo workspace and depends on:
- `@workspace/api-zod` - Shared API validation schemas
- `@workspace/db` - Shared database configuration
- `@workspace/shared-types` - Shared TypeScript types

## Development Notes

### Code Style
- TypeScript strict mode enabled
- ES6+ syntax
- Async/await for asynchronous operations
- Functional programming patterns

### Performance
- ESBuild for fast compilation
- Minimal dependencies
- Efficient database queries
- Optimized AI API calls

### Security
- Environment variable configuration
- CORS middleware
- Input validation with Zod
- SQL injection prevention (via ORM)

## Testing

Currently, manual testing is performed using the frontend application. Automated tests should be added:

```bash
# TODO: Add test framework
pnpm test
```

## Deployment

### Build
```bash
pnpm run build
```

### Environment Setup
Ensure all environment variables are configured in production.

### Start
```bash
pnpm start
```

The server will start on the configured PORT (default: 8000).

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process on port 8000

2. **Database Connection Failed**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check database credentials

3. **Groq API Errors**
   - Verify GROQ_API_KEY is valid
   - Check Groq service status
   - Fallback parser will activate on failure

4. **TypeScript Errors**
   - Run `pnpm run typecheck`
   - Ensure workspace dependencies are installed
   - Check tsconfig.json configuration

## Comparison with Python Backend

This Node.js implementation provides the same functionality as the Python/FastAPI backend:

| Feature | Python Backend | Node.js Backend |
|---------|----------------|-----------------|
| Language | Python | TypeScript |
| Framework | FastAPI | Express |
| AI Framework | LangGraph | Custom implementation |
| ORM | SQLAlchemy | Drizzle |
| API Docs | Auto-generated (Swagger) | Manual documentation |
| Type Safety | Pydantic | TypeScript + Zod |

Choose based on:
- Team expertise
- Existing infrastructure
- Performance requirements
- Ecosystem preferences

## Support

For issues or questions:
1. Check the main project README.md
2. Review AGENTS.md for architecture details
3. Examine the Python backend implementation for reference
