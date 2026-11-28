document.addEventListener("DOMContentLoaded", () => {
  const galleryDots = document.querySelectorAll(".gallery-dot");
  const mainProductImg = document.getElementById("mainProductImg");
  const arrowPrev = document.querySelector(".gallery-nav-arrow:first-child");
  const arrowNext = document.querySelector(".gallery-nav-arrow:last-child");

  
  const images = [];
  if (mainProductImg) {
    const currentSrc = mainProductImg.getAttribute("src");
    images.push(currentSrc);
    
    if (currentSrc.includes("white")) {
      images.push("assets/images/candle-putih1.jpeg", "assets/images/candle-putih2.jpeg");
    } else if (currentSrc.includes("green")) {
      images.push("assets/images/candle-kuning1.jpeg", "assets/images/candle-kuning2.jpeg");
    } else if (currentSrc.includes("yellow")) {
      images.push("assets/images/candle-ungu1.jpeg", "assets/images/candle-ungu2.jpeg");
    } else {
      images.push(currentSrc, currentSrc);
    }
  }

  let currentIndex = 0;

  function setActiveImage(index) {
    if (!mainProductImg || images.length === 0) return;
    currentIndex = (index + images.length) % images.length;

    mainProductImg.style.opacity = "0.4";
    setTimeout(() => {
      mainProductImg.src = images[currentIndex];
      mainProductImg.style.opacity = "1";
    }, 120);

    galleryDots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  galleryDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveImage(index);
    });
  });

  if (arrowPrev) {
    arrowPrev.addEventListener("click", () => {
      setActiveImage(currentIndex - 1);
    });
  }

  if (arrowNext) {
    arrowNext.addEventListener("click", () => {
      setActiveImage(currentIndex + 1);
    });
  }

  
  const btnDetailCart = document.querySelector(".btn-detail-cart");
  if (btnDetailCart) {
    btnDetailCart.addEventListener("click", () => {
      const title = document.querySelector(".product-detail-title")?.textContent.trim() || "Lilin Aromaterapi";
      const priceText = document.querySelector(".product-detail-price")?.textContent.trim() || "Rp 45.000";
      const price = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 45000;
      const imgSrc = mainProductImg?.getAttribute("src") || "assets/images/candle-white.png";

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
            desc: "Natural Soy Candle • Pure Essential Oil",
            price: price,
            qty: 1,
            img: imgSrc,
            selected: true
          });
        }

        localStorage.setItem("zandle_cart", JSON.stringify(cart));
        if (typeof updateNavCartBadge === "function") {
          updateNavCartBadge();
        }
      } catch (err) {
        
      }
    });
  }

  const btnDetailBuy = document.querySelector(".btn-detail-buy");
  if (btnDetailBuy) {
    btnDetailBuy.addEventListener("click", () => {
      const title = document.querySelector(".product-detail-title")?.textContent.trim() || "Lilin Aromaterapi";
      const priceText = document.querySelector(".product-detail-price")?.textContent.trim() || "Rp 45.000";
      const price = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 45000;
      const imgSrc = mainProductImg?.getAttribute("src") || "assets/images/candle-white.png";

      const directItem = {
        id: Date.now(),
        title: title,
        desc: "Natural Soy Candle • Pure Essential Oil",
        price: price,
        qty: 1,
        img: imgSrc,
        selected: true
      };

      try {
        localStorage.setItem("zandle_direct_checkout", JSON.stringify(directItem));
      } catch (err) {
        
      }
    });
  }

  const relatedCartBtns = document.querySelectorAll(".related-section .btn-cart-sm");
  relatedCartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest(".product-card");
      if (!card) return;
      const title = card.querySelector(".product-title")?.textContent.trim() || "Lilin Aromaterapi";
      const priceText = card.querySelector(".product-price")?.textContent.trim() || "Rp 45.000";
      const price = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 45000;
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
        window.location.href = "keranjang.html";
      } catch (err) {
      }
    });
  });
});
