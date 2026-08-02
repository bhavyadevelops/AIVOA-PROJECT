# UI Components

This directory contains reusable UI components used throughout the application.

## Overview

Components are built with:
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Framer Motion**: Animations

## Component Categories

### Form Components
- `button.tsx` - Button with variants
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form label
- `select.tsx` - Dropdown select
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio button group

### Data Display
- `badge.tsx` - Badge/tag component
- `card.tsx` - Card container
- `table.tsx` - Data table
- `progress.tsx` - Progress bar
- `separator.tsx` - Visual separator

### Feedback
- `toast.tsx` - Toast notifications
- `alert.tsx` - Alert banners
- `dialog.tsx` - Modal dialogs
- `alert-dialog.tsx` - Confirmation dialogs

### Navigation
- `breadcrumb.tsx` - Breadcrumb navigation
- `tabs.tsx` - Tabbed interface
- `navigation-menu.tsx` - Navigation menu

### Layout
- `scroll-area.tsx` - Custom scrollable area
- `separator.tsx` - Visual dividers
- `collapsible.tsx` - Collapsible content

### Interactive
- `popover.tsx` - Popover/dropdown
- `tooltip.tsx` - Tooltip on hover
- `dropdown-menu.tsx` - Dropdown menu
- `calendar.tsx` - Date picker calendar

### Specialized
- `ErrorBoundary.tsx` - React error boundary
- `sonner.tsx` - Toast notification provider

## Component Pattern

Each component follows this pattern:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

const Component = React.forwardRef<
  React.ElementRef<typeof Primitive>,
  ComponentProps
>(({ className, ...props }, ref) => (
  <Primitive
    ref={ref}
    className={cn('base-classes', className)}
    {...props}
  />
));
Component.displayName = Primitive.displayName;

export { Component };
```

**Key Points**:
- Uses `forwardRef` for ref forwarding
- Uses `cn()` utility for merging Tailwind classes
- Exports component with proper displayName
- TypeScript types from Radix UI primitives

## Usage Example

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## Custom Components

### ErrorBoundary
**Purpose**: Catches React errors and displays fallback UI

**Features**:
- Catches errors in component tree
- Displays error message
- Provides reload button
- Logs errors to console

**Usage**:
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Why Radix UI?

1. **Accessibility**: Built-in ARIA attributes and keyboard navigation
2. **Unstyled**: Full control over styling with Tailwind
3. **Composable**: Easy to compose and customize
4. **Headless**: Separates logic from presentation
5. **Type-safe**: Full TypeScript support