(async function () {
  "use strict";

  // ==========================================
  // 1. SECURITY SECURITY & STORAGE MANAGERS
  // ==========================================
  function getStoredToken() {
    return localStorage.getItem("token");
  }

  function safeParseUser(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function getUserFromStorage() {
    return (
      safeParseUser(localStorage.getItem("user")) ||
      safeParseUser(localStorage.getItem("currentUser"))
    );
  }

  // ==========================================
  // 2. DATA EXTRACTION & FORMATTING ENGINE
  // ==========================================
  function getDisplayName(user) {
    if (!user) return "Sayed Hasan Sami";
    const target = user.user || user.profile || user;
    if (typeof target === "string") {
      return target.trim() || "Sayed Hasan Sami";
    }
    const firstName = String(target.firstName || target.firstname || "").trim();
    const lastName = String(target.lastName || target.lastname || "").trim();
    const fullName = String(target.name || target.fullName || "").trim();
    if (firstName || lastName) return `${firstName} ${lastName}`.trim();
    if (fullName) return fullName;
    if (target.email) return String(target.email).split("@")[0];
    return "Sayed Hasan Sami";
  }

  function getInitials(displayName) {
    const parts = String(displayName || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return "MF";
    return parts
      .slice(0, 3)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("selectedJob");
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "/pages/signin.html";
  }

  window.MFHUserSession = {
    getCurrentUser: function () {
      const storedUser = getUserFromStorage();
      const fallbackName =
        new URLSearchParams(window.location.search).get("name") ||
        "Sayed Hasan Sami";
      return {
        raw: storedUser,
        displayName: storedUser ? getDisplayName(storedUser) : fallbackName,
      };
    },
    getDisplayName: getDisplayName,
    getInitials: getInitials,
  };

  // ==========================================
  // 3. SECURE AUTH & LIVE CONTENT ORCHESTRATOR
  // ==========================================
  const token = getStoredToken();
  if (!token) {
    window.location.href = "/pages/signin.html";
    return;
  }

  async function fetchUserProfile(authToken) {
    try {
      const response = await fetch(
        "https://freelancerhubbackend.onrender.com/api/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      if (!response.ok) throw new Error("Backend rejected authorization token session.");
      return await response.json();
    } catch (err) {
      console.error("Profile synchronization engine failure:", err);
      return null;
    }
  }

async function syncDashboardSession() {
  let profileData = await fetchUserProfile(token);

  if (!profileData) {
    profileData = getUserFromStorage();
    if (!profileData) {
      console.warn("No valid remote session or local fallback data cache payload found. Redirecting to auth.");
      handleLogout();
      return;
    }
  } else {
    localStorage.setItem("user", JSON.stringify(profileData));
  }

  const displayName =
    `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() ||
    getDisplayName(profileData);

  const avatarUrl = profileData.avatar_url;
  const firstName =
    profileData.firstName ||
    profileData.firstname ||
    displayName.split(/\s+/)[0] ||
    "User";

  // Sidebar avatar
  const sidebarAvatar = document.getElementById("sidebarAvatar");
  if (sidebarAvatar) {
    sidebarAvatar.src =
      avatarUrl ||
      "https://res.cloudinary.com/dz6mwsw9d/image/upload/v1778526754/fallback_img.png";
    sidebarAvatar.alt = displayName;
  }

  // Sidebar name
  const sidebarName = document.getElementById("sidebarName");
  if (sidebarName) sidebarName.textContent = displayName;

  // Topbar profile avatar
  const topbarProfile = document.getElementById("topbarProfile");
  if (topbarProfile) {
    topbarProfile.src =
      avatarUrl ||
      "https://res.cloudinary.com/dz6mwsw9d/image/upload/v1778526754/fallback_img.png";
    topbarProfile.alt = displayName;
  }

  // Greeting
  const greetingTitle = document.getElementById("greetingTitle");
  if (greetingTitle) greetingTitle.textContent = `${getGreeting()}, ${firstName} 👋`;
}

  // ==========================================
  // 4. INTERACTION EVENT LISTENERS
  // ==========================================
  function setupSidebarMenus() {
    const sidebarGroupButton = document.querySelector(".sidebar_group_button");
    if (sidebarGroupButton) {
      const sidebarGroup = sidebarGroupButton.closest(".sidebar_group");
      const sidebarSubmenu = sidebarGroup
        ? sidebarGroup.querySelector(".sidebar_submenu")
        : null;
      if (sidebarGroup && sidebarSubmenu) {
        sidebarGroupButton.addEventListener("click", function () {
          const isExpanded = sidebarGroupButton.getAttribute("aria-expanded") === "true";
          sidebarGroupButton.setAttribute("aria-expanded", String(!isExpanded));
          sidebarGroup.classList.toggle("is-open", !isExpanded);
          sidebarSubmenu.hidden = isExpanded;
        });
      }
    }

    const profileMenuToggle = document.getElementById("profileMenuToggle");
    const profileSubmenu = document.getElementById("profileSubmenu");
    const profileChevron = document.getElementById("profileChevron");
    if (profileMenuToggle && profileSubmenu) {
      profileMenuToggle.addEventListener("click", function () {
        const isHidden = profileSubmenu.hidden;
        profileSubmenu.hidden = !isHidden;
        if (profileChevron) {
          profileChevron.style.transform = isHidden ? "rotate(-180deg)" : "rotate(0deg)";
        }
      });
    }

    const logoutButton = document.getElementsByClassName("sidebar_logout");
    if (logoutButton.length > 0) {
      logoutButton[0].addEventListener("click", handleLogout);
    }

    // ✅ Messages button click handler
    const messagesButton = document.querySelector(
      '.topbar_icon_button[aria-label="Messages"]'
    );
    if (messagesButton) {
      messagesButton.addEventListener("click", () => {
        window.location.href = "../pages/massage.html"; // adjust path if needed
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      syncDashboardSession();
      setupSidebarMenus();
    });
  } else {
    syncDashboardSession();
    setupSidebarMenus();
  }
})();
