import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDoDrW4HV04xX1UgghOTPyVfg7z66oaN08",
  authDomain: "azari-solar-fb3e7.firebaseapp.com",
  projectId: "azari-solar-fb3e7",
  storageBucket: "azari-solar-fb3e7.firebasestorage.app",
  messagingSenderId: "400363778126",
  appId: "1:400363778126:web:ac2307343b0257e308131f",
  measurementId: "G-EHHQ45EHLF"
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
