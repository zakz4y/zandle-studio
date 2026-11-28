document.addEventListener("DOMContentLoaded", () => {
  const filterPills = document.querySelectorAll(".filter-pill");
  const rows = document.querySelectorAll(".admin-table tbody tr");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const filterStatus = pill.getAttribute("data-status");
      rows.forEach((row) => {
        const statusBadge = row.querySelector(".admin-badge");
        if (!statusBadge) return;
        const statusText = statusBadge.textContent.trim().toLowerCase();

        if (filterStatus === "semua" || statusText === filterStatus) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  });

  const checkAll = document.getElementById("checkAll");
  const rowCheckboxes = document.querySelectorAll(".row-checkbox");

  if (checkAll) {
    checkAll.addEventListener("change", () => {
      rowCheckboxes.forEach((cb) => {
        cb.checked = checkAll.checked;
      });
    });
  }

  const searchInput = document.querySelector(".admin-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });
    });
  }
});
