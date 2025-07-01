import React, { useState } from "react";

export default function LoginPage({ onLoginWithEmail, onSignup, error }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-400 to-yellow-300 text-gray-900">
      <div className="bg-white/80 rounded-3xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center">
        <div className="text-5xl mb-4">🧠</div>
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to Echo Brain Therapy
        </h1>
        <div className="flex space-x-4 mb-6 mt-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
              tab === "login"
                ? "bg-purple-400 text-white"
                : "bg-white/80 text-purple-700"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
              tab === "signup"
                ? "bg-pink-400 text-white"
                : "bg-white/80 text-pink-700"
            }`}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>
        {error && (
          <div className="mb-4 text-red-500 font-semibold">{error}</div>
        )}
        {tab === "login" ? (
          <form
            className="w-full flex flex-col items-center"
            onSubmit={(e) => {
              e.preventDefault();
              onLoginWithEmail(email, password);
            }}
          >
            <input
              type="email"
              placeholder="Email"
              className="mb-3 px-4 py-3 rounded-xl w-full bg-white border border-purple-200 focus:ring-2 focus:ring-purple-300 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-3 px-4 py-3 rounded-xl w-full bg-white border border-purple-200 focus:ring-2 focus:ring-purple-300 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full mt-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Login
            </button>
          </form>
        ) : (
          <form
            className="w-full flex flex-col items-center"
            onSubmit={(e) => {
              e.preventDefault();
              onSignup(signupEmail, signupPassword);
            }}
          >
            <input
              type="email"
              placeholder="Email"
              className="mb-3 px-4 py-3 rounded-xl w-full bg-white border border-pink-200 focus:ring-2 focus:ring-pink-300 outline-none"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-3 px-4 py-3 rounded-xl w-full bg-white border border-pink-200 focus:ring-2 focus:ring-pink-300 outline-none"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full mt-2 px-8 py-3 bg-gradient-to-r from-pink-400 to-yellow-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
            >
              Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
