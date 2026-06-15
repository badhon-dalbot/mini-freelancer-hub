// (function () {
//   // ==========================================
//   // 1. SESSION & CACHED STORAGE CHECK
//   // ==========================================
//   function getStoredToken() {
//     return localStorage.getItem("token");
//   }

//   function getLocalProfileData() {
//     try {
//       return JSON.parse(localStorage.getItem("user")) || null;
//     } catch (e) {
//       console.error("Failed to parse user session storage:", e);
//       return null;
//     }
//   }

//   function getDisplayName(userObj) {
//     if (!userObj || !userObj.profile) return "User";
//     const first = String(userObj.profile.first_name || "").trim();
//     const last = String(userObj.profile.last_name || "").trim();

//     if (first || last) return `${first} ${last}`.trim();
//     if (userObj.email) return userObj.email.split("@")[0];
//     return "User";
//   }

//   function getInitials(displayName) {
//     const parts = String(displayName || "")
//       .trim()
//       .split(/\s+/)
//       .filter(Boolean);
//     if (!parts.length) return "U";
//     return parts
//       .slice(0, 3)
//       .map((p) => p.charAt(0))
//       .join("")
//       .toUpperCase();
//   }

//   function getGreeting() {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good morning";
//     if (hour < 18) return "Good afternoon";
//     return "Good evening";
//   }

//   // ==========================================
//   // 2. DOM ELEMENTS MAPPING
//   // ==========================================
//   const statsRow = document.getElementById("statsRow");
//   const overviewCards = document.getElementById("overviewCards");
//   const payoutList = document.getElementById("payoutList");
//   const chartFilters = document.getElementById("chartFilters");
//   const earningsChart = document.getElementById("earningsChart");
//   const sidebarName = document.getElementById("sidebarName");
//   const sidebarAvatar = document.getElementById("sidebarAvatar");
//   const topbarProfile = document.getElementById("topbarProfile");
//   const greetingTitle = document.getElementById("greetingTitle");
//   const greetingText = document.getElementById("greetingText");

//   // Utility Formatter
//   function formatCurrency(value) {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       maximumFractionDigits: 0,
//     }).format(Number(value || 0));
//   }

//   // ==========================================
//   // 3. UI RENDERING ENGINE FUNCTIONS
//   // ==========================================
//   function renderStats(stats) {
//     if (!statsRow) return;

//     // Map live database metrics from login payload into the layout matrix
//     const metrics = [
//       {
//         icon: "◔",
//         tone: "orange",
//         label: "Ongoing projects",
//         value: stats.ongoing_projects || 0,
//         action: "View",
//       },
//       {
//         icon: "✓",
//         tone: "green",
//         label: "Completed projects",
//         value: stats.completed_projects || 0,
//         action: "View",
//       },
//       {
//         icon: "✕",
//         tone: "pink",
//         label: "Canceled projects",
//         value: stats.canceled_projects || 0,
//         action: "View",
//       },
//       {
//         icon: "▣",
//         tone: "violet",
//         label: "Completed tasks",
//         value: stats.tasks_sold - stats.ongoing_tasks || 0,
//         action: "View",
//       },
//     ];

//     statsRow.innerHTML = metrics
//       .map(function (stat) {
//         return `
//                 <article class="stat_card">
//                     <div class="stat_icon ${stat.tone}">${stat.icon}</div>
//                     <p class="stat_label">${stat.label}</p>
//                     <p class="stat_value">${stat.value}</p>
//                     <p class="stat_action">${stat.action}</p>
//                 </article>
//             `;
//       })
//       .join("");
//   }

//   function renderOverviewCards(stats) {
//     if (!overviewCards) return;

//     const cardsData = [
//       {
//         badge: "warning",
//         badgeLabel: "Ongoing",
//         value: stats.ongoing_tasks || 0,
//         label: "Ongoing tasks",
//       },
//       {
//         badge: "danger",
//         badgeLabel: "Cancelled",
//         value: stats.canceled_tasks || 0,
//         label: "Canceled tasks",
//       },
//       { badge: "danger", badgeLabel: "Open", value: 0, label: "Disputes" }, // Default placeholder fallback
//     ];

