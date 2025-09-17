// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDGjuvvGtKT33757mn-dZm1chXmAzXo7AQ",
  authDomain: "ecommerce-light-6b249.firebaseapp.com",
  projectId: "ecommerce-light-6b249",
  storageBucket: "ecommerce-light-6b249.firebasestorage.app",
  messagingSenderId: "733418563422",
  appId: "1:733418563422:web:57d7c0ef2a5ec5593ad1cf",
  measurementId: "G-5LB25CKGEY"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize analytics only if supported
export let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}