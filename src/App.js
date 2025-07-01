import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-400 to-yellow-300 text-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🧠</span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight font-sans">
            Echo Brain Therapy
          </span>
        </div>
        <a
          href="/chat"
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-all"
        >
          Sign In / Sign Up
        </a>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 mb-10">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col items-center">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Your AI Therapy Companion
          </h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-2xl mb-8">
            Echo Brain is a modern, AI-powered therapy platform designed to help
            you reflect, grow, and find emotional support—anytime, anywhere.
            Start your journey to a healthier mind today.
          </p>
          <a
            href="/chat"
            className="mt-4 mb-12 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xl font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white/80">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="font-bold text-xl mb-2">AI-Powered Chat</h3>
              <p className="text-gray-600">
                24/7 intelligent conversation for reflection, advice, and
                emotional support.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <div className="text-4xl mb-2">🔒</div>
              <h3 className="font-bold text-xl mb-2">Private & Secure</h3>
              <p className="text-gray-600">
                Your conversations are confidential and protected with
                industry-leading security.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <div className="text-4xl mb-2">📈</div>
              <h3 className="font-bold text-xl mb-2">Personal Growth</h3>
              <p className="text-gray-600">
                Track your progress and receive personalized insights to help
                you grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-purple-200">
              <h3 className="font-bold text-xl mb-2">Starter</h3>
              <div className="text-3xl font-bold mb-2">Free</div>
              <ul className="text-gray-600 mb-4">
                <li>• Limited daily messages</li>
                <li>• Basic AI support</li>
              </ul>
              <a
                href="/chat"
                className="mt-auto px-6 py-2 bg-purple-400 text-white rounded-full font-semibold shadow hover:scale-105 transition-all"
              >
                Try Free
              </a>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-4 border-pink-400 scale-105">
              <h3 className="font-bold text-xl mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-2">$9/mo</div>
              <ul className="text-gray-600 mb-4">
                <li>• Unlimited messages</li>
                <li>• Advanced AI insights</li>
                <li>• Priority support</li>
              </ul>
              <a
                href="/chat"
                className="mt-auto px-6 py-2 bg-pink-500 text-white rounded-full font-semibold shadow hover:scale-105 transition-all"
              >
                Go Pro
              </a>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-purple-200">
              <h3 className="font-bold text-xl mb-2">Therapist</h3>
              <div className="text-3xl font-bold mb-2">$29/mo</div>
              <ul className="text-gray-600 mb-4">
                <li>• All Pro features</li>
                <li>• Human therapist check-ins</li>
                <li>• Custom growth plans</li>
              </ul>
              <a
                href="/chat"
                className="mt-auto px-6 py-2 bg-purple-600 text-white rounded-full font-semibold shadow hover:scale-105 transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 bg-white/60 mt-auto">
        &copy; {new Date().getFullYear()} Echo Brain Therapy. All rights
        reserved.
      </footer>
    </div>
  );
}
