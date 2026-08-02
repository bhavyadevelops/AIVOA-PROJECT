# Assistant Feature

This directory contains the AI assistant panel for complaint intake and chat.

## Overview

The assistant feature provides:
- File upload with drag-and-drop support
- Text paste input for complaints
- AI extraction progress visualization
- Chat interface for AI copilot
- Risk assessment display panel

## Files

### `components/IntakeAssistant.tsx`
**Purpose**: Main UI component for the assistant panel

**Key Components**:

#### State Management
```typescript
const [inputText, setInputText] = useState('');
const [file, setFile] = useState<File | null>(null);
const [currentStage, setCurrentStage] = useState(0);
const [isExtracting, setIsExtracting] = useState(false);
const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
const [chatInput, setChatInput] = useState('');
```

**State Variables**:
- `inputText`: Pasted complaint text
- `file`: Uploaded file (if any)
- `currentStage`: Current extraction stage (0-5)
- `isExtracting`: Loading state for extraction
- `chatMessages`: Chat history with AI
- `chatInput`: Current chat input

#### Extraction Stages
```typescript
const EXTRACTION_STAGES = [
  'Parsing Input',
  'Extracting Fields',
  'Classifying Risk',
  'Checking Completeness',
  'Generating Summary',
  'Finalizing',
];
```
Matches the LangGraph backend workflow stages.

#### File Upload Handler
```typescript
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit');
      return;
    }

    // Validate file type
    const allowedTypes = ['.txt', '.eml', '.csv', '.pdf', '.docx'];
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      alert('Unsupported file type. Please upload TXT, EML, CSV, PDF, or DOCX files.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(selectedFile);
  }
};
```

**Validation**:
- File size: Max 10MB
- File types: .txt, .eml, .csv, .pdf, .docx
- Error handling with user-friendly alerts

#### Drag and Drop Handlers
```typescript
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  const droppedFile = e.dataTransfer.files?.[0];
  if (droppedFile) {
    const event = { target: { files: [droppedFile] } } as React.ChangeEvent<HTMLInputElement>;
    handleFileUpload(event);
  }
};
```
Enables drag-and-drop file upload.

#### Progress Simulation
```typescript
const simulateProgress = () => {
  setCurrentStage(0);
  setIsExtracting(true);
  
  const interval = setInterval(() => {
    setCurrentStage((prev) => {
      if (prev >= EXTRACTION_STAGES.length - 1) {
        clearInterval(interval);
        setIsExtracting(false);
        return prev;
      }
      return prev + 1;
    });
  }, 800);
};
```
Simulates extraction progress for UI feedback.
Note: In production, this should be driven by actual backend progress events.

#### Extract Handler
```typescript
const handleExtract = () => {
  if (!inputText.trim()) {
    alert('Please enter complaint text or upload a file');
    return;
  }
  
  if (inputText.length > 100000) {
    alert('Text is too long. Please provide a shorter text or split into multiple files.');
    return;
  }
  
  onExtract(inputText);
  simulateProgress();
};
```

**Validation**:
- Text not empty
- Text length < 100,000 characters
- Calls parent onExtract callback
- Simulates progress

#### Chat Handler
```typescript
const handleChat = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!chatInput.trim()) return;
  
  setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
  setChatInput('');
  
  // Simulate AI response
  setTimeout(() => {
    const aiResponse = "Based on the complaint analysis...";
    setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
  }, 1000);
};
```

**Note**: Currently uses simulated responses. Should connect to backend `/api/complaints/copilot/chat` endpoint for production.

#### UI Structure

**Input Section** (before extraction):
- File upload button with drag-drop zone
- Textarea for pasting complaint text
- Extract button

**Progress Section** (during extraction):
- Progress bar
- Stage indicators with icons
- Current stage highlighted

**Risk Assessment Panel** (after extraction):
- Overall risk indicator with color coding
- Severity rationale
- Priority rationale
- Patient safety impact
- Product quality impact
- Recommended actions
- Confidence notes

**Chat Section** (always available):
- Chat message history
- Input form
- Suggested prompts

**Props**:
```typescript
interface IntakeAssistantProps {
  hasExtractedData: boolean;
  riskAssessment: RiskAssessment | null;
  onExtract: (text: string) => void;
}
```

### `hooks/use-intake-assistant.ts`
**Purpose**: Custom hook for assistant state management

**Note**: This file doesn't exist in current implementation. State is managed directly in component. Could be extracted for better separation of concerns.

## Styling

Uses Tailwind CSS classes:
- Card-based layout with shadows
- Responsive grid
- Color-coded risk indicators (red/amber/green)
- Smooth transitions and animations
- Badge components for labels

## Future Improvements

1. **Real-time Progress**: Connect to backend WebSocket for actual progress updates
2. **Chat Integration**: Connect to actual AI chat endpoint
3. **File Parsing**: Implement proper PDF/DOCX parsing
4. **Accessibility**: Add ARIA labels and keyboard navigation
5. **Error Recovery**: Better error handling and retry logic