document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".password-toggle-btn");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isPassword = input.getAttribute("type") === "password";
      input.setAttribute("type", isPassword ? "text" : "password");
      btn.setAttribute("aria-label", isPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
      
      const eyeIcon = btn.querySelector(".eye-icon");
      const eyeOffIcon = btn.querySelector(".eye-off-icon");
      if (eyeIcon && eyeOffIcon) {
        eyeIcon.style.display = isPassword ? "none" : "block";
        eyeOffIcon.style.display = isPassword ? "block" : "none";
      }
    });
  });

  const uploadBtn = document.getElementById("uploadPhotoBtn");
  const avatarInput = document.getElementById("avatarFileInput");
  const avatarImg = document.getElementById("profileAvatarImg");

  const savedAvatar = localStorage.getItem("zandle_admin_avatar");
  if (savedAvatar) {
    if (avatarImg) avatarImg.src = savedAvatar;
    document.querySelectorAll(".admin-avatar-btn img").forEach((img) => {
      img.src = savedAvatar;
    });
  }

  if (uploadBtn && avatarInput) {
    uploadBtn.addEventListener("click", () => avatarInput.click());
    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        window.showAdminNotice({
          title: "Ukuran Terlalu Besar",
          message: "Ukuran file foto maksimal 2MB. Silakan pilih foto lain.",
          type: "danger"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        if (avatarImg) avatarImg.src = base64Data;
        document.querySelectorAll(".admin-avatar-btn img").forEach((img) => {
          img.src = base64Data;
        });
        localStorage.setItem("zandle_admin_avatar", base64Data);

        window.showAdminNotice({
          title: "Foto Profil Diperbarui",
          message: "Foto profil admin berhasil diunggah dan disimpan.",
          type: "success"
        });
      };
      reader.readAsDataURL(file);
    });
  }

  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const adminName = document.getElementById("adminName")?.value || "Much Aqilla Al - Hayyu";
      window.showAdminNotice({
        title: "Perubahan Disimpan",
        message: `Data profil untuk ${adminName} berhasil diperbarui.`,
        type: "success"
      });
    });
  }
});
