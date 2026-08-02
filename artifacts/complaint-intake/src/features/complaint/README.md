# Complaint Feature

This directory contains the complaint form with field editing and validation.

## Overview

The complaint feature provides:
- Display of all complaint fields in organized sections
- Field editing with AI badge tracking
- Visual feedback during AI population
- Missing field indicators
- Save and reset functionality

## Files

### `components/ComplaintForm.tsx`
**Purpose**: Main UI component for the complaint form

**Key Components**:

#### Props
```typescript
interface ComplaintFormProps {
  complaint: Partial<ComplaintFields>;
  riskAssessment: RiskAssessment | null;
  missingFields: string[];
  aiPopulatedFields: Set<keyof ComplaintFields>;
  editedFields: Set<keyof ComplaintFields>;
  animatingFields: Set<keyof ComplaintFields>;
  onFieldChange: (field: keyof ComplaintFields, value: string) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}
```

#### FormField Component
```typescript
const FormField = ({ label, value, field, isAiGenerated, isVerified, isAnimating, onChange, multiline = false, isDateField = false }: any) => {
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
  const [open, setOpen] = React.useState(false);

  const getBorderClass = () => {
    if (isVerified) return 'border-emerald-300 focus-visible:ring-emerald-500';
    if (isAiGenerated) return 'border-cyan-300 focus-visible:ring-cyan-500';
    return 'border-slate-300 focus-visible:ring-primary';
  };

  const getBgClass = () => {
    if (isAnimating) return 'bg-cyan-100 animate-pulse';
    if (isVerified) return 'bg-emerald-50/30';
    if (isAiGenerated) return 'bg-cyan-50/30';
    return 'bg-white';
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange(field, selectedDate ? selectedDate.toISOString().split('T')[0] : '');
    setOpen(false);
  };

  return (
    <div className={`flex flex-col space-y-1.5 ${isDateField ? 'mb-3' : 'mb-2'}`}>
      <div className="flex justify-between items-center min-h-5">
        <label className="text-[13px] font-semibold text-slate-700 tracking-tight">{label}</label>
        {isVerified ? (
          <Badge variant="verified" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 pl-1.5 text-[10px] py-0">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </Badge>
        ) : isAiGenerated ? (
          <Badge variant="ai" className="bg-cyan-50 text-cyan-700 border-cyan-200 gap-1 pl-1.5 text-[10px] py-0">
            <Activity className="w-3 h-3" /> AI
          </Badge>
        ) : null}
      </div>
      {multiline ? (
        <Textarea 
          className={`${getBgClass()} ${getBorderClass()} focus-visible:ring-2 shadow-sm min-h-25 transition-all duration-500`} 
          value={value || ''} 
          onChange={(e) => onChange(field, e.target.value)} 
        />
      ) : isDateField ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`${getBgClass()} ${getBorderClass()} focus-visible:ring-2 shadow-sm h-9 transition-all duration-500 w-full justify-start text-left font-normal`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date.toLocaleDateString() : <span className="text-slate-400">Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Input 
          className={`${getBgClass()} ${getBorderClass()} focus-visible:ring-2 shadow-sm h-9 transition-all duration-500`} 
          value={value || ''} 
          onChange={(e) => onChange(field, e.target.value)} 
        />
      )}
    </div>
  );
};
```

**FormField Features**:
- **Badges**: Shows "AI" or "Verified" badge based on field origin
- **Animations**: Cyan pulse animation during AI population
- **Date Picker**: Calendar popover for date fields
- **Textarea**: Multi-line input for description
- **Input**: Single-line input for other fields
- **Color Coding**:
  - AI generated: Cyan border/background
  - Verified: Emerald border/background
  - Default: Slate border/white background

#### Form Sections

**Section 1: Complaint Source**
```typescript
<FormField
  label="Complaint Source"
  value={complaint.complaintSource}
  field="complaintSource"
  isAiGenerated={aiPopulatedFields.has('complaintSource')}
  isVerified={editedFields.has('complaintSource')}
  isAnimating={animatingFields.has('complaintSource')}
  onChange={onFieldChange}
/>
<FormField
  label="Customer Name"
  value={complaint.customerName}
  field="customerName"
  isAiGenerated={aiPopulatedFields.has('customerName')}
  isVerified={editedFields.has('customerName')}
  isAnimating={animatingFields.has('customerName')}
  onChange={onFieldChange}
/>
```

**Section 2: Product Information**
```typescript
<FormField label="Product Name" field="productName" ... />
<FormField label="Strength" field="strength" ... />
<FormField label="Batch Number" field="batch" ... />
<FormField label="Manufacturing Date" field="manufacturingDate" isDateField ... />
<FormField label="Expiry Date" field="expiryDate" isDateField ... />
<FormField label="Quantity" field="quantity" ... />
```

