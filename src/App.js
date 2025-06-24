import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "prism-react-renderer";
import { sendToEchoBrain } from "./services/echoBrainAPI";

export default function App() {
  // ===== ORIGINAL STATE HOOKS (UNCHANGED) =====
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [loopCount, setLoopCount] = React.useState(0);
  const [emotionalState, setEmotionalState] = React.useState(50);
  const [mode, setMode] = React.useState("reflective");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  // ===== ORIGINAL EFFECTS (UNCHANGED) =====
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // ===== ORIGINAL HANDLERS (UNCHANGED) =====
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

  // ===== ORIGINAL API LOGIC (UNCHANGED) =====
  async function handleSubmit() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    setIsLoading(true);

    try {
      const response = await generateEchoResponse(userMessage);
      await simulateTypewriter(response);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm having trouble responding right now. Please try again.",
          sender: "system",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // ===== ORIGINAL HELPER FUNCTIONS (UNCHANGED) =====
  async function generateEchoResponse(userMessage) {
    const context = {
      mode,
      emotionalState,
      loopCount,
      messageHistory: messages,
      memoryTags: getMemoryTags(),
    };

    const apiResponse = await sendToEchoBrain(userMessage, context);
    let response = apiResponse;
    const pressure = calculatePressure(userMessage);
    const isEmotional = emotionalState > 75;
    const loopTriggered = loopCount >= 3 && loopCount < 5;

    const hasRepetition = checkForRepetition(userMessage);
    if (hasRepetition) {
      setLoopCount((prev) => prev + 1);
      response = `[Loop ${loopCount + 1}] ${response}`;
    }

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

    if ((isEmotional || loopTriggered) && pressure > 60) {
      response = `${generateSparkInsight()}\n\n${response}`;
    }

    if (userMessage.toLowerCase().includes("remember")) {
      response += `\n\n📌 Remembering: "${userMessage}"`;
    }

    if (userMessage.toLowerCase().includes("forget")) {
      response +=
        "\n\n🗑️ I've cleared my temporary memory of our conversation.";
    }

    return response;
  }

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
      '"What if the answer isn"t a thought, but a breath?"',
      '"Let"s imagine this feeling as a color – what would it be?"',
      '"Sometimes truth hides in the silence between words."',
      '"If this emotion had a soundtrack, what would it play?"',
      '"What does your shadow self want you to know right now?"',
    ];
    return sparkIdeas[Math.floor(Math.random() * sparkIdeas.length)] + " \n\n";
  }

  async function simulateTypewriter(fullText) {
    let displayed = "";
    for (let i = 0; i < fullText.length; i++) {
      displayed += fullText[i];
      await new Promise((r) => setTimeout(r, 15));
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.sender === "echo_typing") {
          return [
            ...prev.slice(0, -1),
            { sender: "echo_typing", text: displayed },
          ];
        } else {
          return [...prev, { sender: "echo_typing", text: displayed }];
        }
      });
    }
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { sender: "echo", text: displayed },
    ]);
  }

  function addMessage(text, sender) {
    setMessages((prev) => [...prev, { text, sender }]);
  }

  // ===== NEW MARKDOWN RENDERER =====
  function MessageContent({ text, sender }) {
    return (
      <ReactMarkdown
        children={text}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                language={match[1]}
                children={String(children).replace(/\n$/, "")}
                {...props}
              />
            ) : (
              <code className="bg-gray-700 rounded px-1 py-0.5 text-sm">
                {children}
              </code>
            );
          },
          pre({ children }) {
            return (
              <pre className="bg-gray-800 rounded-lg p-3 my-2 overflow-x-auto">
                {children}
              </pre>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-purple-500 pl-4 my-2 text-gray-300 italic">
                {children}
              </blockquote>
            );
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                className="text-purple-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
        }}
      />
    );
  }

  // ===== RENDER (ORIGINAL STRUCTURE WITH MARKDOWN SUPPORT) =====
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header (unchanged) */}
      <header className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            🧠 Echo Brain v4.2
          </h1>
          <div className="flex space-x-2">
            {["reflective", "logical", "creative"].map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`px-3 py-1 rounded-full text-sm ${
                  mode === m
                    ? `bg-${
                        m === "reflective"
                          ? "purple"
                          : m === "logical"
                          ? "blue"
                          : "pink"
                      }-600`
                    : "bg-gray-700"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Chat messages (updated with Markdown) */}
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
                      : msg.sender === "echo_typing"
                      ? "bg-gray-700 rounded-bl-none animate-pulse"
                      : "bg-gray-800 rounded-bl-none"
                  }`}
                >
                  <div
                    className={`prose prose-invert max-w-none ${
                      msg.sender === "user" ? "text-white" : "text-gray-200"
                    }`}
                  >
                    <MessageContent text={msg.text} sender={msg.sender} />
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-sm text-gray-400 animate-pulse">
                Echo Brain is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Footer (unchanged) */}
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
