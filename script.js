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

  fireConfetti(); // Launch confetti
}

// 📖 Load All Wishes (for message.html or admin.html)
function loadAllWishes(isAdmin = false) {
  const container = document.getElementById("wishList");
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  container.innerHTML = "";

  if (wishes.length === 0) {
    container.innerHTML = "<p>No wishes yet!</p>";
    return;
  }

  wishes.reverse().forEach((w, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><b>${w.name}</b> (${w.timestamp}):<br>${w.message}</p>`;

    if (isAdmin) {
      const btn = document.createElement("button");
      btn.textContent = "❌ Delete";
      btn.style.marginLeft = "10px";
      btn.onclick = () => deleteWish(index);
      div.appendChild(btn);
    }

    div.innerHTML += "<hr>";
    container.appendChild(div);
  });
}

// ❌ Delete a wish (admin only)
function deleteWish(index) {
  if (confirm("Are you sure you want to delete this wish?")) {
    const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
    wishes.reverse(); // Match display order
    wishes.splice(index, 1);
    wishes.reverse();
    localStorage.setItem("wishes", JSON.stringify(wishes));
    loadAllWishes(true);
  }
}

// 📸 Lightbox Gallery
function viewImg(src) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("fullImg").src = src;
}

// 🧨 Confetti Blast
function fireConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }
}
