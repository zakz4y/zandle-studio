




document.addEventListener("DOMContentLoaded", () => {
  
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector(".newsletter-input");
      if (input && input.value) {
        alert("Terima kasih sudah berlangganan newsletter Zandle Studio!");
        input.value = "";
      }
    });
  }

  const btnCartList = document.querySelectorAll(".btn-cart-sm");
  btnCartList.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      if (!card) return;
      const title = card.querySelector(".product-title")?.textContent.trim() || "Lilin Aromaterapi";
      const priceText = card.querySelector(".product-price")?.textContent.trim() || "Rp 25.000";
      const price = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 25000;
      const img = card.querySelector(".product-thumb img")?.getAttribute("src") || "assets/images/candle-white.png";
      const tags = Array.from(card.querySelectorAll(".tag-pill")).map((t) => t.textContent.trim()).join(" • ");

      try {
        localStorage.removeItem("zandle_direct_checkout");
        const saved = localStorage.getItem("zandle_cart");
        let cart = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(cart)) cart = [];

        const existing = cart.find((i) => i.title === title);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({
            id: Date.now(),
            title: title,
            desc: tags || "Signature Soy Candle",
            price: price,
            qty: 1,
            img: img,
            selected: true
          });
        }

        localStorage.setItem("zandle_cart", JSON.stringify(cart));
        if (typeof updateNavCartBadge === "function") {
          updateNavCartBadge();
        }
      } catch (e) {
      }
    });
  });
});
