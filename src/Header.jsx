import React from "react";

export default function Header({ darkMode, setDarkMode, user }) {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Logo and Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">🧠</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Echo Brain
          </h1>
          <p className="text-xs text-purple-300">AI Therapy Companion</p>
        </div>
      </div>

      {/* User Info */}
    </div>
  );
}
