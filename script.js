// script.js (FULLY UPDATED)

import { db, storage } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// 🌙 Toggle Theme
export function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

// 🎉 Confetti
export function fireConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

// 💌 Submit a Wish
window.submitWish = async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("wish").value.trim();
  const file = document.getElementById("wishImage").files[0];
  const flower = document.querySelector('input[name="flower"]:checked')?.value || "";

  if (!name || !message) return alert("Please enter both name and message");

  let imageUrl = "";
  if (file) {
    const imgRef = ref(storage, `wishImages/${Date.now()}_${file.name}`);
    await uploadBytes(imgRef, file);
    imageUrl = await getDownloadURL(imgRef);
  }

  await addDoc(collection(db, "wishes"), {
    name,
    message,
    flower,
    imageUrl,
    timestamp: new Date().toISOString()
  });

  document.getElementById("confirmation").innerHTML = "🎉 Thank you for your wish! 🎉";
  document.getElementById("yourWish").innerHTML = `<p><b>${name}:</b> ${message}</p>`;
  fireConfetti();
}

// 📖 Load Wishes (Admin or Public)
window.loadAllWishes = async function (isAdmin = false) {
  const container = document.getElementById("wishList");
  const snapshot = await getDocs(collection(db, "wishes"));
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = "<p>No wishes yet!</p>";
    return;
  }

  snapshot.forEach(docSnap => {
    const w = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `<p><b>${w.name}</b>: ${w.message}<br><i>${w.flower}</i></p>`;

    if (w.imageUrl) {
      const img = document.createElement("img");
      img.src = w.imageUrl;
      img.style.maxWidth = "200px";
      div.appendChild(img);
    }

    if (isAdmin) {
      const btn = document.createElement("button");
      btn.textContent = "❌ Delete";
      btn.onclick = async () => {
        await deleteDoc(doc(db, "wishes", docSnap.id));
        loadAllWishes(true);
      };
      div.appendChild(btn);
    }

    div.innerHTML += "<hr>";
    container.appendChild(div);
  });
};

// 📸 Gallery View Image
window.viewImg = function (src, index) {
  const lightbox = document.getElementById("lightbox");
  const fullImg = document.getElementById("fullImg");
  fullImg.src = src;
  lightbox.dataset.index = index;
  lightbox.style.display = "flex";
};

window.prevImg = function () {
  let index = parseInt(document.getElementById("lightbox").dataset.index);
  const images = Array.from(document.querySelectorAll(".gallery img"));
  index = (index - 1 + images.length) % images.length;
  viewImg(images[index].src, index);
};

window.nextImg = function () {
  let index = parseInt(document.getElementById("lightbox").dataset.index);
  const images = Array.from(document.querySelectorAll(".gallery img"));
  index = (index + 1) % images.length;
  viewImg(images[index].src, index);
};

// 📤 Upload New Gallery Image
window.uploadGalleryImage = async function () {
  const file = document.getElementById("galleryInput").files[0];
  if (!file) return alert("No file selected");

  const imgRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);

  const gallery = document.querySelector(".gallery");
  const index = gallery.querySelectorAll("img").length;
  const img = document.createElement("img");
  img.src = url;
  img.onclick = () => viewImg(url, index);
  gallery.appendChild(img);
};
