import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAutCW6wbbqqoQ9xFmoUQ94tOfetlmYiu8",
  authDomain: "birthdayguestbook.firebaseapp.com",
  projectId: "birthdayguestbook",
  storageBucket: "birthdayguestbook.firebasestorage.app",
  messagingSenderId: "546499033317",
  appId: "1:546499033317:web:6d5628d0fa688537147c0c",
  measurementId: "G-KLF16SE0XS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const wishList = document.getElementById("adminWishList");

async function showAllWishes() {
  const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "wish-box";
    div.innerHTML = `<strong>${data.name}:</strong><br>${data.wish}`;
    wishList.appendChild(div);
  });
}

showAllWishes();
