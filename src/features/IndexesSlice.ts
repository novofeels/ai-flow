// src/features/IndexesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIndexes } from '@/services/indexService';
import { Indexes } from '@/types/indexes';
import { getAccessToken } from '@/utils/authTokenUtils';

// Define interface for the indexes slice state
interface IndexesState {
  data: Indexes | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: IndexesState = {
  data: null,
  status: 'idle',
  error: null
};

// Create async thunk for fetching indexes
export const fetchIndexes = createAsyncThunk(
  'indexes/fetchIndexes',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const indexes = await getIndexes(token);
      return indexes;
    } catch (error) {
      // Handle any errors and return a rejection
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Create the indexes slice
const indexesSlice = createSlice({
  name: 'indexes',
  initialState,
  reducers: {
    // Standard reducers if needed
    resetIndexes: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(fetchIndexes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // Handle successful state
      .addCase(fetchIndexes.fulfilled, (state, action: PayloadAction<Indexes>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      // Handle error state
      .addCase(fetchIndexes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { resetIndexes } = indexesSlice.actions;
export default indexesSlice.reducer;