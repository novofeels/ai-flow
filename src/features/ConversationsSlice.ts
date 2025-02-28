// src/features/ConversationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, ConversationsList } from '@/types/conversations';
import { getUnarchivedConversations, getArchivedConversations } from '@/services/conversationService';
import { getAccessToken } from '@/utils/authTokenUtils';

// Define interface for the conversations slice state
interface ConversationsState {
  unarchived: {
    data: ConversationsList | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  archived: {
    data: ConversationsList | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  selectedConversation: Conversation | null;
}

// Initial state
const initialState: ConversationsState = {
  unarchived: {
    data: null,
    status: 'idle',
    error: null
  },
  archived: {
    data: null,
    status: 'idle',
    error: null
  },
  selectedConversation: null
};

// Create async thunk for fetching unarchived conversations
export const fetchUnarchivedConversations = createAsyncThunk(
  'conversations/fetchUnarchived',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const conversations = await getUnarchivedConversations(token);
      return conversations;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Create async thunk for fetching archived conversations
export const fetchArchivedConversations = createAsyncThunk(
  'conversations/fetchArchived',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const conversations = await getArchivedConversations(token);
      return conversations;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Create the conversations slice
const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    selectConversation: (state, action: PayloadAction<Conversation>) => {
      state.selectedConversation = action.payload;
    },
    clearSelectedConversation: (state) => {
      state.selectedConversation = null;
    },
    resetConversations: (state) => {
      state.unarchived = {
        data: null,
        status: 'idle',
        error: null
      };
      state.archived = {
        data: null,
        status: 'idle',
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle unarchived conversations
      .addCase(fetchUnarchivedConversations.pending, (state) => {
        state.unarchived.status = 'loading';
        state.unarchived.error = null;
      })
      .addCase(fetchUnarchivedConversations.fulfilled, (state, action: PayloadAction<ConversationsList>) => {
        state.unarchived.status = 'succeeded';
        state.unarchived.data = action.payload;
      })
      .addCase(fetchUnarchivedConversations.rejected, (state, action) => {
        state.unarchived.status = 'failed';
        state.unarchived.error = action.payload as string;
      })
      
      // Handle archived conversations
      .addCase(fetchArchivedConversations.pending, (state) => {
        state.archived.status = 'loading';
        state.archived.error = null;
      })
      .addCase(fetchArchivedConversations.fulfilled, (state, action: PayloadAction<ConversationsList>) => {
        state.archived.status = 'succeeded';
        state.archived.data = action.payload;
      })
      .addCase(fetchArchivedConversations.rejected, (state, action) => {
        state.archived.status = 'failed';
        state.archived.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { selectConversation, clearSelectedConversation, resetConversations } = conversationsSlice.actions;
export default conversationsSlice.reducer;