const CART_STORAGE_KEY = "zandle_cart";
const SHIPPING_STORAGE_KEY = "zandle_shipping";

const DEFAULT_CART = [
  {
    id: 1,
    title: "Lilin Custom — Sage Green",
    desc: 'Aroma: Lavender Bliss • 200ml • Label: "Untuk Kamu"',
    price: 75000,
    qty: 1,
    img: "assets/images/candle-green.png",
    selected: true
  },
  {
    id: 2,
    title: "Matcha Breeze",
    desc: "Signature Daily Fresh • 150ml",
    price: 50000,
    qty: 1,
    img: "assets/images/candle-green.png",
    selected: true
  },
  {
    id: 3,
    title: "Pure Soy Signature",
    desc: "Natural White • 200ml",
    price: 25000,
    qty: 1,
    img: "assets/images/candle-white.png",
    selected: true
  }
];

function getCartItems() {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(DEFAULT_CART));
    return DEFAULT_CART.map((item) => ({ ...item }));
  }
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
  }
  return DEFAULT_CART.map((item) => ({ ...item }));
}

function saveCartItems(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  if (typeof updateNavCartBadge === "function") {
    updateNavCartBadge();
  }
}

function formatRupiah(number) {
  return "Rp " + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsCol = document.getElementById("cartItemsCol");
  const checkSelectAll = document.getElementById("checkSelectAll");
  const selectedCountText = document.getElementById("selectedCountText");
  const btnDeleteSelected = document.getElementById("btnDeleteSelected");
  const summaryItemCount = document.getElementById("summaryItemCount");
  const subtotalText = document.getElementById("subtotalText");
  const shippingText = document.getElementById("shippingText");
  const shippingCitySelect = document.getElementById("shippingCitySelect");
  const shippingDetailLabel = document.getElementById("shippingDetailLabel");
  const discountRow = document.getElementById("discountRow");
  const discountText = document.getElementById("discountText");
  const grandTotalText = document.getElementById("grandTotalText");
  const promoForm = document.getElementById("promoForm");
  const promoInput = document.getElementById("promoInput");
  const btnApplyPromo = document.getElementById("btnApplyPromo");
  const promoFeedback = document.getElementById("promoFeedback");

  let appliedDiscount = 0;
  let cartData = getCartItems();

  function calculateShipping(itemCount) {
    if (itemCount === 0) return 0;
    const selectedOption = shippingCitySelect?.selectedOptions[0];
    const baseCost = parseInt(selectedOption?.dataset?.cost || "22000", 10);
    const extraPerItem = 3000;
    return baseCost + Math.max(0, itemCount - 1) * extraPerItem;
  }

  function renderCart() {
    if (!cartItemsCol) return;

    const existingRows = cartItemsCol.querySelectorAll(".cart-item-row");
    existingRows.forEach((r) => r.remove());

    const emptyExisting = cartItemsCol.querySelector(".cart-empty-state");
    if (emptyExisting) emptyExisting.remove();

    const selectAllRow = cartItemsCol.querySelector(".cart-select-all-row");

    if (cartData.length === 0) {
      if (selectAllRow) selectAllRow.style.display = "none";

      const emptyDiv = document.createElement("div");
      emptyDiv.className = "cart-empty-state";
      emptyDiv.innerHTML = `
        <h3>Keranjang Belanja Kosong</h3>
        <p>Anda belum memiliki lilin di dalam keranjang.</p>
        <a href="katalog.html" class="btn-primary" style="display: inline-block;">Jelajahi Lilin Sekarang</a>
      `;
      cartItemsCol.insertBefore(emptyDiv, cartItemsCol.querySelector("div:last-child"));
      updateSummary();
      return;
    }

    if (selectAllRow) selectAllRow.style.display = "flex";

    const lastChild = cartItemsCol.querySelector("div:last-child");

    cartData.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item-row";
      row.dataset.id = item.id;
      row.dataset.price = item.price;

      row.innerHTML = `
        <div class="cart-item-info">
          <input type="checkbox" class="cart-item-check item-select-box" ${item.selected !== false ? "checked" : ""}>
          <div class="cart-item-thumb">
            <img src="${item.img}" alt="${escapeHtml(item.title)}">
          </div>
          <div class="cart-item-meta">
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.desc)}</p>
            <p style="font-weight: 600; color: var(--text-dark); margin-top: 4px;">${formatRupiah(item.price)}</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
          <div class="quantity-stepper">
            <button type="button" class="step-btn btn-cart-minus" aria-label="Kurangi kuantitas">-</button>
            <span class="cart-item-qty" style="font-weight: 600; min-width: 16px; text-align: center;">${item.qty}</span>
            <button type="button" class="step-btn btn-cart-plus" aria-label="Tambah kuantitas">+</button>
          </div>
          <span class="cart-item-row-total" style="font-weight: 600; font-size: 15px; min-width: 90px; text-align: right;">${formatRupiah(item.price * item.qty)}</span>
          <button type="button" class="cart-item-delete-btn" title="Hapus pesanan">✕</button>
        </div>
      `;

      const checkEl = row.querySelector(".item-select-box");
      const btnMinus = row.querySelector(".btn-cart-minus");
      const btnPlus = row.querySelector(".btn-cart-plus");
      const btnDelete = row.querySelector(".cart-item-delete-btn");

      checkEl.addEventListener("change", () => {
        item.selected = checkEl.checked;
        saveCartItems(cartData);
        syncSelectAllState();
        updateSummary();
      });

      btnMinus.addEventListener("click", () => {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          if (confirm(`Hapus "${item.title}" dari keranjang?`)) {
            cartData = cartData.filter((i) => i.id !== item.id);
            saveCartItems(cartData);
            renderCart();
            return;
          }
        }
        saveCartItems(cartData);
        updateRowDisplay(row, item);
        updateSummary();
      });

      btnPlus.addEventListener("click", () => {
        item.qty += 1;
        saveCartItems(cartData);
        updateRowDisplay(row, item);
        updateSummary();
      });

      btnDelete.addEventListener("click", () => {
        cartData = cartData.filter((i) => i.id !== item.id);
        saveCartItems(cartData);
        renderCart();
      });

      cartItemsCol.insertBefore(row, lastChild);
    });

    syncSelectAllState();
    updateSummary();
  }

  function updateRowDisplay(row, item) {
    const qtySpan = row.querySelector(".cart-item-qty");
    const totalSpan = row.querySelector(".cart-item-row-total");
    if (qtySpan) qtySpan.textContent = item.qty;
    if (totalSpan) totalSpan.textContent = formatRupiah(item.price * item.qty);
  }

  function syncSelectAllState() {
    if (!checkSelectAll) return;
    const allSelected = cartData.length > 0 && cartData.every((item) => item.selected !== false);
    checkSelectAll.checked = allSelected;

    const selectedCount = cartData.filter((item) => item.selected !== false).length;
    if (selectedCountText) {
      selectedCountText.textContent = selectedCount;
    }
  }

  function updateSummary() {
    const selectedItems = cartData.filter((item) => item.selected !== false);
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalSelectedQty = selectedItems.reduce((sum, item) => sum + item.qty, 0);

    const shipping = calculateShipping(totalSelectedQty);
    const grandTotal = Math.max(0, subtotal + shipping - appliedDiscount);

    if (summaryItemCount) summaryItemCount.textContent = totalSelectedQty;
    if (subtotalText) subtotalText.textContent = formatRupiah(subtotal);
    if (shippingText) shippingText.textContent = formatRupiah(shipping);

    if (shippingDetailLabel && shippingCitySelect) {
      const opt = shippingCitySelect.selectedOptions[0];
      const cityName = opt?.text || "Jakarta";
      shippingDetailLabel.textContent = `Estimasi (Malang ke ${cityName} • ${totalSelectedQty} item)`;
    }

    if (discountRow && discountText) {
      if (appliedDiscount > 0 && selectedItems.length > 0) {
        discountRow.style.display = "flex";
        discountText.textContent = `-${formatRupiah(appliedDiscount)}`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (grandTotalText) grandTotalText.textContent = formatRupiah(grandTotal);

    saveCartItems(cartData);

    const checkoutState = {
      subtotal,
      shipping,
      grandTotal,
      selectedQty: totalSelectedQty,
      city: shippingCitySelect?.value || "jakarta"
    };
    localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(checkoutState));
  }

  if (shippingCitySelect) {
    shippingCitySelect.addEventListener("change", () => {
      updateSummary();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (checkSelectAll) {
    checkSelectAll.addEventListener("change", () => {
      const isChecked = checkSelectAll.checked;
      cartData.forEach((item) => {
        item.selected = isChecked;
      });
      saveCartItems(cartData);
      renderCart();
    });
  }

  if (btnDeleteSelected) {
    btnDeleteSelected.addEventListener("click", () => {
      const count = cartData.filter((i) => i.selected !== false).length;
      if (count === 0) {
        alert("Pilih setidaknya satu lilin untuk dihapus.");
        return;
      }
      if (confirm(`Hapus ${count} lilin yang dipilih dari keranjang?`)) {
        cartData = cartData.filter((i) => i.selected === false);
        saveCartItems(cartData);
        renderCart();
      }
    });
  }

  if (btnApplyPromo && promoInput) {
    const handlePromo = () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!promoFeedback) return;

      if (code === "ZANDLE10" || code === "DISKON15") {
        appliedDiscount = 15000;
        promoFeedback.style.display = "block";
        promoFeedback.style.color = "#16a34a";
        promoFeedback.textContent = "Kupon berhasil dipasang! Potongan Rp 15.000.";
        updateSummary();
      } else if (code === "") {
        promoFeedback.style.display = "block";
        promoFeedback.style.color = "#dc2626";
        promoFeedback.textContent = "Silakan masukkan kode promo.";
      } else {
        appliedDiscount = 0;
        promoFeedback.style.display = "block";
        promoFeedback.style.color = "#dc2626";
        promoFeedback.textContent = "Kode kupon tidak valid atau telah kedaluwarsa.";
        updateSummary();
      }
    };

    btnApplyPromo.addEventListener("click", handlePromo);
    if (promoForm) {
      promoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handlePromo();
      });
    }
  }

  renderCart();
});
