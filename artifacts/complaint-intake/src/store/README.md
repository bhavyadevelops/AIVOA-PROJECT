# Redux Store

This directory contains the Redux store configuration and slices for state management.

## Overview

Uses Redux Toolkit for:
- Centralized state management
- Async data fetching with createAsyncThunk
- Predictable state updates
- Excellent DevTools support

## Files

### `index.ts`
**Purpose**: Redux store configuration

**Code Explanation**:
```typescript
import { configureStore } from '@reduxjs/toolkit';
import complaintReducer from './complaintSlice';

export const store = configureStore({
  reducer: {
    complaint: complaintReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Key Points**:
- Configures store with complaint reducer
- Middleware setup for serializable checks
- TypeScript types for RootState and AppDispatch
- Ignored actions for persistence (future use)

### `complaintSlice.ts`
**Purpose**: Complaint state management slice

**Key Components**:

#### TypeScript Interfaces
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
- Type definitions for complaint and risk data
- Matches backend Pydantic models
- Ensures type safety across app

#### State Interface
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

**State Fields**:
- `complaint`: Extracted complaint data (partial, may be incomplete)
- `riskAssessment`: AI risk analysis (null if not extracted)
- `missingFields`: List of required fields not provided
- `aiPopulatedFields`: Set of fields populated by AI (for badges)
- `editedFields`: Set of fields manually edited by user
- `animatingFields`: Set of fields currently animating
- `isExtracting`: Loading state for extraction
- `isSaving`: Loading state for save
- `error`: Error message if any

#### Initial State
```typescript
const initialState: ComplaintState = {
  complaint: {},
  riskAssessment: null,
  missingFields: [],
  aiPopulatedFields: new Set(),
  editedFields: new Set(),
  animatingFields: new Set(),
  isExtracting: false,
  isSaving: false,
  error: null,
};
```

#### Async Thunks

**extractComplaint**:
```typescript
export const extractComplaint = createAsyncThunk(
  'complaint/extract',
  async (data: { text: string; documentName?: string; documentType?: string }) => {
    const response = await fetch('http://localhost:8000/api/complaints/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to extract complaint');
    }
    
    return response.json();
  }
);
```

**Purpose**: Call backend API to extract complaint data

**Flow**:
1. Receives text and optional document metadata
2. Makes POST request to backend
3. Throws error if response not OK
4. Returns parsed JSON response

**saveComplaint**:
```typescript
export const saveComplaint = createAsyncThunk(
  'complaint/save',
  async (data: { complaint: ComplaintFields; riskAssessment: RiskAssessment }) => {
    const response = await fetch('http://localhost:8000/api/complaints/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save complaint');
    }
    
    return response.json();
  }
);
```

**Purpose**: Save complaint to database

**Flow**:
1. Receives complaint and risk assessment
2. Makes POST request to backend
3. Throws error if response not OK
4. Returns saved complaint with ID

#### Synchronous Actions

**setComplaint**:
```typescript
setComplaint: (state, action: PayloadAction<Partial<ComplaintFields>>) => {
  state.complaint = { ...state.complaint, ...action.payload };
}
```
- Updates complaint data with partial update
- Merges new data with existing data

**setRiskAssessment**:
```typescript
setRiskAssessment: (state, action: PayloadAction<RiskAssessment>) => {
  state.riskAssessment = action.payload;
}
```
- Sets risk assessment data

**setAiPopulatedFields**:
```typescript
setAiPopulatedFields: (state, action: PayloadAction<Set<keyof ComplaintFields>>) => {
  state.aiPopulatedFields = action.payload;
}
```
- Sets which fields were populated by AI

**addAiPopulatedField**:
```typescript
addAiPopulatedField: (state, action: PayloadAction<keyof ComplaintFields>) => {
  state.aiPopulatedFields.add(action.payload);
}
```
- Adds a single field to AI populated set

**addEditedField**:
```typescript
addEditedField: (state, action: PayloadAction<keyof ComplaintFields>) => {
  state.editedFields.add(action.payload);
}
```
- Adds a field to edited set (when user edits AI field)

**addAnimatingField**:
```typescript
addAnimatingField: (state, action: PayloadAction<keyof ComplaintFields>) => {
  state.animatingFields.add(action.payload);
}
```
- Adds field to animating set (for visual feedback)

**removeAnimatingField**:
```typescript
removeAnimatingField: (state, action: PayloadAction<keyof ComplaintFields>) => {
  state.animatingFields.delete(action.payload);
}
```
- Removes field from animating set

**reset**:
```typescript
reset: (state) => {
  state.complaint = {};
  state.riskAssessment = null;
  state.missingFields = [];
  state.aiPopulatedFields = new Set();
  state.editedFields = new Set();
  state.animatingFields = new Set();
  state.error = null;
}
```
- Resets all state to initial values
- Called after successful save or manual reset

**clearError**:
```typescript
clearError: (state) => {
  state.error = null;
}
```
- Clears error message

#### Extra Reducers (Async Thunk Handlers)

**extractComplaint**:
```typescript
.addCase(extractComplaint.pending, (state) => {
  state.isExtracting = true;
  state.error = null;
})
.addCase(extractComplaint.fulfilled, (state, action) => {
  state.isExtracting = false;
  state.complaint = action.payload.complaint;
  state.riskAssessment = action.payload.riskAssessment;
  state.missingFields = action.payload.missingFields;
  
  const populated = new Set<keyof ComplaintFields>();
  Object.keys(action.payload.complaint).forEach((key) => {
    if (action.payload.complaint[key as keyof ComplaintFields]) {
      populated.add(key as keyof ComplaintFields);
    }
  });
  state.aiPopulatedFields = populated;
  state.editedFields = new Set();
})
.addCase(extractComplaint.rejected, (state, action) => {
  state.isExtracting = false;
  state.error = action.error.message || 'Failed to extract complaint';
})
```

**Flow**:
- **pending**: Set loading, clear error
- **fulfilled**: Update state with API response, set AI populated fields
- **rejected**: Clear loading, set error message

**saveComplaint**:
```typescript
.addCase(saveComplaint.pending, (state) => {
  state.isSaving = true;
  state.error = null;
})
.addCase(saveComplaint.fulfilled, (state) => {
  state.isSaving = false;
  state.complaint = {};
  state.riskAssessment = null;
  state.missingFields = [];
  state.aiPopulatedFields = new Set();
  state.editedFields = new Set();
  state.animatingFields = new Set();
})
.addCase(saveComplaint.rejected, (state, action) => {
  state.isSaving = false;
  state.error = action.error.message || 'Failed to save complaint';
})
```

**Flow**:
- **pending**: Set loading, clear error
- **fulfilled**: Reset all state (ready for new complaint)
- **rejected**: Clear loading, set error message

## Usage Example

### In Component
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { extractComplaint, setComplaint } from '@/store/complaintSlice';

function MyComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const { complaint, isExtracting } = useSelector((state: RootState) => state.complaint);
  
  const handleExtract = (text: string) => {
    dispatch(extractComplaint({ text }));
  };
  
  const handleFieldChange = (field: string, value: string) => {
    dispatch(setComplaint({ [field]: value }));
  };
  
  return (
    <div>
      <button onClick={() => handleExtract("sample text")}>
        {isExtracting ? 'Extracting...' : 'Extract'}
      </button>
      <input 
        value={complaint.customerName || ''}
        onChange={(e) => handleFieldChange('customerName', e.target.value)}
      />
    </div>
  );
}
```

### In Custom Hook
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { extractComplaint, saveComplaint, reset } from '@/store/complaintSlice';

export function useComplaintForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { complaint, riskAssessment, isExtracting, isSaving } = useSelector((state: RootState) => state.complaint);
  
  const handleExtract = (text: string) => {
    dispatch(extractComplaint({ text }));
  };
  
  const handleSave = () => {
    dispatch(saveComplaint({ complaint, riskAssessment }));
  };
  
  const handleReset = () => {
    dispatch(reset());
  };
  
  return { complaint, riskAssessment, isExtracting, isSaving, handleExtract, handleSave, handleReset };
}
```

## Why Redux Toolkit?

1. **Required by assignment**: Mandatory technology stack
2. **Predictable state**: Centralized, easy to debug
3. **DevTools**: Excellent time-travel debugging
4. **Simplified async**: createAsyncThunk handles pending/fulfilled/rejected
5. **Immutability**: Immer built-in, no manual spreading needed
6. **TypeScript**: Full type safety