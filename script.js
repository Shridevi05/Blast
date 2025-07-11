// 🔥 Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// 🎯 Identify visitor
let visitorId = localStorage.getItem("visitorId");
if (!visitorId) {
  visitorId = crypto.randomUUID();
  localStorage.setItem("visitorId", visitorId);
}

document.addEventListener("DOMContentLoaded", async () => {
  // 🌙 Theme Toggle
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }

  // 💌 Guestbook
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

        const entry = document.createElement("div");
        entry.innerHTML = `<strong>${name}:</strong> ${wish}`;
        wishList.innerHTML = "";
        wishList.appendChild(entry);
        form.reset();
        launchConfetti();
      } catch (err) {
        alert("Failed to save wish.");
        console.error(err);
      }
    });

    const q = query(collection(db, "wishes"), where("visitorId", "==", visitorId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const entry = document.createElement("div");
      entry.innerHTML = `<strong>${data.name}:</strong> ${data.wish}`;
      wishList.appendChild(entry);
    });
  }

  // 🎂 Celebration (cake)
  if (document.querySelector(".cake")) {
    startCelebration();
  }

  // 🖼️ Gallery slideshow
  if (document.getElementById("slideshow")) {
    showSlides();
  }
});

// 🎊 Confetti
function launchConfetti() {
  import("https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.module.mjs").then(({ default: confetti }) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  });
}

// 🎉 Cake Celebration
function startCelebration() {
  const layers = document.querySelectorAll('.layer');
  const candle = document.querySelector('.candle');
  const flame = document.getElementById('flame');
  const message = document.getElementById('message');

  layers.forEach((layer, i) => {
    setTimeout(() => {
      layer.style.opacity = 1;
    }, i * 800);
  });

  setTimeout(() => {
    candle.style.opacity = 1;
    flame.style.opacity = 1;
  }, layers.length * 800 + 500);

  setTimeout(() => {
    confettiBlast();
  }, layers.length * 800 + 800);

  setTimeout(() => {
    message.innerText = `Dear Me,

Happy 20th Birthday! 🎂💖

Today, I want to take a moment to appreciate myself — not just for growing older, but for growing stronger, kinder, wiser, and more loving.

I’m proud of how far I’ve come — through every challenge I’ve faced, every tear I’ve wiped, and every smile I’ve shared. I’ve learned, I’ve struggled, I’ve laughed, and I’ve bloomed. 🌸

This year, I promise to keep showing up for myself. To protect my peace, honor my boundaries, and keep dreaming big. Because I deserve joy, success, and love — especially from myself.

Here’s to more soft moments, wild dreams, and beautiful memories.

With all my love,
Me 💕`;
  }, layers.length * 800 + 1500);
}

// 🎂 Confetti Blast (Cake)
function confettiBlast() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    import("https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.module.mjs").then(({ default: confetti }) => {
      confetti({
        particleCount: 50,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2,
        },
        ...defaults,
      });
    });
  }, 250);
}

// 📸 Gallery autoplay
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll(".slide");
  slides.forEach(slide => slide.style.display = "none");
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000); // every 3 sec
}
