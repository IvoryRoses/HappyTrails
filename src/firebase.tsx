// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD0rLv64yHzllcRrdqDSz9R6iDhZRXVp0",
  authDomain: "happytrails-project.firebaseapp.com",
  projectId: "happytrails-project",
  storageBucket: "happytrails-project.appspot.com",
  messagingSenderId: "973218191200",
  appId: "1:973218191200:web:71ad37f7a545efac267005",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
