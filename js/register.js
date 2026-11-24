// ==========================================
// ZANDLE STUDIO - REGISTER PAGE JAVASCRIPT
// Validasi Form & Interaksi Front-End
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector(".auth-form-side form");
  const submitBtn = document.querySelector(".btn-auth-submit");

  function validateRegister(e) {
    const nameInput = document.querySelector('.auth-form-side input[type="text"]');
    const emailInput = document.querySelector('.auth-form-side input[type="email"]');
    const passInput = document.querySelector('.auth-form-side input[type="password"]');
    const termsCheck = document.getElementById("terms");

    if (!nameInput || !nameInput.value.trim()) {
      if (e) e.preventDefault();
      alert("Silakan masukkan nama lengkap Anda.");
      if (nameInput) nameInput.focus();
      return false;
    }

    if (!emailInput || !emailInput.value.trim()) {
      if (e) e.preventDefault();
      alert("Silakan masukkan email Anda.");
      if (emailInput) emailInput.focus();
      return false;
    }

    if (!passInput || passInput.value.length < 8) {
      if (e) e.preventDefault();
      alert("Kata sandi minimal harus 8 karakter.");
      if (passInput) passInput.focus();
      return false;
    }

    if (termsCheck && !termsCheck.checked) {
      if (e) e.preventDefault();
      alert("Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.");
      termsCheck.focus();
      return false;
    }

    return true;
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      validateRegister(e);
    });
  }

  if (submitBtn && submitBtn.tagName.toLowerCase() === "a") {
    submitBtn.addEventListener("click", (e) => {
      if (!validateRegister(e)) {
        // batalkan navigasi jika tidak valid
      }
    });
  }
});
