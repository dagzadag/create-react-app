import React from "react";

export default function LandingPage({ onStartChat }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-400 to-yellow-300 text-gray-900">
      <div className="bg-white/80 rounded-3xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center">
        <div className="text-5xl mb-4">🧠</div>
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to Echo Brain Therapy
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Your AI-powered companion for reflection, emotional support, and
          creative exploration. Start a conversation and let your thoughts flow
          in a safe, judgment-free space.
        </p>
        <button
          onClick={onStartChat}
          className="mt-4 px-8 py-4 bg-purple-600 hover:bg-pink-500 text-white text-xl font-semibold rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Chat with me
        </button>
      </div>
    </div>
  );
}
