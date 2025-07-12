// 🌙 Dark Mode Toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

// 💌 Submit Wish and Store in LocalStorage
function submitWish(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const wish = document.getElementById("wish").value.trim();
  if (!name || !wish) return;

  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  wishes.push({ name, message: wish, timestamp: new Date().toLocaleString() });
  localStorage.setItem("wishes", JSON.stringify(wishes));

  document.getElementById("confirmation").innerHTML = "🎉 Thank you for your wish! 🎉";
  document.getElementById("yourWish").innerHTML = `<p><b>${name}:</b> ${wish}</p>`;

  confetti(); // Launch confetti
}

// 📖 Load All Wishes for Admin View
function loadAllWishes() {
  const container = document.getElementById("wishList");
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  container.innerHTML = "";
  wishes.reverse().forEach(w => {
    const div = document.createElement("div");
    div.innerHTML = `<p><b>${w.name}</b> (${w.timestamp}):<br>${w.message}</p><hr>`;
    container.appendChild(div);
  });
}

// 📸 Lightbox Gallery
function viewImg(src) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("fullImg").src = src;
}

// 🧨 Confetti Blast
function fireConfetti() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
}
