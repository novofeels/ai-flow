// src/services/conversationService.ts
import { ConversationsList } from "@/types/conversations";
import { ENDPOINTS } from "@/config/apiConfig";

/**
 * Fetch unarchived conversations from the API
 * @param accessToken - The Bearer token from session storage
 * @returns A promise that resolves to a list of unarchived conversations
 */
export async function getUnarchivedConversations(accessToken: string): Promise<ConversationsList> {
  if (!accessToken) {
    throw new Error("No access token provided for getUnarchivedConversations");
  }

  const response = await fetch(ENDPOINTS.UNARCHIVED_CONVERSATIONS, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch unarchived conversations. Status: ${response.status}, Details: ${errorText}`);
  }

  return response.json();
}

/**
 * Fetch archived conversations from the API
 * @param accessToken - The Bearer token from session storage
 * @returns A promise that resolves to a list of archived conversations
 */
export async function getArchivedConversations(accessToken: string): Promise<ConversationsList> {
  if (!accessToken) {
    throw new Error("No access token provided for getArchivedConversations");
  }

  const response = await fetch(ENDPOINTS.ARCHIVED_CONVERSATIONS, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch archived conversations. Status: ${response.status}, Details: ${errorText}`);
  }

  return response.json();
}