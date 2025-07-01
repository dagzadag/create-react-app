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
            <code className={className} {...props}>
              {children}
            </code>
          );
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
    <div
      key={index}
      className={`flex items-end ${
        isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 ${isUser ? "order-2 ml-3" : "order-1 mr-3"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-2xl ${
            isUser
              ? "bg-gradient-to-br from-blue-400 to-purple-400 text-white"
              : "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
          }`}
        >
          {isUser ? "🧑" : "🧠"}
        </div>
      </div>
      {/* Bubble */}
      <div
        className={`relative max-w-[80%] p-4 rounded-3xl shadow-xl font-sans transition-all duration-200 ${
          isUser
            ? "bg-gradient-to-r from-purple-200 to-pink-200 text-gray-900 rounded-br-none"
            : isEcho
            ? "bg-gradient-to-r from-white/90 to-purple-100 dark:from-gray-800/90 dark:to-purple-900 text-gray-900 dark:text-gray-100 rounded-bl-none"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        }`}
        style={{
          borderBottomRightRadius: isUser ? 0 : undefined,
          borderBottomLeftRadius: isUser ? undefined : 0,
        }}
      >
        <div className="prose prose-invert max-w-none">
          <MessageContent
            text={msg.text}
            sender={msg.sender}
            darkMode={darkMode}
          />
        </div>
        <span className="text-xs opacity-60 mt-2 block text-right font-mono">
          {formatTime(msg.timestamp)}
        </span>
        {isEcho && (
          <button
            onClick={() => copyToClipboard(msg.text)}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/60 hover:bg-pink-200 transition-colors duration-200 group shadow-md"
            title="Copy to clipboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            <span className="hidden group-hover:block absolute top-8 right-0 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Copy to clipboard
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
