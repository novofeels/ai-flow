// src/services/conversationService.ts
import { ConversationsList, Conversation } from "@/types/conversations";
import { ENDPOINTS } from "@/config/apiConfig";

/**
 * Fetch unarchived conversations from the API
 * @param accessToken - The Bearer token from session storage
 * @param conversation - The complete conversation object
 * @param isArchived - Whether to archive (true) or unarchive (false) the conversation
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

export async function updateConversationTitle(
  accessToken: string,
  conversation: Conversation
): Promise<Conversation> {
  if (!accessToken) {
    throw new Error("No access token provided for updateConversationTitle");
  }

  const response = await fetch(`${ENDPOINTS.UPDATE_CONVERSATION_TITLE}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversation),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update conversation title. Status: ${response.status}, Details: ${errorText}`);
  }

  return response.json();
}

export async function toggleConversationArchiveStatus(
  accessToken: string,
  conversationId: string,
  isArchived: boolean
): Promise<void> {  // Note: Return type changed to void
  if (!accessToken) {
    throw new Error("No access token provided for toggleConversationArchiveStatus");
  }

  const response = await fetch(`${ENDPOINTS.TOGGLE_ARCHIVE_STATUS}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "ConversationId": conversationId,
      "IsArchieved": isArchived  // Keep the API's misspelling
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const action = isArchived ? "archive" : "unarchive";
    throw new Error(`Failed to ${action} conversation. Status: ${response.status}, Details: ${errorText}`);
  }

  // Success with no response body needed
  return;
}