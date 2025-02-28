"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchUnarchivedConversations, fetchArchivedConversations, selectConversation } from "@/features/ConversationsSlice";
import { Conversation } from "@/types/conversations";

const ConversationsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showArchived, setShowArchived] = useState(false);
  
  const { 
    unarchived: { data: unarchivedConversations, status: unarchivedStatus, error: unarchivedError },
    archived: { data: archivedConversations, status: archivedStatus, error: archivedError }
  } = useAppSelector((state) => state.conversations);

  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);

  useEffect(() => {
    // Fetch unarchived conversations when component mounts
    if (unarchivedStatus === 'idle') {
      dispatch(fetchUnarchivedConversations());
    }
  }, [dispatch, unarchivedStatus]);

  // Fetch archived conversations only when the user wants to view them
  useEffect(() => {
    if (showArchived && archivedStatus === 'idle') {
      dispatch(fetchArchivedConversations());
    }
  }, [dispatch, showArchived, archivedStatus]);

  const handleConversationClick = (conversation: Conversation) => {
    dispatch(selectConversation(conversation));
  };

  const toggleArchiveView = () => {
    setShowArchived(!showArchived);
  };

  // Determine which conversations to display
  const conversations = showArchived ? archivedConversations : unarchivedConversations;
  const status = showArchived ? archivedStatus : unarchivedStatus;
  const error = showArchived ? archivedError : unarchivedError;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Conversations</h2>
        <button 
          onClick={toggleArchiveView}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
        >
          {showArchived ? "Show Active" : "Show Archived"}
        </button>
      </div>

      {status === 'loading' && <p className="text-gray-600">Loading conversations...</p>}
      {status === 'failed' && <p className="text-red-500">{error}</p>}
      
      {status === 'succeeded' && conversations && conversations.length === 0 && (
        <p className="text-gray-500">No {showArchived ? "archived" : "active"} conversations found.</p>
      )}

      {status === 'succeeded' && conversations && conversations.length > 0 && (
        <ul className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <li 
              key={conversation.id}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? "bg-blue-50 border-l-4 border-blue-400" : ""
              }`}
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="font-medium mb-1 truncate">{conversation.title}</div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{new Date(conversation.updateDate).toLocaleDateString()}</span>
                <span>{conversation.indexValue}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationsList;