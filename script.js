// script.js (FINAL with Gallery + Guestbook Fixes)

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
  getDownloadURL,
  listAll
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

// 💌 Submit a Wish (with image + flower)
window.submitWish = async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("wish").value.trim();
  const file = document.getElementById("imageUpload")?.files[0];
  const flower = document.getElementById("flower")?.value || "";

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

  document.getElementById("confirmation").innerHTML =
    "🎉 Thank you for your lovely birthday wish! It truly made my day more special. 💖";
  document.getElementById("yourWish").innerHTML = `<p><b>${name}:</b> ${message}</p>`;
  fireConfetti();

  document.getElementById("name").value = "";
  document.getElementById("wish").value = "";
  if (document.getElementById("imageUpload")) document.getElementById("imageUpload").value = "";
  if (document.getElementById("flower")) document.getElementById("flower").value = "";
};

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
      img.style.display = "block";
      img.style.margin = "10px auto";
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

// 📸 Lightbox
window.viewImg = function (src, index) {
  const lightbox = document.getElementById("lightbox");
  const fullImg = document.getElementById("fullImg");
  fullImg.src = src;
  lightbox.dataset.index = index;
  lightbox.style.display = "flex";
};

window.hideLightbox = function () {
  document.getElementById("lightbox").style.display = "none";
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

// 📤 Upload to Firebase Gallery
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

  alert("✅ Image uploaded to gallery!");
};

// 🖼️ Load Local + Firebase Gallery Images
window.loadGalleryImages = async function () {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  for (let i = 1; i <= 8; i++) {
    const url = `img/photo${i}.jpg`;
    const img = document.createElement("img");
    img.src = url;
    img.alt = `Photo ${i}`;
    const index = gallery.querySelectorAll("img").length;
    img.onclick = () => viewImg(url, index);
    gallery.appendChild(img);
  }

  const listRef = ref(storage, "gallery");
  try {
    const result = await listAll(listRef);
    const urls = await Promise.all(result.items.map(item => getDownloadURL(item)));

    urls.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      const index = gallery.querySelectorAll("img").length;
      img.onclick = () => viewImg(url, index);
      gallery.appendChild(img);
    });
  } catch (error) {
    console.error("Error loading Firebase gallery:", error);
  }
};

// Auto-load for gallery.html
if (window.location.pathname.includes("gallery")) {
  loadGalleryImages();
}
