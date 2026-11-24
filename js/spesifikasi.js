// ==========================================
// ZANDLE STUDIO - SPECIFICATION PAGE JAVASCRIPT
// Interaksi Spesifikasi Produk & Toast
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");

  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // Interaksi tombol atau spesifikasi
  const actionBtns = document.querySelectorAll(".spec-action-btn");
  actionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast("Spesifikasi produk berhasil disalin!");
    });
  });
});
