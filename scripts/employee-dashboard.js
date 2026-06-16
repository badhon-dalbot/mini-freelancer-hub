(async function () {
    "use strict";

    // ==========================================
    // 1. SESSION INTERFACE & SECURITY CORES
    // ==========================================
    function getStoredToken() {
        return localStorage.getItem("token");
    }

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }

    const sessionToken = getStoredToken();

    // Look for a local session fallback immediately to prevent routing lockouts
    let localUserFallback = null;
    if (window.MFHUserSession) {
        localUserFallback = window.MFHUserSession.getCurrentUser()?.raw;
    }

    // CRITICAL FIX: Only boot out if there is NO token AND no local fallback profile data exists
    if (!sessionToken && !localUserFallback) {
        console.warn("No authentication vectors found. Redirecting to signin.");
        window.location.href = "/pages/signin.html";
        return;
    }

    // Secure Data Acquisition Interface mapping to Render Backend Service
    async function fetchUserProfile(token) {
        if (!token) return null;
        try {
            const response = await fetch("https://freelancerhubbackend.onrender.com/auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Backend server authentication state validation rejected.");
            }

            return await response.json();
        } catch (err) {
            console.error("Profile payload synchronization link failed (Using local storage fallback):", err);
            return null; // Suppress absolute failure to allow local session backup execution
        }
    }

    // ==========================================
    // 2. DYNAMIC LAYOUT ASSEMBLY ENGINE
    // ==========================================
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    }

    function renderDashboardMetrics(profileData) {
        const statsRow = document.getElementById("statsRow");
        const overviewCards = document.getElementById("overviewCards");
        const payoutList = document.getElementById("payoutList");

        // Parse profile properties or apply UI template default parameters
        const totalIncomeValue = profileData && profileData.totalIncome !== undefined ? profileData.totalIncome : 1080;
        const projectsDoneCount = profileData && profileData.projectsDone !== undefined ? profileData.projectsDone : 1;
        const ongoingProjectsCount = profileData && profileData.ongoingProjects !== undefined ? profileData.ongoingProjects : 1;
        const cancelledProjectsCount = profileData && profileData.cancelledProjects !== undefined ? profileData.cancelledProjects : 0;
        const tasksSoldLines = profileData && profileData.tasksSold !== undefined ? profileData.tasksSold : 2;
        const ongoingTasksLines = profileData && profileData.ongoingTasks !== undefined ? profileData.ongoingTasks : 0;
        const cancelledTasksLines = profileData && profileData.cancelledTasks !== undefined ? profileData.cancelledTasks : 1;

        // --- SECTION 1: Top Statistics Row Cards (4 Grid items) ---
        if (statsRow) {
            statsRow.innerHTML = `
                <article class="stat_card">
                    <div class="stat_icon_wrapper purple_bg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </div>
                    <p class="stat_card_label">Total income</p>
                    <p class="stat_card_value">${formatCurrency(totalIncomeValue)}</p>
                    <span class="stat_card_action action_green">Refresh</span>
                </article>
                <article class="stat_card">
                    <div class="stat_icon_wrapper green_bg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <p class="stat_card_label">Withdraw requested</p>
                    <p class="stat_card_value">${formatCurrency(0)}</p>
                    <span class="stat_card_action action_blue">Show all invoices</span>
                </article>
                <article class="stat_card">
                    <div class="stat_icon_wrapper pink_bg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                    <p class="stat_card_label">Pending income</p>
                    <p class="stat_card_value">${formatCurrency(0)}</p>
                    <span class="stat_card_action action_gray">Refresh</span>
                </article>
                <article class="stat_card">
                    <div class="stat_icon_wrapper orange_bg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </div>
                    <p class="stat_card_label">Available in account</p>
                    <p class="stat_card_value">${formatCurrency(totalIncomeValue)}</p>
                    <span class="stat_card_action action_orange_text">Withdraw now</span>
                </article>
            `;
        }

        // --- SECTION 2: 6 Performance Metric Overview Cards ---
        if (overviewCards) {
            overviewCards.innerHTML = `
                <article class="metric_detail_card">
                    <div class="metric_top_row">
                        <div class="metric_icon_box green_tint">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <button class="metric_view_btn" type="button">View</button>
                    </div>
                    <p class="metric_big_number">${projectsDoneCount}</p>
                    <p class="metric_title_text">Completed projects</p>
                    <div class="watermark_bg_icon check_watermark"></div>
                </article>
                <article class="metric_detail_card">
                    <div class="metric_top_row">
                        <div class="metric_icon_box orange_tint">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <button class="metric_view_btn" type="button">View</button>
                    </div>
                    <p class="metric_big_number">${ongoingProjectsCount}</p>
                    <p class="metric_title_text">Ongoing projects</p>
                    <div class="watermark_bg_icon clock_watermark"></div>
                </article>
                <article class="metric_detail_card">
                    <div class="metric_top_row">
                        <div class="metric_icon_box pink_tint">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </div>
                        <button class="metric_view_btn" type="button">View</button>
                    </div>
                    <p class="metric_big_number">${cancelledProjectsCount}</p>
                    <p class="metric_title_text">Cancelled projects</p>
                    <div class="watermark_bg_icon cross_watermark"></div>
                </article>
                <article class="metric_detail_card">
                    <div class="metric_top_row">
                        <div class="metric_icon_box teal_tint">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><path d="M20 7h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm11 16H4V9h16v11z"></path></svg>
                        </div>
                        <button class="metric_view_btn" type="button">View</button>
                    </div>
                    <p class="metric_big_number">${tasksSoldLines}</p>
                    <p class="metric_title_text">Tasks sold</p>
                    <div class="watermark_bg_icon bag_watermark"></div>
                </article>
                <article class="metric_detail_card">
                    <div class="metric_top_row">
                        <div class="metric_icon_box yellow_tint">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <button class="metric_view_btn" type="button">View</button>
                    </div>
                    <p class="metric_big_number">${ongoingTasksLines}</p>
                    <p class="metric_title_text">Ongoing tasks</p>
                    <div class="watermark_bg_icon clock_watermark"></div>
                </article>
                <article class="metric_detail_card">
                    <div class="metric_top_row">
                        <div class="metric_icon_box red_tint">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </div>
                        <button class="metric_view_btn" type="button">View</button>
                    </div>
                    <p class="metric_big_number">${cancelledTasksLines}</p>
                    <p class="metric_title_text">Cancelled tasks</p>
                    <div class="watermark_bg_icon cross_watermark"></div>
                </article>
            `;
        }

        // --- SECTION 3: Right Side Payout Methods Panel ---
        if (payoutList) {
            payoutList.innerHTML = `
                <button class="payout_item" type="button">
                    <span class="payout_left">
                        <span class="payout_icon paypal_blue">P</span>
                        <span>Setup PayPal account</span>
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <button class="payout_item" type="button">
                    <span class="payout_left">
                        <span class="payout_icon payoneer_orange">G</span>
                        <span>Payoneer</span>
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <button class="payout_item" type="button">
                    <span class="payout_left">
                        <span class="payout_icon bank_gray">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </span>
                        <span>Setup bank account</span>
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            `;
        }
    }

    // ==========================================
    // 3. CORE ROUTINE & EXPLICIT DATA PIPELINE
    // ==========================================
    async function syncAndBuildDashboard() {
        // Query remote server mapping
        let userProfile = await fetchUserProfile(sessionToken);

        // Explicit Local Fallback Check
        if (!userProfile && window.MFHUserSession) {
            const currentSession = window.MFHUserSession.getCurrentUser();
            userProfile = currentSession.raw;
        }

        const sessionHandler = window.MFHUserSession;
        const fallbackName = new URLSearchParams(window.location.search).get('name') || 'Sayed Hasan Sami';
        
        const displayName = sessionHandler ? sessionHandler.getDisplayName(userProfile) : fallbackName;
        const initials = sessionHandler ? sessionHandler.getInitials(displayName) : "SHS";

        // Isolate greeting parameters safely
        const nameParts = displayName.trim().split(/\s+/);
        const firstName = userProfile?.firstName || userProfile?.firstname || nameParts[2] || nameParts[0] || "Sami";

        // Target Document Elements
        const sidebarAvatar = document.getElementById("sidebarAvatar");
        const sidebarName = document.getElementById("sidebarName");
        const topbarProfile = document.getElementById("topbarProfile");
        const greetingTitle = document.getElementById("greetingTitle");
        const greetingText = document.getElementById("greetingText");

        // Dynamic Profile Content Mount paths
        if (sidebarName) sidebarName.textContent = displayName;
        
        if (sidebarAvatar) {
            if (userProfile && (userProfile.avatarUrl || userProfile.avatar_url)) {
                sidebarAvatar.src = userProfile.avatarUrl || userProfile.avatar_url;
                sidebarAvatar.alt = displayName;
            } else {
                // Node Transformation: If no active image target is mapped, build placeholder text box matching layout rules
                const initialsElement = document.createElement("div");
                initialsElement.className = "topbar_profile"; 
                initialsElement.id = "sidebarAvatar";
                initialsElement.style.display = "flex";
                initialsElement.style.alignItems = "center";
                initialsElement.style.justifyContent = "center";
                initialsElement.style.width = "40px";
                initialsElement.style.height = "40px";
                initialsElement.style.borderRadius = "50%";
                initialsElement.style.backgroundColor = "var(--primary-color, #4f46e5)";
                initialsElement.style.color = "#ffffff";
                initialsElement.style.fontWeight = "bold";
                initialsElement.textContent = initials.slice(0, 2);
                sidebarAvatar.replaceWith(initialsElement);
            }
        }

        if (topbarProfile) {
            if (userProfile && (userProfile.avatarUrl || userProfile.avatar_url)) {
                topbarProfile.innerHTML = `<img src="${userProfile.avatarUrl || userProfile.avatar_url}" alt="${displayName}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            } else {
                topbarProfile.textContent = initials.slice(0, 2);
            }
        }

        if (greetingTitle) greetingTitle.textContent = `${getGreeting()}, ${firstName} 👋`;
        if (greetingText) greetingText.textContent = "Here's what's happening with your account today.";

        // Assemble interactive statistics templates
        renderDashboardMetrics(userProfile);
    }

    // ==========================================
    // 4. NAVIGATION EXTRA ACTION BINDINGS
    // ==========================================
    function bindExtraDashboardActions() {
        const messageBtn = document.querySelector('.topbar_icon_button[aria-label="Messages"]');
        if (messageBtn) {
            messageBtn.addEventListener("click", function () {
                window.location.href = "../pages/massage.html";
            });
        }
    }

    // Runtime Lifecycle Compilation Bootstrap
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            syncAndBuildDashboard();
            bindExtraDashboardActions();
        });
    } else {
        syncAndBuildDashboard();
        bindExtraDashboardActions();
    }
})();