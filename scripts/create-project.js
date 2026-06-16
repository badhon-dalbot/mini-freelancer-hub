(function () {
  const API_BASE_URL = "https://freelancerhubbackend.onrender.com/api";

  // ==============================
  // 1. Load User Profile (Sidebar)
  // ==============================
  async function loadUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const profile = await response.json();
      const displayName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

      // Sidebar avatar
      const sidebarAvatar = document.getElementById("sidebarAvatar");
      if (sidebarAvatar) {
        sidebarAvatar.src =
          profile.avatar_url ||
          "/Assests/default-avatar.png"; // use a local fallback image
        sidebarAvatar.alt = displayName;
      }

      // Sidebar name
      const sidebarName = document.getElementById("sidebarName");
      if (sidebarName) {
        sidebarName.textContent = displayName || "User";
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  }

  // Run profile loader on page load
  document.addEventListener("DOMContentLoaded", loadUserProfile);

  // ==============================
  // 2. Project Form Logic
  // ==============================
  const form = document.querySelector(".create_project_form");
  const projectTypeCards = document.querySelectorAll(".project_type_card");
  const projectTitleInput = document.getElementById("projectTitle");
  const descriptionInput = document.getElementById("description");
  const minBudgetInput = document.getElementById("minBudget");
  const maxBudgetInput = document.getElementById("maxBudget");
  const categorySelect = document.getElementById("category");
  const locationSelect = document.getElementById("location");
  const aiWriteButton = document.querySelector(".ai_write_button");

  // --- UI Interactive State Changes ---
  projectTypeCards.forEach((card) => {
    card.addEventListener("click", function () {
      projectTypeCards.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");

      const radioInput = this.querySelector('input[type="radio"]');
      if (radioInput) radioInput.checked = true;
    });
  });

  if (aiWriteButton) {
    aiWriteButton.addEventListener("click", function () {
      const title = projectTitleInput ? projectTitleInput.value.trim() : "your project";
      const cat = (categorySelect && categorySelect.value) ? categorySelect.value : "this area";

      if (descriptionInput) {
        descriptionInput.value = `We are looking for an expert to handle our "${title}". This project falls under ${cat} requirements. Ideal applicants must possess clean communication skills and prioritize deadline milestones.`;
      }
    });
  }

  // --- Helper Utility ---
  function getInputValue(element, fallback = "") {
    return element ? element.value.trim() : fallback;
  }

  // --- Form Validation ---
  function validateForm() {
    let isValid = true;

    document.querySelectorAll(".field_error").forEach((el) => el.classList.remove("field_error"));

    if (!getInputValue(projectTitleInput)) {
      if (projectTitleInput) projectTitleInput.classList.add("field_error");
      isValid = false;
    }

    if (!getInputValue(descriptionInput)) {
      if (descriptionInput) descriptionInput.classList.add("field_error");
      isValid = false;
    }

    const minRaw = getInputValue(minBudgetInput);
    const maxRaw = getInputValue(maxBudgetInput);

    const minPrice = minRaw ? Number(minRaw) : null;
    const maxPrice = maxRaw ? Number(maxRaw) : null;

    if (minPrice !== null && maxPrice !== null && maxPrice < minPrice) {
      if (minBudgetInput) minBudgetInput.classList.add("field_error");
      if (maxBudgetInput) maxBudgetInput.classList.add("field_error");
      isValid = false;
    }

    return isValid;
  }

  // --- API Submission ---
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!validateForm()) {
        alert("Please complete all required fields correctly before submitting.");
        return;
      }

      let selectedPriceType = "fixed";
      const checkedRadio = document.querySelector('input[name="projectType"]:checked');
      if (checkedRadio) {
        const cardContainer = checkedRadio.closest(".project_type_card");
        const textSignature = cardContainer ? cardContainer.textContent.toLowerCase() : "";
        if (textSignature.includes("hourly")) {
          selectedPriceType = "hourly";
        }
      }

      const minRaw = getInputValue(minBudgetInput);
      const maxRaw = getInputValue(maxBudgetInput);

      const payload = {
        title: getInputValue(projectTitleInput),
        description: getInputValue(descriptionInput),
        price_type: selectedPriceType,
        min_price: minRaw ? Number(minRaw) : null,
        max_price: maxRaw ? Number(maxRaw) : null,
        category_id: (categorySelect && categorySelect.value && categorySelect.value !== "Choose category") 
          ? Number(categorySelect.value) 
          : null,
        job_type: (locationSelect && locationSelect.value) ? locationSelect.value.toLowerCase() : "remote",
        experience_level: "entry",
        status: "open",
        hiring_capacity: 1,
      };

      const actionButton = form.querySelector(".save_continue_button");
      if (!actionButton) return;

      const originalText = actionButton.textContent;
      actionButton.textContent = "Submitting...";
      actionButton.disabled = true;

      try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Server rejected request.");
        }

        alert("🎉 Project created successfully!");
        window.location.href = "/pages/employee-dashboard.html#projects";
      } catch (err) {
        console.error("[PROJECT CREATION FAILURE]", err);
        alert(`Failed to save project: ${err.message}`);
      } finally {
        actionButton.textContent = originalText;
        actionButton.disabled = false;
      }
    });
  }
})();
