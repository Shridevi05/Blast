// script.js

document.addEventListener("DOMContentLoaded", () => {
  // 🌙 Theme Toggle
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }

  // 💌 Guestbook Form Logic
  const form = document.getElementById("wishForm");
  const wishList = document.getElementById("wishList");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const wish = document.getElementById("wish").value.trim();

      if (name && wish) {
        const entry = document.createElement("div");
        entry.innerHTML = `<strong>${name}:</strong> ${wish}`;
        wishList.appendChild(entry);
        form.reset();
      }
    });
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

// 🎊 Confetti Blast
function confettiBlast() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 50,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: Math.random() - 0.2,
      },
      ...defaults,
    });
  }, 250);
}

// 🖼️ Slideshow for Gallery
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll(".slide");
  slides.forEach(slide => slide.style.display = "none");
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 3000); // Change image every 3 sec
}
