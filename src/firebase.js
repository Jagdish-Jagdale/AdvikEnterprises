// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBd-wx4sMvTYzpQz4XGSQx3V1tVVhj6mcE",
    authDomain: "advik-51f3c.firebaseapp.com",
    projectId: "advik-51f3c",
    storageBucket: "advik-51f3c.firebasestorage.app",
    messagingSenderId: "231219359245",
    appId: "1:231219359245:web:6ee08a72d74df8d8ca6f44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
export const storage = getStorage(app);