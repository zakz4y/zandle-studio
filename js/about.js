// ==========================================
// ZANDLE STUDIO - ABOUT PAGE JAVASCRIPT
// Interaksi Halaman Tentang Kami
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll untuk link jangkar seperti #faq, #pengiriman, #kontak
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
});
