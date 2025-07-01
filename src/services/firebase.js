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
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

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
const auth = getAuth(app);

// Auth functions
const provider = new GoogleAuthProvider();
export function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}
export function signOutUser() {
  return signOut(auth);
}
export function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
export function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export { auth, onAuthStateChanged };

export { app, db };

// User-scoped chat functions
export async function fetchChats(userId) {
  try {
    const chatsRef = collection(db, "users", userId, "chats");
    const q = query(chatsRef, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}

export async function loadMessages(userId, chatId) {
  try {
    const messagesRef = collection(
      db,
      "users",
      userId,
      "chats",
      chatId,
      "messages"
    );
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

export async function saveMessage(userId, chatId, message) {
  try {
    const messagesRef = collection(
      db,
      "users",
      userId,
      "chats",
      chatId,
      "messages"
    );
    await setDoc(doc(messagesRef), {
      ...message,
      timestamp: serverTimestamp(),
    });
    // Update chat's last message and timestamp
    const chatRef = doc(db, "users", userId, "chats", chatId);
    await updateDoc(chatRef, {
      preview: message.text.slice(0, 50),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
}

export async function createNewChat(userId) {
  try {
    const newChatRef = doc(collection(db, "users", userId, "chats"));
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
    return newChatRef.id;
  } catch (error) {
    console.error("Error creating new chat:", error);
    return null;
  }
}
