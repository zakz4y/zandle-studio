// ==========================================
// ZANDLE STUDIO - CHECKOUT PAGE JAVASCRIPT
// Pilihan Metode Pembayaran, Hitung Ongkir & Total, Timer QRIS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const methodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const qrisBox = document.getElementById("qrisDetailBox");
  const bcaBox = document.getElementById("bcaDetailBox");
  const mandiriBox = document.getElementById("mandiriDetailBox");
  const shippingRadios = document.querySelectorAll('input[name="shippingMethod"]');
  const shippingCostEl = document.getElementById("checkoutShippingCost");
  const grandTotalEl = document.getElementById("checkoutGrandTotal");
  const qrisTimerEl = document.getElementById("qrisTimer");

  // Ganti detail box metode bayar
  methodRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (qrisBox) qrisBox.style.display = radio.value === "qris" ? "block" : "none";
      if (bcaBox) bcaBox.style.display = radio.value === "bca" ? "block" : "none";
      if (mandiriBox) mandiriBox.style.display = radio.value === "mandiri" ? "block" : "none";
    });
  });

  // Ganti opsi pengiriman
  shippingRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      let cost = 15000;
      if (radio.value === "express") cost = 25000;
      else if (radio.value === "instant") cost = 35000;

      if (shippingCostEl) {
        shippingCostEl.textContent = "Rp " + cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      // Hitung ulang total (asumsi subtotal 150.000 + biaya admin 1.000)
      const baseSubtotal = 150000;
      const adminFee = 1000;
      const total = baseSubtotal + cost + adminFee;

      if (grandTotalEl) {
        grandTotalEl.textContent = "Rp " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
    });
  });

  // Timer QRIS
  if (qrisTimerEl) {
    let timeLeft = 14 * 60 + 59; // 14:59
    const timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        qrisTimerEl.textContent = "00:00 (Kedaluwarsa)";
        return;
      }
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      const seconds = (timeLeft % 60).toString().padStart(2, "0");
      qrisTimerEl.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }

  // Tombol aksi QRIS
  const btnDownloadQr = document.getElementById("btnDownloadQr");
  if (btnDownloadQr) {
    btnDownloadQr.addEventListener("click", () => {
      alert("QR Code berhasil disimpan ke perangkat Anda.");
    });
  }

  const btnCheckQrisPaid = document.getElementById("btnCheckQrisPaid");
  if (btnCheckQrisPaid) {
    btnCheckQrisPaid.addEventListener("click", () => {
      window.location.href = "checkout-done.html";
    });
  }
});
