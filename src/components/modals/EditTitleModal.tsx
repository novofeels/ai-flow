"use client";

import React, { useState, useEffect } from "react";

interface EditTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTitle: string) => void;
  currentTitle: string;
}

const EditTitleModal: React.FC<EditTitleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentTitle,
}) => {
  const [title, setTitle] = useState(currentTitle);
  
  // Update the title state when currentTitle prop changes
  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit Conversation Title</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-blue-800 bg-white"
            placeholder="Enter conversation title"
            autoFocus
          />
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-900"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTitleModal;