import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Toast from "./Toast";
import ChatWindow from "./ChatWindow";
import Footer from "./Footer";
import useLongPress from "./hooks/useLongPress";
import { scrollToBottom, formatTime } from "./utils";
import {
  fetchChats,
  loadMessages,
  saveMessage,
  createNewChat,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  auth,
  onAuthStateChanged,
} from "./services/firebase";
import { sendToEchoBrain } from "./services/echoBrainAPI";
import LoginPage from "./LoginPage";
import Cookies from "js-cookie";

export default function Chat() {
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
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const messagesEndRef = useRef(null);
  const useLongPressHook = (text) =>
    useLongPress(() => copyToClipboard(text), 500);
  const [showChat, setShowChat] = useState(false);

  // ===== AUTH LOGIC =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        Cookies.set("session", firebaseUser.uid, { expires: 7 });
        setShowChat(true);
      } else {
        setUser(null);
        Cookies.remove("session");
        setShowChat(false);
      }
    });
    // On mount, check for session cookie
    if (Cookies.get("session")) {
      setShowChat(true);
    }
    return () => unsubscribe();
  }, []);

  const handleLoginWithEmail = async (email, password) => {
    setAuthError("");
    try {
      await signInWithEmail(email, password);
    } catch (e) {
      setAuthError(e.message);
    }
  };

  const handleSignup = async (email, password) => {
    setAuthError("");
    try {
      await signUpWithEmail(email, password);
    } catch (e) {
      setAuthError(e.message);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setShowChat(false);
    Cookies.remove("session");
  };

  // ===== FIREBASE FUNCTIONS =====
  const fetchChatsCallback = useCallback(async () => {
    if (!user) return;
    setLoadingChats(true);
    const chats = await fetchChats(user.uid);
    setChatHistory(chats);
    if (chats.length > 0 && !currentChatId) {
      setCurrentChatId(chats[0].id);
      loadMessagesCallback(chats[0].id);
    }
    setLoadingChats(false);
  }, [currentChatId, user]);

  const loadMessagesCallback = useCallback(
    async (chatId) => {
      if (!user) return;
      const loadedMessages = await loadMessages(user.uid, chatId);
      setMessages(loadedMessages);
    },
    [user]
  );

  const saveMessageCallback = async (chatId, message) => {
    if (!user) return;
    await saveMessage(user.uid, chatId, message);
  };

  const createNewChatCallback = async () => {
    if (!user) return;
    const newChatId = await createNewChat(user.uid);
    await fetchChatsCallback();
    setCurrentChatId(newChatId);
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
    return newChatId;
  };

  // ===== EFFECTS =====
  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const handleScroll = () => {
      if (main.scrollHeight - main.scrollTop - main.clientHeight > 100)
        setShowScrollButton(true);
      else setShowScrollButton(false);
    };
    main.addEventListener("scroll", handleScroll);
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showChat) fetchChatsCallback();
  }, [fetchChatsCallback, showChat]);

  useEffect(() => {
    if (currentChatId) {
      loadMessagesCallback(currentChatId);
    }
  }, [currentChatId, loadMessagesCallback]);

  // ===== HANDLERS =====
  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function handleInputKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (currentChatId) handleSubmit();
    }
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    addMessage(`🧠 Switched to ${newMode} mode.`, "system");
  }

  async function startNewChat() {
    await createNewChatCallback();
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
    await saveMessageCallback(currentChatId, userMessage);
    setIsLoading(true);
    try {
      const response = await generateEchoResponse(userMessage.text);
      const aiMessage = {
        text: response,
        sender: "echo",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      await saveMessageCallback(currentChatId, aiMessage);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = {
        text: "I'm having trouble responding right now. Please try again.",
        sender: "system",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessageCallback(currentChatId, errorMessage);
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

  async function addMessage(text, sender) {
    const message = {
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    await saveMessageCallback(currentChatId, message);
  }

  // ===== COPY FUNCTIONALITY =====
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ show: true, message: "Copied to clipboard!" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    });
  };

  // ===== RENDER =====
  if (!showChat) {
    return (
      <LoginPage
        onLoginWithEmail={handleLoginWithEmail}
        onSignup={handleSignup}
        error={authError}
      />
    );
  }

  // Overlay for mobile sidebar
  const showSidebarOverlay =
    sidebarOpen && typeof window !== "undefined" && window.innerWidth < 768;

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
      {/* Sidebar Overlay for mobile */}
      {showSidebarOverlay && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
      {/* Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        loadingChats={loadingChats}
        onSelectChat={selectChat}
        onStartNewChat={startNewChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center">
          <Header
            mode={mode}
            onModeChange={handleModeChange}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <button
            onClick={handleLogout}
            className="mr-6 px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl shadow hover:scale-105 transition-all"
          >
            Logout
          </button>
        </div>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          darkMode={darkMode}
          copyToClipboard={copyToClipboard}
          formatTime={formatTime}
          messagesEndRef={messagesEndRef}
          showScrollButton={showScrollButton}
          scrollToBottom={() => scrollToBottom(messagesEndRef)}
        />
        <Footer
          input={input}
          onInputChange={handleInputChange}
          onInputKeyDown={handleInputKeyDown}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          currentChatId={currentChatId}
          darkMode={darkMode}
          setToast={setToast}
          mode={mode}
        />
      </div>
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}
