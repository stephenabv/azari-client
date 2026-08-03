const firebaseConfig = {
  apiKey: "AIzaSyDoDrW4HV04xX1UgghOTPyVfg7z66oaN08",
  authDomain: "azari-solar-fb3e7.firebaseapp.com",
  projectId: "azari-solar-fb3e7",
  storageBucket: "azari-solar-fb3e7.firebasestorage.app",
  messagingSenderId: "400363778126",
  appId: "1:400363778126:web:ac2307343b0257e308131f",
  measurementId: "G-EHHQ45EHLF",
};

let _analyticsPromise: Promise<import("firebase/analytics").Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<import("firebase/analytics").Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (_analyticsPromise) return _analyticsPromise;

  _analyticsPromise = (async () => {
    const [{ initializeApp, getApps }, { getAnalytics, isSupported }] = await Promise.all([
      import("firebase/app"),
      import("firebase/analytics"),
    ]);
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const supported = await isSupported();
    return supported ? getAnalytics(app) : null;
  })();

  return _analyticsPromise;
}
