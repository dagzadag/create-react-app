import React from "react";
import MessageBubble from "./MessageBubble";

function TypingIndicator() {
  return (
    <div className="flex items-center space-x-3 p-4 bg-purple-800/50 rounded-2xl shadow-sm border border-purple-700/30">
      <div className="flex space-x-1">
        <span
          className="block w-2 h-2 bg-pink-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></span>
        <span
          className="block w-2 h-2 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></span>
        <span
          className="block w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></span>
      </div>
      <span className="text-sm text-purple-200 font-medium">
        Echo Brain is thinking...
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
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-800/60 to-pink-800/60 flex items-center justify-center shadow-lg border border-purple-700/30">
              <span className="text-4xl">🌱</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to your safe space
              </h2>
              <p className="text-purple-200 max-w-md text-sm leading-relaxed">
                Start a new conversation or select an existing one from the
                sidebar. I'm here to help with reflection, emotional support, or
                creative exploration.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-purple-400">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Your conversations are private and secure</span>
            </div>
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

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 p-3 bg-purple-800/90 backdrop-blur-sm text-purple-200 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 border border-purple-600/30"
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
            <polyline points="17 11 12 6 7 11"></polyline>
            <polyline points="17 18 12 13 7 18"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}
