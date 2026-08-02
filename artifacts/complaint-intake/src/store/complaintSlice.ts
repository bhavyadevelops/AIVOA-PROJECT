import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
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

interface ComplaintState {
  complaint: Partial<ComplaintFields>;
  riskAssessment: RiskAssessment | null;
  missingFields: string[];
  aiPopulatedFields: (keyof ComplaintFields)[];
  editedFields: (keyof ComplaintFields)[];
  animatingFields: (keyof ComplaintFields)[];
  isExtracting: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: ComplaintState = {
  complaint: {},
  riskAssessment: null,
  missingFields: [],
  aiPopulatedFields: [],
  editedFields: [],
  animatingFields: [],
  isExtracting: false,
  isSaving: false,
  error: null,
};

// Async thunks
export const extractComplaint = createAsyncThunk(
  'complaint/extract',
  async (data: { text: string; documentName?: string; documentType?: string; file?: File }) => {
    const formData = new FormData();
    
    if (data.file) {
      formData.append('file', data.file);
      formData.append('document_name', data.documentName || data.file.name);
    } else {
      formData.append('text', data.text);
      if (data.documentName) formData.append('document_name', data.documentName);
      if (data.documentType) formData.append('document_type', data.documentType);
    }
    
    const response = await fetch('http://localhost:8000/api/complaints/extract', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to extract complaint');
    }
    
    return response.json();
  }
);

export const saveComplaint = createAsyncThunk(
  'complaint/save',
  async (data: { complaint: ComplaintFields; riskAssessment: RiskAssessment }) => {
    console.log('Sending save request with data:', data);
    const response = await fetch('http://localhost:8000/api/complaints/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Save failed with status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`Failed to save complaint: ${errorText}`);
    }
    
    return response.json();
  }
);

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    setComplaint: (state, action: PayloadAction<Partial<ComplaintFields>>) => {
      state.complaint = { ...state.complaint, ...action.payload };
    },
    setRiskAssessment: (state, action: PayloadAction<RiskAssessment>) => {
      state.riskAssessment = action.payload;
    },
    setAiPopulatedFields: (state, action: PayloadAction<(keyof ComplaintFields)[]>) => {
      state.aiPopulatedFields = action.payload;
    },
    setEditedFields: (state, action: PayloadAction<(keyof ComplaintFields)[]>) => {
      state.editedFields = action.payload;
    },
    setAnimatingFields: (state, action: PayloadAction<(keyof ComplaintFields)[]>) => {
      state.animatingFields = action.payload;
    },
    addAiPopulatedField: (state, action: PayloadAction<keyof ComplaintFields>) => {
      if (!state.aiPopulatedFields.includes(action.payload)) {
        state.aiPopulatedFields.push(action.payload);
      }
    },
    addEditedField: (state, action: PayloadAction<keyof ComplaintFields>) => {
      if (!state.editedFields.includes(action.payload)) {
        state.editedFields.push(action.payload);
      }
    },
    addAnimatingField: (state, action: PayloadAction<keyof ComplaintFields>) => {
      if (!state.animatingFields.includes(action.payload)) {
        state.animatingFields.push(action.payload);
      }
    },
    removeAnimatingField: (state, action: PayloadAction<keyof ComplaintFields>) => {
      state.animatingFields = state.animatingFields.filter(field => field !== action.payload);
    },
    reset: (state) => {
      state.complaint = {};
      state.riskAssessment = null;
      state.missingFields = [];
      state.aiPopulatedFields = [];
      state.editedFields = [];
      state.animatingFields = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Extract complaint
      .addCase(extractComplaint.pending, (state) => {
        state.isExtracting = true;
        state.error = null;
      })
      .addCase(extractComplaint.fulfilled, (state, action) => {
        state.isExtracting = false;
        state.complaint = action.payload.complaint;
        state.riskAssessment = action.payload.riskAssessment;
        state.missingFields = action.payload.missingFields;
        
        // Set AI populated fields
        const populated: (keyof ComplaintFields)[] = [];
        Object.keys(action.payload.complaint).forEach((key) => {
          if (action.payload.complaint[key as keyof ComplaintFields]) {
            populated.push(key as keyof ComplaintFields);
          }
        });
        state.aiPopulatedFields = populated;
        state.editedFields = [];
      })
      .addCase(extractComplaint.rejected, (state, action) => {
        state.isExtracting = false;
        state.error = action.error.message || 'Failed to extract complaint';
      })
      // Save complaint
      .addCase(saveComplaint.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveComplaint.fulfilled, (state) => {
        state.isSaving = false;
        // Reset after successful save
        state.complaint = {};
        state.riskAssessment = null;
        state.missingFields = [];
        state.aiPopulatedFields = [];
        state.editedFields = [];
        state.animatingFields = [];
      })
      .addCase(saveComplaint.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to save complaint';
      });
  },
});

export const {
  setComplaint,
  setRiskAssessment,
  setAiPopulatedFields,
  setEditedFields,
  setAnimatingFields,
  addAiPopulatedField,
  addEditedField,
  addAnimatingField,
  removeAnimatingField,
  reset,
  clearError,
} = complaintSlice.actions;

export default complaintSlice.reducer;