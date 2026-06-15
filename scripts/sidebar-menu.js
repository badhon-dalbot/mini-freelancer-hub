function setupSidebarMenuToggle() {
  const sidebarGroupButton = document.querySelector(".sidebar_group_button");

  if (!sidebarGroupButton) {
    return;
  }

  const sidebarGroup = sidebarGroupButton.closest(".sidebar_group");
  const sidebarSubmenu = sidebarGroup
    ? sidebarGroup.querySelector(".sidebar_submenu")
    : null;

  if (!sidebarGroup || !sidebarSubmenu) {
    return;
  }

  sidebarGroupButton.addEventListener("click", function () {
    const isExpanded =
      sidebarGroupButton.getAttribute("aria-expanded") === "true";

    sidebarGroupButton.setAttribute("aria-expanded", String(!isExpanded));
    sidebarGroup.classList.toggle("is-open", !isExpanded);
    sidebarSubmenu.hidden = isExpanded;
  });
}

function setupSidebarLogout() {
  // Select the logout element via its class targeting standard HTML definitions
  const logoutButton = document.querySelector(".sidebar_logout");

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener("click", function (event) {
    // Prevent standard instant page jumps to allow full cleanup state clearance
    event.preventDefault();

    // 1. Wipe out active local storage objects defined inside user-session.js
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token"); // Clears backend API authorization headers

    // 2. Wipe clean any active fallback session indicators
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("selectedJob"); // Clears transient bidding page states

    // 3. Gracefully redirect the user back to the public homepage route
    const targetUrl = logoutButton.getAttribute("href") || "/index.html";
    window.location.href = targetUrl;
  });
}

// Initialize layout modules on page compilation
setupSidebarMenuToggle();
setupSidebarLogout();
