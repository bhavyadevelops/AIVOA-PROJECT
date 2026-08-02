import { configureStore } from '@reduxjs/toolkit';
import complaintReducer from './complaintSlice';

export const store = configureStore({
  reducer: {
    complaint: complaintReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['complaint.aiPopulatedFields', 'complaint.editedFields', 'complaint.animatingFields'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;