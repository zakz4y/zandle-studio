const PROFILE_STORAGE_KEY = "zandle_user_profile";
const ORDERS_STORAGE_KEY = "zandle_orders";

const DEFAULT_PROFILE = {
  name: "Zacky Achmad",
  phone: "081234567890",
  city: "jakarta",
  cost: 22000,
  cityLabel: "Jakarta",
  postalCode: "65141",
  address: "Jl. Terusan Ijen No. 12, Klojen, Kota Malang, Jawa Timur"
};

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

function getUserProfile() {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch (e) {
    }
  }
  return { ...DEFAULT_PROFILE };
}

function saveUserProfile(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  const shippingState = {
    shipping: profile.cost,
    city: profile.city,
    cityLabel: profile.cityLabel
  };
  localStorage.setItem("zandle_shipping", JSON.stringify(shippingState));
}

function getStoredOrders() {
  const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-pill");
  const navViewBtns = document.querySelectorAll(".nav-view-btn");
  const panelOrders = document.getElementById("panelOrders");
  const panelProfile = document.getElementById("panelProfile");
  const dropdownProfileLink = document.getElementById("dropdownProfileLink");
  const dropdownOrderLink = document.getElementById("dropdownOrderLink");

  const ordersTable = document.getElementById("ordersTable");
  const ordersTableBody = document.getElementById("ordersTableBody");
  const ordersEmptyState = document.getElementById("ordersEmptyState");
  const ordersPagination = document.getElementById("ordersPagination");

  const orderModal = document.getElementById("orderModal");
  const modalOrderTitle = document.getElementById("modalOrderTitle");
  const modalOrderBody = document.getElementById("modalOrderBody");
  const orderModalClose = document.getElementById("orderModalClose");
  const orderModalDismiss = document.getElementById("orderModalDismiss");

  const cancelConfirmModal = document.getElementById("cancelConfirmModal");
  const cancelTargetOrderCode = document.getElementById("cancelTargetOrderCode");
  const cancelModalClose = document.getElementById("cancelModalClose");
  const cancelModalDismiss = document.getElementById("cancelModalDismiss");
  const btnConfirmCancelOrder = document.getElementById("btnConfirmCancelOrder");

  let pendingCancelOrderCode = null;

  function openOrderModal(title, htmlContent) {
    if (!orderModal) return;
    if (modalOrderTitle) modalOrderTitle.textContent = title;
    if (modalOrderBody) modalOrderBody.innerHTML = htmlContent;
    orderModal.classList.add("open");
  }

  function closeOrderModal() {
    if (!orderModal) return;
    orderModal.classList.remove("open");
  }

  function openCancelModal(code) {
    pendingCancelOrderCode = code;
    if (cancelTargetOrderCode) {
      cancelTargetOrderCode.textContent = `#${code}`;
    }
    if (cancelConfirmModal) {
      cancelConfirmModal.classList.add("open");
    }
  }

  function closeCancelModal() {
    pendingCancelOrderCode = null;
    if (cancelConfirmModal) {
      cancelConfirmModal.classList.remove("open");
    }
  }

  if (orderModalClose) orderModalClose.addEventListener("click", closeOrderModal);
  if (orderModalDismiss) orderModalDismiss.addEventListener("click", closeOrderModal);
  if (orderModal) {
    orderModal.addEventListener("click", (e) => {
      if (e.target === orderModal) closeOrderModal();
    });
  }

  if (cancelModalClose) cancelModalClose.addEventListener("click", closeCancelModal);
  if (cancelModalDismiss) cancelModalDismiss.addEventListener("click", closeCancelModal);
  if (cancelConfirmModal) {
    cancelConfirmModal.addEventListener("click", (e) => {
      if (e.target === cancelConfirmModal) closeCancelModal();
    });
  }

  if (btnConfirmCancelOrder) {
    btnConfirmCancelOrder.addEventListener("click", () => {
      if (!pendingCancelOrderCode) return;
      const order = userOrders.find((o) => o.code === pendingCancelOrderCode);
      if (order) {
        order.status = "dibatalkan";
        order.statusLabel = "Dibatalkan";
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(userOrders));
      }
      closeCancelModal();
      closeOrderModal();
      renderOrders();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (cancelConfirmModal && cancelConfirmModal.classList.contains("open")) {
        closeCancelModal();
      } else if (orderModal && orderModal.classList.contains("open")) {
        closeOrderModal();
      }
    }
  });

  let currentTabFilter = "all";
  const userOrders = getStoredOrders();

  function renderOrders() {
    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = "";

    const filtered = userOrders.filter((order) => {
      if (currentTabFilter === "all") return true;
      return order.status === currentTabFilter;
    });

    if (filtered.length === 0) {
      if (ordersTable) ordersTable.style.display = "none";
      if (ordersEmptyState) ordersEmptyState.style.display = "block";
      if (ordersPagination) ordersPagination.style.display = "none";
      return;
    }

    if (ordersTable) ordersTable.style.display = "table";
    if (ordersEmptyState) ordersEmptyState.style.display = "none";
    if (ordersPagination) ordersPagination.style.display = "flex";

    filtered.forEach((order) => {
      const tr = document.createElement("tr");
      tr.dataset.status = order.status || "dibuat";

      const itemsSummary = (order.items || []).map((it) => {
        return `<strong>${it.qty || 1}x ${escapeHtml(it.title)}</strong>`;
      }).join("<br>");

      const firstItemNote = (order.items && order.items[0]?.options) || "Lilin aromaterapi buatan tangan";

      let actionButtonHtml = "";
      if (order.status === "dikirim") {
        actionButtonHtml = `<button type="button" class="btn-outline action-btn" data-action="resi" data-code="${order.code}" style="padding: 6px 14px; font-size: 12px;">Lacak Resi</button>`;
      } else if (order.status === "selesai") {
        actionButtonHtml = `<a href="kustomisasi.html" class="btn-outline" style="padding: 6px 14px; font-size: 12px; text-decoration: none;">Beli Lagi</a>`;
      } else if (order.status === "dibatalkan") {
        actionButtonHtml = `<button type="button" class="btn-outline action-btn" data-action="detail" data-code="${order.code}" style="padding: 6px 14px; font-size: 12px;">Detail</button>`;
      } else {
        actionButtonHtml = `
          <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
            <button type="button" class="btn-outline action-btn" data-action="detail" data-code="${order.code}" style="padding: 6px 12px; font-size: 12px;">Detail</button>
            <button type="button" class="btn-outline action-btn" data-action="cancel" data-code="${order.code}" style="padding: 6px 10px; font-size: 12px; color: #dc2626; border-color: #fca5a5;">Batalkan</button>
          </div>
        `;
      }

      tr.innerHTML = `
        <td><strong style="font-family: var(--font-mono); color: var(--color-brown-text); font-weight: 700;">#${escapeHtml(order.code)}</strong></td>
        <td>${escapeHtml(order.date || "-")}</td>
        <td>
          ${itemsSummary}
          <div style="font-size: 12px; color: var(--text-body); margin-top: 2px;">${escapeHtml(firstItemNote)}</div>
        </td>
        <td><strong>${formatRupiah(order.total || 0)}</strong></td>
        <td><span class="status-badge ${escapeHtml(order.status || 'dibuat')}">${escapeHtml(order.statusLabel || 'Diproses')}</span></td>
        <td style="text-align: right;">${actionButtonHtml}</td>
      `;

      ordersTableBody.appendChild(tr);
    });

    bindActionButtons();
  }

  function bindActionButtons() {
    const actionBtns = ordersTableBody?.querySelectorAll(".action-btn") || [];
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.dataset.code;
        const action = btn.dataset.action;
        const order = userOrders.find((o) => o.code === code);
        if (!order) return;

        if (action === "cancel") {
          handleCancelOrder(code);
          return;
        }

        if (action === "resi") {
          const resiHtml = `
            <div style="background: #faf8f5; border: 1px solid var(--border-subtle); border-radius: 10px; padding: 14px; margin-bottom: 16px;">
              <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 2px;">Nomor Resi Pengiriman</div>
              <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--text-dark);">JNE-MLG-${order.code.replace('ZS-', '')}9281</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #16a34a; margin-top: 6px;"></span>
                <div>
                  <div style="font-weight: 600; font-size: 13px;">Paket dalam perjalanan ke kota tujuan</div>
                  <div style="font-size: 12px; color: var(--text-body);">Tujuan: ${escapeHtml(order.shippingAddress?.city || 'Kota Tujuan')}</div>
                </div>
              </div>
              <div style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--border-main); margin-top: 6px;"></span>
                <div>
                  <div style="font-size: 13px; color: var(--text-body);">Paket diserahkan ke kurir JNE Express Malang</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${escapeHtml(order.date)}</div>
                </div>
              </div>
            </div>
          `;
          openOrderModal(`Lacak Resi #${order.code}`, resiHtml);
        } else {
          const itemsListHtml = (order.items || []).map((it) => `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--border-subtle); font-size: 13px;">
              <div>
                <strong>${it.qty || 1}x ${escapeHtml(it.title)}</strong>
                <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(it.options || '')}</div>
              </div>
              <span style="font-weight: 600;">${formatRupiah(it.price * (it.qty || 1))}</span>
            </div>
          `).join("");

          const detailHtml = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <span style="font-size: 12px; color: var(--text-muted); display: block;">Tanggal Pembelian</span>
                <strong>${escapeHtml(order.date)}</strong>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 12px; color: var(--text-muted); display: block;">Status Pesanan</span>
                <span class="status-badge ${escapeHtml(order.status || 'dibuat')}">${escapeHtml(order.statusLabel || 'Diproses')}</span>
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <span style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">ALAMAT PENERIMA</span>
              <div style="font-size: 13px; line-height: 1.5; background: #faf8f5; padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle);">
                <strong>${escapeHtml(order.shippingAddress?.receiver || 'Penerima')}</strong> (${escapeHtml(order.shippingAddress?.phone || '-')})<br>
                ${escapeHtml(order.shippingAddress?.address || '-')}<br>
                ${escapeHtml(order.shippingAddress?.city || '')} ${escapeHtml(order.shippingAddress?.postal || '')}
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <span style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">ITEM DIPESAN</span>
              ${itemsListHtml}
            </div>

            <div style="background: #ffffff; border-radius: 8px; font-size: 13px; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-body);">Subtotal</span>
                <span>${formatRupiah(order.subtotal || 0)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-body);">Ongkos Kirim</span>
                <span>${formatRupiah(order.shipping || 0)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-body);">Biaya Layanan</span>
                <span>${formatRupiah(order.adminFee || 0)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; margin-top: 6px; padding-top: 8px; border-top: 1.5px solid var(--border-main);">
                <span>Total Pembayaran</span>
                <span style="color: var(--color-brown-text);">${formatRupiah(order.total || 0)}</span>
              </div>
            </div>
            ${order.status === "dibuat" ? `
              <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: var(--text-muted);">Pesanan belum diproses kurir</span>
                <button type="button" class="btn-outline modal-cancel-btn" data-code="${order.code}" style="color: #dc2626; border-color: #fca5a5; font-size: 12px; padding: 6px 14px; cursor: pointer;">Batalkan Pesanan Ini</button>
              </div>
            ` : ""}
          `;
          openOrderModal(`Rincian Pesanan #${order.code}`, detailHtml);

          const modalCancelBtn = modalOrderBody?.querySelector(".modal-cancel-btn");
          if (modalCancelBtn) {
            modalCancelBtn.addEventListener("click", () => {
              handleCancelOrder(order.code);
            });
          }
        }
      });
    });
  }

  function handleCancelOrder(code) {
    openCancelModal(code);
  }

  renderOrders();

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentTabFilter = tab.dataset.tab;
      renderOrders();
    });
  });

  function switchPanel(targetId) {
    navViewBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.target === targetId);
    });
    if (panelOrders) panelOrders.classList.toggle("active", targetId === "panelOrders");
    if (panelProfile) panelProfile.classList.toggle("active", targetId === "panelProfile");
  }

  navViewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      switchPanel(target);
      if (history.replaceState) {
        history.replaceState(null, "", target === "panelProfile" ? "#profil" : "#pesanan");
      }
    });
  });

  if (dropdownProfileLink) {
    dropdownProfileLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchPanel("panelProfile");
      location.hash = "#profil";
    });
  }

  if (dropdownOrderLink) {
    dropdownOrderLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchPanel("panelOrders");
      location.hash = "#pesanan";
    });
  }

  if (window.location.hash === "#profil") {
    switchPanel("panelProfile");
  }

  const profileForm = document.getElementById("profileAddressForm");
  const profileNameInput = document.getElementById("profileName");
  const profilePhoneInput = document.getElementById("profilePhone");
  const profileCitySelect = document.getElementById("profileCity");
  const profilePostalInput = document.getElementById("profilePostalCode");
  const profileAddressInput = document.getElementById("profileAddress");
  const sidebarUserName = document.getElementById("sidebarUserName");
  const sidebarUserPhone = document.getElementById("sidebarUserPhone");
  const navUsername = document.getElementById("navUsername");
  const profileSaveNotice = document.getElementById("profileSaveNotice");

  const currentProfile = getUserProfile();
  if (profileNameInput) profileNameInput.value = currentProfile.name;
  if (profilePhoneInput) profilePhoneInput.value = currentProfile.phone;
  if (profileCitySelect) profileCitySelect.value = currentProfile.city;
  if (profilePostalInput) profilePostalInput.value = currentProfile.postalCode;
  if (profileAddressInput) profileAddressInput.value = currentProfile.address;

  function updateSidebarMeta(prof) {
    if (sidebarUserName) sidebarUserName.textContent = prof.name;
    if (sidebarUserPhone) sidebarUserPhone.textContent = prof.phone;
    if (navUsername) {
      const short = prof.name.split(" ")[0].toLowerCase();
      navUsername.textContent = short;
    }
  }

  updateSidebarMeta(currentProfile);

  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedOption = profileCitySelect?.selectedOptions[0];
      const cost = parseInt(selectedOption?.dataset?.cost || "22000", 10);
      const cityLabel = selectedOption?.dataset?.label || selectedOption?.text || "Jakarta";

      const updated = {
        name: profileNameInput?.value.trim() || DEFAULT_PROFILE.name,
        phone: profilePhoneInput?.value.trim() || DEFAULT_PROFILE.phone,
        city: profileCitySelect?.value || DEFAULT_PROFILE.city,
        cost: cost,
        cityLabel: cityLabel,
        postalCode: profilePostalInput?.value.trim() || DEFAULT_PROFILE.postalCode,
        address: profileAddressInput?.value.trim() || DEFAULT_PROFILE.address
      };

      saveUserProfile(updated);
      updateSidebarMeta(updated);

      if (profileSaveNotice) {
        profileSaveNotice.style.display = "inline-block";
        setTimeout(() => {
          profileSaveNotice.style.display = "none";
        }, 3000);
      }
    });
  }

  const pageBtns = document.querySelectorAll(".pagination .page-btn");
  pageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled || btn.textContent.includes("Prev") || btn.textContent.includes("Next")) return;
      pageBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});