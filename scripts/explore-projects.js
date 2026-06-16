(function () {
  const topHeader = document.getElementById("header");
  const sidebar = document.getElementById("sidebar");
  const searchBar = document.getElementById("search-bar");
  const jobContainer = document.getElementById("jobContainer");
  const resultCount = document.getElementById("resultCount");
  const searchInputs = Array.from(
    document.querySelectorAll(
      '#header input[type="text"], #search-bar input[type="text"]',
    ),
  );

  const login = sessionStorage.getItem("isLoggedIn") === "true";

async function loadUserProfile() {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const response = await fetch(
      "https://freelancerhubbackend.onrender.com/api/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load profile");
    }

    const user = await response.json();

    // Save profile
    localStorage.setItem("user", JSON.stringify(user));

    const sidebarName = document.getElementById("sidebarName");
    const sidebarAvatar = document.getElementById("sidebarAvatar");

    if (sidebarName) {
      sidebarName.textContent =
        `${user.first_name} ${user.last_name}`.trim();
    }

    if (sidebarAvatar) {
      sidebarAvatar.src = user.avatar_url;
      sidebarAvatar.alt = `${user.first_name} ${user.last_name}`;
    }
  } catch (err) {
    console.error(err);
  }
}

  if (login) {
    if (topHeader) {
      topHeader.style.display = "none";
    }
  } else {
    if (sidebar) {
      sidebar.style.display = "none";
    }
    if (searchBar) {
      searchBar.style.display = "none";
    }
  }

  if (login) {
    loadUserProfile();
  }

  const state = {
    projects: [],
    filteredProjects: [],
    searchTerm: "",
  };

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
      const escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return escapeMap[character] || character;
    });
  }

  function formatLabel(value) {
    return String(value ?? "")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/\b\w/g, function (character) {
        return character.toUpperCase();
      });
  }

  function formatDate(value) {
    if (!value) {
      return "Recently";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatPrice(minPrice, maxPrice, priceType) {
    const min = Number(minPrice);
    const max = Number(maxPrice);

    if (Number.isFinite(min) && Number.isFinite(max)) {
      if (min === max) {
        return `$${min.toFixed(0)}`;
      }

      return `$${min.toFixed(0)} - $${max.toFixed(0)}`;
    }

    if (Number.isFinite(min)) {
      return `$${min.toFixed(0)}`;
    }

    if (Number.isFinite(max)) {
      return `$${max.toFixed(0)}`;
    }

    return priceType ? "Budget on request" : "$0";
  }

  function formatPriceType(value) {
    const normalized = String(value ?? "").toLowerCase().trim();

    if (normalized === "fixed") {
      return "Fixed Price Project";
    }

    if (normalized === "hourly") {
      return "Hourly Project";
    }

    const labeled = formatLabel(value);

    if (!labeled) {
      return "Project";
    }

    if (/project$/i.test(labeled)) {
      return labeled;
    }

    return `${labeled} Project`;
  }

  function buildTags(project) {
    const tags = [project.jobType, project.experienceLevel, project.statusLabel].filter(
      Boolean,
    );

    if (tags.length) {
      return tags;
    }

    return ["Open Brief"];
  }

  function getBuyerName(project) {
    if (project.clientId) {
      return `Client ${project.clientId}`;
    }

    return "Project Buyer";
  }

  function slugify(value) {
    return String(value ?? "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeProject(project) {
    const title = project.title || "Untitled Project";
    const jobType = formatLabel(project.job_type || project.jobType || "remote");
    const experienceLevel = formatLabel(
      project.experience_level || project.experienceLevel,
    );
    const statusLabel = formatLabel(project.status || project.statusLabel);
    const priceTypeValue = project.price_type || project.priceType;
    const id = project.id || slugify(title) || `project-${Date.now()}`;

    return {
      id: id,
      title: title,
      description: project.description || "No description provided.",
      priceType: formatPriceType(priceTypeValue),
      price: formatPrice(project.min_price, project.max_price, priceTypeValue),
      tags: buildTags({ jobType, experienceLevel, statusLabel }),
      buyerName: getBuyerName({ clientId: project.client_id }),
      postDate: formatDate(project.created_at),
      isFavorite: Boolean(project.isFavorite),
      location: jobType || "Remote",
      jobType: jobType,
      experienceLevel: experienceLevel,
      statusLabel: statusLabel,
      hiringCapacity: project.hiring_capacity || 1,
      rawProject: project,
    };
  }

  function extractProjectList(response) {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.projects)) {
      return response.projects;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    return [];
  }

  function syncSearchInputs(value, sourceInput) {
    searchInputs.forEach(function (input) {
      if (input !== sourceInput) {
        input.value = value;
      }
    });
  }

  function renderProjects(projects) {
    if (!jobContainer) {
      return;
    }

    jobContainer.innerHTML = "";

    if (resultCount) {
      resultCount.textContent = String(projects.length);
    }

    if (!projects.length) {
      jobContainer.innerHTML =
        '<p class="projects-state">No projects match your search.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();

    projects.forEach(function (project) {
      const card = document.createElement("div");
      card.className = "job-card";

      card.innerHTML = `
        <div class="card-top">
          <p class="post-date">${escapeHTML(project.postDate)}</p>
          <button class="favorite-btn ${project.isFavorite ? "active" : ""}" type="button" aria-label="Toggle favorite">
            <svg class="icon-favorite" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 7.12508C1.50003 5.41654 2.55333 3.88485 4.14871 3.27338C5.74408 2.66192 7.55129 3.09724 8.69325 4.36809C8.77267 4.453 8.88373 4.5012 9 4.5012C9.11627 4.5012 9.22733 4.453 9.30675 4.36809C10.4453 3.08874 12.257 2.64776 13.8562 3.2607C15.4554 3.87363 16.5082 5.41247 16.5 7.12508C16.5 8.84258 15.375 10.1251 14.25 11.2501L10.131 15.2348C9.8483 15.5595 9.43972 15.7471 9.00922 15.7498C8.57871 15.7525 8.16779 15.5702 7.881 15.2491L3.75 11.2501C2.625 10.1251 1.5 8.85008 1.5 7.12508" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg class="icon-default" width="18" height="18" viewBox="0 0 18 18">
              <path d="M9 16s-7-4.5-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.5-7 9-7 9z" fill="none" stroke="#9CA3AF" stroke-width="1.5"/>
            </svg>
          </button>
        </div>
        <div class="job-title">${escapeHTML(project.title)}</div>
        <div class="job-price"><span>${escapeHTML(project.priceType)}</span><span>${escapeHTML(project.price)}</span></div>
        <div class="tags">
          ${project.tags.map(function (tag) {
        return `<span class="tag">${escapeHTML(tag)}</span>`;
      }).join("")}
        </div>
        <hr>
        <div class="job-bottom">
          <div class="buyer-info"><img src="/Assests/John Doe Icon.png" alt="Buyer Icon"> <span>${escapeHTML(project.buyerName)}</span></div>
          <button class="view-jobs-btn" type="button" data-job-id="${escapeHTML(project.id)}">View Jobs</button>
        </div>
      `;

      fragment.appendChild(card);
    });

    jobContainer.appendChild(fragment);
  }

  function applyFilters() {
    const query = state.searchTerm.trim().toLowerCase();

    state.filteredProjects = state.projects.filter(function (project) {
      if (!query) {
        return true;
      }

      const haystack = [
        project.title,
        project.description,
        project.priceType,
        project.price,
        project.buyerName,
        project.jobType,
        project.experienceLevel,
        project.statusLabel,
        project.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    renderProjects(state.filteredProjects);
  }

  function openJobDetails(jobId) {
    const selectedJob =
      state.projects.find(function (project) {
        return project.id === jobId;
      }) || state.projects[0];

    if (!selectedJob) {
      return;
    }

    sessionStorage.setItem("selectedJob", JSON.stringify(selectedJob));
    window.location.href = `/pages/job-description.html?job=${encodeURIComponent(selectedJob.id)}`;
  }

  function setLoadingState() {
    if (jobContainer) {
      jobContainer.innerHTML = '<p class="projects-state">Loading projects...</p>';
    }

    if (resultCount) {
      resultCount.textContent = "0";
    }
  }

  function setErrorState() {
    if (jobContainer) {
      jobContainer.innerHTML =
        '<p class="projects-state projects-state--error">Unable to load projects right now.</p>';
    }

    if (resultCount) {
      resultCount.textContent = "0";
    }
  }

  async function loadProjects() {
    setLoadingState();

    const response = await getData("/projects");

    if (typeof response === "undefined" || response === null) {
      setErrorState();
      return;
    }

    state.projects = extractProjectList(response).map(normalizeProject);
    applyFilters();
  }

  if (jobContainer) {
    jobContainer.addEventListener("click", function (event) {
      const favoriteButton = event.target.closest(".favorite-btn");

      if (favoriteButton) {
        favoriteButton.classList.toggle("active");
        return;
      }

      const viewButton = event.target.closest(".view-jobs-btn");

      if (viewButton) {
        openJobDetails(viewButton.getAttribute("data-job-id"));
      }
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener("input", function (event) {
      state.searchTerm = event.target.value || "";
      syncSearchInputs(state.searchTerm, input);
      applyFilters();
    });
  });

  loadProjects();
})();
