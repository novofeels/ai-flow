// src/features/ConversationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, ConversationsList } from '@/types/conversations';
import { 
  getUnarchivedConversations, 
  getArchivedConversations, 
  updateConversationTitle as updateConversationTitleAPI,
  toggleConversationArchiveStatus
} from '@/services/conversationService';
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

// Create async thunk for updating conversation title
export const updateConversationTitle = createAsyncThunk(
  'conversations/updateTitle',
  async ({ conversation, newTitle }: { conversation: Conversation, newTitle: string }, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      // Create a new conversation object with the updated title
      const updatedConversation = {
        ...conversation,
        title: newTitle
      };
      
      const result = await updateConversationTitleAPI(token, updatedConversation);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Create async thunk for toggling conversation archive status
export const toggleArchiveStatus = createAsyncThunk(
  'conversations/toggleArchiveStatus',
  async ({ conversationId, isArchived, conversation }: { 
    conversationId: string, 
    isArchived: boolean,
    conversation: Conversation 
  }, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      
      // Call the API - it returns nothing on success
      await toggleConversationArchiveStatus(token, conversationId, isArchived);
      
      // Create the updated conversation object ourselves
      const updatedConversation: Conversation = {
        ...conversation,
        isArchived: isArchived
      };
      
      return updatedConversation;
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
      })
      
      // Handle update conversation title
      .addCase(updateConversationTitle.pending, (state) => {
        // You might want to add a loading state for the title update if needed
      })
      .addCase(updateConversationTitle.fulfilled, (state, action: PayloadAction<Conversation>) => {
        const updatedConversation = action.payload;
        
        // Update in unarchived list if present
        if (state.unarchived.data) {
          state.unarchived.data = state.unarchived.data.map(conversation => 
            conversation.id === updatedConversation.id ? updatedConversation : conversation
          );
        }
        
        // Update in archived list if present
        if (state.archived.data) {
          state.archived.data = state.archived.data.map(conversation => 
            conversation.id === updatedConversation.id ? updatedConversation : conversation
          );
        }
        
        // Update selected conversation if it's the one being edited
        if (state.selectedConversation && state.selectedConversation.id === updatedConversation.id) {
          state.selectedConversation = updatedConversation;
        }
      })
      .addCase(updateConversationTitle.rejected, (state, action) => {
        // Handle error state if needed
        console.error('Failed to update conversation title:', action.payload);
      })
      
      // Handle toggle archive status
      .addCase(toggleArchiveStatus.pending, (state) => {
        // Optional: Add loading state for archive toggle
      })
      .addCase(toggleArchiveStatus.fulfilled, (state, action: PayloadAction<Conversation>) => {
        const updatedConversation = action.payload;
        
        // If conversation was archived, remove from unarchived list and add to archived list
        if (updatedConversation.isArchived) {
          // Remove from unarchived list if present
          if (state.unarchived.data) {
            state.unarchived.data = state.unarchived.data.filter(
              conversation => conversation.id !== updatedConversation.id
            );
          }
          
          // Add to archived list if it exists
          if (state.archived.data) {
            // Avoid duplicates
            if (!state.archived.data.some(c => c.id === updatedConversation.id)) {
              state.archived.data = [updatedConversation, ...state.archived.data];
            }
          }
        } 
        // If conversation was unarchived, remove from archived list and add to unarchived list
        else {
          // Remove from archived list if present
          if (state.archived.data) {
            state.archived.data = state.archived.data.filter(
              conversation => conversation.id !== updatedConversation.id
            );
          }
          
          // Add to unarchived list if it exists
          if (state.unarchived.data) {
            // Avoid duplicates
            if (!state.unarchived.data.some(c => c.id === updatedConversation.id)) {
              state.unarchived.data = [updatedConversation, ...state.unarchived.data];
            }
          }
        }
        
        // Update selected conversation if it's the one being toggled
        if (state.selectedConversation && state.selectedConversation.id === updatedConversation.id) {
          state.selectedConversation = updatedConversation;
        }
      })
      .addCase(toggleArchiveStatus.rejected, (state, action) => {
        // Handle error state if needed
        console.error('Failed to toggle archive status:', action.payload);
      });
  }
});

// Export actions and reducer
export const { selectConversation, clearSelectedConversation, resetConversations } = conversationsSlice.actions;
export default conversationsSlice.reducer;