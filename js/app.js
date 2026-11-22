const ZANDLE_CATALOG = [
  { id: 1, name: "Lavender Bliss", price: 65000, category: "Floral", image: "assets/images/katalog-candle1.png", url: "katalog.html" },
  { id: 2, name: "Lemon Grass Calm", price: 70000, category: "Citrus & Fresh", image: "assets/images/katalog-candle2.png", url: "katalog.html" },
  { id: 3, name: "Cinnamon Warmth", price: 65000, category: "Warm & Spicy", image: "assets/images/katalog-candle3.png", url: "katalog.html" },
  { id: 4, name: "Pure Soy Signature", price: 25000, category: "Floral", image: "assets/images/candle-white.png", url: "katalog.html" },
  { id: 5, name: "Matcha Breeze", price: 50000, category: "Citrus & Fresh", image: "assets/images/candle-green.png", url: "katalog.html" },
  { id: 6, name: "Citrus Therapy", price: 70000, category: "Citrus & Fresh", image: "assets/images/candle-yellow.png", url: "katalog.html" },
  { id: 7, name: "Lilin Custom Racik Sendiri", price: 75000, category: "Kustom", image: "assets/images/candle-green.png", url: "kustomisasi.html" }
];

function initGlobalUI() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const navCenter = document.getElementById("navCenter");
  if (menuBtn && navCenter) {
    menuBtn.addEventListener("click", () => {
      navCenter.classList.toggle("open");
    });
  }

  const searchBtn = document.getElementById("searchBtn");
  const searchModal = document.getElementById("searchModal");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.add("open");
    if (searchInput) {
      searchInput.value = "";
      renderSearchResults("");
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.remove("open");
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openSearch();
    });
  }

  if (searchClose) {
    searchClose.addEventListener("click", closeSearch);
  }

  if (searchModal) {
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchModal && searchModal.classList.contains("open")) {
      closeSearch();
    }
  });

  function renderSearchResults(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    const matched = q ? ZANDLE_CATALOG.filter(it => it.name.toLowerCase().includes(q) || it.category.toLowerCase().includes(q)) : ZANDLE_CATALOG.slice(0, 4);
    if (!matched.length) {
      searchResults.innerHTML = `<div class="search-hint">Tidak ada lilin yang cocok dengan "${query}".</div>`;
      return;
    }
    searchResults.innerHTML = matched.map(it => `
      <a href="${it.url}" class="search-result-item">
        <div class="search-result-thumb">
          <img src="${it.image}" alt="${it.name}">
        </div>
        <div class="search-result-meta">
          <h5>${it.name}</h5>
          <p>${it.category}</p>
        </div>
        <div class="search-result-price">Rp ${it.price.toLocaleString("id-ID")}</div>
      </a>
    `).join("");
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });
  }

  renderSearchResults("");
}

function showToast(msg) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

document.addEventListener("DOMContentLoaded", initGlobalUI);
