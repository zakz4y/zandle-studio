document.addEventListener("DOMContentLoaded", () => {
  const bars = document.querySelectorAll(".bar-col");
  bars.forEach((bar) => {
    bar.addEventListener("mouseenter", () => {
      const height = bar.style.height;
      bar.setAttribute("title", `Aktivitas: ${height}`);
    });
  });

  const searchInput = document.querySelector(".admin-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const orderRows = document.querySelectorAll(".recent-order-row");
      orderRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? "flex" : "none";
      });
    });
  }
});
