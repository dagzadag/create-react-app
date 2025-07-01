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

export { app, db };

export async function fetchChats(currentChatId, loadMessages) {
  try {
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

    if (chats.length > 0 && !currentChatId && loadMessages) {
      loadMessages(chats[0].id);
    }
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}

export async function loadMessages(chatId) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const querySnapshot = await getDocs(q);

    const loadedMessages = [];
    querySnapshot.forEach((doc) => {
      loadedMessages.push(doc.data());
    });

    return loadedMessages;
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
}

export async function saveMessage(chatId, message) {
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
}

export async function createNewChat(
  chatHistory,
  setChatHistory,
  setCurrentChatId,
  setMessages,
  setInput,
  setSidebarOpen
) {
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

    if (setChatHistory) setChatHistory([newChatWithId, ...(chatHistory || [])]);
    if (setCurrentChatId) setCurrentChatId(newChatRef.id);
    if (setMessages) setMessages([]);
    if (setInput) setInput("");
    if (setSidebarOpen) setSidebarOpen(false);

    return newChatRef.id;
  } catch (error) {
    console.error("Error creating new chat:", error);
    return null;
  }
}
