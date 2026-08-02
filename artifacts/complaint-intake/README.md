# Frontend - React Application

This directory contains the React frontend for the AIVOA Complaint Management System.

## Overview

The frontend is built with:
- **React 19.1.0**: UI library
- **TypeScript 5.9**: Type safety
- **Redux Toolkit**: State management (required by assignment)
- **Tailwind CSS 4.1.14**: Styling
- **Vite 7.3.2**: Build tool
- **Wouter 3.3.5**: Routing
- **Radix UI**: Accessible components

## Key Files

### `package.json`
**Purpose**: Project dependencies and scripts

**Key Dependencies**:
- `react`: UI library
- `@reduxjs/toolkit`: State management
- `react-redux`: React bindings for Redux
- `tailwindcss`: CSS framework
- `vite`: Build tool
- `wouter`: Routing
- `@radix-ui/*`: UI components
- `lucide-react`: Icons

**Scripts**:
```json
{
  "dev": "vite --config vite.config.ts --host 0.0.0.0",
  "build": "vite build --config vite.config.ts",
  "serve": "vite preview --config vite.config.ts --host 0.0.0.0",
  "typecheck": "tsc -p tsconfig.json --noEmit"
}
```

### `vite.config.ts`
**Purpose**: Vite build configuration

**Key Settings**:
- Configures path aliases (@ → src)
- Sets up Tailwind CSS plugin
- Configures build output

### `tsconfig.json`
**Purpose**: TypeScript configuration

**Key Settings**:
- Path aliases for imports
- Strict type checking
- React JSX support

### `index.html`
**Purpose**: HTML entry point

**Key Elements**:
- Mount point: `<div id="root"></div>`
- Font import: Google Inter
- Meta tags for SEO and viewport

### `src/main.tsx`
**Purpose**: Application entry point

**Code Explanation**:
```typescript
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
);
```

**Key Points**:
- Wraps app in Redux Provider
- Wraps in ErrorBoundary for error handling
- Mounts to #root element

### `src/App.tsx`
**Purpose**: Root component with routing

**Code Explanation**:
```typescript
function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </Provider>
  );
}
```

**Key Points**:
- Wouter Router for navigation
- Dashboard page at root path
- Toast notifications via Sonner
- QueryClientProvider for data fetching (kept for future use)

## Directory Structure

```
src/
├── components/      # Reusable UI components
├── features/        # Feature-specific modules
│   ├── assistant/   # AI assistant panel
│   └── complaint/   # Complaint form
├── pages/           # Page components
├── store/           # Redux store
├── types/           # TypeScript types
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── main.tsx         # Entry point
```

## Running the Application

```bash
cd artifacts/complaint-intake
pnpm install
pnpm run dev
```

Application will be available at http://localhost:5173

## Building for Production

```bash
pnpm run build
```

Output in `dist/` directory.

## Key Features

### State Management
- Redux Toolkit for global state
- Centralized complaint data
- Async thunks for API calls
- Predictable state updates

### UI Components
- Radix UI for accessibility
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons

### Routing
- Wouter for lightweight routing
- Simple route configuration
- 404 handling

### Error Handling
- ErrorBoundary for React errors
- Toast notifications for user feedback
- API error handling in Redux thunks

## Environment

No environment variables required for frontend.
Backend API URL is hardcoded to `http://localhost:8000` for development.