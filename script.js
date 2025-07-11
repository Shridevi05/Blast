// script.js

document.addEventListener("DOMContentLoaded", async () => {
  // 🌙 Theme Toggle
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }

  // 🔥 Firebase setup
  const firebaseConfig = {
    apiKey: "AIzaSyAutCW6wbbqqoQ9xFmoUQ94tOfetlmYiu8",
    authDomain: "birthdayguestbook.firebaseapp.com",
    projectId: "birthdayguestbook",
    storageBucket: "birthdayguestbook.firebasestorage.app",
    messagingSenderId: "546499033317",
    appId: "1:546499033317:web:6d5628d0fa688537147c0c",
    measurementId: "G-KLF16SE0XS"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // 💌 Guestbook form logic
  const form = document.getElementById("wishForm");
  const wishList = document.getElementById("wishList");

  if (form && wishList) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const wish = document.getElementById("wish").value.trim();

      if (name && wish) {
        try {
          const docRef = await db.collection("wishes").add({
            name,
            wish,
            timestamp: new Date()
          });
          localStorage.setItem("myWishId", docRef.id);
          showOwnWishOnly();
          form.reset();
        } catch (error) {
          console.error("Error saving wish:", error);
        }
      }
    });

    async function showOwnWishOnly() {
      const id = localStorage.getItem("myWishId");
      if (id) {
        const doc = await db.collection("wishes").doc(id).get();
        if (doc.exists) {
          const data = doc.data();
          wishList.innerHTML = `<strong>${data.name}:</strong> ${data.wish}`;
        }
      }
    }

    showOwnWishOnly();
  }

  // 🎂 Celebration Page (Cake Layers, Message, Confetti)
  if (document.querySelector(".cake")) {
    startCelebration();
  }

  // 📸 Gallery Autoplay
  if (document.getElementById("slideshow")) {
    showSlides();
  }
});

// 🎉 Celebration Logic
function startCelebration() {
  const layers = document.querySelectorAll(".layer");
  const candle = document.querySelector(".candle");
  const flame = document.getElementById("flame");
  const message = document.getElementById("message");

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
    message.innerText = `Dear Me,\n\nHappy 20th Birthday! 🎂💖\n\nToday, I want to take a moment to appreciate myself — not just for growing older, but for growing stronger, kinder, wiser, and more loving.\n\nI’m proud of how far I’ve come — through every challenge I’ve faced, every tear I’ve wiped, and every smile I’ve shared. I’ve learned, I’ve struggled, I’ve laughed, and I’ve bloomed. 🌸\n\nThis year, I promise to keep showing up for myself. To protect my peace, honor my boundaries, and keep dreaming big. Because I deserve joy, success, and love — especially from myself.\n\nHere’s to more soft moments, wild dreams, and beautiful memories.\n\nWith all my love,\nMe 💕`;
  }, layers.length * 800 + 1500);
}

// 🎊 Confetti Blast
function confettiBlast() {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    confetti({
      particleCount: 50,
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      ...defaults,
    });
  }, 250);
}

// 🖼️ Slideshow for Gallery
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide) => (slide.style.display = "none"));
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000);
}
