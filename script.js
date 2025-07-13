// 🌙 Dark Mode Toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

// 💌 Submit Wish and Store in LocalStorage
function submitWish(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const wish = document.getElementById("wish").value.trim();
  const flower = document.getElementById("flower").value;
  const imageInput = document.getElementById("wishImage");
  let imageUrl = "";

  if (imageInput.files[0]) {
    const reader = new FileReader();
    reader.onloadend = () => {
      imageUrl = reader.result;
      saveWish(name, wish, flower, imageUrl);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveWish(name, wish, flower, "");
  }
}

function saveWish(name, wish, flower, imageUrl) {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  wishes.push({ name, message: wish, flower, imageUrl, timestamp: new Date().toLocaleString() });
  localStorage.setItem("wishes", JSON.stringify(wishes));

  document.getElementById("confirmation").innerHTML = "🎉 Thank you for your wish!";
  document.getElementById("yourWish").innerHTML = `<p><b>${name}:</b> ${wish} ${flower}<br>${imageUrl ? `<img src="${imageUrl}" class="wish-img">` : ""}</p>`;
  fireConfetti();
}

// 📖 Load All Wishes
function loadAllWishes(isAdmin = false) {
  const container = document.getElementById("wishList");
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  container.innerHTML = "";

  if (wishes.length === 0) {
    container.innerHTML = "<p>No wishes yet!</p>";
    return;
  }

  wishes.forEach((w, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><b>${w.name}</b> (${w.timestamp}):<br>${w.message} ${w.flower || ""}<br>${w.imageUrl ? `<img src="${w.imageUrl}" class="wish-img">` : ""}</p>`;
    if (isAdmin) {
      const btn = document.createElement("button");
      btn.textContent = "❌ Delete";
      btn.onclick = () => deleteWish(index);
      div.appendChild(btn);
    }
    div.innerHTML += "<hr>";
    container.appendChild(div);
  });
}

// ❌ Delete Wish (Admin Only)
function deleteWish(index) {
  if (confirm("Are you sure you want to delete this wish?")) {
    const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
    wishes.splice(index, 1);
    localStorage.setItem("wishes", JSON.stringify(wishes));
    loadAllWishes(true);
  }
}

// 📸 Lightbox Viewer for Gallery
let currentImgIndex = 0;
function viewImg(src, index) {
  currentImgIndex = index;
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("fullImg").src = src;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function prevImg(event) {
  event.stopPropagation();
  const images = document.querySelectorAll(".gallery img");
  if (currentImgIndex > 0) currentImgIndex--;
  document.getElementById("fullImg").src = images[currentImgIndex].src;
}

function nextImg(event) {
  event.stopPropagation();
  const images = document.querySelectorAll(".gallery img");
  if (currentImgIndex < images.length - 1) currentImgIndex++;
  document.getElementById("fullImg").src = images[currentImgIndex].src;
}

// 🖼️ Handle Image Upload to Gallery
window.onload = () => {
  const input = document.getElementById("imgUpload");
  if (input) {
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const images = JSON.parse(localStorage.getItem("galleryImages")) || [];
          images.push(reader.result);
          localStorage.setItem("galleryImages", JSON.stringify(images));
          displayGallery();
        };
        reader.readAsDataURL(file);
      }
    });
    displayGallery();
  }
};

// 🖼️ Display Gallery Images
function displayGallery() {
  const images = JSON.parse(localStorage.getItem("galleryImages")) || [];
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  gallery.innerHTML = "";
  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => viewImg(src, i);
    gallery.appendChild(img);
  });
}

// 🎉 Confetti
function fireConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }
}
function addPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;

    // Save to localStorage
    let photos = JSON.parse(localStorage.getItem("galleryPhotos")) || [];
    photos.push(base64);
    localStorage.setItem("galleryPhotos", JSON.stringify(photos));

    // Add to gallery
    const img = document.createElement("img");
    img.src = base64;
    img.onclick = () => viewImg(base64);
    img.className = "gallery-img";
    document.getElementById("gallery").appendChild(img);
  };
  reader.readAsDataURL(file);
}

// Load custom uploaded photos
window.onload = function() {
  const storedPhotos = JSON.parse(localStorage.getItem("galleryPhotos")) || [];
  storedPhotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => viewImg(src);
    img.className = "gallery-img";
    document.getElementById("gallery").appendChild(img);
  });
};

