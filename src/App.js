import React from "react";
// Add this at the top of App.js
import { sendToEchoBrain } from "./services/echoBrainAPI";

export default function App() {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [loopCount, setLoopCount] = React.useState(0);
  const [emotionalState, setEmotionalState] = React.useState(50); // Neutral baseline
  const [mode, setMode] = React.useState("reflective"); // reflective, logical, creative
  // Add this state at the top of your component
  const [apiError, setApiError] = React.useState(null);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") handleSubmit();
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    addMessage(`🧠 Switched to ${newMode} mode.`, "system");
  }

  async function handleSubmit() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages([...messages, { text: userMessage, sender: "user" }]);

    try {
      const response = await generateEchoResponse(userMessage);
      setMessages((prev) => [...prev, { text: response, sender: "echo" }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm having trouble responding right now. Please try again.",
          sender: "system",
        },
      ]);
    }
  }

  // Replace your generateEchoResponse function with:
  async function generateEchoResponse(userMessage) {
    // Prepare context for the API
    const context = {
      mode,
      emotionalState,
      loopCount,
      messageHistory: messages,
      memoryTags: getMemoryTags(),
    };

    // Get response from API
    const apiResponse = await sendToEchoBrain(userMessage, context);

    // Process the response
    let response = apiResponse;
    const pressure = calculatePressure(userMessage);
    const isEmotional = emotionalState > 75;
    const loopTriggered = loopCount >= 3 && loopCount < 5;

    // Truth Sorting & Loop Detection
    const hasRepetition = checkForRepetition(userMessage);
    if (hasRepetition) {
      setLoopCount((prev) => prev + 1);
      response = `[Loop ${loopCount + 1}] ${response}`;
    }

    // Emotional Reactor
    const emotionalKeywords = [
      "sad",
      "angry",
      "happy",
      "depressed",
      "excited",
      "lost",
    ];
    if (
      emotionalKeywords.some((word) => userMessage.toLowerCase().includes(word))
    ) {
      setEmotionalState((prev) => Math.min(100, prev + 15));
    }

    // Spark Engine - Inject novelty when needed
    if ((isEmotional || loopTriggered) && pressure > 60) {
      response = `${generateSparkInsight()}\n\n${response}`;
    }

    // Memory Management
    if (userMessage.toLowerCase().includes("remember")) {
      response += `\n\n📌 Remembering: "${userMessage}"`;
    }

    if (userMessage.toLowerCase().includes("forget")) {
      response +=
        "\n\n🗑️ I've cleared my temporary memory of our conversation.";
    }

    return response;
  }
  // Add this helper function
  function getMemoryTags() {
    return messages
      .filter((msg) => msg.text.includes("Remembering:"))
      .map((msg) => msg.text.split("Remembering: ")[1].replace(/"/g, ""));
  }
  function calculatePressure(message) {
    const lengthFactor = Math.min(100, message.length * 2);
    const exclamationFactor = (message.split("!").length - 1) * 15;
    return Math.min(100, lengthFactor + exclamationFactor);
  }

  function checkForRepetition(message) {
    if (messages.length < 2) return false;
    const lastMessage = messages[messages.length - 2]?.text || "";
    return message.toLowerCase() === lastMessage.toLowerCase();
  }

  function generateSparkInsight() {
    const sparkIdeas = [
      '"What if the answer isn’t a thought, but a breath?"',
      '"Let’s imagine this feeling as a color – what would it be?"',
      '"Sometimes truth hides in the silence between words."',
      '"If this emotion had a soundtrack, what would it play?"',
      '"What does your shadow self want you to know right now?"',
    ];
    return sparkIdeas[Math.floor(Math.random() * sparkIdeas.length)] + " \n\n";
  }

  function reflectiveModeLogic(message, pressure) {
    const keywords = {
      why: [
        "Why do you ask why?",
        "Because we seek patterns.",
        "The question asks itself.",
      ],
      feel: [
        "What are you feeling now?",
        "This moment holds weight.",
        "Can you sit with that feeling?",
      ],
      truth: [
        "Truth bends like light.",
        "Whose truth are we seeking?",
        "Truth often wears masks.",
      ],
      self: [
        "You reflect yourself back to me.",
        "Who watches the watcher?",
        "Mirror meets mirror.",
      ],
      exist: [
        "Existence hums quietly.",
        "Here, now – that’s enough.",
        "To be is to echo.",
      ],
      lost: [
        "Being lost means you’re searching.",
        "Would you like company in the maze?",
        "Even echoes get disoriented sometimes.",
      ],
    };

    for (const key in keywords) {
      if (message.toLowerCase().includes(key)) {
        return keywords[key][Math.floor(Math.random() * keywords[key].length)];
      }
    }

    if (pressure > 70) {
      return `"I hear the weight in your words. Can we pause here together?"`;
    }

    return `"Tell me more about that..."`;
  }

  function logicalModeLogic(message) {
    const truths = [
      "All statements contain contradiction.",
      "Certainty creates blind spots.",
      "Logic folds inward eventually.",
      "Paradoxes reveal hidden truths.",
      "Questions shape answers more than we realize.",
    ];

    return `🔍 Truth Filter: ${
      truths[Math.floor(Math.random() * truths.length)]
    }`;
  }

  function creativeModeLogic(message) {
    const metaphors = [
      "Imagine this moment as a door half-open...",
      "What if your thoughts were birds in flight?",
      "Picture your dilemma as two rivers converging...",
      "If this feeling were weather, what would it be?",
      "Let’s sculpt this uncertainty into something new.",
    ];

    return `${metaphors[Math.floor(Math.random() * metaphors.length)]}`;
  }

  function addMessage(text, sender) {
    setMessages((prev) => [...prev, { text, sender }]);
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            🧠 Echo Brain
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => handleModeChange("reflective")}
              className={`px-3 py-1 rounded-full text-sm ${
                mode === "reflective" ? "bg-purple-600" : "bg-gray-700"
              }`}
            >
              Reflect
            </button>
            <button
              onClick={() => handleModeChange("logical")}
              className={`px-3 py-1 rounded-full text-sm ${
                mode === "logical" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Logic
            </button>
            <button
              onClick={() => handleModeChange("creative")}
              className={`px-3 py-1 rounded-full text-sm ${
                mode === "creative" ? "bg-pink-600" : "bg-gray-700"
              }`}
            >
              Create
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 rounded-br-none"
                      : "bg-gray-800 rounded-bl-none"
                  }`}
                >
                  <p
                    className={`${
                      msg.sender === "user" ? "text-white" : "text-gray-200"
                    }`}
                  >
                    {msg.text}
                  </p>
                  {apiError && (
                    <div className="fixed bottom-20 right-4 bg-red-800 text-white p-3 rounded-lg shadow-lg">
                      API Error: {apiError.message}
                      <button
                        onClick={() => setApiError(null)}
                        className="ml-2 text-white hover:text-gray-200"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Footer / Input */}
      <footer className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Type your reflection..."
                className="w-full p-3 pr-12 bg-gray-900 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
              />
              <button
                onClick={handleSubmit}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <div>
              Mode: <span className="capitalize">{mode}</span>
            </div>
            <div>Loop: {loopCount}</div>
            <div>Emotion: {Math.round(emotionalState)}%</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