//     overviewCards.innerHTML = cardsData
//       .map(function (card) {
//         return `
//                 <article class="overview_card">
//                     <div class="overview_top_row">
//                         <span class="overview_badge ${card.badge}">${card.badgeLabel}</span>
//                         <button class="overview_view" type="button">View</button>
//                     </div>
//                     <p class="overview_value">${card.value}</p>
//                     <p class="overview_label">${card.label}</p>
//                 </article>
//             `;
//       })
//       .join("");
//   }

//   function renderPayouts(stats) {
//     if (!payoutList) return;

//     const payoutsData = [
//       {
//         label: "Wallet balance",
//         icon: "⌂",
//         value: formatCurrency(stats.available_in_account),
//         action: "Add credit",
//       },
//       {
//         label: "Pending income",
//         icon: "▭",
//         value: formatCurrency(stats.pending_income),
//         action: "View all",
//       },
//     ];

//     payoutList.innerHTML = payoutsData
//       .map(function (item) {
//         return `
//                 <article class="payout_item">
//                     <span class="payout_icon">${item.icon}</span>
//                     <span class="payout_label">${item.label}</span>
//                     <span class="payout_value">${item.value}</span>
//                     <span class="payout_action">${item.action}</span>
//                 </article>
//             `;
//       })
//       .join("");
//   }

//   function buildLinePath(values, width, height, padding) {
//     const chartWidth = width - (padding.left + padding.right);
//     const chartHeight = height - (padding.top + padding.bottom);
//     const highestValue = Math.max.apply(null, values);
//     const lowestValue = Math.min.apply(null, values);
//     const range = Math.max(highestValue - lowestValue, 0.25);
//     const step = chartWidth / Math.max(values.length - 1, 1);

//     return values.map(function (value, index) {
//       const x = padding.left + step * index;
//       const normalized = (value - lowestValue) / range;
//       const y = padding.top + chartHeight - normalized * chartHeight;
//       return { x: x, y: y };
//     });
//   }

//   function renderChart(filterKey, chartConfig) {
//     if (!earningsChart) return;

//     const chartData = chartConfig[filterKey] || chartConfig.weekly;
//     const width = 960;
//     const height = 280;
//     const padding = { top: 22, right: 24, bottom: 34, left: 42 };
//     const points = buildLinePath(chartData.values, width, height, padding);
//     const lastPoint = points[points.length - 1];
//     const firstPoint = points[0];

//     const areaPath = [
//       `M ${firstPoint.x} ${height - padding.bottom}`,
//       `L ${firstPoint.x} ${firstPoint.y}`,
//       points
//         .slice(1)
//         .map((p) => `L ${p.x} ${p.y}`)
//         .join(" "),
//       `L ${lastPoint.x} ${height - padding.bottom}`,
//       "Z",
//     ].join(" ");

//     const linePath = points
//       .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
//       .join(" ");

//     const gridLines = [0.15, 0.35, 0.55, 0.75, 0.95]
//       .map(function (ratio) {
//         const y = padding.top + (height - padding.top - padding.bottom) * ratio;
//         return `<line class="chart_grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line>`;
//       })
//       .join("");

//     const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//     const labelStep =
//       (width - padding.left - padding.right) / Math.max(labels.length - 1, 1);
//     const axisLabels = labels
//       .map(function (label, index) {
//         const x = padding.left + labelStep * index;
//         return `<text class="chart_axis_label" x="${x}" y="${height - 8}" text-anchor="middle">${label}</text>`;
//       })
//       .join("");

//     const valueLabels = ["$0", "$0.2", "$0.4", "$0.6", "$0.8", "$1.0", "$1.2"]
//       .map(function (label, index) {
//         const y =
//           height -
//           padding.bottom -
//           ((height - padding.top - padding.bottom) / 6) * index;
//         return `<text class="chart_axis_label" x="${padding.left - 10}" y="${y + 4}" text-anchor="end">${label}</text>`;
//       })
//       .join("");

//     const dots = points
//       .map(
//         (p) =>
//           `<circle class="chart_point" cx="${p.x}" cy="${p.y}" r="5"></circle>`,
//       )
//       .join("");

//     earningsChart.innerHTML = `
//             ${gridLines}
//             ${valueLabels}
//             <path class="chart_area" d="${areaPath}"></path>
//             <path class="chart_line" d="${linePath}"></path>
//             ${dots}
//             ${axisLabels}
//         `;
//   }

