# Source Directory

This directory contains the main source code for the Node.js/Express API server.

## Overview

The `src/` directory is organized by functionality, with separate modules for AI processing, API routes, utility libraries, and application configuration.

## Directory Structure

```
src/
├── ai/              # AI workflow and processing
│   ├── nodes/       # Individual AI processing nodes
│   ├── prompts/     # AI prompt templates
│   ├── services/    # External service integrations
│   ├── graph.ts     # AI workflow orchestration
│   ├── state.ts     # Workflow state definitions
│   ├── types.ts     # AI-related types
│   └── index.ts     # AI module exports
├── routes/          # API route handlers
│   ├── complaints/  # Complaint-specific endpoints
│   ├── health.ts    # Health check endpoint
│   └── index.ts     # Route aggregation
├── lib/             # Utility libraries
│   ├── complaint-ai.ts   # AI processing wrapper
│   └── logger.ts         # Logging configuration
├── middlewares/     # Express middleware (empty, reserved for future use)
├── app.ts           # Express application setup
└── index.ts         # Application entry point
```

## Modules

### ai/ - AI Processing Module

**Purpose**: Implements the multi-agent AI workflow for complaint processing.

**Key Components**:
- **graph.ts**: Orchestrates the AI workflow with state management
- **nodes/**: Individual processing steps (parse, extract, classify, validate, summarize)
- **prompts/**: Prompt templates for AI interactions
- **services/**: External AI service integrations (Groq, fallback parser)
- **state.ts**: TypeScript interfaces for workflow state
- **types.ts**: Shared type definitions for AI operations

**Workflow**:
1. Parse input text
2. Extract structured fields using AI
3. Classify risk level
4. Validate completeness
5. Generate summary

### routes/ - API Routes Module

**Purpose**: Defines HTTP endpoints and request handlers.

**Key Components**:
- **health.ts**: Health check endpoint for monitoring
- **complaints/**: Complaint-related operations
  - `extract.ts`: AI-powered extraction endpoint
  - `create.ts`: Create complaint endpoint
  - `get.ts`: Retrieve complaint endpoint
  - `chat.ts`: AI chat assistant endpoint
- **index.ts**: Aggregates all routes with middleware

**API Base Path**: `/api`

### lib/ - Utility Libraries

**Purpose**: Shared utility functions and configurations.

**Key Components**:
- **complaint-ai.ts**: Wrapper for AI processing operations
- **logger.ts**: Pino logger configuration

### middlewares/ - Express Middleware

**Purpose**: Custom Express middleware functions.

**Current Status**: Empty directory, reserved for future middleware such as:
- Authentication
- Rate limiting
- Request validation
- Error handling

### app.ts - Application Configuration

**Purpose**: Configures the Express application.

**Key Responsibilities**:
- Middleware setup (CORS, logging, parsing)
- Route registration
- Error handling
- Server configuration

### index.ts - Entry Point

**Purpose**: Application entry point that starts the server.

**Key Responsibilities**:
- Loads environment variables
- Initializes database connection
- Starts HTTP server
- Handles graceful shutdown

## Key Patterns

### Async/Await
All asynchronous operations use async/await for readability:
```typescript
async function processComplaint(text: string) {
  const result = await aiService.extract(text);
  return result;
}
```

### Error Handling
Consistent error handling with try-catch blocks:
```typescript
try {
  const result = await operation();
  return result;
} catch (error) {
  logger.error('Operation failed', error);
  throw new ApiError('Operation failed', 500);
}
```

### Dependency Injection
Services are injected where needed for testability:
```typescript
export function createComplaintHandler(db: Database) {
  return async (req: Request, res: Response) => {
    // Use db parameter
  };
}
```

### Type Safety
Strict TypeScript typing throughout:
```typescript
interface ComplaintState {
  text: string;
  complaint: ExtractedData;
  riskAssessment: RiskAssessment;
}
```

## Environment Configuration

The application loads environment variables from `.env` file:

```typescript
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8000;
const groqApiKey = process.env.GROQ_API_KEY;
```

## Logging

Structured logging with Pino:
```typescript
import logger from './lib/logger';

logger.info('Processing complaint', { complaintId });
logger.error('Extraction failed', { error });
```

## Development Notes

### Adding New Routes

1. Create route file in appropriate `routes/` subdirectory
2. Define endpoints with Express router
3. Add request/response validation
4. Register in `routes/index.ts`

### Adding AI Nodes

1. Create node file in `ai/nodes/`
2. Implement node function following the pattern
3. Add to workflow in `ai/graph.ts`
4. Update state types if needed

### Adding Services

1. Create service file in `ai/services/` or `lib/`
2. Implement service interface
3. Add error handling and logging
4. Export for use in other modules

## Testing

Currently uses manual testing. Future improvements:
```bash
# TODO: Add Jest or similar testing framework
pnpm test
```

## Build Process

Source files are compiled using ESBuild:
- TypeScript → JavaScript
- Tree shaking for unused code
- Source maps for debugging
- Minification for production

## Integration Points

### Database
Uses `@workspace/db` package for database operations:
- Connection management
- Query execution
- Transaction handling

### Validation
Uses `@workspace/api-zod` package for request validation:
- Schema definitions
- Runtime validation
- Error generation

### Types
Uses `@workspace/shared-types` package for shared type definitions:
- API contracts
- Data models
- Common interfaces

## Performance Considerations

- Async operations for non-blocking I/O
- Connection pooling for database
- Efficient AI API usage with fallbacks
- Minimal dependencies for fast startup

## Security Considerations

- Environment variable for sensitive data
- Input validation on all endpoints
- CORS configuration
- SQL injection prevention via ORM
- Error message sanitization

## Future Enhancements

- Add comprehensive error middleware
- Implement request rate limiting
- Add authentication/authorization
- Implement request caching
- Add API documentation (Swagger/OpenAPI)
- Comprehensive test coverage
- Performance monitoring
