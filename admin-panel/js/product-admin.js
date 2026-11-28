document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("productModal");
  const addBtn = document.getElementById("addProductBtn");
  const cancelBtn = document.getElementById("cancelProductBtn");
  const productForm = document.getElementById("productForm");

  if (addBtn && modalOverlay) {
    addBtn.addEventListener("click", () => {
      document.getElementById("modalTitle").textContent = "Tambah Produk Baru";
      productForm.reset();
      modalOverlay.classList.add("active");
    });
  }

  if (cancelBtn && modalOverlay) {
    cancelBtn.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
    });
  }

  document.querySelectorAll(".product-btn-edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const title = card.querySelector(".product-card-title").textContent.trim();
      document.getElementById("modalTitle").textContent = `Edit Produk: ${title}`;
      document.getElementById("productNameInput").value = title;
      modalOverlay.classList.add("active");
    });
  });

  document.querySelectorAll(".product-btn-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const title = card.querySelector(".product-card-title").textContent.trim();
      window.showAdminConfirm({
        title: "Hapus Produk?",
        message: `Produk "${title}" akan dihapus dari katalog. Tindakan ini tidak dapat dibatalkan.`,
        danger: true,
        confirmText: "Ya, Hapus",
        onConfirm: () => {
          card.style.transition = "opacity 0.2s ease, transform 0.2s ease";
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => card.remove(), 200);
          window.showAdminNotice({
            title: "Produk Dihapus",
            message: `Produk "${title}" berhasil dihapus dari sistem.`,
            type: "success"
          });
        }
      });
    });
  });

  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      modalOverlay.classList.remove("active");
      const name = document.getElementById("productNameInput").value;
      window.showAdminNotice({
        title: "Produk Tersimpan",
        message: `Data produk "${name}" berhasil diperbarui.`,
        type: "success"
      });
    });
  }

  const searchInput = document.querySelector(".admin-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll(".product-card").forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? "" : "none";
      });
    });
  }
});
