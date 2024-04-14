// api/firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyChrFIxe5YfCfIRD6Fzfq0z5NVWJL8epqY",
    authDomain: "transition-chat.firebaseapp.com",
    projectId: "transition-chat",
    storageBucket: "transition-chat.appspot.com",
    messagingSenderId: "1042379704022",
    appId: "1:1042379704022:web:d0cd900df0b1b8b3a5ab77",
    measurementId: "G-XWGR05CMXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;

// Conditionally initialize Firebase Analytics if supported
if (typeof window !== "undefined" && getAnalytics.isSupported()) {
  analytics = getAnalytics(app);
} else {
  console.warn("Firebase Analytics is not supported in this environment.");
}

export default app; // Export the app instance
export { analytics }; // Export the analytics instance