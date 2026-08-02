# TypeScript Types

This directory contains shared TypeScript type definitions used across the application.

## Files

### `index.ts`
**Purpose**: Central type definitions for complaint and risk data

**Code Explanation**:
```typescript
export interface ComplaintFields {
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
  overallRisk: string;
  severityReason: string;
  priorityReason: string;
  patientSafety: string;
  productQuality: string;
  recommendedActions: string[];
  confidenceNotes: string;
}
```

## Types

### ComplaintFields
Represents the structure of a complaint with all extracted fields.

**Fields**:
- `complaintSource`: Source of the complaint (email, phone, portal, etc.)
- `customerName`: Name of the customer reporting the issue
- `productName`: Name of the pharmaceutical product
- `strength`: Product strength/dosage
- `batch`: Batch number of the product
- `manufacturingDate`: Date when product was manufactured
- `expiryDate`: Expiration date of the product
- `quantity`: Quantity mentioned in complaint
- `complaintType`: Type of complaint (quality, safety, efficacy, etc.)
- `complaintDate`: Date when complaint was reported
- `description`: Detailed description of the issue
- `severity`: Severity level (Low, Medium, High)
- `priority`: Priority level (Low, Medium, High)

**Note**: All fields are strings to accommodate various formats and partial data.

### RiskAssessment
Represents the AI-generated risk assessment for a complaint.

**Fields**:
- `overallRisk`: Overall risk level (Low, Medium, High)
- `severityReason`: Explanation for severity classification
- `priorityReason`: Explanation for priority classification
- `patientSafety`: Assessment of patient safety impact
- `productQuality`: Assessment of product quality impact
- `recommendedActions`: Array of recommended actions to take
- `confidenceNotes`: Notes on confidence level of assessment

## Usage

```typescript
import type { ComplaintFields, RiskAssessment } from '@/types';

const complaint: ComplaintFields = {
  customerName: "John Smith",
  productName: "Product ABC",
  // ... other fields
};

const risk: RiskAssessment = {
  overallRisk: "High",
  severityReason: "Based on reported severity: High",
  // ... other fields
};
```

## Why Separate Types?

1. **Reusability**: Types can be imported across components
2. **Consistency**: Ensures same structure everywhere
3. **Type Safety**: Catches type errors at compile time
4. **Documentation**: Types serve as documentation
5. **Sync with Backend**: Matches backend Pydantic models

## Future Types

Potential additions:
- `User` - User authentication data
- `FilterOptions` - Query filter parameters
- `PaginationParams` - Pagination configuration
- `ApiResponse<T>` - Generic API response wrapper