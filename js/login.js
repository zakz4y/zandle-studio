document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".auth-form-side form");
  const submitBtn = document.querySelector(".btn-auth-submit");
  const modal = document.getElementById("authModal");
  const modalTitle = document.getElementById("authModalTitle");
  const modalMsg = document.getElementById("authModalMsg");
  const modalClose = document.getElementById("authModalClose");

  function showAuthModal(title, msg) {
    if (!modal) {
      return;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalMsg) modalMsg.textContent = msg;
    modal.classList.add("open");
  }

  function closeAuthModal() {
    if (modal) modal.classList.remove("open");
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeAuthModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAuthModal();
    });
  }

  const togglePassBtn = document.getElementById("togglePassword");
  const passInputEl = document.getElementById("passwordInput");

  if (togglePassBtn && passInputEl) {
    togglePassBtn.addEventListener("click", () => {
      const isPassword = passInputEl.getAttribute("type") === "password";
      passInputEl.setAttribute("type", isPassword ? "text" : "password");
      const eyeOpen = togglePassBtn.querySelector(".eye-open");
      const eyeClosed = togglePassBtn.querySelector(".eye-closed");
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? "none" : "block";
        eyeClosed.style.display = isPassword ? "block" : "none";
      }
    });
  }

  function validate(e) {
    const emailInput = document.querySelector('.auth-form-side input[type="email"]');
    const passInput = document.getElementById("passwordInput") || document.querySelector('.auth-form-side input[type="password"]') || document.querySelector('.auth-form-side input[type="text"]');

    if (!emailInput || !emailInput.value.trim()) {
      if (e) e.preventDefault();
      showAuthModal("Email Diperlukan", "Silakan masukkan alamat email Anda untuk melanjutkan masuk.");
      if (emailInput) emailInput.focus();
      return false;
    }

    if (!passInput || !passInput.value.trim()) {
      if (e) e.preventDefault();
      showAuthModal("Kata Sandi Diperlukan", "Silakan ketikkan kata sandi akun Anda.");
      if (passInput) passInput.focus();
      return false;
    }

    return true;
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      validate(e);
    });
  }

  if (submitBtn && submitBtn.tagName.toLowerCase() === "a") {
    submitBtn.addEventListener("click", (e) => {
      validate(e);
    });
  }
});
