import React, { useRef, useEffect } from "react";

export default function Footer({
  input,
  onInputChange,
  onInputKeyDown,
  onSubmit,
  isLoading,
  currentChatId,
  darkMode,
  setToast,
  mode,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="bg-purple-800/60 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-700/30 p-4">
      <div className="relative">
        {/* Input Area */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={onInputChange}
              onKeyDown={onInputKeyDown}
              placeholder={
                currentChatId
                  ? "Share your thoughts... I'm here to listen and support you."
                  : "Type your message, then select or create a chat to send"
              }
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-purple-900/60 backdrop-blur-sm border border-purple-600/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-purple-100 placeholder-purple-400 resize-none min-h-[48px] max-h-[120px] font-sans text-sm transition-all duration-200"
              rows={1}
              ref={textareaRef}
            />

            {/* Character Counter */}
            {input.length > 0 && (
              <div className="absolute bottom-2 right-3 text-xs text-purple-400">
                {input.length}/2000
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={() => {
              if (!currentChatId) {
                setToast({
                  show: true,
                  message: "Please select or create a chat first",
                });
                setTimeout(() => setToast({ show: false, message: "" }), 2000);
                return;
              }
              onSubmit();
            }}
            disabled={isLoading || !input.trim()}
            className={`flex-shrink-0 p-3 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 self-start ${
              isLoading || !input.trim()
                ? "bg-purple-700/60 text-purple-400 cursor-not-allowed border border-purple-600/30"
                : "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 active:scale-95 border border-pink-500/30"
            }`}
            title={!currentChatId ? "Select or create a chat first" : ""}
            type="button"
          >
            {isLoading ? (
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
                className="animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="3"
                  strokeDasharray="42"
                  strokeDashoffset="16"
                />
              </svg>
            ) : (
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>

        {/* Helper Text */}
        {!currentChatId && (
          <div className="mt-2 text-xs text-purple-400 text-center">
            💡 Create a new chat or select an existing one to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
