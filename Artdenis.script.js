// Artdenis.script.js

const projects = {
  p1: {
    title: "Projet 1",
    images: [
      "ressource_Artdenis/20240303_173119.jpg",
      "ressource_Artdenis/20240303_173121.jpg",
      "ressource_Artdenis/DSC_7770.jpg",
      "ressource_Artdenis/DSC_7774.jpg",
    ],
  },
  p2: {
    title: "Projet 2",
    images: [
      "ressource_Artdenis/20240303_173148.jpg",
      "ressource_Artdenis/20240313_104621.jpg",
      "ressource_Artdenis/DSC_775.jpg",
      "ressource_Artdenis/apres/apres4.jpg",
    ],
  },
  p3: {
    title: "Projet 3",
    images: [
      "ressource_Artdenis/20240313_104647.jpg",
      "ressource_Artdenis/20240313_104709.jpg",
      "ressource_Artdenis/apres/apres5.jpg",
      "ressource_Artdenis/apres/apres6.jpg",
    ],
  },
  p4: {
    title: "Projet 4",
    images: [
      "ressource_Artdenis/20240313_104713.jpg",
      "ressource_Artdenis/DSC_7770.jpg",
      "ressource_Artdenis/apres/apres7.jpg",
      "ressource_Artdenis/apres/apres8.jpg",
    ],
  },
};

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalCarrousel = document.getElementById("modalCarrousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const viewer = document.getElementById("imgViewer");
const viewerImg = document.getElementById("viewerImg");

let currentProject = null;
let currentIndex = 0;

function openModal(projectKey, startIndex = 0) {
  const p = projects[projectKey];
  if (!p) return;

  currentProject = projectKey;
  currentIndex = Math.max(0, Math.min(startIndex, p.images.length - 1));

  modalTitle.textContent = p.title;

  // Render slides
  modalCarrousel.innerHTML = p.images
    .map(
      (src, i) => `
      <button class="modal-slide" type="button" data-index="${i}" aria-label="Ouvrir image ${i + 1}">
        <img src="${src}" alt="${p.title} - image ${i + 1}">
      </button>
    `
    )
    .join("");

  // Open modal
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  // Scroll to current
  scrollToIndex(currentIndex);
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  currentProject = null;
}

function scrollToIndex(idx) {
  const slide = modalCarrousel.querySelector(`.modal-slide[data-index="${idx}"]`);
  if (slide) slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function next() {
  if (!currentProject) return;
  const len = projects[currentProject].images.length;
  currentIndex = (currentIndex + 1) % len;
  scrollToIndex(currentIndex);
}

function prev() {
  if (!currentProject) return;
  const len = projects[currentProject].images.length;
  currentIndex = (currentIndex - 1 + len) % len;
  scrollToIndex(currentIndex);
}

function openViewer(src, alt = "Image en grand") {
  viewerImg.src = src;
  viewerImg.alt = alt;
  viewer.classList.add("is-open");
  viewer.setAttribute("aria-hidden", "false");
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
  viewerImg.src = "";
}

// Click: open project (button)
document.addEventListener("click", (e) => {
  const openBtn = e.target.closest(".open-project");
  if (openBtn) {
    openModal(openBtn.dataset.project, 0);
    return;
  }

  // Click: thumbnail
  const thumb = e.target.closest(".thumb");
  if (thumb) {
    openModal(thumb.dataset.project, Number(thumb.dataset.index || 0));
    return;
  }

  // Close modal
  const closeModalEl = e.target.closest('[data-close="modal"]');
  if (closeModalEl) {
    closeModal();
    return;
  }

  // Click image in modal -> open viewer
  const modalSlide = e.target.closest(".modal-slide");
  if (modalSlide && currentProject) {
    const idx = Number(modalSlide.dataset.index || 0);
    const src = projects[currentProject].images[idx];
    openViewer(src, `${projects[currentProject].title} - image ${idx + 1}`);
    return;
  }

  // Close viewer
  const closeViewerEl = e.target.closest('[data-close="viewer"]');
  if (closeViewerEl) {
    closeViewer();
    return;
  }
});

// Buttons
nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

// Keyboard
document.addEventListener("keydown", (e) => {
  if (viewer.classList.contains("is-open")) {
    if (e.key === "Escape") closeViewer();
    return;
  }
  if (!modal.classList.contains("is-open")) return;

  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});
