import React from "react";

export default function Toast({ message, show }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-purple-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-700/30 px-6 py-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-purple-100 font-medium text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
