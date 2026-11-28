(function () {
  let modalOverlay = null;

  function ensureModalContainer() {
    if (!modalOverlay) {
      modalOverlay = document.createElement("div");
      modalOverlay.className = "admin-global-modal-overlay";
      modalOverlay.innerHTML = `
        <div class="admin-global-modal-card" role="dialog" aria-modal="true">
          <div class="admin-modal-icon-badge" id="adminModalIcon">✓</div>
          <h3 class="admin-modal-title" id="adminModalTitle">Pemberitahuan</h3>
          <p class="admin-modal-message" id="adminModalMessage">Pesan...</p>
          <div class="admin-modal-actions" id="adminModalActions">
            <button type="button" class="btn-modal-cancel" id="adminModalCancelBtn">Batal</button>
            <button type="button" class="btn-modal-confirm" id="adminModalConfirmBtn">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(modalOverlay);
    }
  }

  window.showAdminNotice = function ({ title = "Informasi", message = "", type = "success", onConfirm = null }) {
    ensureModalContainer();
    const icon = modalOverlay.querySelector("#adminModalIcon");
    const titleEl = modalOverlay.querySelector("#adminModalTitle");
    const msgEl = modalOverlay.querySelector("#adminModalMessage");
    const cancelBtn = modalOverlay.querySelector("#adminModalCancelBtn");
    const confirmBtn = modalOverlay.querySelector("#adminModalConfirmBtn");

    icon.className = `admin-modal-icon-badge admin-modal-icon-${type}`;
    icon.textContent = type === "success" ? "✓" : type === "danger" ? "!" : "i";

    titleEl.textContent = title;
    msgEl.textContent = message;

    cancelBtn.style.display = "none";
    confirmBtn.className = "btn-modal-confirm";
    confirmBtn.textContent = "OK";

    const closeHandler = () => {
      modalOverlay.classList.remove("active");
      confirmBtn.removeEventListener("click", closeHandler);
      if (typeof onConfirm === "function") onConfirm();
    };

    confirmBtn.addEventListener("click", closeHandler);
    modalOverlay.classList.add("active");
  };

  window.showAdminConfirm = function ({
    title = "Konfirmasi",
    message = "Apakah Anda yakin?",
    danger = false,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    onConfirm = null,
    onCancel = null
  }) {
    ensureModalContainer();
    const icon = modalOverlay.querySelector("#adminModalIcon");
    const titleEl = modalOverlay.querySelector("#adminModalTitle");
    const msgEl = modalOverlay.querySelector("#adminModalMessage");
    const cancelBtn = modalOverlay.querySelector("#adminModalCancelBtn");
    const confirmBtn = modalOverlay.querySelector("#adminModalConfirmBtn");

    icon.className = `admin-modal-icon-badge ${danger ? "admin-modal-icon-danger" : "admin-modal-icon-warning"}`;
    icon.textContent = "!";

    titleEl.textContent = title;
    msgEl.textContent = message;

    cancelBtn.style.display = "inline-flex";
    cancelBtn.textContent = cancelText;

    confirmBtn.className = `btn-modal-confirm ${danger ? "danger" : ""}`;
    confirmBtn.textContent = confirmText;

    const cleanup = () => {
      modalOverlay.classList.remove("active");
      confirmBtn.removeEventListener("click", handleConfirm);
      cancelBtn.removeEventListener("click", handleCancel);
    };

    const handleConfirm = () => {
      cleanup();
      if (typeof onConfirm === "function") onConfirm();
    };

    const handleCancel = () => {
      cleanup();
      if (typeof onCancel === "function") onCancel();
    };

    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", handleCancel);
    modalOverlay.classList.add("active");
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  const savedAvatar = localStorage.getItem("zandle_admin_avatar");
  if (savedAvatar) {
    document.querySelectorAll(".admin-avatar-btn img").forEach((img) => {
      img.src = savedAvatar;
    });
  }

  const searchInput = document.querySelector(".admin-search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
          console.log("Searching admin panel for:", query);
        }
      }
    });
  }

  const currentPath = window.location.pathname.split("/").pop();
  const navItems = document.querySelectorAll(".admin-nav-item");
  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href && href === currentPath) {
      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");
    }
  });

  const logoutBtn = document.querySelector(".admin-sidebar-bottom a[href*='login']");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.showAdminConfirm({
        title: "Konfirmasi Keluar",
        message: "Apakah Anda yakin ingin keluar dari panel admin Zandle Studio?",
        danger: true,
        confirmText: "Keluar",
        onConfirm: () => {
          sessionStorage.removeItem("zandle_admin_auth");
          window.location.href = "index.html";
        }
      });
    });
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const mainAdminEl = document.querySelector(".admin-content") || document.querySelector(".login-admin-wrapper");
  if (mainAdminEl) {
    mainAdminEl.classList.add("page-enter-reveal");
  }

  const revealTargets = document.querySelectorAll(
    ".kpi-card, .chart-card, .recent-orders-card, .admin-table-container, .product-card, .profile-avatar-card, .profile-details-card, .admin-card"
  );

  if ("IntersectionObserver" in window && revealTargets.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    revealTargets.forEach((el, index) => {
      el.classList.add("scroll-reveal");
      if (index < 4 && window.scrollY < 80) {
        el.classList.add("revealed");
      } else {
        observer.observe(el);
      }
    });
  }
});
