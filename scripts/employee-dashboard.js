
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

    // If local storage payload contains an embedded data wrapper or profile object
    const target = user.user || user.profile || user;

    if (typeof target === "string") {
      return target.trim() || "Sayed Hasan Sami";
    }

    const firstName = String(target.firstName || target.firstname || "").trim();
    const lastName = String(target.lastName || target.lastname || "").trim();
    const fullName = String(target.name || target.fullName || "").trim();

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    if (fullName) {
      return fullName;
    }
    if (target.email) {
      return String(target.email).split("@")[0];
    }

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
      .map(function (part) {
        return part.charAt(0);
      })
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

    // Clear fallbacks and transient project state tracking values
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("selectedJob");
    sessionStorage.removeItem("isLoggedIn");

    window.location.href = "/pages/signin.html";
  }

  // Expose helper API globally onto window object to preserve application cross-compatibility
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

  // Instant Security Scan before page layout rendering finishes
  const token = getStoredToken();
  if (!token) {
    window.location.href = "/pages/signin.html";
    return; // Kill compilation scope thread execution immediately
  }

  // Profile retrieval pipeline from Render server infrastructure
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

      if (!response.ok)
        throw new Error("Backend rejected authorization token session.");
      return await response.json();
    } catch (err) {
      console.error("Profile synchronization engine failure:", err);
      return null;
    }
  }

  async function syncDashboardSession() {
    // Attempt live payload synchronization, fall back cleanly to local state cache if offline
    let profileData = await fetchUserProfile(token);

    if (!profileData) {
      profileData = getUserFromStorage();
      if (!profileData) {
        console.warn(
          "No valid remote session or local fallback data cache payload found. Redirecting to auth.",
        );
        handleLogout();
        return;
      }
    } else {
      // Refresh local cache values dynamically with current fresh server data
      localStorage.setItem("user", JSON.stringify(profileData));
    }

    // Process UI values safely
    const displayName =
      `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() ||
      getDisplayName(profileData);

    const avatarUrl = profileData.avatar_url;

    const firstName =
      profileData.firstName ||
      profileData.firstname ||
      displayName.split(/\s+/)[0] ||
      "User";

    // Target elements
    const sidebarProfileWrapper = document.getElementById("profileMenuToggle");
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const sidebarName = document.getElementById("sidebarName");
    const topbarProfile = document.getElementById("topbarProfile");
    const greetingTitle = document.getElementById("greetingTitle");

    // Populate values
    if (sidebarAvatar) {
      sidebarAvatar.src =
        avatarUrl ||
        "https://res.cloudinary.com/dz6mwsw9d/image/upload/v1778526754/fallback_img.png";

      sidebarAvatar.alt = displayName;
    }
    if (sidebarName) sidebarName.textContent = displayName;
    if (topbarProfile) topbarProfile.textContent = initials;
    if (greetingTitle)
      greetingTitle.textContent = `${getGreeting()}, ${firstName} 👋`;

    // Make interfaces visible simultaneously to eliminate page text layout flashing
    if (sidebarProfileWrapper) sidebarProfileWrapper.style.opacity = "1";
    if (topbarProfile) topbarProfile.style.opacity = "1";
    if (greetingTitle) greetingTitle.style.opacity = "1";
  }

  // ==========================================
  // 4. INTERACTION EVENT LISTENERS
  // ==========================================
  function setupSidebarMenus() {
    // Project Submenu Accordion Panel Toggle Handler
    const sidebarGroupButton = document.querySelector(".sidebar_group_button");
    if (sidebarGroupButton) {
      const sidebarGroup = sidebarGroupButton.closest(".sidebar_group");
      const sidebarSubmenu = sidebarGroup
        ? sidebarGroup.querySelector(".sidebar_submenu")
        : null;

      if (sidebarGroup && sidebarSubmenu) {
        sidebarGroupButton.addEventListener("click", function () {
          const isExpanded =
            sidebarGroupButton.getAttribute("aria-expanded") === "true";
          sidebarGroupButton.setAttribute("aria-expanded", String(!isExpanded));
          sidebarGroup.classList.toggle("is-open", !isExpanded);
          sidebarSubmenu.hidden = isExpanded;
        });
      }
    }

    // Main Dropdown Profile Widget Controller
    const profileMenuToggle = document.getElementById("profileMenuToggle");
    const profileSubmenu = document.getElementById("profileSubmenu");
    const profileChevron = document.getElementById("profileChevron");

    if (profileMenuToggle && profileSubmenu) {
      profileMenuToggle.addEventListener("click", function () {
        const isHidden = profileSubmenu.hidden;
        profileSubmenu.hidden = !isHidden;

        if (profileChevron) {
          profileChevron.style.transform = isHidden
            ? "rotate(-180deg)"
            : "rotate(0deg)";
        }
      });
    }

    // Application Logout Controller Action Target
    const logoutButton = document.getElementsByClassName("sidebar_logout");
    if (logoutButton.length > 0) {
      logoutButton[0].addEventListener("click", handleLogout);
    }
  }

  // Execute UI assignments cleanly when DOM nodes are available
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
