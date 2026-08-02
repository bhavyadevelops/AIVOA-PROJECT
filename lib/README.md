# Shared Libraries

This directory contains shared libraries used across the monorepo.

## Overview

The `lib/` directory contains reusable packages that can be imported by multiple workspaces:
- `db/` - Database schema and ORM configuration
- `api-zod/` - API validation schemas with Zod
- `shared-types/` - Shared TypeScript types

## Subdirectories

### `db/`
**Purpose**: Database schema and migrations

**Key Files**:
- `package.json` - Database package configuration
- `src/schema/` - Database table definitions
- `migrations/` - Database migration files

**Usage**:
```typescript
import { complaintsTable } from '@workspace/db';
```

**Note**: This was used with the old Node.js/Express backend. The new Python/FastAPI backend has its own database configuration in `backend/database.py`.

### `api-zod/`
**Purpose**: API validation schemas using Zod

**Key Files**:
- `package.json` - Validation package configuration
- `src/` - Zod schemas for API validation

**Usage**:
```typescript
import { ComplaintSchema } from '@workspace/api-zod';
```

**Note**: This was used with the old Node.js/Express backend. The new Python/FastAPI backend uses Pydantic for validation.

### `shared-types/`
**Purpose**: Shared TypeScript type definitions

**Key Files**:
- `package.json` - Types package configuration
- `complaint.ts` - Complaint type definitions
- `risk.ts` - Risk assessment type definitions
- `index.ts` - Main export file

**Usage**:
```typescript
import type { ComplaintFields, RiskAssessment } from '@workspace/shared-types';
```

**Note**: This was used with the old Node.js/Express backend. The new React frontend has its own types in `artifacts/complaint-intake/src/types/`.

## Monorepo Structure

This is a pnpm workspace monorepo with shared libraries:
```
aivoa-cms/
├── lib/                    # Shared libraries
│   ├── db/                # Database schema
│   ├── api-zod/           # API validation
│   └── shared-types/      # Shared types
├── artifacts/             # Application packages
│   ├── api-server/        # Old Node.js backend (deprecated)
│   └── complaint-intake/  # React frontend
└── backend/               # New Python backend
```

## Workspace Configuration

Defined in root `pnpm-workspace.yaml`:
```yaml
packages:
  - 'lib/*'
  - 'artifacts/*'
  - 'backend'
```

## Importing Shared Libraries

In workspace packages:
```json
{
  "dependencies": {
    "@workspace/db": "workspace:*",
    "@workspace/api-zod": "workspace:*",
    "@workspace/shared-types": "workspace:*"
  }
}
```

## Migration Status

With the technology stack migration to Python/FastAPI:
- `lib/db/` - **Deprecated** (replaced by `backend/database.py`)
- `lib/api-zod/` - **Deprecated** (replaced by Pydantic in FastAPI)
- `lib/shared-types/` - **Deprecated** (replaced by local types in frontend)

These libraries were used with the old Node.js/Express backend and are kept for reference but are not actively used in the new implementation.

## Future Considerations

If the project evolves to use a unified backend (Node.js or Python) with shared types:
- Consider using Protocol Buffers for cross-language type sharing
- Or use OpenAPI spec as the single source of truth
- Or generate types from database schema