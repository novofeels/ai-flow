// src/types/conversations.ts

/**
 * Interface for conversation data returned from the API
 */
export interface Conversation {
    id: string;
    title: string;
    engagementId: string;
    clientId: string;
    indexName: string;
    indexValue: string;
    indexKey: string;
    isArchived: boolean;
    conversationFilePath: string;
    createdDate: string; // ISO date string
    createdParticipantId: string;
    updateDate: string; // ISO date string
    updatedParticipantId: string;
  }
  
  /**
   * Interface for conversations list returned from the API
   */
  export type ConversationsList = Conversation[];