
(function () {
  // REMOVED: defaultJobCatalog configuration block extracted cleanly.

  function buildGenericJobDetails(job) {
    const title = job.title || "Project";
    const tagList =
      job.tags && job.tags.length
        ? job.tags
        : ["Communication", "Problem Solving"];

    return {
      id: job.id || job._id || "",
      title: title,
      price: job.price || "$0",
      priceType: job.priceType || "Fixed Price Project",
      postDate: job.postDate || "Recently",
      location: job.location || "Remote",
      description:
        job.description ||
        `We are looking for a reliable professional to handle ${title.toLowerCase()}. The right freelancer should communicate clearly, stay organized, and deliver polished results on time.`,
      responsibilities: job.responsibilities || [
        `Plan and execute the work for ${title.toLowerCase()}`,
        "Collaborate with the buyer to refine the brief and expectations",
        "Deliver work that is clean, accurate, and ready for review",
        "Keep communication consistent through the project timeline",
      ],
      requirements: job.requirements || [
        `Experience with ${tagList[0].toLowerCase()}`,
        "Strong written communication skills",
        "Ability to meet deadlines and follow instructions",
        "Attention to detail and a problem-solving mindset",
      ],
      skills: job.skills || tagList
        .concat(["Communication", "Attention to detail"])
        .slice(0, 7),
      hiringCapacity: job.hiringCapacity || "2 freelancers",
      expertise: job.expertise || "Senior level",
      languages: job.languages || "English",
      duration: job.duration || "1 to 3 months",
      buyer: {
        name: job.buyerName || (job.buyer && job.buyer.name) || "Project Buyer",
        memberSince: (job.buyer && job.buyer.memberSince) || "April 30, 2024",
        title: (job.buyer && job.buyer.title) || title,
        description:
          (job.buyer && job.buyer.description) ||
          "Looking for a dependable freelancer who can communicate clearly, follow the brief, and deliver work that feels professional from the first draft.",
        location: (job.buyer && job.buyer.location) || "United States (US)",
        totalProjects: (job.buyer && job.buyer.totalProjects) || 1,
        ongoingProjects: (job.buyer && job.buyer.ongoingProjects) || 0,
      },
    };
  }

  function resolveJobData(job) {
    const genericJob = buildGenericJobDetails(job);

    return {
      ...genericJob,
      ...job,
      buyer: {
        ...genericJob.buyer,
        ...(job.buyer || {}),
      },
    };
  }

  function getUserProfile() {
    const session = window.MFHUserSession;

    if (session && typeof session.getCurrentUser === "function") {
      return session.getCurrentUser();
    }

    return {
      displayName: "Sayed Hasan Sami",
    };
  }

  function setSidebarUser() {
    const userProfile = getUserProfile();
    const sidebarName = document.getElementById("sidebarName");
    const sidebarAvatar = document.getElementById("sidebarAvatar");

    if (sidebarName) {
      sidebarName.textContent = userProfile.displayName;
    }

    if (sidebarAvatar && window.MFHUserSession) {
      sidebarAvatar.textContent = window.MFHUserSession.getInitials(
        userProfile.displayName,
      );
    }
  }

  function renderJobDescription(job) {
    const jobTitle = document.getElementById("jobTitle");
    const jobMeta = document.getElementById("jobMeta");
    const jobPrice = document.getElementById("jobPrice");
    const jobPriceType = document.getElementById("jobPriceType");
    const jobDescription = document.getElementById("jobDescription");
    const responsibilitiesList = document.getElementById("responsibilitiesList");
    const requirementsList = document.getElementById("requirementsList");
    const skillsList = document.getElementById("skillsList");
    const proposalButton = document.getElementById("proposalButton");
    const projectRequirements = document.getElementById("projectRequirements");
    const buyerCard = document.getElementById("buyerCard");

    if (jobTitle) jobTitle.textContent = job.title;
    if (jobMeta) jobMeta.textContent = `Posted ${job.postDate} · ${job.location}`;
    if (jobPrice) jobPrice.textContent = job.price;
    if (jobPriceType) jobPriceType.textContent = job.priceType;
    if (jobDescription) jobDescription.textContent = job.description;

    if (responsibilitiesList && job.responsibilities) {
      responsibilitiesList.innerHTML = job.responsibilities
        .map(item => `<li>${item}</li>`)
        .join("");
    }

    if (requirementsList && job.requirements) {
      requirementsList.innerHTML = job.requirements
        .map(item => `<li>${item}</li>`)
        .join("");
    }

    if (skillsList && job.skills) {
      skillsList.innerHTML = job.skills
        .map(skill => `<span class="skill_chip">${skill}</span>`)
        .join("");
    }

    if (proposalButton) {
      proposalButton.addEventListener("click", function () {
        sessionStorage.setItem("selectedJob", JSON.stringify(job));
        window.location.href = `/pages/submit-bid.html?job=${encodeURIComponent(job.id)}`;
      });
    }

    if (projectRequirements) {
      projectRequirements.innerHTML = `
        <div class="requirement_item"><span>Hiring capacity</span><strong>${job.hiringCapacity}</strong></div>
        <div class="requirement_item"><span>Expertise</span><strong>${job.expertise}</strong></div>
        <div class="requirement_item"><span>Languages</span><strong>${job.languages}</strong></div>
        <div class="requirement_item"><span>Project duration</span><strong>${job.duration}</strong></div>
      `;
    }

    if (buyerCard) {
      buyerCard.innerHTML = `
        <div class="buyer_heading">
          <div>
            <h3>${job.buyer.name}</h3>
            <p>Member since ${job.buyer.memberSince}</p>
          </div>
          <span class="buyer_verified" aria-label="Verified buyer">✓</span>
        </div>
        <h4>${job.buyer.title}</h4>
        <p class="buyer_description">${job.buyer.description}</p>
        <div class="buyer_stats">
          <div><span>Located in</span><strong>${job.buyer.location}</strong></div>
          <div><span>Total posted projects</span><strong>${job.buyer.totalProjects}</strong></div>
          <div><span>Ongoing projects</span><strong>${job.buyer.ongoingProjects}</strong></div>
        </div>
        <a class="buyer_button" href="/pages/explore-projects.html">See all posted projects →</a>
      `;
    }
  }

  function renderBidPage(job) {
    const jobTitle = document.getElementById("jobTitle");
    const jobMeta = document.getElementById("jobMeta");
    const jobPrice = document.getElementById("jobPrice");
    const jobPriceType = document.getElementById("jobPriceType");
    const fixedBudgetLabel = document.getElementById("fixedBudgetLabel");
    const projectRequirements = document.getElementById("projectRequirements");
    const buyerCard = document.getElementById("buyerCard");
    const bidAmount = document.getElementById("bidAmount");
    const commissionAmount = document.getElementById("commissionAmount");
    const payoutAmount = document.getElementById("payoutAmount");
    const proposalNotes = document.getElementById("proposalNotes");
    const submitButton = document.getElementById("submitBidButton");
    const statusMessage = document.getElementById("bidStatusMessage");
    const bidForm = document.querySelector(".bid_form");
    const secondaryActionButton = document.querySelector(".secondary_action_button");

    // Populate dynamic job context layout 
    if (jobTitle) jobTitle.textContent = job.title;
    if (jobMeta) jobMeta.textContent = `Posted ${job.postDate} · ${job.location}`;
    if (jobPrice) jobPrice.textContent = job.price;
    if (jobPriceType) jobPriceType.textContent = job.priceType;
    if (fixedBudgetLabel) fixedBudgetLabel.textContent = job.price;

    // Dynamically match the "Back to job" button query parameter link targets
    if (secondaryActionButton && job.id) {
      secondaryActionButton.setAttribute("href", `/pages/job-description.html?job=${encodeURIComponent(job.id)}`);
    }

    if (projectRequirements) {
      projectRequirements.innerHTML = `
        <div class="requirement_item"><span>Hiring capacity</span><strong>${job.hiringCapacity}</strong></div>
        <div class="requirement_item"><span>Expertise</span><strong>${job.expertise}</strong></div>
        <div class="requirement_item"><span>Languages</span><strong>${job.languages}</strong></div>
        <div class="requirement_item"><span>Project duration</span><strong>${job.duration}</strong></div>
      `;
    }

    if (buyerCard) {
      buyerCard.innerHTML = `
        <div class="buyer_heading">
          <div>
            <h3>${job.buyer.name}</h3>
            <p>Member since ${job.buyer.memberSince}</p>
          </div>
          <span class="buyer_verified" aria-label="Verified buyer">✓</span>
        </div>
        <h4>${job.buyer.title}</h4>
        <p class="buyer_description">${job.buyer.description}</p>
        <div class="buyer_stats">
          <div><span>Located in</span><strong>${job.buyer.location}</strong></div>
          <div><span>Total posted projects</span><strong>${job.buyer.totalProjects}</strong></div>
          <div><span>Ongoing projects</span><strong>${job.buyer.ongoingProjects}</strong></div>
        </div>
        <a class="buyer_button" href="/pages/explore-projects.html">See all posted projects →</a>
      `;
    }

    function updateBidSummary() {
      const amount = Number(bidAmount && bidAmount.value ? bidAmount.value : 0);
      const commission = amount * 0.2;
      const payout = amount - commission;

      if (commissionAmount) commissionAmount.textContent = `$${commission.toFixed(0)}`;
      if (payoutAmount) payoutAmount.textContent = `$${payout.toFixed(0)}`;

      const workingRateLabel = document.getElementById("workingRateLabel");
      if (workingRateLabel) workingRateLabel.textContent = `$${amount.toFixed(0)}`;
    }

    if (bidAmount) {
      bidAmount.addEventListener("input", updateBidSummary);
      updateBidSummary(); 
    }

    if (proposalNotes && job.description && !proposalNotes.value.trim()) {
      proposalNotes.value = `I am interested in this project because ${job.title.toLowerCase()} requires care, clean execution, and consistent communication.`;
    }

    function showStatus(msg, isError = false) {
      if (!statusMessage) return;
      statusMessage.textContent = msg;
      statusMessage.style.display = "block";

      if (isError) {
        statusMessage.style.color = "#d9534f";
        statusMessage.style.backgroundColor = "#fdf7f7";
        statusMessage.style.borderColor = "#d9534f";
      } else {
        statusMessage.style.color = "#3c763d";
        statusMessage.style.backgroundColor = "#f4f9f4";
        statusMessage.style.borderColor = "#3c763d";
      }
    }

    if (bidForm) {
      if (statusMessage) statusMessage.style.display = "none"; 

      bidForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const projectId = job.id || new URLSearchParams(window.location.search).get("job");
        if (!projectId) {
          showStatus("Error: Cannot establish project identity. Missing project ID.", true);
          return;
        }

        const clientHourlyRate = parseFloat(bidAmount.value); 
        if (isNaN(clientHourlyRate) || clientHourlyRate <= 0) {
          showStatus("Please enter a valid working budget rate greater than $0.", true);
          return;
        }
        
        const freelancerHourlyRate = clientHourlyRate * 0.8; 
        const notesContent = proposalNotes.value.trim();

        if (!notesContent) {
          showStatus("Please provide some introductory proposal notes for the client.", true);
          return;
        }

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Submitting your bid...";
        }

        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          if (!token) {
            showStatus("Authentication missing. Please sign in to submit proposals.", true);
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = "Submit bid now";
            }
            return;
          }

          // FIXED Endpoint to absolute backend node server on port 3000
          const response = await fetch(`https://freelancerhubbackend.onrender.com/api/bids/${projectId}/bids`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              proposal_text: notesContent,
              client_hourly_rate: clientHourlyRate,
              freelancer_hourly_rate: freelancerHourlyRate
            }),
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message || "Server rejected proposal submission.");
          }

          showStatus("Success! Your bid has been submitted successfully.", false);
          bidForm.reset();
          updateBidSummary();

          setTimeout(() => {
            window.location.href = "/pages/user-dashboard.html";
          }, 2000);
        } catch (error) {
          showStatus(error.message, true);
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Submit bid now";
          }
        }
      });
    }
  }

  // --- Dynamic API Content Fetch Lifecycle ---
  async function initPage() {
    setSidebarUser();

    const queryJobId = new URLSearchParams(window.location.search).get("job");
    let targetJobData = { id: queryJobId || "" };

    if (queryJobId) {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        // FIXED Endpoint to absolute backend node server on port 3000
        const response = await fetch(`https://freelancerhubbackend.onrender.com/api/bids/${queryJobId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          const apiJobData = await response.json();
          if (apiJobData) {
            targetJobData = apiJobData;
          }
        } else {
          console.warn(`API returned code ${response.status}. Dropping to session fallback logic.`);
        }
      } catch (error) {
        console.error("Network error while connecting to structural data resource path:", error);
      }
    }

    if (!targetJobData.title) {
      const storedJob = sessionStorage.getItem("selectedJob");
      if (storedJob) {
        try {
          const parsedJob = JSON.parse(storedJob);
          if (parsedJob && (parsedJob.id === queryJobId || !queryJobId)) {
            targetJobData = parsedJob;
          }
        } catch {
          // Ignore failure
        }
      }
    }

    if (!targetJobData.title && !targetJobData.id) {
      targetJobData.id = "website-design-front-end-development";
      targetJobData.title = "Website Design and Front-End Development";
    }

    const job = resolveJobData(targetJobData);

    if (document.body.dataset.page === "job-description") {
      renderJobDescription(job);
    }

    if (document.body.dataset.page === "submit-bid") {
      renderBidPage(job);
    }
  }

  initPage();
})();