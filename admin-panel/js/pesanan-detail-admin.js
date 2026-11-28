document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("printInvoiceBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  const statusBtn = document.getElementById("changeStatusBtn");
  if (statusBtn) {
    statusBtn.addEventListener("click", () => {
      const statuses = ["Diproses", "Dikirim", "Selesai"];
      const nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
      window.showAdminNotice({
        title: "Status Pesanan Diperbarui",
        message: `Status pesanan #1023 telah berhasil diubah menjadi: ${nextStatus}. Notifikasi otomatis telah dikirim ke pelanggan.`,
        type: "success"
      });
    });
  }
});
