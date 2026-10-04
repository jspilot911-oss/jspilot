import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD12rjxxSb8hRGEnPi7M5P7ReDsRHCgIIA",
    authDomain: "jspilot-fe502.firebaseapp.com",
    projectId: "jspilot-fe502",
    storageBucket: "jspilot-fe502.firebasestorage.app",
    messagingSenderId: "499565173763",
    appId: "1:499565173763:web:7cd4d0d100ab4cb76ac236"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);