import React, { useState } from "react";

export default function LoginPage({ onLoginWithEmail, onSignup, error }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      onSignup(email, password);
    } else {
      onLoginWithEmail(email, password);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-purple-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-700/30 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl">🧠</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Echo Brain Therapy
          </h1>
          <p className="text-purple-300 text-sm">
            {isSignup ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-700/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-purple-200 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-purple-800/60 backdrop-blur-sm border border-purple-600/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-purple-100 placeholder-purple-400 transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-purple-200 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-purple-800/60 backdrop-blur-sm border border-purple-600/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-purple-100 placeholder-purple-400 transition-all duration-200"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border border-pink-500/30"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 pt-6 border-t border-purple-700/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl">🔒</div>
              <p className="text-xs text-purple-300">Secure</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">💬</div>
              <p className="text-xs text-purple-300">Private</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">🌱</div>
              <p className="text-xs text-purple-300">Supportive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
