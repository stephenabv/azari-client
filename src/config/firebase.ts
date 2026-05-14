import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkIW5knpnf4h0wBZg5EKeVHsoeJT2xJ-w",
  authDomain: "azari-solar.firebaseapp.com",
  projectId: "azari-solar",
  storageBucket: "azari-solar.firebasestorage.app",
  messagingSenderId: "117381532618",
  appId: "1:117381532618:web:1e154ada09687dcc015d33",
  measurementId: "G-WRTF9Z95CQ"
};

const app = initializeApp(firebaseConfig);

let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
export const db = getFirestore(app);