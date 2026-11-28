document.addEventListener("DOMContentLoaded", () => {
  const addModal = document.getElementById("addLaporanModal");
  const deleteModal = document.getElementById("deleteConfirmModal");
  const openAddBtn = document.getElementById("openAddLaporanBtn");
  const formLaporan = document.getElementById("formLaporan");
  const tableBody = document.querySelector(".admin-table tbody");
  const datePickerBtn = document.getElementById("datePickerBtn");
  const datePickerInput = document.getElementById("datePickerInput");
  const datePickerLabel = document.getElementById("datePickerLabel");
  let targetRowToDelete = null;

  if (datePickerInput && datePickerLabel) {
    datePickerInput.addEventListener("change", (e) => {
      const val = e.target.value;
      if (!val) {
        datePickerLabel.textContent = "Pilih Tanggal";
        filterByDate(null);
        return;
      }
      const parts = val.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const formatted = `${parts[2]} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
      datePickerLabel.textContent = formatted;
      filterByDate(val);
    });
  }

  function filterByDate(selectedDateStr) {
    document.querySelectorAll(".admin-table tbody tr").forEach((row) => {
      const dateCell = row.children[3];
      const rowDate = dateCell.getAttribute("data-date");
      if (!selectedDateStr || !rowDate || rowDate === selectedDateStr) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  if (openAddBtn && addModal) {
    openAddBtn.addEventListener("click", () => {
      formLaporan.reset();
      addModal.classList.add("active");
    });
  }

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (addModal) addModal.classList.remove("active");
      if (deleteModal) deleteModal.classList.remove("active");
    });
  });

  if (formLaporan) {
    formLaporan.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("laporanJudul").value;
      const cat = document.getElementById("laporanKategori").value;
      const dateRaw = document.getElementById("laporanTanggal").value;

      let dateFormatted = dateRaw;
      if (dateRaw) {
        const p = dateRaw.split("-");
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        dateFormatted = `${p[2]} ${months[parseInt(p[1], 10) - 1]} ${p[0]}`;
      }

      const newIndex = tableBody.children.length + 1;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="color: var(--admin-text-muted); font-weight: 500;">${newIndex}</td>
        <td style="font-weight: 600;">${title}</td>
        <td>${cat}</td>
        <td style="color: var(--admin-text-muted);" data-date="${dateRaw}">${dateFormatted}</td>
        <td><span class="admin-badge admin-badge-draft">Draft</span></td>
        <td>
          <a href="#" class="action-link btn-edit-laporan" style="margin-right: 12px;">Edit</a>
          <button type="button" class="btn-delete-laporan" style="color: #dc2626; font-size: 13px; font-weight: 600;">Hapus</button>
        </td>
      `;
      tableBody.appendChild(row);
      addModal.classList.remove("active");
      attachRowEvents(row);

      window.showAdminNotice({
        title: "Laporan Dibuat",
        message: `Laporan "${title}" berhasil ditambahkan ke daftar.`,
        type: "success"
      });
    });
  }

  function attachRowEvents(row) {
    const delBtn = row.querySelector(".btn-delete-laporan");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        targetRowToDelete = row;
        const rowTitle = row.children[1].textContent;
        window.showAdminConfirm({
          title: "Hapus Laporan?",
          message: `Laporan "${rowTitle}" akan dihapus secara permanen.`,
          danger: true,
          confirmText: "Ya, Hapus",
          onConfirm: () => {
            row.remove();
            window.showAdminNotice({
              title: "Laporan Dihapus",
              message: "Data laporan telah dihapus dari sistem.",
              type: "success"
            });
          }
        });
      });
    }

    const editBtn = row.querySelector(".btn-edit-laporan");
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const currentTitle = row.children[1].textContent;
        document.getElementById("laporanJudul").value = currentTitle;
        if (addModal) addModal.classList.add("active");
      });
    }
  }

  document.querySelectorAll(".admin-table tbody tr").forEach(attachRowEvents);

  const filterCat = document.getElementById("filterKategori");
  if (filterCat) {
    filterCat.addEventListener("change", () => {
      const selected = filterCat.value.toLowerCase();
      document.querySelectorAll(".admin-table tbody tr").forEach((row) => {
        const catText = row.children[2].textContent.toLowerCase();
        if (selected === "all" || catText.includes(selected)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }

  const searchInput = document.querySelector(".admin-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll(".admin-table tbody tr").forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? "" : "none";
      });
    });
  }
});
