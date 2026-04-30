// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkIW5knpnf4h0wBZg5EKeVHsoeJT2xJ-w",
  authDomain: "azari-solar.firebaseapp.com",
  projectId: "azari-solar",
  storageBucket: "azari-solar.firebasestorage.app",
  messagingSenderId: "117381532618",
  appId: "1:117381532618:web:1e154ada09687dcc015d33",
  measurementId: "G-WRTF9Z95CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);