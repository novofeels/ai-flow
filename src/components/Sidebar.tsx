// src/app/components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import { FaHome, FaHistory, FaCog } from "react-icons/fa";

const Sidebar = () => {
  // 'activePanel' tracks which panel (if any) is open.
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleIconClick = (panel: string) => {
    // Toggle panel: if already active, close it; otherwise, open it.
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <>
      {/* Static sidebar: fixed narrow column with icons */}
      <div
        className="fixed left-0 h-full w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-4 z-40"
        style={{ top: "64px" }} // Adjust to match Topbar height
      >
        <button
          className="p-2 hover:bg-gray-700 rounded"
          onClick={() => handleIconClick("home")}
        >
          <FaHome size={24} />
        </button>
        <button
          className="p-2 hover:bg-gray-700 rounded"
          onClick={() => handleIconClick("history")}
        >
          <FaHistory size={24} />
        </button>
        <button
          className="p-2 hover:bg-gray-700 rounded"
          onClick={() => handleIconClick("settings")}
        >
          <FaCog size={24} />
        </button>
      </div>

      {/* Expandable panel for additional content */}
      <div
        className={`fixed top-[64px] left-16 h-full bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          activePanel ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "300px" }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">
            {activePanel === "history"
              ? "Conversation History"
              : activePanel === "home"
              ? "Home Panel"
              : activePanel === "settings"
              ? "Settings"
              : ""}
          </h2>
          {activePanel === "history" && (
            <div>
              <p>Your conversation history goes here.</p>
              {/* Render conversation history items */}
            </div>
          )}
          {activePanel === "home" && (
            <div>
              <p>Home panel content goes here.</p>
            </div>
          )}
          {activePanel === "settings" && (
            <div>
              <p>Settings content goes here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
