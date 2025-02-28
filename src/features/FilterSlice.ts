import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFilterOptions } from '@/services/filterService';
import { FilterOptions } from '@/types/filterOptions';
import { getAccessToken } from '@/utils/authTokenUtils';

// Define interface for the filter slice state
interface FilterState {
  options: FilterOptions | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: FilterState = {
  options: null,
  status: 'idle',
  error: null
};

// Create async thunk for fetching filter options
export const fetchFilterOptions = createAsyncThunk(
  'filters/fetchFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const filterOptions = await getFilterOptions(token);
      return filterOptions;
    } catch (error) {
      // Handle any errors and return a rejection
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Create the filter slice
const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // You can add standard reducers here if needed
    resetFilters: (state) => {
      state.options = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(fetchFilterOptions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // Handle successful state
      .addCase(fetchFilterOptions.fulfilled, (state, action: PayloadAction<FilterOptions>) => {
        state.status = 'succeeded';
        state.options = action.payload;
        state.error = null;
      })
      // Handle error state
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { resetFilters } = filterSlice.actions;
export default filterSlice.reducer;