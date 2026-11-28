function formatRupiah(num) {
  return "Rp " + (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
  const subtotalEl = document.getElementById("doneSubtotal");
  const shippingEl = document.getElementById("doneShipping");
  const adminEl = document.getElementById("doneAdmin");
  const totalEl = document.getElementById("doneTotal");
  const doneOrderCodeEl = document.getElementById("doneOrderCode");
  const doneItemsList = document.getElementById("doneItemsList");

  const latestCode = localStorage.getItem("zandle_latest_order_code");
  let foundOrder = null;

  try {
    const rawOrders = localStorage.getItem("zandle_orders");
    if (rawOrders) {
      const orders = JSON.parse(rawOrders);
      if (Array.isArray(orders) && orders.length > 0) {
        if (latestCode) {
          foundOrder = orders.find((o) => o.code === latestCode);
        }
        if (!foundOrder) foundOrder = orders[0];
      }
    }
  } catch (e) {
  }

  if (foundOrder) {
    if (doneOrderCodeEl) {
      doneOrderCodeEl.textContent = `#${foundOrder.code}`;
    }

    if (doneItemsList && foundOrder.items && foundOrder.items.length > 0) {
      doneItemsList.innerHTML = foundOrder.items.map((it) => {
        const titleText = (it.qty && it.qty > 1 ? `${it.qty}x ` : "") + escapeHtml(it.title);
        const specText = escapeHtml(it.options || it.desc || "Lilin Aromaterapi Signature");
        const priceText = formatRupiah((it.price || 0) * (it.qty || 1));
        return `
          <div class="done-item-row">
            <div class="done-item-meta">
              <span class="done-item-name">${titleText}</span>
              <span class="done-item-spec">${specText}</span>
            </div>
            <span class="done-item-price">${priceText}</span>
          </div>
        `;
      }).join("");
    }

    if (subtotalEl) subtotalEl.textContent = formatRupiah(foundOrder.subtotal);
    if (shippingEl) shippingEl.textContent = formatRupiah(foundOrder.shipping);
    if (adminEl) adminEl.textContent = formatRupiah(foundOrder.adminFee);
    if (totalEl) totalEl.textContent = formatRupiah(foundOrder.total);

    try {
      const rawCart = localStorage.getItem("zandle_cart");
      if (rawCart) {
        let cart = JSON.parse(rawCart);
        if (Array.isArray(cart)) {
          const remainingCart = cart.filter((item) => item.selected === false);
          localStorage.setItem("zandle_cart", JSON.stringify(remainingCart));
          if (typeof updateNavCartBadge === "function") {
            updateNavCartBadge();
          }
        }
      }
    } catch (e) {
    }
  } else {
    if (latestCode && doneOrderCodeEl) {
      doneOrderCodeEl.textContent = `#${latestCode}`;
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
  }

  localStorage.removeItem("zandle_direct_checkout");
});
