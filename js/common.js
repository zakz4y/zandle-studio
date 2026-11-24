




const ZANDLE_PRODUCTS = [
  {
    name: "Calm Lavender",
    category: "Floral",
    price: 45000,
    priceFormatted: "Rp 45.000",
    url: "product01.html",
    img: "assets/images/candle-white.png",
    desc: "Aroma menenangkan lavender alami"
  },
  {
    name: "Citrus Garden",
    category: "Citrus & Fresh",
    price: 75000,
    priceFormatted: "Rp 75.000",
    url: "product02.html",
    img: "assets/images/candle-green.png",
    desc: "Kesegaran jeruk & lemon menyegarkan"
  },
  {
    name: "Warm Vanilla Coffee",
    category: "Warm & Spicy",
    price: 120000,
    priceFormatted: "Rp 120.000",
    url: "product03.html",
    img: "assets/images/candle-yellow.png",
    desc: "Perpaduan vanilla manis dan kopi hangat"
  },
  {
    name: "Lavender Bliss",
    category: "Floral",
    price: 65000,
    priceFormatted: "Rp 65.000",
    url: "product01.html",
    img: "assets/images/katalog-candle1.png",
    desc: "Aromaterapi lavender murni premium"
  },
  {
    name: "Lemon Grass Calm",
    category: "Citrus & Fresh",
    price: 70000,
    priceFormatted: "Rp 70.000",
    url: "product02.html",
    img: "assets/images/katalog-candle2.png",
    desc: "Serai wangi pereda penat harian"
  },
  {
    name: "Cinnamon Warmth",
    category: "Warm & Spicy",
    price: 65000,
    priceFormatted: "Rp 65.000",
    url: "product03.html",
    img: "assets/images/katalog-candle3.png",
    desc: "Aroma kayu manis lembut menentramkan"
  }
];

function updateNavCartBadge() {
  const badge = document.getElementById("navCartCount");
  if (!badge) return;

  const saved = localStorage.getItem("zandle_cart");
  if (saved) {
    try {
      const items = JSON.parse(saved);
      if (Array.isArray(items)) {
        const totalQty = items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);
        badge.textContent = totalQty;
        return;
      }
    } catch (e) {
      
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  const profileToggle = document.getElementById("profileToggle");
  const profileMenu = document.getElementById("profileDropdownMenu");
  const profileBadge = document.querySelector(".user-badge");

  if (profileMenu) {
    if (profileBadge && profileToggle) {
      profileBadge.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    document.addEventListener("click", (e) => {
      if (profileToggle && !e.target.closest(".user-menu-wrapper")) {
        profileToggle.checked = false;
        profileMenu.classList.remove("show");
      }
    });
  }

  
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navCenter = document.getElementById("navCenter");

  if (mobileBtn && navCenter) {
    mobileBtn.addEventListener("click", () => {
      navCenter.classList.toggle("open");
    });
  }

  
  const searchBtn = document.getElementById("searchBtn");
  const searchModal = document.getElementById("searchModal");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  function renderSearchResults(query) {
    if (!searchResults) return;

    const term = (query || "").trim().toLowerCase();
    let matches = ZANDLE_PRODUCTS;

    if (term.length > 0) {
      matches = ZANDLE_PRODUCTS.filter((prod) => {
        return (
          prod.name.toLowerCase().includes(term) ||
          prod.category.toLowerCase().includes(term) ||
          prod.desc.toLowerCase().includes(term)
        );
      });
    }

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 14px;">
          Tidak ada produk yang cocok dengan "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      return;
    }

    searchResults.innerHTML = matches
      .map(
        (prod) => `
        <a href="${prod.url}" class="search-result-item">
          <div class="search-result-thumb">
            <img src="${prod.img}" alt="${escapeHtml(prod.name)}">
          </div>
          <div class="search-result-meta">
            <h5>${escapeHtml(prod.name)}</h5>
            <p>${escapeHtml(prod.category)} • ${escapeHtml(prod.desc)}</p>
          </div>
          <span class="search-result-price">${prod.priceFormatted}</span>
        </a>
      `
      )
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function openSearchModal() {
    if (!searchModal) return;
    searchModal.classList.add("open");
    if (searchInput) {
      searchInput.value = "";
      renderSearchResults("");
      setTimeout(() => searchInput.focus(), 80);
    }
  }

  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove("open");
  }

  if (searchBtn && searchModal) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openSearchModal();
    });
  }

  if (searchClose) {
    searchClose.addEventListener("click", () => {
      closeSearchModal();
    });
  }

  if (searchModal) {
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) {
        closeSearchModal();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeSearchModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchModal && searchModal.classList.contains("open")) {
      closeSearchModal();
    }
  });

  
  updateNavCartBadge();
});
