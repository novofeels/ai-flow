import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFilterOptions } from '@/services/filterService';
import { FilterOptions } from '@/types/filterOptions';
import { getAccessToken } from '@/utils/authTokenUtils';

// Define extended interface for the filter slice state
interface FilterState {
  options: FilterOptions | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  
  // Processed filter data for easier access
  documentCategories: string[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

// Initial state
const initialState: FilterState = {
  options: null,
  status: 'idle',
  error: null,
  documentCategories: [],
  dateRange: {
    startDate: null,
    endDate: null
  }
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

// Helper function to extract document categories from filter options
const extractDocumentCategories = (options: any): string[] => {
  // Check if options has document_category and it's an array
  if (options?.document_category && Array.isArray(options.document_category)) {
    // Remove 'All' from the categories
    return options.document_category.filter((cat: string) => cat !== 'All');
  }
  return [];
};

// Helper function to extract date range from filter options
const extractDateRange = (options: any): { startDate: string | null; endDate: string | null } => {
  // Use StartDate and EndDate from the options
  return {
    startDate: options?.StartDate?.[0] || null,
    endDate: options?.EndDate?.[0] || null
  };
};

// Create the filter slice
const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Reset filters to initial state
    resetFilters: (state) => {
      state.options = null;
      state.status = 'idle';
      state.error = null;
      state.documentCategories = [];
      state.dateRange = {
        startDate: null,
        endDate: null
      };
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
      .addCase(fetchFilterOptions.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.options = action.payload;
        
        // Process the raw filter data into more usable state
        state.documentCategories = extractDocumentCategories(action.payload);
        state.dateRange = extractDateRange(action.payload);
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