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

### Development
No environment variables required for frontend.
Backend API URL is hardcoded to `http://localhost:8000` for development.

### Production
Create `.env` file:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Architecture Overview

### Component Architecture

The frontend follows a feature-based architecture:

1. **IntakeAssistant**: Main container component
   - Manages two-panel layout
   - Coordinates between form and assistant
   - Handles file upload and extraction

2. **ComplaintForm**: Interactive form component
   - Controlled inputs with Redux state
   - Real-time validation
   - AI badge indicators
   - Field-by-field editing

3. **AssistantPanel**: AI chat interface
   - Chat message display
   - AI response handling
   - Context-aware suggestions

### State Management

Redux store structure:
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

### API Integration

Async thunks handle API communication:
- `extractComplaint`: Calls extraction endpoint
- `saveComplaint`: Saves to database
- `sendChatMessage`: AI assistant queries

## File Upload Support

### Supported Formats
- TXT files
- EML (email) files
- CSV files
- PDF files
- DOCX files

### Upload Process
1. Drag & drop or file selection
2. File validation (size < 10MB)
3. Text extraction from file
4. Automatic AI extraction
5. Form population

### Fixtures for Testing
Located in `public/fixtures/`:
- `api-complaint.txt` - API-related complaint sample
- `packaging-complaint.eml` - Email complaint sample
- `vague-customer-complaint.txt` - Minimal information sample

## UI/UX Features

### Responsive Design
- Desktop: Two-panel layout
- Tablet: Stacked panels
- Mobile: Single panel with tabs

### Visual Feedback
- Loading states during extraction
- Success toasts on save
- Error messages for validation
- Animation for field population

### Accessibility
- Radix UI components (ARIA compliant)
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

## Development Workflow

### Adding New Components

1. Create component in `src/components/`
2. Follow existing naming conventions
3. Use TypeScript interfaces for props
4. Implement with Tailwind CSS
5. Add Radix UI for complex interactions

### Adding New Features

1. Create feature directory in `src/features/`
2. Implement Redux slice in `src/store/`
3. Add types in `src/types/`
4. Create custom hooks in `src/hooks/`
5. Update routing in `src/App.tsx`

### Styling Guidelines

- Use Tailwind utility classes
- Follow existing color scheme
- Maintain consistent spacing
- Use semantic HTML
- Ensure responsive design

## Performance Optimizations

### Code Splitting
- Lazy loading for routes
- Dynamic imports for heavy components
- Tree shaking for unused code

### State Optimization
- Redux selectors for efficient updates
- Memoization with React.memo
- Avoid unnecessary re-renders

### Build Optimizations
- Vite's fast HMR
- Production minification
- Asset optimization
- Bundle size monitoring

## Testing

### Manual Testing
Use provided fixtures in `public/fixtures/`:
```bash
# Test different complaint types
# - API complaints
# - Email complaints
# - Vague complaints
```

### Future Testing
```bash
# TODO: Add test framework
pnpm test
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running on port 8000
   - Check CORS configuration
   - Review browser console for errors

2. **State Not Updating**
   - Check Redux DevTools
   - Verify action dispatches
   - Review reducer logic

3. **Styles Not Loading**
   - Verify Tailwind CSS configuration
   - Check build process
   - Clear browser cache

4. **TypeScript Errors**
   - Run `pnpm run typecheck`
   - Verify type definitions
   - Check tsconfig.json

## Deployment

### Build Process
```bash
pnpm run build
```

Creates optimized production build in `dist/`:
- Minified JavaScript
- Optimized CSS
- Asset hashing
- Source maps

### Deployment Options

**Static Hosting** (Vercel, Netlify, GitHub Pages):
```bash
# Deploy dist/ directory
# Configure single-page application routing
```

**Docker**:
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build
CMD ["pnpm", "run", "serve"]
```

**Traditional Server** (Nginx, Apache):
- Serve static files from `dist/`
- Configure SPA routing
- Enable gzip compression

## Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Security Considerations

- Input sanitization on form fields
- XSS protection via React
- CSRF tokens for API calls
- Secure cookie handling
- Content Security Policy headers

## Known Limitations

- Single-page application (no multi-page routing)
- No offline support
- Limited mobile optimization
- No internationalization (i18n)
- No theme switching

## Future Enhancements

- Add comprehensive error boundaries
- Implement offline support with service workers
- Add internationalization
- Implement advanced search/filtering
- Add data visualization dashboard
- Implement bulk complaint upload
- Add user authentication
- Create admin panel
- Add export functionality (PDF, Excel)
- Implement real-time notifications