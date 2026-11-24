// ==========================================
// ZANDLE STUDIO - KUSTOMISASI PAGE JAVASCRIPT
// Pemilihan Aroma, Warna Lilin, Ukuran Wadah, Label Personal, Qty
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Aroma
  const aromaOptions = document.querySelectorAll(".aroma-option");
  const valAromaText = document.getElementById("valAroma");

  aromaOptions.forEach((option) => {
    option.addEventListener("click", () => {
      aromaOptions.forEach((el) => el.classList.remove("active"));
      option.classList.add("active");
      const name = option.querySelector(".aroma-name");
      if (name && valAromaText) valAromaText.textContent = name.textContent;
    });
  });

  // 2. Warna Lilin
  const waxDots = document.querySelectorAll(".wax-dot");
  const valColorText = document.getElementById("valColor");
  const candlePreview = document.getElementById("candlePreviewBody");

  waxDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      waxDots.forEach((el) => el.classList.remove("active"));
      dot.classList.add("active");
      const colorName = dot.getAttribute("title") || dot.dataset.name;
      const colorHex = dot.style.backgroundColor || dot.dataset.hex;
      if (colorName && valColorText) valColorText.textContent = colorName;
      if (colorHex && candlePreview) candlePreview.style.backgroundColor = colorHex;
    });
  });

  // 3. Ukuran Wadah
  const sizeCards = document.querySelectorAll(".size-select-card");
  const valSizeText = document.getElementById("valSize");
  const totalPriceText = document.getElementById("totalPriceText");

  let basePrice = 75000;

  sizeCards.forEach((card) => {
    card.addEventListener("click", () => {
      sizeCards.forEach((el) => el.classList.remove("active"));
      card.classList.add("active");
      if (valSizeText) valSizeText.textContent = card.textContent.trim();

      if (card.textContent.includes("100ml")) basePrice = 45000;
      else if (card.textContent.includes("150ml")) basePrice = 60000;
      else if (card.textContent.includes("200ml")) basePrice = 75000;

      updateTotalCustomPrice();
    });
  });

  // 4. Input Label Personal
  const labelInput = document.getElementById("labelInput");
  const previewLabel = document.getElementById("candlePreviewLabel");

  if (labelInput && previewLabel) {
    labelInput.addEventListener("input", (e) => {
      previewLabel.textContent = e.target.value.trim() || "Zandle Studio";
    });
  }

  // 5. Tombol Jumlah (+ / -)
  const qtyMinus = document.getElementById("btnQtyMinus");
  const qtyPlus = document.getElementById("btnQtyPlus");
  const qtyVal = document.getElementById("qtyVal");

  function updateTotalCustomPrice() {
    const qty = parseInt(qtyVal?.textContent, 10) || 1;
    const total = basePrice * qty;
    if (totalPriceText) {
      totalPriceText.textContent = "Rp " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }

  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener("click", () => {
      let count = parseInt(qtyVal.textContent, 10) || 1;
      if (count > 1) {
        qtyVal.textContent = count - 1;
        updateTotalCustomPrice();
      }
    });

    qtyPlus.addEventListener("click", () => {
      let count = parseInt(qtyVal.textContent, 10) || 1;
      qtyVal.textContent = count + 1;
      updateTotalCustomPrice();
    });
  }

  // Tombol Tambah ke Keranjang
  const btnAddToCartCustom = document.querySelector(".btn-custom-cart");
  if (btnAddToCartCustom) {
    btnAddToCartCustom.addEventListener("click", (e) => {
      const aroma = valAromaText?.textContent.trim() || "Lavender";
      const color = valColorText?.textContent.trim() || "Sage Green";
      const size = valSizeText?.textContent.trim() || "200ml";
      const label = labelInput?.value.trim() || "Zandle Studio";
      const qty = parseInt(qtyVal?.textContent, 10) || 1;

      // Simpan item custom ke cart localStorage
      try {
        const saved = localStorage.getItem("zandle_cart");
        let cart = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(cart)) cart = [];

        cart.push({
          id: Date.now(),
          title: `Lilin Custom — ${color}`,
          desc: `Aroma: ${aroma} • ${size} • Label: "${label}"`,
          price: basePrice,
          qty: qty,
          img: "assets/images/candle-green.png",
          selected: true
        });

        localStorage.setItem("zandle_cart", JSON.stringify(cart));
        if (typeof updateNavCartBadge === "function") {
          updateNavCartBadge();
        }
      } catch (err) {
        // fallback
      }
    });
  }
});
