document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("adminPasswordToggle");
  const passwordInput = document.getElementById("adminPassword");

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      toggleBtn.setAttribute("aria-label", isPassword ? "Sembunyikan password" : "Tampilkan password");

      const eyeIcon = toggleBtn.querySelector(".eye-icon");
      const eyeOffIcon = toggleBtn.querySelector(".eye-off-icon");
      if (eyeIcon && eyeOffIcon) {
        eyeIcon.style.display = isPassword ? "none" : "block";
        eyeOffIcon.style.display = isPassword ? "block" : "none";
      }
    });
  }

  const loginForm = document.getElementById("adminLoginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      sessionStorage.setItem("zandle_admin_auth", "true");
      window.location.href = "dashboard-admin.html";
    });
  }
});
