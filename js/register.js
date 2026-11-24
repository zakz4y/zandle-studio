document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector(".auth-form-side form");
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

  function validateRegister(e) {
    const nameInput = document.querySelector('.auth-form-side input[type="text"]');
    const emailInput = document.querySelector('.auth-form-side input[type="email"]');
    const passInput = document.querySelector('.auth-form-side input[type="password"]');
    const termsCheck = document.getElementById("terms");

    if (!nameInput || !nameInput.value.trim()) {
      if (e) e.preventDefault();
      showAuthModal("Nama Lengkap Kosong", "Silakan masukkan nama lengkap Anda untuk pendaftaran.");
      if (nameInput) nameInput.focus();
      return false;
    }

    if (!emailInput || !emailInput.value.trim()) {
      if (e) e.preventDefault();
      showAuthModal("Email Kosong", "Silakan masukkan alamat email yang valid.");
      if (emailInput) emailInput.focus();
      return false;
    }

    if (!passInput || passInput.value.length < 8) {
      if (e) e.preventDefault();
      showAuthModal("Kata Sandi Kurang Aman", "Kata sandi minimal harus terdiri dari 8 karakter.");
      if (passInput) passInput.focus();
      return false;
    }

    if (termsCheck && !termsCheck.checked) {
      if (e) e.preventDefault();
      showAuthModal("Persetujuan Diperlukan", "Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi Zandle Studio.");
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
      validateRegister(e);
    });
  }
});
