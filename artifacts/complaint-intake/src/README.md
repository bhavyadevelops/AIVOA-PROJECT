# Source Directory

This directory contains the main source code for the React frontend application.

## Overview

The `src/` directory is organized using a feature-based architecture with clear separation of concerns. It includes components, features, pages, state management, utilities, and type definitions.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ComplaintForm.tsx       # Main complaint form component
│   ├── ErrorBoundary.tsx      # Error handling component
│   ├── IntakeAssistant.tsx    # Main container component
│   ├── ui/                    # Radix UI components
│   └── README.md              # Component documentation
├── features/            # Feature-specific modules
│   ├── assistant/             # AI assistant feature
│   │   ├── components/
│   │   │   └── IntakeAssistant.tsx
│   │   └── README.md
│   ├── complaint/             # Complaint management feature
│   │   ├── components/
│   │   │   └── ComplaintForm.tsx
│   │   ├── hooks/
│   │   │   └── use-complaint-form.ts
│   │   ├── services/
│   │   │   └── complaint-service.ts
│   │   └── README.md
│   └── risk/                  # Risk assessment feature
│       ├── components/
│       │   └── RiskSummary.tsx
│       └── README.md
├── pages/               # Page-level components
│   ├── Dashboard.tsx           # Main dashboard page
│   ├── not-found.tsx           # 404 page
│   └── README.md               # Page documentation
├── store/               # Redux state management
│   ├── index.ts                # Store configuration
│   ├── complaintSlice.ts       # Complaint state reducer
│   └── README.md               # Store documentation
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx          # Mobile detection hook
│   ├── use-toast.ts            # Toast notification hook
│   └── README.md               # Hooks documentation
├── lib/                 # Utility libraries
│   ├── utils.ts                # General utility functions
│   └── README.md               # Library documentation
├── types/               # TypeScript type definitions
│   ├── index.ts                # Shared type definitions
│   └── README.md               # Type documentation
├── App.tsx              # Root application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Core Modules

### components/ - UI Components

**Purpose**: Reusable UI components used throughout the application.

