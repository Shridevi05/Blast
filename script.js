// script.js

// Load Firebase (from CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyAutCW6wbbqqoQ9xFmoUQ94tOfetlmYiu8",
  authDomain: "birthdayguestbook.firebaseapp.com",
  projectId: "birthdayguestbook",
  storageBucket: "birthdayguestbook.firebasestorage.app",
  messagingSenderId: "546499033317",
  appId: "1:546499033317:web:6d5628d0fa688537147c0c",
  measurementId: "G-KLF16SE0XS"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generate or get unique visitor ID
let visitorId = localStorage.getItem("visitorId");
if (!visitorId) {
  visitorId = crypto.randomUUID();
  localStorage.setItem("visitorId", visitorId);
}

// DOM ready
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("wishForm");
  const wishList = document.getElementById("wishList");

  if (form && wishList) {
    // Handle form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const wish = document.getElementById("wish").value.trim();

      if (!name || !wish) return;

      try {
        await addDoc(collection(db, "wishes"), {
          name,
          wish,
          visitorId,
          timestamp: Date.now()
        });

        // Show their wish immediately
        wishList.innerHTML = `<strong>${name}:</strong> ${wish}`;
        form.reset();
      } catch (err) {
        console.error("Failed to save wish:", err);
        alert("Something went wrong. Try again later!");
      }
    });

    // Show existing wish if already submitted
    const q = query(collection(db, "wishes"), where("visitorId", "==", visitorId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      wishList.innerHTML = `<strong>${data.name}:</strong> ${data.wish}`;
    });
  }
});
