function formatRupiah(number) {
  return "Rp " + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  const shippingLabels = document.querySelectorAll(".shipping-option");
  const shippingCostEl = document.getElementById("checkoutShippingCost");
  const checkoutSubtotalEl = document.getElementById("checkoutSubtotal");
  const grandTotalEl = document.getElementById("checkoutGrandTotal");
  const checkoutItemsList = document.getElementById("checkoutItemsList");

  const receiverNameInput = document.getElementById("checkoutReceiverName");
  const receiverPhoneInput = document.getElementById("checkoutReceiverPhone");
  const receiverPostalInput = document.getElementById("checkoutReceiverPostal");
  const receiverAddressInput = document.getElementById("checkoutReceiverAddress");

  const shipOptReguler = document.getElementById("shipOptReguler");
  const shipOptExpress = document.getElementById("shipOptExpress");
  const shipCostReguler = document.getElementById("shipCostReguler");
  const shipCostExpress = document.getElementById("shipCostExpress");
  const shipDescReguler = document.getElementById("shipDescReguler");
  const shipDescExpress = document.getElementById("shipDescExpress");

  const paymentLabels = document.querySelectorAll(".payment-choice");
  const bcaBox = document.getElementById("bcaDetailBox");
  const mandiriBox = document.getElementById("mandiriDetailBox");

  const adminFee = 1000;
  let baseShippingCost = 22000;
  let targetCityLabel = "Jakarta";
  let currentShippingCost = 22000;
  let checkoutItems = [];
  let baseSubtotal = 0;

  const savedProfile = localStorage.getItem("zandle_user_profile");
  if (savedProfile) {
    try {
      const prof = JSON.parse(savedProfile);
      if (prof.name && receiverNameInput) receiverNameInput.value = prof.name;
      if (prof.phone && receiverPhoneInput) receiverPhoneInput.value = prof.phone;
      if (prof.postalCode && receiverPostalInput) receiverPostalInput.value = prof.postalCode;
      if (prof.address && receiverAddressInput) receiverAddressInput.value = prof.address;
      if (prof.cost) baseShippingCost = prof.cost;
      if (prof.cityLabel) targetCityLabel = prof.cityLabel;
    } catch (e) {
    }
  }

  const savedShipping = localStorage.getItem("zandle_shipping");
  if (savedShipping) {
    try {
      const parsed = JSON.parse(savedShipping);
      if (parsed.shipping && typeof parsed.shipping === "number") {
        baseShippingCost = parsed.shipping;
      }
      if (parsed.cityLabel) {
        targetCityLabel = parsed.cityLabel;
      } else if (parsed.city) {
        targetCityLabel = parsed.city.charAt(0).toUpperCase() + parsed.city.slice(1);
      }
    } catch (e) {
    }
  }

  const expressCost = baseShippingCost + 10000;

  if (shipCostReguler) shipCostReguler.textContent = formatRupiah(baseShippingCost);
  if (shipCostExpress) shipCostExpress.textContent = formatRupiah(expressCost);
  if (shipDescReguler) shipDescReguler.textContent = `Tujuan: ${targetCityLabel} • Estimasi 2 - 3 hari kerja`;
  if (shipDescExpress) shipDescExpress.textContent = `Tujuan: ${targetCityLabel} • Estimasi 1 hari kerja`;

  if (shipOptReguler) {
    shipOptReguler.dataset.cost = baseShippingCost;
    const r = shipOptReguler.querySelector('input[type="radio"]');
    if (r) r.value = baseShippingCost;
  }
  if (shipOptExpress) {
    shipOptExpress.dataset.cost = expressCost;
    const r = shipOptExpress.querySelector('input[type="radio"]');
    if (r) r.value = expressCost;
  }

  currentShippingCost = baseShippingCost;

  const directItemStr = localStorage.getItem("zandle_direct_checkout");
  if (directItemStr) {
    try {
      const parsedDirect = JSON.parse(directItemStr);
      if (parsedDirect && typeof parsedDirect === "object") {
        checkoutItems = [parsedDirect];
      }
    } catch (e) {
    }
  }

  if (checkoutItems.length === 0) {
    const savedCart = localStorage.getItem("zandle_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          checkoutItems = parsedCart.filter((i) => i.selected !== false);
        }
      } catch (e) {
      }
    }
  }

  baseSubtotal = checkoutItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  if (checkoutItemsList) {
    checkoutItemsList.innerHTML = "";
    if (checkoutItems.length === 0) {
      checkoutItemsList.innerHTML = `<div style="font-size: 13px; color: var(--text-muted); padding: 8px 0;">Tidak ada item yang dipilih untuk checkout.</div>`;
    } else {
      checkoutItems.forEach((item, idx) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.marginBottom = idx === checkoutItems.length - 1 ? "0" : "8px";
        row.style.fontSize = "13px";

        const titleText = `${item.qty || 1}x ${escapeHtml(item.title)}`;
        const priceVal = formatRupiah(item.price * (item.qty || 1));

        row.innerHTML = `
          <span style="color: var(--text-dark); max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(item.title)}">${titleText}</span>
          <span style="font-weight: 600; color: var(--text-dark);">${priceVal}</span>
        `;
        checkoutItemsList.appendChild(row);
      });
    }
  }

  if (checkoutSubtotalEl) {
    checkoutSubtotalEl.textContent = formatRupiah(baseSubtotal);
  }

  function updateTotal() {
    if (shippingCostEl) {
      shippingCostEl.textContent = formatRupiah(currentShippingCost);
    }
    const total = baseSubtotal > 0 ? baseSubtotal + currentShippingCost + adminFee : 0;
    if (grandTotalEl) {
      grandTotalEl.textContent = formatRupiah(total);
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

      const cost = parseInt(label.dataset.cost || radio?.value || String(baseShippingCost), 10);
      currentShippingCost = cost;
      updateTotal();
    });

    if (radio && radio.checked) {
      shippingLabels.forEach((l) => l.classList.remove("active"));
      label.classList.add("active");
      currentShippingCost = parseInt(label.dataset.cost || radio.value || String(baseShippingCost), 10);
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

  const btnPayOrder = document.getElementById("btnPayOrder");
  if (btnPayOrder) {
    btnPayOrder.addEventListener("click", () => {
      if (checkoutItems.length > 0) {
        const orderIdNumber = Math.floor(1000 + Math.random() * 9000);
        const orderCode = `ZS-${orderIdNumber}`;
        const today = new Date();
        const dateStr = today.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });

        const newOrder = {
          code: orderCode,
          date: dateStr,
          status: "dibuat",
          statusLabel: "Sedang Dibuat",
          items: checkoutItems.map((item) => ({
            title: item.title,
            qty: item.qty || 1,
            price: item.price,
            options: item.options || ""
          })),
          subtotal: baseSubtotal,
          shipping: currentShippingCost,
          adminFee: adminFee,
          total: baseSubtotal + currentShippingCost + adminFee,
          shippingAddress: {
            receiver: receiverNameInput?.value || "Zacky Achmad",
            phone: receiverPhoneInput?.value || "081234567890",
            postal: receiverPostalInput?.value || "65141",
            address: receiverAddressInput?.value || "",
            city: targetCityLabel
          }
        };

        let existingOrders = [];
        try {
          const raw = localStorage.getItem("zandle_orders");
          if (raw) existingOrders = JSON.parse(raw);
          if (!Array.isArray(existingOrders)) existingOrders = [];
        } catch (e) {
          existingOrders = [];
        }

        existingOrders.unshift(newOrder);
        localStorage.setItem("zandle_orders", JSON.stringify(existingOrders));
        localStorage.setItem("zandle_latest_order_code", orderCode);
      }
    });
  }

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