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
    <footer className="p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl rounded-t-3xl sticky bottom-0 z-10 transition-all duration-300">
      <div className="container mx-auto max-w-3xl">
        <div className="flex flex-col space-y-4">
          {/* Input Area */}
          <div className="relative flex items-center">
            {/* Emoji Picker Icon (non-functional) */}

            <textarea
              value={input}
              onChange={onInputChange}
              onKeyDown={onInputKeyDown}
              placeholder={
                currentChatId
                  ? "Type your reflection... Try: 'Explain quantum physics' or 'How do I feel better today?'"
                  : "Type your message, then select or create a chat to send"
              }
              className="w-full pl-12 pr-16 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none min-h-[60px] max-h-[200px] font-sans text-lg transition-all duration-200"
              rows={1}
              ref={textareaRef}
              style={{
                height: "auto",
                minHeight: "60px",
                maxHeight: "200px",
              }}
            />
            <button
              onClick={() => {
                if (!currentChatId) {
                  setToast({
                    show: true,
                    message: "Please select or create a chat first",
                  });
                  setTimeout(
                    () => setToast({ show: false, message: "" }),
                    2000
                  );
                  return;
                }
                onSubmit();
              }}
              disabled={isLoading || !input.trim()}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-xl text-white text-2xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 hover:scale-110 active:scale-95 ${
                isLoading || !input.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-pink-500"
              }`}
              title={!currentChatId ? "Select or create a chat first" : ""}
              type="button"
            >
              {isLoading ? (
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
                  width="28"
                  height="28"
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

          {/* Counter and Mode Info */}
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {input.length > 0 && (
                <span className={input.length > 2000 ? "text-red-400" : ""}>
                  {input.length}/2000
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
