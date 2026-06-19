// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 🌟 Ativa o módulo de login real

// Configuração oficial obtida no console do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjMxpCqUQNOlaR6_hOkLq1GKGl9l6ZEqU",
  authDomain: "mars-cervejaria-df1ac.firebaseapp.com",
  databaseURL: "https://mars-cervejaria-df1ac-default-rtdb.firebaseio.com",
  projectId: "mars-cervejaria-df1ac",
  storageBucket: "mars-cervejaria-df1ac.firebasestorage.app",
  messagingSenderId: "707824888834",
  appId: "1:707824888834:web:9937a46087ac3339a4cb1b"
};

// Inicializa a aplicação Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias prontas para uso nos componentes
export const db = getFirestore(app);
>>>>>>> 5218563f7dcd7c9ce44518cef0a4e5493f9d81e7
export const auth = getAuth(app); // 🌟 Exportado para o seu App.js usar no login