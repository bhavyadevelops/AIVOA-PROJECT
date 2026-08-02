# Shared Directory

This directory contains shared utilities, constants, and type definitions used across the entire AIVOA-CMS project.

## Overview

The `shared/` directory provides common code that can be used by both the frontend (React/TypeScript) and backend implementations (Python and Node.js). This ensures consistency and reduces code duplication across the project.

## Directory Structure

```
shared/
├── constants/          # Shared constants and enums
│   ├── complaint-status.ts    # Complaint status values
│   ├── priority.ts            # Priority level definitions
│   ├── severity.ts            # Severity level definitions
│   └── index.ts               # Constant exports
└── types/              # Shared TypeScript type definitions
    ├── ai.ts                  # AI-related types
    ├── complaint.ts           # Complaint data types
    ├── risk.ts                # Risk assessment types
    ├── index.ts               # Type exports
    └── package.json           # Package configuration
```

## Modules

### constants/ - Shared Constants

**Purpose**: Centralized constant values used throughout the application.

#### complaint-status.ts

Defines the possible status values for complaints in the system:

```typescript
export const COMPLAINT_STATUS = {
  PENDING_TRIAGE: 'Pending Triage',
  UNDER_INVESTIGATION: 'Under Investigation',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
} as const;
```

**Usage**:
- Frontend: Display status badges, filter by status
- Backend: Set initial status, update status
- Database: Store status values

#### priority.ts

Defines priority levels for complaint classification:

```typescript
export const PRIORITY_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;
```

**Usage**:
- Risk assessment logic
- UI priority indicators
- Filtering and sorting

#### severity.ts

Defines severity levels for complaint classification:

```typescript
export const SEVERITY_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;
```

**Usage**:
- Risk assessment calculations
- AI extraction targets
- Severity-based routing

### types/ - Shared Type Definitions

**Purpose**: TypeScript type definitions that ensure consistency across frontend and backend.

#### ai.ts

AI-related type definitions for LangGraph workflow:

```typescript
export interface AIExtractionResult {
  complaint: ExtractedComplaint;
  riskAssessment: RiskAssessment;
  summary: string;
  missingFields: string[];
}

export interface ProcessingState {
  text: string;
  complaint: ExtractedComplaint;
  riskAssessment: RiskAssessment;
  processingSteps: string[];
}
```

**Usage**:
- Type safety for AI operations
- API request/response contracts
- State management

#### complaint.ts

Complaint data structure definitions:

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

export interface ComplaintRequest {
  complaint: ExtractedComplaint;
  riskAssessment: RiskAssessment;
  documentName?: string;
  documentType?: string;
}
```

**Usage**:
- Form data structure
- API request bodies
- Database record structure
- Redux state

#### risk.ts

Risk assessment type definitions:

```typescript
export interface RiskAssessment {
  overallRisk: 'High' | 'Medium' | 'Low';
  severityReason: string;
  priorityReason: string;
  patientSafety: string;
  productQuality: string;
  recommendedActions: string[];
  confidenceNotes: string;
}

export interface CompletenessCheck {
  isComplete: boolean;
  missingFields: string[];
  completenessScore: number;
}
```

**Usage**:
- Risk assessment display
- AI response validation
- API contracts

## Integration Points

### Frontend Integration

The React frontend imports shared types and constants:

```typescript
import { COMPLAINT_STATUS } from '@/shared/constants';
import { ExtractedComplaint, RiskAssessment } from '@/shared/types';

// Use in components and Redux store
const status = COMPLAINT_STATUS.PENDING_TRIAGE;
const complaint: ExtractedComplaint = { /* ... */ };
```

### Node.js Backend Integration

The Node.js backend can import shared types:

```typescript
import { ExtractedComplaint, RiskAssessment } from '@workspace/shared-types';

