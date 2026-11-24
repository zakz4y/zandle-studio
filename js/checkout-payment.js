document.addEventListener("DOMContentLoaded", () => {
  const timerEl = document.querySelector(".countdown-timer");
  const subtotalEl = document.getElementById("paySubtotal");
  const shippingEl = document.getElementById("payShipping");
  const adminEl = document.getElementById("payAdmin");
  const totalEl = document.getElementById("payTotal");

  function formatRupiah(num) {
    return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  try {
    const saved = localStorage.getItem("zandle_payment_total");
    if (saved) {
      const data = JSON.parse(saved);
      if (subtotalEl && data.subtotal) subtotalEl.textContent = formatRupiah(data.subtotal);
      if (shippingEl && data.shipping) shippingEl.textContent = formatRupiah(data.shipping);
      if (adminEl && data.adminFee) adminEl.textContent = formatRupiah(data.adminFee);
      if (totalEl && data.total) totalEl.textContent = formatRupiah(data.total);
    }
  } catch (e) {
  }

  if (timerEl) {
    let timeLeft = 10 * 60; 
    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        timerEl.textContent = "00:00:00";
        return;
      }
      timeLeft--;
      const hours = "00";
      const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      const seconds = (timeLeft % 60).toString().padStart(2, "0");
      timerEl.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  }
});
