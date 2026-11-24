document.addEventListener("DOMContentLoaded", () => {
  const subtotalEl = document.getElementById("doneSubtotal");
  const shippingEl = document.getElementById("doneShipping");
  const adminEl = document.getElementById("doneAdmin");
  const totalEl = document.getElementById("doneTotal");

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
});
