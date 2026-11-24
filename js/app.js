




document.addEventListener("DOMContentLoaded", () => {

  
  const profileBtn = document.getElementById("profileDropdownBtn");
  const profileMenu = document.getElementById("profileDropdownMenu");

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("show");
    });

    
    document.addEventListener("click", () => {
      profileMenu.classList.remove("show");
    });
  }


  
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navCenter = document.getElementById("navCenter");

  if (mobileBtn && navCenter) {
    mobileBtn.addEventListener("click", () => {
      navCenter.classList.toggle("open");
    });
  }


  
  
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

  
  const sizeCards = document.querySelectorAll(".size-select-card");
  const valSizeText = document.getElementById("valSize");
  const totalPriceText = document.getElementById("totalPriceText");

  sizeCards.forEach((card) => {
    card.addEventListener("click", () => {
      sizeCards.forEach((el) => el.classList.remove("active"));
      card.classList.add("active");
      if (valSizeText) valSizeText.textContent = card.textContent.trim();
      
      
      if (card.textContent.includes("100ml") && totalPriceText) totalPriceText.textContent = "Rp 45.000";
      if (card.textContent.includes("150ml") && totalPriceText) totalPriceText.textContent = "Rp 60.000";
      if (card.textContent.includes("200ml") && totalPriceText) totalPriceText.textContent = "Rp 75.000";
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

  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener("click", () => {
      let count = parseInt(qtyVal.textContent, 10) || 1;
      if (count > 1) qtyVal.textContent = count - 1;
    });

    qtyPlus.addEventListener("click", () => {
      let count = parseInt(qtyVal.textContent, 10) || 1;
      qtyVal.textContent = count + 1;
    });
  }


  
  const catalogSizeBtns = document.querySelectorAll(".size-btn");
  catalogSizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      catalogSizeBtns.forEach((el) => el.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const catalogColorDots = document.querySelectorAll(".color-dots-row .color-dot");
  catalogColorDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      catalogColorDots.forEach((el) => el.classList.remove("active"));
      dot.classList.add("active");
    });
  });


  
  const galleryDots = document.querySelectorAll(".gallery-dot");
  const mainProductImg = document.getElementById("mainProductImg");

  galleryDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      galleryDots.forEach((el) => el.classList.remove("active"));
      dot.classList.add("active");
    });
  });

});
