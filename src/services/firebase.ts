// firebase.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration

const API_KEY = import.meta.env.FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "1:473793975081:android:8c3738cbabad018c4ddd38.firebaseapp.com",
  projectId: "voiceflashcards-5607a",
  storageBucket: "voiceflashcards-5607a.appspot.com",
  messagingSenderId: "473793975081",
  appId: "1:473793975081:android:8c3738cbabad018c4ddd38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage, app };
