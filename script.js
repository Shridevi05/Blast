function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

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

  confetti();
}

function loadAllWishes() {
  const container = document.getElementById("wishList");
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  wishes.reverse().forEach(w => {
    const div = document.createElement("div");
    div.innerHTML = `<p><b>${w.name}</b> (${w.timestamp}):<br>${w.message}</p><hr>`;
    container.appendChild(div);
  });
}

function viewImg(src) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("fullImg").src = src;
}

function fireConfetti() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
}
