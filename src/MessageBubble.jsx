import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "prism-react-renderer";
import vsDark from "prism-react-renderer/themes/vsDark";
import github from "prism-react-renderer/themes/github";

function MessageContent({ text, sender, darkMode }) {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
              style={darkMode ? vsDark : github}
              PreTag="div"
              {...props}
            />
          ) : (
            <code className="bg-purple-800/60 px-1.5 py-0.5 rounded text-sm font-mono text-purple-200 border border-purple-700/30">
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-2 leading-relaxed">{children}</p>;
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function MessageBubble({
  msg,
  index,
  darkMode,
  copyToClipboard,
  formatTime,
}) {
  const isUser = msg.sender === "user";
  const isEcho = msg.sender === "echo" || msg.sender === "echo_typing";

  return (
    <div className={`flex justify-${isUser ? "end" : "start"}`}>
      {/* Message Bubble */}
      <div
        className={`max-w-[80%] p-4 rounded-2xl shadow-sm transition-all duration-200 ${
          isUser
            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-br-md border border-pink-500/30"
            : "bg-purple-800/60 backdrop-blur-sm text-purple-100 rounded-bl-md border border-purple-700/30"
        }`}
      >
        <div className="prose prose-sm max-w-none">
          <MessageContent
            text={msg.text}
            sender={msg.sender}
            darkMode={darkMode}
          />
        </div>

        {/* Timestamp */}
        <div
          className={`flex items-center justify-between mt-2 ${
            isUser ? "text-white/70" : "text-purple-300"
          }`}
        >
          <span className="text-xs font-mono">{formatTime(msg.timestamp)}</span>

          {/* Copy Button for AI messages */}
          {isEcho && (
            <button
              onClick={() => copyToClipboard(msg.text)}
              className="ml-2 p-1 rounded-full hover:bg-purple-700/40 transition-colors duration-200"
              title="Copy to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
