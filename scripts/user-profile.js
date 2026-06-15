(function () {
  // const DEFAULT_PROFILE = {
  //   firstName: "Ava",
  //   lastName: "Anderson",
  //   name: "Ava Anderson",
  //   title: "Creative Web Designer",
  //   bio: "Hello, I'm Ava, a passionate web designer based in Bangladesh. I specialize in crafting stunning online experiences that captivate audiences and elevate brands. Whether you're launching a new website or looking to refresh your online presence, let's collaborate to bring your vision to life with creativity and functionality. Together, we can create a website that not only looks great but also drives results. Let's embark on this exciting journey of building your digital identity!",
  //   country: "Bangladesh",
  //   state: "Dhaka",
  //   freelancerType: "Independent",
  //   englishLevel: "Conversational",
  //   languages: ["English", "French"],
  //   skills: [
  //     "App Design",
  //     "Art Generation",
  //     "Content Writing",
  //     "Illustration",
  //     "Logo Design",
  //   ],
  //   hourlyRate: 20,
  //   avatar: "/Assests/Sara Miller  Icon.png",
  //   reviewCount: "3 reviews",
  //   viewCount: "8,571 views",
  //   social: ["behance", "dribbble", "linkedin", "instagram"],
  //   portfolio: [
  //     {
  //       title: "Creative Web Innovations",
  //       image: "/Assests/Sara Miller  Icon.png",
  //     },
  //     {
  //       title: "Interactive Design Odyssey",
  //       image: "/Assests/Sara Miller  Icon.png",
  //     },
  //     {
  //       title: "Seamless Experience Design",
  //       image: "/Assests/Sara Miller  Icon.png",
  //     },
  //     {
  //       title: "Pixel Perfect Creations",
  //       image: "/Assests/Sara Miller  Icon.png",
  //     },
  //   ],
  //   education: [
  //     {
  //       school: "University of Science and Technology",
  //       degree: "Bachelor in Computer Science",
  //       from: "April 1, 2016",
  //       to: "April 1, 2020",
  //       description:
  //         "Studied core concepts in computer science, including algorithms, data structures, and programming languages. Completed coursework in software development.",
  //     },
  //     {
  //       school: "Business School of Excellence",
  //       degree: "Master of Business Administration",
  //       from: "April 1, 2020",
  //       to: "April 1, 2022",
  //       description:
  //         "Specialized in marketing management, strategic planning, and business development. Completed advanced coursework in finance, organizational behavior.",
  //     },
  //     {
  //       school: "School of Visual Arts",
  //       degree: "Associate of Arts in Graphic Design",
  //       from: "April 1, 2022",
  //       to: "April 1, 2024",
  //       description:
  //         "Completed a comprehensive online certification in Digital Marketing, gaining expertise in SEO, social media marketing, and Google Analytics.",
  //     },
  //     {
  //       school: "Online Course Platform",
  //       degree: "Certification in Digital Marketing",
  //       from: "May 1, 2021",
  //       to: "May 1, 2022",
  //       description:
  //         "Completed a comprehensive online certification in Digital Marketing, gaining expertise in SEO, social media marketing, and Google Analytics.",
  //     },
  //   ],
  //   experience: [
  //     {
  //       title: "Junior Web Designer",
  //       company: "WebWorks Solutions",
  //       from: "May 1, 2013",
  //       to: "July 1, 2014",
  //       description:
  //         "Assisted senior designers in creating website layouts and graphics. Participated in client meetings to gather the requirements and feedback.",
  //     },
  //     {
  //       title: "Freelance Web Designer",
  //       company: "Self-employed",
  //       from: "August 2, 2014",
  //       to: "December 2, 2015",
  //       description:
  //         "Worked with clients to create custom website designs tailored to their brand and target audience. Utilized HTML, CSS, and JavaScript to build responsive sites.",
  //     },
  //     {
  //       title: "Web Designer",
  //       company: "Design Dynamics Agency",
  //       from: "January 3, 2016",
  //       to: "May 3, 2018",
  //       description:
  //         "Designed and developed responsive websites for various clients across different industries. Created wireframes, mockups, and prototypes to communicate ideas.",
  //     },
  //     {
  //       title: "Web Designer",
  //       company: "Digital Creations Inc.",
  //       from: "June 1, 2018",
  //       to: "Present",
  //       description:
  //         "Lead design projects from concept to completion, specializing in website and interface design. Collaborate with clients to understand their goals and translate them into polished digital experiences.",
  //     },
  //   ],
  // };

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
