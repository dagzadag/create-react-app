import React from "react";
import MessageBubble from "./MessageBubble";

function TypingIndicator() {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex space-x-2">
        <span
          className="block w-3 h-3 bg-pink-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></span>
        <span
          className="block w-3 h-3 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></span>
        <span
          className="block w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></span>
      </div>
      <span className="ml-3 text-base text-purple-400 font-semibold">
        is typing...
      </span>
    </div>
  );
}

export default function ChatWindow({
  messages = [],
  isLoading,
  darkMode,
  copyToClipboard,
  formatTime,
  messagesEndRef,
  showScrollButton,
  scrollToBottom,
}) {
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto rounded-3xl shadow-xl bg-white/80 dark:bg-gray-900/80 p-6 md:p-10 min-h-[60vh] flex flex-col justify-end">
        <div className="space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-fade-in">
              <div className="text-6xl mb-4">🌱</div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome to your safe space
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md text-lg">
                Start a new conversation or select an existing one from the
                sidebar.
                <br />I can help with reflection, emotional support, or creative
                exploration.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className="animate-fade-in">
              <MessageBubble
                msg={msg}
                index={index}
                darkMode={darkMode}
                copyToClipboard={copyToClipboard}
                formatTime={formatTime}
              />
            </div>
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 p-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-30 border-4 border-white/60 dark:border-gray-900/60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="17 11 12 6 7 11"></polyline>
            <polyline points="17 18 12 13 7 18"></polyline>
          </svg>
        </button>
      )}
    </main>
  );
}
