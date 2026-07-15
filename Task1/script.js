const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let visibleImages = [];
let currentIndex = 0;

// Filter images by category
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const selectedCategory = button.dataset.filter;

    galleryItems.forEach((item) => {
      if (
        selectedCategory === "all" ||
        item.dataset.category === selectedCategory
      ) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

// Open lightbox
galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    visibleImages = Array.from(galleryItems).filter(
      (img) => !img.classList.contains("hidden")
    );

    currentIndex = visibleImages.indexOf(item);
    showImage(currentIndex);
    lightbox.classList.add("open");
  });
});

// Display selected image
function showImage(index) {
  const img = visibleImages[index].querySelector("img");
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove("open");
}

// Next image
function showNext() {
  currentIndex = (currentIndex + 1) % visibleImages.length;
  showImage(currentIndex);
}

// Previous image
function showPrev() {
  currentIndex =
    (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  showImage(currentIndex);
}

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

// Close when clicking outside the image
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard controls
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrev();
});