//   function renderFilters(activeKey, chartConfig) {
//     if (!chartFilters) return;
//     chartFilters.innerHTML = Object.keys(chartConfig)
//       .map(function (key) {
//         const isActive = key === activeKey;
//         return `<button class="chart_filter ${isActive ? "active" : ""}" type="button" data-chart-key="${key}">${chartConfig[key].label}</button>`;
//       })
//       .join("");
//   }

//   function setupProfileMenuToggle() {
//     const profileMenuToggle = document.getElementById("profileMenuToggle");
//     const profileSubmenu = document.getElementById("profileSubmenu");
//     const profileChevron = document.getElementById("profileChevron");

//     if (!profileMenuToggle || !profileSubmenu) return;

//     profileMenuToggle.addEventListener("click", function () {
//       const isHidden = profileSubmenu.hidden;
//       profileSubmenu.hidden = !isHidden;
//       if (profileChevron) {
//         profileChevron.style.transform = isHidden
//           ? "rotate(-180deg)"
//           : "rotate(0deg)";
//       }
//     });
//   }

//   // ==========================================
//   // 4. MAIN SEQUENTIAL INITIALIZER
//   // ==========================================
//   function initDashboard() {
//     const token = getStoredToken();

//     // Safety Guard: Force back to login if unauthorized
//     if (!token) {
//       window.location.href = "/pages/signin.html";
//       return;
//     }

//     const userObj = getLocalProfileData();
//     if (!userObj) {
//       console.warn("User session data corrupt. Cleaning cookies/storage.");
//       localStorage.clear();
//       window.location.href = "/pages/signin.html";
//       return;
//     }

//     // Parse Name Elements cleanly
//     const displayName = getDisplayName(userObj);
//     const initials = getInitials(displayName);
//     const firstName =
//       (userObj.profile && userObj.profile.first_name) ||
//       displayName.split(/\s+/)[0] ||
//       "User";

//     // Apply profile text mappings across Layout Nodes
//     if (sidebarName) sidebarName.textContent = displayName;
//     if (sidebarAvatar) sidebarAvatar.textContent = initials;
//     if (topbarProfile) topbarProfile.textContent = initials;
//     if (greetingTitle)
//       greetingTitle.textContent = `${getGreeting()}, ${firstName} 👋`;
//     if (greetingText)
//       greetingText.textContent =
//         "Here is what is happening with your account today.";

//     // Extract backend calculated statistics block object
//     const activeStats = userObj.stats || {};

//     // Fire layout grid components populated with actual query stats
//     renderStats(activeStats);
//     renderOverviewCards(activeStats);
//     renderPayouts(activeStats);

//     // Chart mock structural values mapping matrix
//     const chartMockConfiguration = {
//       weekly: {
//         label: "Weekly",
//         values: [0.12, 0.15, 0.55, 0.48, 0.68, 0.64, 0.79, 0.76, 0.92, 0.9],
//       },
//       monthly: {
//         label: "Monthly",
//         values: [
//           0.18, 0.22, 0.3, 0.42, 0.56, 0.5, 0.62, 0.66, 0.71, 0.75, 0.83, 0.92,
//         ],
//       },
//       yearly: {
//         label: "Yearly",
//         values: [
//           0.16, 0.24, 0.33, 0.45, 0.54, 0.61, 0.69, 0.76, 0.84, 0.9, 0.97, 1,
//         ],
//       },
//     };

//     if (chartFilters && earningsChart) {
//       renderFilters("weekly", chartMockConfiguration);
//       renderChart("weekly", chartMockConfiguration);

//       chartFilters.addEventListener("click", function (event) {
//         const button = event.target.closest("[data-chart-key]");
//         if (!button) return;
//         const chartKey = button.getAttribute("data-chart-key");
//         renderFilters(chartKey, chartMockConfiguration);
//         renderChart(chartKey, chartMockConfiguration);
//       });
//     }

//     setupProfileMenuToggle();
//   }

//   // Fire orchestrator layout sequence after DOM is safe
//   document.addEventListener("DOMContentLoaded", initDashboard);
// })();

/**
 * Mini Freelancer Hub - Core Dashboard Architecture
 * Consolidated modules: user-session, sidebar-menu, profile-sync
 */

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
    const displayName = getDisplayName(profileData);
    const initials = getInitials(displayName);
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
    if (sidebarAvatar) sidebarAvatar.textContent = initials;
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
