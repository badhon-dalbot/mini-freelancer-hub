(function () {
  const DEFAULT_PROFILE = {
    firstName: 'Ava',
    lastName: 'Anderson',
    name: 'Ava Anderson',
    title: 'Creative Web Designer',
    bio:
      'Hello, I\'m Ava, a passionate web designer based in Bangladesh. I specialize in crafting stunning online experiences that captivate audiences and elevate brands. Whether you\'re launching a new website or looking to refresh your online presence, let\'s collaborate to bring your vision to life with creativity and functionality. Together, we can create a website that not only looks great but also drives results. Let\'s embark on this exciting journey of building your digital identity!',
    country: 'Bangladesh',
    state: 'Dhaka',
    freelancerType: 'Independent',
    englishLevel: 'Conversational',
    languages: ['English', 'French'],
    skills: ['App Design', 'Art Generation', 'Content Writing', 'Illustration', 'Logo Design'],
    hourlyRate: 20,
    avatar: '/Assests/Sara Miller  Icon.png',
    reviewCount: '3 reviews',
    viewCount: '8,571 views',
    social: ['behance', 'dribbble', 'linkedin', 'instagram'],
    portfolio: [
        { title: 'Creative Web Innovations', image: '/Assests/Sara Miller  Icon.png' },
      { title: 'Interactive Design Odyssey', image: '/Assests/Sara Miller  Icon.png' },
      { title: 'Seamless Experience Design', image: '/Assests/Sara Miller  Icon.png' },
      { title: 'Pixel Perfect Creations', image: '/Assests/Sara Miller  Icon.png' }
    ],
    education: [
      {
        school: 'University of Science and Technology',
        degree: 'Bachelor in Computer Science',
        from: 'April 1, 2016',
        to: 'April 1, 2020',
        description: 'Studied core concepts in computer science, including algorithms, data structures, and programming languages. Completed coursework in software development.'
      },
      {
        school: 'Business School of Excellence',
        degree: 'Master of Business Administration',
        from: 'April 1, 2020',
        to: 'April 1, 2022',
        description: 'Specialized in marketing management, strategic planning, and business development. Completed advanced coursework in finance, organizational behavior.'
      },
      {
        school: 'School of Visual Arts',
        degree: 'Associate of Arts in Graphic Design',
        from: 'April 1, 2022',
        to: 'April 1, 2024',
        description: 'Completed a comprehensive online certification in Digital Marketing, gaining expertise in SEO, social media marketing, and Google Analytics.'
      },
      {
        school: 'Online Course Platform',
        degree: 'Certification in Digital Marketing',
        from: 'May 1, 2021',
        to: 'May 1, 2022',
        description: 'Completed a comprehensive online certification in Digital Marketing, gaining expertise in SEO, social media marketing, and Google Analytics.'
      }
    ],
    experience: [
      {
        title: 'Junior Web Designer',
        company: 'WebWorks Solutions',
        from: 'May 1, 2013',
        to: 'July 1, 2014',
        description: 'Assisted senior designers in creating website layouts and graphics. Participated in client meetings to gather the requirements and feedback.'
      },
      {
        title: 'Freelance Web Designer',
        company: 'Self-employed',
        from: 'August 2, 2014',
        to: 'December 2, 2015',
        description: 'Worked with clients to create custom website designs tailored to their brand and target audience. Utilized HTML, CSS, and JavaScript to build responsive sites.'
      },
      {
        title: 'Web Designer',
        company: 'Design Dynamics Agency',
        from: 'January 3, 2016',
        to: 'May 3, 2018',
        description: 'Designed and developed responsive websites for various clients across different industries. Created wireframes, mockups, and prototypes to communicate ideas.'
      },
      {
        title: 'Web Designer',
        company: 'Digital Creations Inc.',
        from: 'June 1, 2018',
        to: 'Present',
        description: 'Lead design projects from concept to completion, specializing in website and interface design. Collaborate with clients to understand their goals and translate them into polished digital experiences.'
      }
    ]
  };

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function normalizeList(value, fallback) {
    if (Array.isArray(value) && value.length) return value;
    if (typeof value === 'string' && value.trim()) {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return fallback.slice();
  }

  function getProfile() {
    const stored = safeParse(localStorage.getItem('user')) || safeParse(localStorage.getItem('currentUser')) || {};
    const firstName = stored.firstName || stored.firstname || DEFAULT_PROFILE.firstName;
    const lastName = stored.lastName || stored.lastname || DEFAULT_PROFILE.lastName;

    return {
      ...DEFAULT_PROFILE,
      ...stored,
      firstName,
      lastName,
      name: stored.name || stored.fullName || `${firstName} ${lastName}`.trim(),
      skills: normalizeList(stored.skills || stored.skillsCSV, DEFAULT_PROFILE.skills),
      languages: normalizeList(stored.languages || stored.languagesCSV, DEFAULT_PROFILE.languages),
      portfolio: Array.isArray(stored.portfolio) && stored.portfolio.length ? stored.portfolio : DEFAULT_PROFILE.portfolio,
      education: Array.isArray(stored.education) && stored.education.length ? stored.education : DEFAULT_PROFILE.education,
      experience: Array.isArray(stored.experience) && stored.experience.length ? stored.experience : DEFAULT_PROFILE.experience
    };
  }

  function renderChips(container, values) {
    container.innerHTML = '';
    values.forEach((value) => {
      const chip = document.createElement('span');
      chip.className = 'skill';
      chip.textContent = value;
      container.appendChild(chip);
    });
  }

  function renderPortfolio(container, items) {
    container.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'portfolio_item';
      card.innerHTML = `
        <img src="${item.image || item.thumbnail || '/Assests/Sara Miller  Icon.png'}" alt="${item.title || 'Portfolio item'}" />
        <div class="portfolio_caption">${item.title || 'Portfolio item'}</div>
      `;
      container.appendChild(card);
    });
  }

  function renderEducation(container, items) {
    container.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'info_card';
      card.innerHTML = `
        <h4>${item.degree || ''}</h4>
        <div class="meta">${item.school || ''} • ${item.from || ''} - ${item.to || ''}</div>
        <p>${item.description || ''}</p>
      `;
      container.appendChild(card);
    });
  }

  function renderExperience(container, items) {
    container.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'info_card';
      card.innerHTML = `
        <h4>${item.title || ''}</h4>
        <div class="meta">${item.company || ''} • ${item.from || ''} - ${item.to || ''}</div>
        <p>${item.description || ''}</p>
      `;
      container.appendChild(card);
    });
  }

  function render() {
    const profile = getProfile();
    const avatar = document.getElementById('profileAvatarImage');
    avatar.src = profile.avatar || '/Assests/AI solution Icon';
    avatar.onerror = () => {
      avatar.src = 'https://via.placeholder.com/120x120?text=Ava';
    };

    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileRateLabel').textContent = `$${profile.hourlyRate}/hr`;
    document.getElementById('profileReviewCount').textContent = profile.reviewCount;
    document.getElementById('profileJobCount').textContent = profile.viewCount;
    document.getElementById('profileLocation').textContent = profile.country;
    document.getElementById('profileFreelancerType').textContent = profile.freelancerType;
    document.getElementById('profileLanguagesSummary').textContent = profile.languages.join(', ');
    document.getElementById('profileEnglishLevel').textContent = profile.englishLevel;
    document.getElementById('profileBio').textContent = profile.bio;

    const socialRow = document.getElementById('profileSocialRow');
    socialRow.innerHTML = '';
    profile.social.forEach((name) => {
      const dot = document.createElement('span');
      dot.className = 'social_dot';
      dot.title = name;
      socialRow.appendChild(dot);
    });

    renderChips(document.getElementById('profileSkills'), profile.skills);
    renderPortfolio(document.getElementById('profilePortfolio'), profile.portfolio);
    renderEducation(document.getElementById('profileEducation'), profile.education);
    renderExperience(document.getElementById('profileExperience'), profile.experience);
  }

  document.addEventListener('DOMContentLoaded', render);
})();