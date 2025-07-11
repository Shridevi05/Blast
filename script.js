import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

let visitorId = localStorage.getItem("visitorId");
if (!visitorId) {
  visitorId = crypto.randomUUID();
  localStorage.setItem("visitorId", visitorId);
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("wishForm");
  const wishList = document.getElementById("wishList");

  if (form && wishList) {
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

        wishList.innerHTML = `<strong>${name}:</strong> ${wish}`;
        form.reset();
        launchConfetti(); // 🎉
      } catch (err) {
        alert("Error saving wish.");
        console.error(err);
      }
    });

    const q = query(collection(db, "wishes"), where("visitorId", "==", visitorId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      wishList.innerHTML = `<strong>${data.name}:</strong> ${data.wish}`;
    });
  }
});

// 🎉 Confetti Function
function launchConfetti() {
  import("https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.module.mjs").then(({ default: confetti }) => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
    });
  });
}
