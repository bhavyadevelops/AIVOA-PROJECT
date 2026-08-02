# Library / Utilities

This directory contains utility functions and helper modules used throughout the application.

## Files

### `utils.ts`
**Purpose**: Utility functions for common operations

**Key Functions**:

#### cn()
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Purpose**: Merge Tailwind CSS classes intelligently

**Usage**:
```typescript
cn('px-4 py-2', 'bg-blue-500', className)
```

**Features**:
- Merges multiple class strings
- Handles conditional classes
- Resolves Tailwind class conflicts
- Widely used in UI components

**Why**:
- Combines `clsx` (conditional classes) and `tailwind-merge` (conflict resolution)
- Ensures correct Tailwind class precedence
- Common pattern in shadcn/ui components

## Utility Categories

### String Utilities
- (To be added) formatDate, truncate, capitalize, etc.

### Number Utilities
- (To be added) formatCurrency, formatPercent, etc.

### Array Utilities
- (To be added) groupBy, sortBy, unique, etc.

### Object Utilities
- (To be added) deepClone, pick, omit, etc.

### Validation Utilities
- (To be added) validateEmail, validatePhone, etc.

## When to Add Utilities

1. **Used in 3+ places**: Logic used across multiple components
2. **Complex logic**: Logic that's hard to understand inline
3. **Pure functions**: Functions without side effects
4. **Testable**: Functions that are easy to test independently

## Utility Function Pattern

```typescript
export function utilityName(input: InputType): OutputType {
  // Validation
  if (!input) {
    return defaultValue;
  }
  
  // Transformation
  const result = transform(input);
  
  // Return
  return result;
}
```

## Testing Utilities

Utilities should be tested independently:
```typescript
describe('cn', () => {
  it('merges classes', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  
  it('handles conditional classes', () => {
    expect(cn('a', false && 'b')).toBe('a');
  });
});
```

## Future Utilities

Potential additions:
- `formatDate`: Format dates consistently
- `formatNumber`: Format numbers with locale
- `generateId`: Generate unique IDs
- `debounce`: Debounce function calls
- `throttle`: Throttle function calls
- `deepEqual`: Deep object comparison