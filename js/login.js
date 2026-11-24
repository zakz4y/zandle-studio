// ==========================================
// ZANDLE STUDIO - LOGIN PAGE JAVASCRIPT
// Validasi Form & Interaksi Front-End
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".auth-form-side form");
  const submitBtn = document.querySelector(".btn-auth-submit");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      const emailInput = loginForm.querySelector('input[type="email"]');
      const passInput = loginForm.querySelector('input[type="password"]');

      if (!emailInput || !emailInput.value.trim()) {
        e.preventDefault();
        alert("Silakan masukkan email Anda.");
        if (emailInput) emailInput.focus();
        return;
      }

      if (!passInput || !passInput.value.trim()) {
        e.preventDefault();
        alert("Silakan masukkan kata sandi Anda.");
        if (passInput) passInput.focus();
        return;
      }
    });
  }

  // Handle jika tombol berupa tag <a> atau <button>
  if (submitBtn && submitBtn.tagName.toLowerCase() === "a") {
    submitBtn.addEventListener("click", (e) => {
      const emailInput = document.querySelector('.auth-form-side input[type="email"]');
      const passInput = document.querySelector('.auth-form-side input[type="password"]');

      if (!emailInput || !emailInput.value.trim()) {
        e.preventDefault();
        alert("Silakan masukkan alamat email.");
        if (emailInput) emailInput.focus();
        return;
      }

      if (!passInput || !passInput.value.trim()) {
        e.preventDefault();
        alert("Silakan masukkan kata sandi.");
        if (passInput) passInput.focus();
        return;
      }
    });
  }
});
