import React from "react";

export default function Sidebar({
  chatHistory = [],
  currentChatId,
  loadingChats,
  onSelectChat,
  onStartNewChat,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
}) {
  return (
    <div
      className={`fixed md:relative z-20 w-72 h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-2xl rounded-r-3xl border-0 md:border-r-0 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
      style={{ borderTopLeftRadius: "2rem", borderBottomLeftRadius: "2rem" }}
    >
      {/* User Avatar */}
      <div className="flex flex-col items-center py-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300 flex items-center justify-center text-3xl shadow-lg mb-2">
          <span role="img" aria-label="User">
            🧑‍💻
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-300 mb-2">
          Welcome!
        </div>
      </div>
      <div className="px-4 pb-2">
        <button
          onClick={onStartNewChat}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-pink-400 hover:to-yellow-300 text-white py-3 px-4 rounded-full shadow-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center"
        >
          <span className="mr-2 text-xl">＋</span> New Chat
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-180px)] px-2 pt-2">
        {loadingChats ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          chatHistory.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex flex-col px-4 py-3 my-2 rounded-xl cursor-pointer transition-all duration-150 shadow-sm font-medium text-base ${
                currentChatId === chat.id
                  ? "bg-gradient-to-r from-purple-400 to-pink-300 text-white shadow-lg"
                  : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 hover:bg-pink-100/70 dark:hover:bg-purple-900/40"
              }`}
            >
              <div className="truncate font-semibold">{chat.title}</div>
              <div className="text-xs truncate opacity-70">
                {chat.preview || "No messages yet"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
