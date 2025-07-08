import React, { useState, useEffect } from "react";

// AI Personality Modes
const AI_PERSONALITIES = {
  THERAPIST: {
    emoji: "💚",
    color: "personality-therapist",
    style: "empathetic",
    name: "Therapist Mode",
    description: "Warm, supportive, and emotionally intelligent",
  },
  LOGICIAN: {
    emoji: "🧮",
    color: "personality-logician",
    style: "analytical",
    name: "Logician Mode",
    description: "Precise, logical, and fact-based reasoning",
  },
  POET: {
    emoji: "🌌",
    color: "personality-poet",
    style: "symbolic",
    name: "Poet Mode",
    description: "Creative, metaphorical, and philosophically deep",
  },
  CODER: {
    emoji: "💻",
    color: "personality-coder",
    style: "technical",
    name: "Coder Mode",
    description: "Technical, solution-focused, and systematic",
  },
};

export default function NeuralInterface({
  currentPersonality = "THERAPIST",
  onPersonalityChange,
  showPersonalitySelector = true,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const currentMode = AI_PERSONALITIES[currentPersonality];

  const handlePersonalityChange = (newPersonality) => {
    if (newPersonality !== currentPersonality) {
      setIsAnimating(true);
      setTimeout(() => {
        onPersonalityChange?.(newPersonality);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="neural-interface">
      {/* Personality Indicator */}
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${currentMode.color} flex items-center justify-center shadow-lg neural-pulse`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span className="text-white text-xl">{currentMode.emoji}</span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-purple-100">
            {currentMode.name}
          </h3>
          <p className="text-sm text-purple-300">{currentMode.description}</p>
        </div>

        {/* Neural Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full neural-pulse"></div>
          <span className="text-xs text-purple-300">Neural Active</span>
        </div>
      </div>

      {/* Personality Selector */}
      {showPersonalitySelector && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(AI_PERSONALITIES).map(([key, personality]) => (
            <button
              key={key}
              onClick={() => handlePersonalityChange(key)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                currentPersonality === key
                  ? `${personality.color} shadow-lg scale-105`
                  : "bg-purple-800/40 hover:bg-purple-700/40"
              } ${isAnimating ? "animate-pulse" : ""}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{personality.emoji}</div>
                <div className="text-xs font-medium text-purple-100">
                  {personality.name.split(" ")[0]}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Neural Activity Monitor */}
      <div className="bg-purple-800/40 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-200">
            Neural Activity
          </span>
          <span className="text-xs text-purple-400">Real-time</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300">Logic Processing</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded-full ${
                    i <= 4 ? "bg-cyan-400" : "bg-purple-600"
                  } neural-pulse`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300">Emotional Resonance</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded-full ${
                    i <= 5 ? "bg-pink-400" : "bg-purple-600"
                  } neural-pulse`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300">Creative Synthesis</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded-full ${
                    i <= 3 ? "bg-purple-400" : "bg-purple-600"
                  } neural-pulse`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bg-purple-900/90 backdrop-blur-xl rounded-lg p-3 shadow-xl border border-purple-700/30">
          <p className="text-xs text-purple-200">
            <strong>{currentMode.name}</strong>
            <br />
            {currentMode.description}
          </p>
        </div>
      )}
    </div>
  );
}

// Hook for managing AI personality
export function useAIPersonality() {
  const [personality, setPersonality] = useState("THERAPIST");
  const [personalityHistory, setPersonalityHistory] = useState([]);

  const changePersonality = (newPersonality) => {
    setPersonalityHistory((prev) => [
      ...prev,
      { from: personality, to: newPersonality, timestamp: Date.now() },
    ]);
    setPersonality(newPersonality);
  };

  const getPersonalityStats = () => {
    const stats = {};
    personalityHistory.forEach((change) => {
      stats[change.to] = (stats[change.to] || 0) + 1;
    });
    return stats;
  };

  return {
    personality,
    changePersonality,
    personalityHistory,
    getPersonalityStats,
  };
}
