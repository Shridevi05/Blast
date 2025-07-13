// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJrNYlEXtr_GKzrogswc4_ibVmKIMFm4U",
  authDomain: "shridevi-birthday.firebaseapp.com",
  projectId: "shridevi-birthday",
  storageBucket: "shridevi-birthday.appspot.com",
  messagingSenderId: "517212932619",
  appId: "1:517212932619:web:da82fc7ca2046a140e950e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
