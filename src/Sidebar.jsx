import React, { useState } from "react";

export default function Sidebar({
  chatHistory = [],
  currentChatId,
  loadingChats,
  onSelectChat,
  onStartNewChat,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  user,
  onUpdateChatTitle,
  onDeleteChat,
}) {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleEditClick = (chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async () => {
    if (editTitle.trim() && editingChatId) {
      await onUpdateChatTitle(editingChatId, editTitle.trim());
      setEditingChatId(null);
      setEditTitle("");
    }
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleDeleteClick = (chatId) => {
    setShowDeleteConfirm(chatId);
  };

  const handleConfirmDelete = async (chatId) => {
    await onDeleteChat(chatId);
    setShowDeleteConfirm(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div
      className={`fixed md:relative z-20 w-80 h-full bg-purple-900/80 backdrop-blur-xl shadow-2xl border-r border-purple-700/30 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* User Profile Section */}
      <div className="p-6 border-b border-purple-700/30">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-purple-100 truncate">
              {user?.email || "Welcome!"}
            </p>
            <p className="text-xs text-purple-300">Ready to chat</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onStartNewChat}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 px-4 rounded-2xl shadow-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-xl hover:scale-[1.02] border border-pink-500/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          {loadingChats ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-400 border-t-transparent"></div>
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm text-purple-300">No chats yet</p>
              <p className="text-xs text-purple-400">
                Start your first conversation!
              </p>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div key={chat.id}>
                {/* Chat Item */}
                <div
                  className={`group p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                    currentChatId === chat.id
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg border border-pink-500/30"
                      : "bg-purple-800/60 hover:bg-purple-700/60 text-purple-100 hover:shadow-md border border-purple-700/30"
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        currentChatId === chat.id ? "bg-white" : "bg-pink-400"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-2 py-1 text-sm bg-purple-900/60 border border-purple-600/30 rounded text-purple-100 focus:outline-none focus:ring-1 focus:ring-pink-400"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit();
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3
                            className={`font-medium text-sm truncate ${
                              currentChatId === chat.id
                                ? "text-white"
                                : "text-purple-100"
                            }`}
                          >
                            {chat.title}
                          </h3>
                          <p
                            className={`text-xs mt-1 truncate ${
                              currentChatId === chat.id
                                ? "text-white/80"
                                : "text-purple-300"
                            }`}
                          >
                            {chat.preview || "No messages yet"}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {editingChatId !== chat.id && (
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(chat);
                          }}
                          className={`p-1 rounded hover:bg-white/20 transition-colors ${
                            currentChatId === chat.id
                              ? "text-white"
                              : "text-purple-300"
                          }`}
                          title="Edit title"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(chat.id);
                          }}
                          className={`p-1 rounded hover:bg-red-500/20 transition-colors ${
                            currentChatId === chat.id
                              ? "text-white"
                              : "text-purple-300"
                          }`}
                          title="Delete chat"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === chat.id && (
                  <div className="mt-2 p-3 bg-red-900/60 rounded-xl border border-red-700/30">
                    <p className="text-xs text-red-200 mb-2">
                      Delete this conversation?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleConfirmDelete(chat.id)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
