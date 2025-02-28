"use client";

import React, { useState, useEffect } from "react";
import { FaHistory, FaArchive } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { 
  fetchUnarchivedConversations, 
  fetchArchivedConversations, 
  selectConversation 
} from "@/features/ConversationsSlice";
import { Conversation } from "@/types/conversations";

const Sidebar = () => {
  // 'activePanel' tracks which panel (if any) is open.
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  
  // Get conversation data from Redux
  const { 
    unarchived: { data: unarchivedConversations, status: unarchivedStatus, error: unarchivedError },
    archived: { data: archivedConversations, status: archivedStatus, error: archivedError },
    selectedConversation
  } = useAppSelector((state) => state.conversations);

  // Fetch unarchived conversations when history panel is opened
  useEffect(() => {
    if (activePanel === "history" && unarchivedStatus === 'idle') {
      dispatch(fetchUnarchivedConversations());
    }
  }, [activePanel, dispatch, unarchivedStatus]);

  // Fetch archived conversations when archive panel is opened
  useEffect(() => {
    if (activePanel === "archive" && archivedStatus === 'idle') {
      dispatch(fetchArchivedConversations());
    }
  }, [activePanel, dispatch, archivedStatus]);

  const handleIconClick = (panel: string) => {
    // Toggle panel: if already active, close it; otherwise, open it.
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const handleConversationClick = (conversation: Conversation) => {
    dispatch(selectConversation(conversation));
    // Optionally close the panel after selection on mobile
    // setActivePanel(null);
  };

  // Helper function to render conversation list
  const renderConversations = (
    conversations: Conversation[] | null, 
    status: string, 
    error: string | null,
    type: 'active' | 'archived'
  ) => {
    if (status === 'loading') {
      return <div className="py-2 px-4 text-gray-500">Loading conversations...</div>;
    }
    
    if (status === 'failed') {
      return <div className="py-2 px-4 text-red-500">Error: {error}</div>;
    }
    
    if (!conversations || conversations.length === 0) {
      return <div className="py-2 px-4 text-gray-500">No {type} conversations found.</div>;
    }
    
    return (
      <ul className="space-y-1">
        {conversations.map((convo) => (
          <li 
            key={convo.id}
            className={`py-2 px-4 cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedConversation?.id === convo.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
            }`}
            onClick={() => handleConversationClick(convo)}
          >
            <div className="font-medium truncate">{convo.title || "Untitled Conversation"}</div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{new Date(convo.updateDate).toLocaleDateString()}</span>
              <span>{convo.indexValue}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {/* Static sidebar: fixed narrow column with icons */}
      <div
        className="fixed left-0 h-full w-12 bg-gray-900 text-white flex flex-col items-center py-4 space-y-4 z-40"
        style={{ top: "64px" }} // Adjust to match Topbar height
      >
        <button
          className={`p-2 hover:bg-gray-700 rounded ${activePanel === 'history' ? 'bg-gray-700' : ''}`}
          onClick={() => handleIconClick("history")}
          title="Active Conversations"
        >
          <FaHistory size={18} />
        </button>
        <button
          className={`p-2 hover:bg-gray-700 rounded ${activePanel === 'archive' ? 'bg-gray-700' : ''}`}
          onClick={() => handleIconClick("archive")}
          title="Archived Conversations"
        >
          <FaArchive size={18} />
        </button>
      </div>

      {/* Expandable panel for additional content */}
      <div
        className={`fixed top-[4rem] left-12 h-full bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          activePanel ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "300px" }}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">
              {activePanel === "history"
                ? "Active Conversations"
                : activePanel === "archive"
                ? "Archived Conversations"
                : ""}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activePanel === "history" && 
              renderConversations(unarchivedConversations, unarchivedStatus, unarchivedError, 'active')}
            
            {activePanel === "archive" && 
              renderConversations(archivedConversations, archivedStatus, archivedError, 'archived')}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;