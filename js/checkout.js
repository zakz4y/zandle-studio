document.addEventListener("DOMContentLoaded", () => {
  const shippingLabels = document.querySelectorAll(".shipping-option");
  const shippingCostEl = document.getElementById("checkoutShippingCost");
  const grandTotalEl = document.getElementById("checkoutGrandTotal");

  const paymentLabels = document.querySelectorAll(".payment-choice");
  const bcaBox = document.getElementById("bcaDetailBox");
  const mandiriBox = document.getElementById("mandiriDetailBox");

  const baseSubtotal = 150000;
  const adminFee = 1000;
  let currentShippingCost = 15000;

  try {
    const saved = localStorage.getItem("zandle_shipping");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.shipping && typeof parsed.shipping === "number") {
        currentShippingCost = parsed.shipping;
      }
    }
  } catch (e) {
  }

  function updateTotal() {
    if (shippingCostEl) {
      shippingCostEl.textContent = "Rp " + currentShippingCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const total = baseSubtotal + currentShippingCost + adminFee;
    if (grandTotalEl) {
      grandTotalEl.textContent = "Rp " + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const state = {
      subtotal: baseSubtotal,
      shipping: currentShippingCost,
      adminFee: adminFee,
      total: total
    };
    localStorage.setItem("zandle_payment_total", JSON.stringify(state));
  }

  shippingLabels.forEach((label) => {
    const radio = label.querySelector('input[type="radio"]');

    label.addEventListener("click", () => {
      shippingLabels.forEach((l) => l.classList.remove("active"));
      label.classList.add("active");
      if (radio) radio.checked = true;

      const cost = parseInt(label.dataset.cost || radio?.value || "15000", 10);
      currentShippingCost = cost;
      updateTotal();
    });

    if (radio && radio.checked) {
      shippingLabels.forEach((l) => l.classList.remove("active"));
      label.classList.add("active");
      currentShippingCost = parseInt(label.dataset.cost || radio.value || "15000", 10);
    }
  });

  paymentLabels.forEach((label) => {
    const radio = label.querySelector('input[type="radio"]');
    const pType = label.dataset.type || radio?.value;

    label.addEventListener("click", () => {
      paymentLabels.forEach((l) => l.classList.remove("active"));
      label.classList.add("active");
      if (radio) radio.checked = true;

      if (bcaBox) bcaBox.style.display = pType === "bca" ? "block" : "none";
      if (mandiriBox) mandiriBox.style.display = pType === "mandiri" ? "block" : "none";
    });
  });

  updateTotal();

  const vaCopyBtns = document.querySelectorAll(".va-copy-btn");
  vaCopyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.code || "8271081234567890";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "Tersalin!";
          setTimeout(() => {
            btn.textContent = "Salin No. VA";
          }, 2000);
        });
      } else {
        alert("Nomor VA: " + code);
      }
    });
  });
});
