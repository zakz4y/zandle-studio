// ==========================================
// ZANDLE STUDIO - HOME PAGE JAVASCRIPT
// Banner interaksi, newsletter toast
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Newsletter submission feedback
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
});
