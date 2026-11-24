document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-pill");
  const rows = document.querySelectorAll(".order-table tbody tr");
  const actionBtns = document.querySelectorAll(".action-btn");
  const pageBtns = document.querySelectorAll(".pagination .page-btn");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.tab;
      rows.forEach((row) => {
        const status = row.dataset.status;
        if (filter === "all" || status === filter) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  });

  actionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const code = row?.querySelector("strong")?.textContent || "Pesanan";
      const actionName = btn.textContent.trim();

      if (actionName.includes("Lacak")) {
        alert(`${actionName} untuk ${code}:\nNo. Resi: JNE-MLG-90281928\nStatus: Paket sedang dalam perjalanan menuju kota tujuan.`);
      } else {
        const itemInfo = row?.querySelectorAll("td")[2]?.innerText?.replace(/\n/g, " - ") || "";
        alert(`Detail ${code}:\n${itemInfo}\nStatus: ${row?.querySelector(".status-badge")?.textContent}`);
      }
    });
  });

  pageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pageBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});
