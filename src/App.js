import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "prism-react-renderer";
import { sendToEchoBrain } from "./services/echoBrainAPI";
import vsDark from "prism-react-renderer/themes/vsDark";
import github from "prism-react-renderer/themes/github";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnm6IjurbAD9DE5TOJ90xRwYloTREXs44",
  authDomain: "nodejs-92f5f.firebaseapp.com",
  databaseURL: "https://nodejs-92f5f.firebaseio.com",
  projectId: "nodejs-92f5f",
  storageBucket: "nodejs-92f5f.firebasestorage.app",
  messagingSenderId: "289333254380",
  appId: "1:289333254380:web:26ba14f11089cf4590edc9",
  measurementId: "G-1S316SLKKN",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Toast Component
function Toast({ message, show }) {
  return (
    <div
      className={`fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}

// Long Press Hook
function useLongPress(callback, delay = 500) {
  const pressTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, []);

  const startPress = useCallback(() => {
    pressTimer.current = setTimeout(callback, delay);
  }, [callback, delay]);

  const cancelPress = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  return {
    onMouseDown: startPress,
    onMouseUp: cancelPress,
    onMouseLeave: cancelPress,
    onTouchStart: startPress,
    onTouchEnd: cancelPress,
  };
}

export default function App() {
  // ===== STATE HOOKS =====
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loopCount, setLoopCount] = useState(0);
  const [emotionalState, setEmotionalState] = useState(50);
  const [mode, setMode] = useState("reflective");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const messagesEndRef = useRef(null);
  const useLongPressHook = (text) =>
    useLongPress(() => copyToClipboard(text), 500);

  // ===== FIREBASE FUNCTIONS =====
  const fetchChats = useCallback(async () => {
    try {
      setLoadingChats(true);
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, orderBy("updatedAt", "desc"));
      const querySnapshot = await getDocs(q);

      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setChatHistory(chats);
      if (chats.length > 0 && !currentChatId) {
        setCurrentChatId(chats[0].id);
        loadMessages(chats[0].id);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoadingChats(false);
    }
  }, [currentChatId]);

  const loadMessages = async (chatId) => {
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp"));
      const querySnapshot = await getDocs(q);

      const loadedMessages = [];
      querySnapshot.forEach((doc) => {
        loadedMessages.push(doc.data());
      });

      setMessages(loadedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const saveMessage = async (chatId, message) => {
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await setDoc(doc(messagesRef), {
        ...message,
        timestamp: serverTimestamp(),
      });

      // Update chat's last message and timestamp
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        preview: message.text.slice(0, 50),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const newChatRef = doc(collection(db, "chats"));
      const newChat = {
        title: "New conversation",
        preview: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(newChatRef, newChat);

      const newChatWithId = {
        id: newChatRef.id,
        ...newChat,
      };

      setChatHistory([newChatWithId, ...chatHistory]);
      setCurrentChatId(newChatRef.id);
      setMessages([]);
      setInput("");
      setSidebarOpen(false);

      return newChatRef.id;
    } catch (error) {
      console.error("Error creating new chat:", error);
      return null;
    }
  };

  // ===== EFFECTS =====
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const main = document.querySelector("main");
    const handleScroll = () => {
      if (main.scrollHeight - main.scrollTop - main.clientHeight > 100)
        setShowScrollButton(true);
      else setShowScrollButton(false);
    };

    main.addEventListener("scroll", handleScroll);
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId);
    }
  }, [currentChatId]);

  // ===== HELPERS =====
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function formatTime(date) {
    if (!date) return "";
    if (typeof date === "object" && date.toDate) {
      date = date.toDate();
    }
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ===== HANDLERS =====
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

  async function startNewChat() {
    await createNewChat();
  }

  async function selectChat(chatId) {
    setCurrentChatId(chatId);
    setSidebarOpen(false);
  }

  async function handleSubmit() {
    if (!input.trim() || !currentChatId) return;

    const userMessage = {
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(currentChatId, userMessage);

    setIsLoading(true);
    try {
      const response = await generateEchoResponse(userMessage.text);
      await simulateTypewriter(response);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = {
        text: "I'm having trouble responding right now. Please try again.",
        sender: "system",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessage(currentChatId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // ===== API LOGIC =====
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
      response = `${generateSparkInsight()}\n${response}`;
    }

    if (userMessage.toLowerCase().includes("remember")) {
      response += `\n📌 Remembering: "${userMessage}"`;
    }

    if (userMessage.toLowerCase().includes("forget")) {
      response += "\n🗑️ I've cleared my temporary memory of our conversation.";
    }

    return response;
  }

  // ===== UTILITIES =====
  function getMemoryTags() {
    return messages
      .filter((msg) => msg.text.includes("Remembering:"))
      .map(
        (msg) => msg.text.split("Remembering: ")[1]?.replace(/"/g, "") || ""
      );
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
    return sparkIdeas[Math.floor(Math.random() * sparkIdeas.length)] + "\n";
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
            { sender: "echo_typing", text: displayed, timestamp: new Date() },
          ];
        } else {
          return [
            ...prev,
            { sender: "echo_typing", text: displayed, timestamp: new Date() },
          ];
        }
      });
    }

    const aiMessage = {
      sender: "echo",
      text: displayed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev.slice(0, -1), aiMessage]);

    await saveMessage(currentChatId, aiMessage);
  }

  async function addMessage(text, sender) {
    const message = {
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    await saveMessage(currentChatId, message);
  }

  // ===== COPY FUNCTIONALITY =====
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ show: true, message: "Copied to clipboard!" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    });
  };

  // ===== MARKDOWN RENDERER =====
  function MessageContent({ text, sender }) {
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

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`md:hidden fixed z-20 top-4 left-4 p-2 rounded-full ${
          darkMode ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-10 w-64 h-full ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        } border-r ${
          darkMode ? "border-gray-700" : "border-gray-300"
        } transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={startNewChat}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition flex items-center justify-center"
          >
            <span>+</span> New Chat
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {loadingChats ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`p-3 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                } cursor-pointer hover:bg-gray-700/50 ${
                  currentChatId === chat.id
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-300"
                    : ""
                }`}
              >
                <div className="font-medium truncate">{chat.title}</div>
                <div
                  className={`text-sm truncate ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {chat.preview || "No messages yet"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className={`p-4 border-b ${
            darkMode
              ? "border-gray-700 bg-gray-800/50"
              : "border-gray-200 bg-white/50"
          } backdrop-blur-sm sticky top-0 z-10`}
        >
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
                      : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                {darkMode ? (
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
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
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
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="text-4xl mb-4">🧠</div>
                  <h2 className="text-2xl font-bold mb-2">Echo Brain v4.2</h2>
                  <p className="text-gray-500 max-w-md">
                    Start a new conversation or select an existing one from the
                    sidebar. I can help with reflection, logical analysis, or
                    creative exploration.
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 rounded-br-none"
                        : msg.sender === "echo_typing"
                        ? "bg-gray-700 rounded-bl-none animate-pulse"
                        : "bg-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.sender !== "user" && (
                      <div className="absolute -left-8 top-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-xs font-bold">
                        A
                      </div>
                    )}
                    {msg.sender === "user" && (
                      <div className="absolute -left-8 top-3 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                        U
                      </div>
                    )}
                    <div
                      className={`prose prose-invert max-w-none ${
                        msg.sender === "user" ? "text-white" : "text-gray-200"
                      }`}
                    >
                      <MessageContent text={msg.text} sender={msg.sender} />
                    </div>
                    <span className="text-xs opacity-60 mt-1 block text-right">
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.sender !== "user" && (
                      <button
                        onClick={() => copyToClipboard(msg.text)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200 group"
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
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span className="hidden group-hover:block absolute top-8 right-0 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Copy to clipboard
                        </span>
                      </button>
                    )}
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

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 right-4 p-2 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
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
              <polyline points="17 11 12 6 7 11"></polyline>
              <polyline points="17 18 12 13 7 18"></polyline>
            </svg>
          </button>
        )}

        {/* Footer */}
        {/* Footer */}
        {/* Footer */}
        <footer
          className={`p-4 border-t ${
            darkMode
              ? "border-gray-700 bg-gray-800/50"
              : "border-gray-200 bg-white/50"
          } backdrop-blur-sm sticky bottom-0`}
        >
          <div className="container mx-auto max-w-3xl">
            <div className="flex flex-col space-y-3">
              {/* Input Area */}
              <div className="relative">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (currentChatId) handleSubmit();
                    }
                  }}
                  placeholder={
                    currentChatId
                      ? "Type your reflection... Try: 'Explain quantum physics' or 'How do I feel better today?'"
                      : "Type your message, then select or create a chat to send"
                  }
                  className={`w-full p-3 pr-12 ${
                    darkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-gray-100 border-gray-300"
                  } border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 resize-none min-h-[60px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800`}
                  rows={1}
                  style={{
                    height: "auto",
                    minHeight: "60px",
                    maxHeight: "200px",
                  }}
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (!currentChatId) {
                      setToast({
                        show: true,
                        message: "Please select or create a chat first",
                      });
                      setTimeout(
                        () => setToast({ show: false, message: "" }),
                        2000
                      );
                      return;
                    }
                    handleSubmit();
                  }}
                  disabled={isLoading || !input.trim()}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                    isLoading || !input.trim()
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-purple-400 hover:text-white cursor-pointer"
                  } transition-colors`}
                  title={!currentChatId ? "Select or create a chat first" : ""}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${isLoading ? "animate-spin" : ""}`}
                  >
                    {isLoading ? (
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="3"
                        strokeDasharray="42"
                        strokeDashoffset="16"
                      />
                    ) : (
                      <>
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </>
                    )}
                  </svg>
                </button>
              </div>

              {/* Counter and Mode Info */}
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {input.length > 0 && (
                    <span className={input.length > 2000 ? "text-red-400" : ""}>
                      {input.length}/2000
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <div className="flex space-x-1 text-xs text-gray-500">
                    <span>Mode:</span>
                    <span className="capitalize">{mode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification */}
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}
