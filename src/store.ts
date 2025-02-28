import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './features/FilterSlice';
import indexesReducer from './features/IndexesSlice';
import conversationsReducer from './features/ConversationsSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    filters: filterReducer,
    indexes: indexesReducer,
    conversations: conversationsReducer,
    // Add other reducers here as your app grows
  }
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;