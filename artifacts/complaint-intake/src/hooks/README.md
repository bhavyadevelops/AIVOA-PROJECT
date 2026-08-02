# Custom Hooks

This directory contains custom React hooks for reusable logic.

## Files

### `use-toast.ts`
**Purpose**: Toast notification hook for user feedback

**Code Explanation**:
```typescript
import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newToast: Toast = { id, title, description, variant };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toast, toasts, dismiss };
}
```

**Usage**:
```typescript
const { toast } = useToast();

toast({
  title: 'Success',
  description: 'Complaint saved successfully',
  variant: 'default'
});

toast({
  title: 'Error',
  description: 'Failed to save complaint',
  variant: 'destructive'
});
```

**Features**:
- Auto-dismiss after 3 seconds
- Supports success (default) and error (destructive) variants
- Unique ID for each toast
- Dismiss function for manual dismissal

## Hook Patterns

### Toast Hook Pattern
```typescript
export function useFeature() {
  const [state, setState] = useState(initialState);
  
  const action = useCallback(() => {
    // Perform action
    setState(newState);
  }, [dependencies]);
  
  return { state, action };
}
```

### Redux Hook Pattern
```typescript
export function useFeature() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.feature);
  
  const action = useCallback((data) => {
    dispatch(featureAction(data));
  }, [dispatch]);
  
  return { state, action };
}
```

## When to Create Custom Hooks

1. **Reusable Logic**: When logic is used in multiple components
2. **Complex State**: When state management is complex
3. **Side Effects**: When you need to manage side effects
4. **Abstraction**: When you want to hide implementation details
5. **Testing**: When you want to test logic independently

## Hook Best Practices

1. **Prefix with `use-`**: Follow React convention
2. **Return objects**: For multiple return values
3. **Use useCallback**: For memoized functions
4. **Clean up effects**: Return cleanup functions in useEffect
5. **TypeScript**: Add proper type annotations

## Existing Hooks

- `use-toast`: Toast notifications
- `use-complaint-form`: Complaint form state (in features/complaint/hooks)
- `use-intake-assistant`: Assistant state (potential, in features/assistant/hooks)

## Future Hooks

Potential additions:
- `useLocalStorage`: Persist state to localStorage
- `useDebounce`: Debounce function calls
- `useAnimationFrame`: Request animation frame hook
- `useMediaQuery`: Responsive design queries
- `useClipboard`: Clipboard operations