// Use in API handlers and services
const complaint: ExtractedComplaint = request.body.complaint;
```

### Python Backend Note

The Python backend uses equivalent Pydantic models but follows the same structure defined in these TypeScript types for consistency.

## Package Configuration

### types/package.json

The types package is configured as a workspace package:

```json
{
  "name": "@workspace/shared-types",
  "version": "0.0.0",
  "private": true,
  "main": "index.ts",
  "types": "index.ts"
}
```

This allows other workspace packages to import it:

```json
{
  "dependencies": {
    "@workspace/shared-types": "workspace:*"
  }
}
```

## Benefits of Shared Code

### Consistency
- Same data structures across frontend and backend
- Consistent constant values
- Single source of truth for types

### Type Safety
- Compile-time type checking
- Better IDE support
- Reduced runtime errors

### Maintainability
- Changes in one place affect all consumers
- Easier to update data structures
- Centralized documentation

### Developer Experience
- Clear contracts between systems
- Better autocomplete
- Easier onboarding

## Usage Patterns

### Adding New Constants

1. Create constant file in `constants/`
2. Export constant object
3. Add to `constants/index.ts`
4. Document usage and purpose

```typescript
// constants/new-constant.ts
export const NEW_CONSTANT = {
  VALUE1: 'value1',
  VALUE2: 'value2',
} as const;

// constants/index.ts
export * from './new-constant';
```

### Adding New Types

1. Create type file in `types/`
2. Define interfaces/types
3. Add to `types/index.ts`
4. Document structure and usage

```typescript
// types/new-type.ts
export interface NewType {
  field1: string;
  field2: number;
}

// types/index.ts
export * from './new-type';
```

### Updating Existing Types

1. Modify type definition
2. Update all usages
3. Test integration points
4. Update documentation

## Best Practices

### Type Design
- Use interfaces for object shapes
- Use types for unions and primitives
- Prefer `as const` for constants
- Add descriptive comments for complex types

### Constant Design
- Group related constants together
- Use descriptive names
- Export as const objects
- Document valid values

### Documentation
- Add JSDoc comments for types
- Document constant purposes
- Provide usage examples
- Note any constraints

## Future Enhancements

### Additional Shared Modules

Potential additions to the shared directory:

```
shared/
├── utils/              # Shared utility functions
│   ├── validation.ts   # Validation helpers
│   ├── formatting.ts   # Formatting utilities
│   └── dates.ts        # Date utilities
├── config/             # Shared configuration
│   ├── api.ts          # API configuration
│   └── database.ts     # Database config
└── validators/         # Shared validation schemas
    ├── complaint.ts    # Complaint validators
    └── risk.ts         # Risk validators
```

### Cross-Language Support

Currently focused on TypeScript. Future enhancements could include:

- Protocol Buffers for language-agnostic schemas
- JSON Schema definitions
- OpenAPI/Swagger specifications
- Python type stubs (.pyi files)

## Testing

### Type Testing

```bash
# TypeScript compilation checks type consistency
cd shared/types
tsc --noEmit
```

### Constant Testing

```bash
# TODO: Add constant validation tests
pnpm test shared/
```

## Troubleshooting

### Import Errors

If you encounter import errors:

1. Verify workspace package configuration
2. Check package.json dependencies
3. Ensure TypeScript paths are configured
4. Verify export statements in index files

### Type Mismatches

If types don't match between systems:

1. Check shared type definitions
2. Verify all consumers are updated
3. Check for outdated type caches
4. Run TypeScript compilation

## Maintenance

### Regular Updates

- Review shared types quarterly
- Update constants as business rules change
- Remove unused types and constants
- Keep documentation current

### Version Control

- Commit shared changes with both frontend and backend
- Tag breaking changes
- Update changelog
- Communicate changes to team

## Examples

### Using Constants in Component

```typescript
import { COMPLAINT_STATUS, PRIORITY_LEVELS } from '@/shared/constants';

function StatusBadge({ status }: { status: string }) {
  const color = status === COMPLAINT_STATUS.HIGH_PRIORITY ? 'red' : 'blue';
  return <Badge color={color}>{status}</Badge>;
}
```

### Using Types in API Handler

```typescript
import { ExtractedComplaint, RiskAssessment } from '@workspace/shared-types';

async function handleComplaint(request: { complaint: ExtractedComplaint }) {
  const complaint: ExtractedComplaint = request.complaint;
  // Process complaint
}
```

### Using Types in Redux Slice

```typescript
import { ExtractedComplaint, RiskAssessment } from '@/shared/types';

interface ComplaintState {
  complaint: Partial<ExtractedComplaint>;
  riskAssessment: RiskAssessment | null;
}
```

## Related Documentation

- Main project README.md
- Frontend README.md
- Backend README.md
- AGENTS.md for architecture details
