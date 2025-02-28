// src/config/apiConfig.ts

// Get the API base URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://prd-think-func.azurewebsites.net/api';

// API endpoints
export const ENDPOINTS = {
  // Conversation endpoints
  FILTER_OPTIONS: `${API_BASE_URL}/conversation/filteroptions`,
  INDEXES: `${API_BASE_URL}/conversation/indexes`,
  UNARCHIVED_CONVERSATIONS: `${API_BASE_URL}/conversations/False`,
  ARCHIVED_CONVERSATIONS: `${API_BASE_URL}/conversations/True`,
  
  // Add other endpoints here as needed
};