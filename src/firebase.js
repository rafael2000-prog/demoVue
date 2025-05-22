import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAu7uwsoFmEc9VFkkPbN3zIbCbjnI2RrY0",
  authDomain: "demovuers.firebaseapp.com",
  projectId: "demovuers",
  storageBucket: "demovuers.firebasestorage.app",
  messagingSenderId: "897416497504",
  appId: "1:897416497504:web:7be02c1ae943b1516cf605"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };