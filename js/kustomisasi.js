document.addEventListener("DOMContentLoaded", () => {
  
  const aromaOptions = document.querySelectorAll(".aroma-option");
  const valAromaText = document.getElementById("valAroma");
  const candlePreviewMeta = document.getElementById("candlePreviewMeta");

  function updateMeta() {
    if (!candlePreviewMeta) return;
    const aroma = valAromaText?.textContent.trim() || "Lavender Bliss";
    const color = valColorText?.textContent.trim() || "Sage Green";
    const size = valSizeText?.textContent.trim().split(" ")[0] || "200ml";
    candlePreviewMeta.textContent = `Pratinjau Lilin ${size} • ${color} • ${aroma}`;
  }

  aromaOptions.forEach((option) => {
    option.addEventListener("click", () => {
      aromaOptions.forEach((el) => el.classList.remove("active"));
      option.classList.add("active");
      const name = option.querySelector(".aroma-name");
      if (name && valAromaText) valAromaText.textContent = name.textContent;
      updateMeta();
    });
  });

  const waxDots = document.querySelectorAll(".wax-dot");
  const valColorText = document.getElementById("valColor");
  const candlePreviewImg = document.getElementById("candlePreviewImg");
  let selectedCandleImg = "assets/images/candle-green.png";

  const colorImgMap = {
    "sage green": "assets/images/candle-green.png",
    "cream natural": "assets/images/candle-white.png",
    "ochre yellow": "assets/images/candle-yellow.png",
    "terracotta warm": "assets/images/katalog-candle4.png",
    "deep indigo": "assets/images/katalog-candle5.png"
  };

  waxDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      waxDots.forEach((el) => el.classList.remove("active"));
      dot.classList.add("active");
      const colorName = dot.getAttribute("title") || dot.dataset.name || "";
      if (colorName && valColorText) valColorText.textContent = colorName;

      const matchedImg = dot.dataset.img || colorImgMap[colorName.toLowerCase()] || "assets/images/candle-green.png";
      selectedCandleImg = matchedImg;

      if (candlePreviewImg) {
        candlePreviewImg.style.opacity = "0.4";
        candlePreviewImg.style.transform = "scale(0.96)";
        setTimeout(() => {
          candlePreviewImg.src = matchedImg;
          candlePreviewImg.style.opacity = "1";
          candlePreviewImg.style.transform = "scale(1)";
        }, 150);
      }
      updateMeta();
    });
  });

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
      updateMeta();
    });
  });

  
  const labelInput = document.getElementById("labelInput");
  const previewLabel = document.getElementById("candlePreviewLabel");

  if (labelInput && previewLabel) {
    labelInput.addEventListener("input", (e) => {
      previewLabel.textContent = e.target.value.trim() || "Zandle Studio";
    });
  }

  
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

  
  const btnAddToCartCustom = document.getElementById("btnAddToCart") || document.querySelector(".btn-custom-cart");
  if (btnAddToCartCustom) {
    btnAddToCartCustom.addEventListener("click", (e) => {
      const aroma = valAromaText?.textContent.trim() || "Lavender";
      const color = valColorText?.textContent.trim() || "Sage Green";
      const size = valSizeText?.textContent.trim() || "200ml";
      const label = labelInput?.value.trim() || "Zandle Studio";
      const qty = parseInt(qtyVal?.textContent, 10) || 1;

      
      try {
        localStorage.removeItem("zandle_direct_checkout");
        const saved = localStorage.getItem("zandle_cart");
        let cart = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(cart)) cart = [];

        cart.push({
          id: Date.now(),
          title: `Lilin Custom — ${color}`,
          desc: `Aroma: ${aroma} • ${size} • Label: "${label}"`,
          price: basePrice,
          qty: qty,
          img: selectedCandleImg,
          selected: true
        });

        localStorage.setItem("zandle_cart", JSON.stringify(cart));
        if (typeof updateNavCartBadge === "function") {
          updateNavCartBadge();
        }
      } catch (err) {
        
      }
    });
  }
});
