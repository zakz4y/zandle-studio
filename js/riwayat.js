const PROFILE_STORAGE_KEY = "zandle_user_profile";

const DEFAULT_PROFILE = {
  name: "Zacky Achmad",
  phone: "081234567890",
  city: "jakarta",
  cost: 22000,
  cityLabel: "Jakarta",
  postalCode: "65141",
  address: "Jl. Terusan Ijen No. 12, Klojen, Kota Malang, Jawa Timur"
};

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

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-pill");
  const rows = document.querySelectorAll(".order-table tbody tr");
  const actionBtns = document.querySelectorAll(".action-btn");
  const pageBtns = document.querySelectorAll(".pagination .page-btn");

  const navViewBtns = document.querySelectorAll(".nav-view-btn");
  const panelOrders = document.getElementById("panelOrders");
  const panelProfile = document.getElementById("panelProfile");
  const dropdownProfileLink = document.getElementById("dropdownProfileLink");
  const dropdownOrderLink = document.getElementById("dropdownOrderLink");

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

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.tab;
      rows.forEach((row) => {
        const status = row.dataset.status;
        if (filter === "all" || status === filter) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  });

  actionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const code = row?.querySelector("strong")?.textContent || "Pesanan";
      const actionName = btn.textContent.trim();

      if (actionName.includes("Lacak")) {
        alert(`${actionName} untuk ${code}:\nNo. Resi: JNE-MLG-90281928\nStatus: Paket sedang dalam perjalanan menuju kota tujuan.`);
      } else {
        const itemInfo = row?.querySelectorAll("td")[2]?.innerText?.replace(/\n/g, " - ") || "";
        alert(`Detail ${code}:\n${itemInfo}\nStatus: ${row?.querySelector(".status-badge")?.textContent}`);
      }
    });
  });

  pageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled || btn.textContent.includes("Prev") || btn.textContent.includes("Next")) return;
      pageBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});