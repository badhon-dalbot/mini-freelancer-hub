(function () {


  const token = localStorage.getItem("token");
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

      if (!response.ok)
        throw new Error("Backend profile verification rejected.");

      const responseData = await response.json();
      // Handle cases where the backend nests data inside a data/profile wrapper property
      return responseData.data || responseData.profile || responseData;
    } catch (err) {
      console.error("Profile synchronization endpoint failure:", err);
      return null;
    }
  }

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function normalizeList(value, fallbackArray) {
    if (Array.isArray(value) && value.length) return value;
    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return fallbackArray;
  }

  // 3. INLINE FALLBACK PARSING NORMALIZER (No DEFAULT_PROFILE object needed)
  function getProfile() {
    const stored =
      safeParse(localStorage.getItem("user")) ||
      safeParse(localStorage.getItem("currentUser")) ||
      {};

    // Check if data properties are nested or flat
    const target = stored.profile || stored.user || stored.data || stored;

    const firstName =
      target.firstName || target.firstname || target.first_name || "User";
    const lastName =
      target.lastName || target.lastname || target.last_name || "";

    return {
      firstName,
      lastName,
      name: target.name || target.fullName || `${firstName} ${lastName}`.trim(),
      title: target.title || target.designation || "Creative Web Designer",
      bio:
        target.bio ||
        target.description ||
        "Welcome to my professional profile layout workspace.",
      country: target.country || "Bangladesh",
      freelancerType:
        target.freelancerType || target.freelancer_type || "Independent",
      englishLevel: target.englishLevel || "Conversational",
      hourlyRate: target.hourlyRate || target.hourly_rate || 20,
      avatar: target.avatar || "/Assests/Sara Miller  Icon.png",
      reviewCount: target.reviewCount || "0 reviews",
      viewCount: target.viewCount || "1 view",
      social: Array.isArray(target.social) ? target.social : ["linkedin"],
      portfolio: Array.isArray(target.portfolio) ? target.portfolio : [],
      education: Array.isArray(target.education) ? target.education : [],
      experience: Array.isArray(target.experience) ? target.experience : [],
    };
  }

  // 4. DOM CARD HYDRATION PIPELINES
  function renderChips(container, values) {
    if (!container) return;
    container.innerHTML = "";
    values.forEach((value) => {
      const chip = document.createElement("span");
      chip.className = "skill";
      chip.textContent = value;
      container.appendChild(chip);
    });
  }

  function renderPortfolio(container, items) {
    if (!container) return;
    container.innerHTML = "";
    if (!items.length) {
      container.innerHTML = `<p style="color:#aaa; font-style:italic;">No portfolio projects uploaded yet.</p>`;
      return;
    }
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "portfolio_item";
      card.innerHTML = `
        <img src="${item.image || item.thumbnail || "/Assests/Sara Miller  Icon.png"}" alt="${item.title || "Portfolio item"}" />
        <div class="portfolio_caption">${item.title || "Portfolio item"}</div>
      `;
      container.appendChild(card);
    });
  }

  function renderEducation(container, items) {
    if (!container) return;
    container.innerHTML = "";
    if (!items.length) {
      container.innerHTML = `<p style="color:#aaa; font-style:italic; padding:10px;">No education history provided.</p>`;
      return;
    }
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "info_card";
      card.innerHTML = `
        <h4>${item.degree || item.qualification || ""}</h4>
        <div class="meta">${item.school || item.institution || ""} • ${item.from || ""} - ${item.to || ""}</div>
        <p>${item.description || ""}</p>
      `;
      container.appendChild(card);
    });
  }

  function renderExperience(container, items) {
    if (!container) return;
    container.innerHTML = "";
    if (!items.length) {
      container.innerHTML = `<p style="color:#aaa; font-style:italic; padding:10px;">No work experience listed.</p>`;
      return;
    }
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "info_card";
      card.innerHTML = `
        <h4>${item.title || item.role || ""}</h4>
        <div class="meta">${item.company || item.employer || ""} • ${item.from || ""} - ${item.to || ""}</div>
        <p>${item.description || ""}</p>
      `;
      container.appendChild(card);
    });
  }

  function renderUI() {
    const profile = getProfile();
    const avatar = document.getElementById("profileAvatarImage");

    if (avatar) {
      avatar.src = profile.avatar;
      avatar.onerror = () => {
        avatar.src =
          "https://via.placeholder.com/120x120?text=" +
          encodeURIComponent(profile.firstName);
      };
    }

    const elName = document.getElementById("profileName");
    const elRate = document.getElementById("profileRateLabel");
    const elReviews = document.getElementById("profileReviewCount");
    const elJobs = document.getElementById("profileJobCount");
    const elLocation = document.getElementById("profileLocation");
    const elType = document.getElementById("profileFreelancerType");
    const elLang = document.getElementById("profileLanguagesSummary");
    const elEng = document.getElementById("profileEnglishLevel");
    const elBio = document.getElementById("profileBio");

    if (elName) elName.textContent = profile.name;
    if (elRate) elRate.textContent = `$${profile.hourlyRate}/hr`;
    if (elReviews) elReviews.textContent = profile.reviewCount;
    if (elJobs) elJobs.textContent = profile.viewCount;
    if (elLocation) elLocation.textContent = profile.country;
    if (elType) elType.textContent = profile.freelancerType;
    if (elLang)
      elLang.textContent = Array.isArray(profile.languages)
        ? profile.languages.join(", ")
        : "English";
    if (elEng) elEng.textContent = profile.englishLevel;
    if (elBio) elBio.textContent = profile.bio;

    const socialRow = document.getElementById("profileSocialRow");
    if (socialRow) {
      socialRow.innerHTML = "";
      profile.social.forEach((name) => {
        const dot = document.createElement("span");
        dot.className = "social_dot";
        dot.title = name;
        socialRow.appendChild(dot);
      });
    }

    renderChips(document.getElementById("profileSkills"), profile.skills || []);
    renderPortfolio(
      document.getElementById("profilePortfolio"),
      profile.portfolio,
    );
    renderEducation(
      document.getElementById("profileEducation"),
      profile.education,
    );
    renderExperience(
      document.getElementById("profileExperience"),
      profile.experience,
    );
  }

  // 5. ASYNC LIFECYCLE MANAGEMENT FLOW
  async function initializeProfilePipeline() {
    // Stage 1: Fast render using whatever data exists in local storage
    renderUI();

    // Stage 2: Synchronize fresh profile data directly from your backend route
    const freshData = await fetchUserProfile(token);
    if (freshData) {
      localStorage.setItem("user", JSON.stringify(freshData));
      // Stage 3: Instant interface re-render to display the username changes
      renderUI();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProfilePipeline);
  } else {
    initializeProfilePipeline();
  }
})();