**Section 3: Issue Description**
```typescript
<FormField label="Complaint Type" field="complaintType" ... />
<FormField label="Complaint Date" field="complaintDate" isDateField ... />
<FormField label="Description" field="description" multiline ... />
```

**Section 4: Classification**
```typescript
<FormField label="Severity" field="severity" ... />
<FormField label="Priority" field="priority" ... />
```

#### Progress Indicator
```typescript
{missingFields.length > 0 && (
  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <AlertTriangle className="w-4 h-4 text-amber-500" />
      <span className="text-sm font-medium text-amber-900">Missing Information</span>
    </div>
    <ul className="space-y-1">
      {missingFields.map((field) => (
        <li key={field} className="text-sm text-amber-700">• {field}</li>
      ))}
    </ul>
  </div>
)}
```
Shows missing required fields with warning styling.

#### Action Buttons
```typescript
<div className="flex gap-2">
  <Button onClick={onSave} disabled={isSaving} className="gap-2">
    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
    {isSaving ? 'Saving...' : 'Save Complaint'}
  </Button>
  <Button variant="outline" onClick={onReset} className="gap-2">
    <RotateCcw className="w-4 h-4" />
    Reset
  </Button>
</div>
```
- Save button with loading state
- Reset button to clear form

### `hooks/use-complaint-form.ts`
**Purpose**: Custom hook for complaint form state management

**Key Functions**:

#### useComplaintForm Hook
```typescript
export function useComplaintForm() {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    complaint,
    riskAssessment,
    missingFields,
    aiPopulatedFields,
    editedFields,
    animatingFields,
    isExtracting,
    isSaving,
    error,
  } = useSelector((state: RootState) => state.complaint);

  const handleFieldChange = (field: keyof ComplaintFields, value: string) => {
    dispatch(setComplaint({ [field]: value }));
    if (aiPopulatedFields.has(field)) {
      dispatch(addEditedField(field));
    }
  };

  const animateFieldPopulation = useCallback((fields: Array<keyof ComplaintFields>) => {
    fields.forEach((field, index) => {
      setTimeout(() => {
        dispatch(addAnimatingField(field));
        
        setTimeout(() => {
          dispatch(removeAnimatingField(field));
        }, 500);
      }, index * 100);
    });
  }, [dispatch]);

  const handleExtract = (text: string) => {
    dispatch(extractComplaint({ text }))
      .unwrap()
      .then((result) => {
        animateFieldPopulation(Object.keys(result.complaint) as Array<keyof ComplaintFields>);
        toast({ title: 'Extraction Complete', description: 'Complaint fields have been populated by AI.' });
      })
      .catch((err) => {
        // Error handling with specific messages
      });
  };

  const handleSave = () => {
    if (!complaint.customerName || !complaint.productName) {
      toast({ title: 'Validation Error', description: 'Customer Name and Product Name are required.', variant: 'destructive' });
      return;
    }

    dispatch(saveComplaint({ complaint: complaint as ComplaintFields, riskAssessment: riskAssessment! }))
      .unwrap()
      .then(() => {
        toast({ title: 'Success', description: 'Complaint saved successfully.' });
        dispatch(reset());
      })
      .catch((err) => {
        // Error handling
      });
  };

  const handleReset = () => {
    dispatch(reset());
  };

  return {
    complaint,
    riskAssessment,
    missingFields,
    aiPopulatedFields,
    editedFields,
    animatingFields,
    isExtracting,
    isSaving,
    handleFieldChange,
    handleExtract,
    handleSave,
    handleReset,
  };
}
```

**Key Features**:
- **Field Change**: Updates Redux state, marks field as edited if AI-generated
- **Animation**: Sequential field population with 100ms delay per field
- **Extract**: Dispatches Redux thunk, handles success/error
- **Save**: Validates required fields, dispatches save thunk
- **Reset**: Clears all state

## Badge Logic

**AI Badge**:
- Shown when field is in `aiPopulatedFields`
- Cyan color scheme
- Indicates field was populated by AI

**Verified Badge**:
- Shown when field is in `editedFields`
- Emerald color scheme
- Indicates user has reviewed/edited the field
- Replaces AI badge when field is edited

## Animation Logic

1. Extraction completes
2. List of populated fields received
3. For each field (with 100ms delay):
   - Add to `animatingFields` (triggers cyan pulse animation)
   - Wait 500ms
   - Remove from `animatingFields` (stops animation)
4. Result: Sequential visual feedback as fields populate

## Validation

**Required Fields**:
- Customer Name
- Product Name
- Batch Number
- Expiry Date
- Quantity

Validation occurs:
- On save (blocks save if missing)
- Via completeness checker (shows missing fields in UI)

## Styling

Uses Tailwind CSS:
- Sectioned layout with cards
- Responsive grid (2 columns on lg screens)
- Color-coded badges and borders
- Smooth transitions (500ms duration)
- Shadow and spacing for hierarchy