(function () {
  const defaultJobCatalog = {
    'website-design-front-end-development': {
      title: 'Website Design and Front-End Development',
      price: '$1,200-$1,400',
      priceType: 'Fixed Price Project',
      postDate: '2 years ago',
      location: 'Remote',
      description:
        'We are seeking a talented Website Designer and Front-End Developer to join our team. In this role, you will be responsible for creating visually appealing and user-friendly websites that meet our clients\' needs. You will work closely with our design and development teams to ensure the final product is both functional and aesthetically pleasing.',
      responsibilities: [
        'Designing and developing responsive websites',
        'Collaborating with the design team to create stunning visual designs',
        'Ensuring the technical feasibility of UI/UX designs',
        'Optimizing websites for maximum speed and scalability',
        'Implementing best practices in front-end development',
        'Staying up-to-date with the latest web design and development trends'
      ],
      requirements: [
        'Proven experience as a website designer and front-end developer',
        'Proficiency in HTML, CSS, and JavaScript',
        'Experience with responsive and mobile design',
        'Knowledge of SEO principles',
        'Excellent communication skills',
        'Strong attention to detail',
        'Ability to work in a fast-paced environment',
        'Team player with a positive attitude'
      ],
      skills: ['App Design', 'Content Writing', 'Illustration', 'Logo Design', 'Marketing', 'Programming', 'SEO'],
      hiringCapacity: '2 freelancers',
      expertise: 'Senior level',
      languages: 'English',
      duration: '1 to 3 months',
      buyer: {
        name: 'Mark Thompson',
        memberSince: 'April 30, 2024',
        title: 'Elevate Your Online Presence with Freelance Website Development',
        description:
          'I am a business owner seeking talented freelancers to build a professional website that enhances our online presence and drives business growth.',
        location: 'United States (US)',
        totalProjects: 1,
        ongoingProjects: 0
      }
    }
  };

  function buildGenericJobDetails(job) {
    const title = job.title || 'Project';
    const tagList = job.tags && job.tags.length ? job.tags : ['Communication', 'Problem Solving'];

    return {
      title: title,
      price: job.price || '$0',
      priceType: job.priceType || 'Fixed Price Project',
      postDate: job.postDate || 'Recently',
      location: job.location || 'Remote',
      description:
        job.description ||
        `We are looking for a reliable professional to handle ${title.toLowerCase()}. The right freelancer should communicate clearly, stay organized, and deliver polished results on time.`,
      responsibilities: [
        `Plan and execute the work for ${title.toLowerCase()}`,
        'Collaborate with the buyer to refine the brief and expectations',
        'Deliver work that is clean, accurate, and ready for review',
        'Keep communication consistent through the project timeline'
      ],
      requirements: [
        `Experience with ${tagList[0].toLowerCase()}`,
        'Strong written communication skills',
        'Ability to meet deadlines and follow instructions',
        'Attention to detail and a problem-solving mindset'
      ],
      skills: tagList.concat(['Communication', 'Attention to detail']).slice(0, 7),
      hiringCapacity: '2 freelancers',
      expertise: 'Senior level',
      languages: 'English',
      duration: '1 to 3 months',
      buyer: {
        name: job.buyerName || 'Project Buyer',
        memberSince: 'April 30, 2024',
        title: title,
        description:
          'Looking for a dependable freelancer who can communicate clearly, follow the brief, and deliver work that feels professional from the first draft.',
        location: 'United States (US)',
        totalProjects: 1,
        ongoingProjects: 0
      }
    };
  }

  function getSelectedJob() {
    const queryJobId = new URLSearchParams(window.location.search).get('job');
    const storedJob = sessionStorage.getItem('selectedJob');

    if (storedJob) {
      try {
        const parsedJob = JSON.parse(storedJob);

        if (parsedJob && parsedJob.id) {
          return parsedJob;
        }
      } catch {
        // Ignore malformed session data and fall back to the catalog.
      }
    }

    return {
      id: queryJobId || 'website-design-front-end-development',
      title: 'Website Design and Front-End Development'
    };
  }

  function resolveJobData(job) {
    const catalogJob = defaultJobCatalog[job.id] || {};
    const genericJob = buildGenericJobDetails(job);

    return {
      ...genericJob,
      ...catalogJob,
      ...job,
      buyer: {
        ...catalogJob.buyer,
        ...(job.buyer || {})
      }
    };
  }

  function getUserProfile() {
    const session = window.MFHUserSession;

    if (session && typeof session.getCurrentUser === 'function') {
      return session.getCurrentUser();
    }

    return {
      displayName: 'Sayed Hasan Sami'
    };
  }

  function setSidebarUser() {
    const userProfile = getUserProfile();
    const sidebarName = document.getElementById('sidebarName');
    const sidebarAvatar = document.getElementById('sidebarAvatar');

    if (sidebarName) {
      sidebarName.textContent = userProfile.displayName;
    }

    if (sidebarAvatar && window.MFHUserSession) {
      sidebarAvatar.textContent = window.MFHUserSession.getInitials(userProfile.displayName);
    }
  }

  function renderJobDescription(job) {
    const jobTitle = document.getElementById('jobTitle');
    const jobMeta = document.getElementById('jobMeta');
    const jobPrice = document.getElementById('jobPrice');
    const jobPriceType = document.getElementById('jobPriceType');
    const jobDescription = document.getElementById('jobDescription');
    const responsibilitiesList = document.getElementById('responsibilitiesList');
    const requirementsList = document.getElementById('requirementsList');
    const skillsList = document.getElementById('skillsList');
    const proposalButton = document.getElementById('proposalButton');
    const projectRequirements = document.getElementById('projectRequirements');
    const buyerCard = document.getElementById('buyerCard');
    const bidForm = document.querySelector('.bid_form');

    if (jobTitle) jobTitle.textContent = job.title;
    if (jobMeta) jobMeta.textContent = `Posted ${job.postDate} · ${job.location}`;
    if (jobPrice) jobPrice.textContent = job.price;
    if (jobPriceType) jobPriceType.textContent = job.priceType;
    if (jobDescription) jobDescription.textContent = job.description;

    if (responsibilitiesList) {
      responsibilitiesList.innerHTML = job.responsibilities
        .map(function (item) {
          return `<li>${item}</li>`;
        })
        .join('');
    }

    if (requirementsList) {
      requirementsList.innerHTML = job.requirements
        .map(function (item) {
          return `<li>${item}</li>`;
        })
        .join('');
    }

    if (skillsList) {
      skillsList.innerHTML = job.skills
        .map(function (skill) {
          return `<span class="skill_chip">${skill}</span>`;
        })
        .join('');
    }

    if (proposalButton) {
      proposalButton.addEventListener('click', function () {
        sessionStorage.setItem('selectedJob', JSON.stringify(job));
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
    const jobTitle = document.getElementById('jobTitle');
    const jobMeta = document.getElementById('jobMeta');
    const jobPrice = document.getElementById('jobPrice');
    const jobPriceType = document.getElementById('jobPriceType');
    const projectRequirements = document.getElementById('projectRequirements');
    const buyerCard = document.getElementById('buyerCard');
    const bidAmount = document.getElementById('bidAmount');
    const commissionAmount = document.getElementById('commissionAmount');
    const payoutAmount = document.getElementById('payoutAmount');
    const proposalNotes = document.getElementById('proposalNotes');
    const submitButton = document.getElementById('submitBidButton');
    const statusMessage = document.getElementById('bidStatusMessage');

    if (jobTitle) jobTitle.textContent = job.title;
    if (jobMeta) jobMeta.textContent = `Posted ${job.postDate} · ${job.location}`;
    if (jobPrice) jobPrice.textContent = job.price;
    if (jobPriceType) jobPriceType.textContent = job.priceType;

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

      if (commissionAmount) {
        commissionAmount.textContent = `$${commission.toFixed(0)}`;
      }

      if (payoutAmount) {
        payoutAmount.textContent = `$${payout.toFixed(0)}`;
      }

      const workingRateLabel = document.getElementById('workingRateLabel');

      if (workingRateLabel) {
        workingRateLabel.textContent = `$${amount.toFixed(0)}`;
      }
    }

    if (bidAmount) {
      bidAmount.addEventListener('input', updateBidSummary);
      updateBidSummary();
    }

    if (bidForm) {
      bidForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (statusMessage) {
          statusMessage.textContent = 'Your bid has been prepared for review.';
        }
      });
    }

    if (proposalNotes && job.description) {
      proposalNotes.value = `I am interested in this project because ${job.title.toLowerCase()} requires care, clean execution, and consistent communication.`;
    }
  }

  const job = resolveJobData(getSelectedJob());

  setSidebarUser();

  if (document.body.dataset.page === 'job-description') {
    renderJobDescription(job);
  }

  if (document.body.dataset.page === 'submit-bid') {
    renderBidPage(job);
  }
})();