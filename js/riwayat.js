// ==========================================
// ZANDLE STUDIO - RIWAYAT PESANAN PAGE JAVASCRIPT
// Filter Status Pesanan Front-End
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Tab filter riwayat jika ada
  const statusTabs = document.querySelectorAll(".history-tab");
  statusTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      statusTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
});
