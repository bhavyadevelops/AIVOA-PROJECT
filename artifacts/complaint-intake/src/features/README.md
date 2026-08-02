# Features

This directory contains feature-specific modules for the application.

## Overview

Features are organized by domain:
- `assistant/` - AI assistant panel for complaint input and chat
- `complaint/` - Complaint form with field editing and validation

Each feature is self-contained with its own components, hooks, and logic.

## Subdirectories

### `assistant/`
Contains the AI assistant panel components and logic.

**Key Files**:
- `components/IntakeAssistant.tsx` - Main assistant UI
- `hooks/use-intake-assistant.ts` - Assistant state management

**Purpose**:
- File upload with drag-and-drop
- Text paste input
- Extraction progress visualization
- Chat interface for AI copilot
- Risk assessment display

### `complaint/`
Contains the complaint form components and logic.

**Key Files**:
- `components/ComplaintForm.tsx` - Main form UI
- `hooks/use-complaint-form.ts` - Form state management

**Purpose**:
- Display all complaint fields
- Handle field editing
- Show AI badges
- Manage field animations
- Save complaint to database

## Feature Architecture

Each feature follows this pattern:
```
feature/
├── components/       # React components
│   └── FeatureName.tsx
├── hooks/           # Custom React hooks
│   └── use-feature.ts
└── index.ts         # Feature exports
```

## Benefits of Feature-Based Structure

1. **Separation of Concerns**: Each feature is independent
2. **Easy to Locate**: Related code is grouped together
3. **Scalable**: Easy to add new features
4. **Reusable**: Features can be shared across projects
5. **Testable**: Each feature can be tested independently