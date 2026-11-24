// ==========================================
// ZANDLE STUDIO - KATALOG PAGE JAVASCRIPT
// Filter Kategori, Warna, Ukuran, dan Urutan
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const categoryRadios = document.querySelectorAll('input[name="kat"]');
  const sizeRadios = document.querySelectorAll('input[name="f-size"]');
  const colorRadios = document.querySelectorAll('input[name="f-color"]');
  const sortSelect = document.querySelector(".katalog-sort");
  const catalogCards = document.querySelectorAll(".katalog-grid-3 .katalog-card-link");
  const catalogCount = document.querySelector(".katalog-count");

  // Ukuran label buttons
  const catalogSizeBtns = document.querySelectorAll(".size-btn");
  catalogSizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      catalogSizeBtns.forEach((el) => el.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Warna dots
  const catalogColorDots = document.querySelectorAll(".color-dots-row .color-dot");
  catalogColorDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      catalogColorDots.forEach((el) => el.classList.remove("active"));
      dot.classList.add("active");
    });
  });

  function applyFilters() {
    let selectedCat = "Semua";
    categoryRadios.forEach((radio) => {
      if (radio.checked) {
        const span = radio.parentElement.querySelector("span");
        if (span) selectedCat = span.textContent.trim();
      }
    });

    let visibleCount = 0;
    catalogCards.forEach((card) => {
      const title = (card.querySelector(".katalog-card-title")?.textContent || "").toLowerCase();
      let match = true;

      if (selectedCat !== "Semua") {
        if (selectedCat.includes("Floral") && !title.includes("lavender")) {
          match = false;
        } else if (selectedCat.includes("Citrus") && !title.includes("citrus") && !title.includes("lemon")) {
          match = false;
        } else if (selectedCat.includes("Warm") && !title.includes("vanilla") && !title.includes("cinnamon") && !title.includes("coffee")) {
          match = false;
        } else if (selectedCat.includes("Woody") && !title.includes("warmth") && !title.includes("cinnamon")) {
          match = false;
        }
      }

      if (match) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (catalogCount) {
      catalogCount.textContent = `Menampilkan ${visibleCount} dari ${catalogCards.length} lilin`;
    }
  }

  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", applyFilters);
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const grid = document.querySelector(".katalog-grid-3");
      if (!grid) return;
      const cardsArr = Array.from(catalogCards);

      if (sortSelect.value.includes("Rendah ke Tinggi")) {
        cardsArr.sort((a, b) => getPrice(a) - getPrice(b));
      } else if (sortSelect.value.includes("Tinggi ke Rendah")) {
        cardsArr.sort((a, b) => getPrice(b) - getPrice(a));
      }

      cardsArr.forEach((c) => grid.appendChild(c));
    });
  }

  function getPrice(cardEl) {
    const priceText = cardEl.querySelector(".katalog-card-price")?.textContent || "0";
    return parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;
  }
});
