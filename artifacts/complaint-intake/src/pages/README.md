# Pages

This directory contains page-level components for different routes.

## Overview

Pages are the top-level components that correspond to application routes. They compose features and components to create complete views.

## Files

### `Dashboard.tsx`
**Purpose**: Main dashboard page containing the complaint intake workflow

**Code Explanation**:
```typescript
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-900">AIVOA Complaint Management</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardContent />
      </main>
    </div>
  );
}
```

**Key Points**:
- Main layout with header and content area
- Uses Slate color scheme
- Responsive padding
- Contains DashboardContent component

### `DashboardContent.tsx`
**Purpose**: Main content area with complaint intake workflow

**Key Components**:
- Left panel: IntakeAssistant (file upload, chat, risk assessment)
- Right panel: ComplaintForm (field editing, save)
- Responsive layout (stacks on mobile, side-by-side on desktop)

**Layout**:
```typescript
<div className="flex flex-col lg:flex-row gap-6">
  <div className="lg:w-[60%]">
    <IntakeAssistant ... />
  </div>
  <div className="lg:w-[40%]">
    <ComplaintForm ... />
  </div>
</div>
```

### `NotFound.tsx`
**Purpose**: 404 page for unmatched routes

**Code Explanation**:
```typescript
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-slate-600">Page not found</p>
    </div>
  );
}
```

## Page Structure

```
Dashboard (Dashboard.tsx)
├── Header
└── Main Content (DashboardContent.tsx)
    ├── Left Panel (IntakeAssistant)
    │   ├── File Upload
    │   ├── Extraction Progress
    │   ├── Risk Assessment
    │   └── Chat
    └── Right Panel (ComplaintForm)
        ├── Section 1: Complaint Source
        ├── Section 2: Product Information
        ├── Section 3: Issue Description
        └── Section 4: Classification
```

## Routing

Routes are defined in `App.tsx` using Wouter:
```typescript
<Switch>
  <Route path="/" component={Dashboard} />
  <Route component={NotFound} />
</Switch>
```

## Adding New Pages

1. Create new component in `pages/` directory
2. Add route in `App.tsx`
3. Update navigation if needed

## Best Practices

1. **Keep pages simple**: Compose features, don't implement logic
2. **Use layouts**: Common layouts in separate components
3. **Responsive design**: Use Tailwind responsive classes
4. **Loading states**: Show loading indicators during data fetching
5. **Error handling**: Display error messages when requests fail