**Key Components**:
- **ComplaintForm**: Interactive form for complaint data entry
- **ErrorBoundary**: React error boundary for error handling
- **IntakeAssistant**: Main container with two-panel layout
- **ui/**: Radix UI component library (60+ components)

**Component Pattern**:
```typescript
interface ComponentProps {
  // Props interface
}

export function Component({ prop }: ComponentProps) {
  // Component logic
  return <div>{/* JSX */}</div>;
}
```

### features/ - Feature Modules

**Purpose**: Self-contained feature modules with their own components, hooks, and services.

**Architecture**:
Each feature follows the structure:
- `components/` - Feature-specific UI components
- `hooks/` - Custom hooks for feature logic
- `services/` - API communication and business logic
- `types/` - Feature-specific type definitions

**Features**:
1. **assistant**: AI chat assistant for guidance
2. **complaint**: Complaint form and management
3. **risk**: Risk assessment display

### pages/ - Page Components

**Purpose**: Page-level components that represent routes in the application.

**Pages**:
- **Dashboard**: Main application page with complaint intake
- **not-found**: 404 error page

**Page Pattern**:
```typescript
export function Dashboard() {
  return (
    <div className="page-container">
      {/* Page content */}
    </div>
  );
}
```

### store/ - State Management

**Purpose**: Redux store configuration and slice reducers.

**Structure**:
- **index.ts**: Store setup with middleware
- **complaintSlice.ts**: Complaint state management

**State Management Pattern**:
```typescript
interface ComplaintState {
  complaint: Partial<ComplaintFields>;
  riskAssessment: RiskAssessment | null;
  missingFields: string[];
  isExtracting: boolean;
  isSaving: boolean;
  error: string | null;
}

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    // Synchronous reducers
  },
  extraReducers: (builder) => {
    // Async thunks
  },
});
```

### hooks/ - Custom Hooks

**Purpose**: Reusable React hooks for common functionality.

**Available Hooks**:
- **use-mobile**: Detect mobile device
- **use-toast**: Toast notification management

**Hook Pattern**:
```typescript
export function useCustomHook() {
  const [state, setState] = useState(initial);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return { state, actions };
}
```

### lib/ - Utility Libraries

**Purpose**: Shared utility functions and helpers.

**Utilities**:
- **utils.ts**: Common utility functions (cn for class names, etc.)

### types/ - Type Definitions

**Purpose**: Shared TypeScript type definitions used across the application.

**Types**:
- Complaint data structures
- Risk assessment types
- API request/response types
- Component prop types

## Entry Points

### main.tsx

**Purpose**: Application entry point that initializes React and renders the app.

**Responsibilities**:
- Create React root
- Wrap in Redux Provider
- Wrap in ErrorBoundary
- Render App component

```typescript
createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
);
```

### App.tsx

**Purpose**: Root component with routing configuration.

**Responsibilities**:
- Set up Wouter routing
- Configure page routes
- Add toast notifications
- Handle 404 routing

```typescript
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WouterRouter>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </QueryClientProvider>
    </Provider>
  );
}
```

## Key Patterns

### Component Organization

1. **Feature-based**: Components grouped by feature
2. **Reusable**: Common components in top-level components/
3. **UI Library**: Radix UI components in components/ui/

### State Management

1. **Redux Toolkit**: Centralized state management
2. **Async Thunks**: API calls with async/await
3. **Selectors**: Efficient state selection
4. **Local State**: Component-specific state with useState

### Styling

1. **Tailwind CSS**: Utility-first styling
2. **Radix UI**: Accessible component styles
3. **Responsive**: Mobile-first approach
4. **Theme**: Consistent color scheme

### Type Safety

1. **TypeScript**: Strict type checking
2. **Interfaces**: Clear prop contracts
3. **Generics**: Reusable type definitions
4. **Runtime Validation**: API response validation

## Data Flow

### User Input Flow
1. User enters data in form
2. onChange handler updates Redux state
3. Form validation checks required fields
4. Visual feedback shows validation status

### AI Extraction Flow
1. User uploads file or pastes text
2. Extract button clicked
3. Redux thunk calls API endpoint
4. Backend processes with LangGraph
5. Response updates Redux state
6. Form populates with extracted data
7. Animation shows AI-populated fields

### Save Flow
1. User clicks save button
2. Form validation runs
3. Redux thunk sends data to API
4. Backend saves to database
5. Success response updates state
6. Toast notification shows success
7. Form resets for next entry

## Architecture Decisions

### Feature-Based Architecture
- **Pros**: Clear feature boundaries, easier maintenance
- **Cons**: More initial setup
- **Decision**: Chosen for scalability and team collaboration

### Redux for State Management
- **Pros**: Predictable state, excellent DevTools
- **Cons**: More boilerplate than Context API
- **Decision**: Required by assignment, provides robust state management

### Radix UI Components
- **Pros**: Accessible, customizable, headless
- **Cons**: Learning curve for styling
- **Decision**: Best-in-class accessibility support

### Wouter for Routing
- **Pros**: Lightweight (2KB vs 15KB for React Router)
- **Cons**: Smaller ecosystem
- **Decision**: Simpler routing needs, better performance

## Development Guidelines

### Adding New Components

1. Create component file in appropriate directory
2. Define props interface
3. Implement component logic
4. Add Tailwind CSS classes
5. Export as default
6. Add documentation comments

### Adding New Features

1. Create feature directory in `features/`
2. Add components, hooks, services as needed
3. Create Redux slice if state needed
4. Add types in `types/`
5. Integrate in main app

### Styling Guidelines

1. Use Tailwind utility classes
2. Follow existing color scheme
3. Maintain consistent spacing (4px grid)
4. Ensure responsive design
5. Test accessibility

### TypeScript Guidelines

1. Define interfaces for all props
2. Use strict type checking
3. Avoid `any` types
4. Use proper generics
5. Document complex types

## Performance Considerations

### Code Splitting
- Lazy loading for routes
- Dynamic imports for heavy components
- Tree shaking for unused code

### State Optimization
- Redux selectors for efficient updates
- React.memo for component memoization
- Avoid unnecessary re-renders

### Build Optimization
- Vite's fast HMR
- Production minification
- Asset optimization
- Bundle size monitoring

## Testing Strategy

### Current Status
- Manual testing with provided fixtures
- No automated tests currently

### Future Testing
```bash
# TODO: Add testing framework
pnpm test
```

**Planned Tests**:
- Component unit tests
- Integration tests for features
- E2E tests for critical flows
- Redux slice tests

## Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Security Considerations

- Input sanitization on all forms
- XSS protection via React
- CSRF tokens for API calls
- Secure cookie handling
- Content Security Policy headers

## Future Enhancements

- Add comprehensive error boundaries
- Implement offline support with service workers
- Add internationalization (i18n)
- Implement advanced search/filtering
- Add data visualization dashboard
- Implement bulk complaint upload
- Add user authentication
- Create admin panel
- Add export functionality (PDF, Excel)
- Implement real-time notifications
- Add comprehensive test coverage
- Performance monitoring integration
