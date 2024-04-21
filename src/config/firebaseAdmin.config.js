// src/config/firebaseAdmin.config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyChrFIxe5YfCfIRD6Fzfq0z5NVWJL8epqY",
    authDomain: "transition-chat.firebaseapp.com",
    projectId: "transition-chat",
    storageBucket: "transition-chat.appspot.com",
    messagingSenderId: "1042379704022",
    appId: "1:1042379704022:web:d0cd900df0b1b8b3a5ab77",
    measurementId: "G-XWGR05CMXP"
};

const app = initializeApp(firebaseConfig);
let analytics;

if (typeof window !== "undefined" && getAnalytics.isSupported()) {
  analytics = getAnalytics(app);
} else {
  console.warn("Firebase Analytics is not supported in this environment.");
}

export default app;
export { analytics };
