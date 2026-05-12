(function () {
  const DEFAULT_PROFILE = {
    firstName: 'Sayed Hasan',
    lastName: 'Sami',
    name: 'Sayed Hasan Sami',
    title: 'Creative Web Designer',
    bio:
      'Hello, I\'m Sayed Hasan, a passionate web designer based in the United States. I specialize in crafting stunning online experiences that captivate audiences and elevate brands. Whether you\'re launching a new website or looking to refresh your online presence, let\'s collaborate to bring your vision to life with creativity and functionality. Together, we can create a website that not only looks great but also drives results. Let\'s embark on this exciting journey of building your digital identity!',
    country: 'Bangladesh',
    state: 'Dhaka',
    freelancerType: 'Independent',
    englishLevel: 'Conversational',
    skills: ['App Design', 'Art Generation', 'Content Writing', 'Illustration', 'Logo Design', 'Marketing', 'Web Design'],
    languages: ['English', 'French'],
    hourlyRate: 20,
    avatar: '/Assests/Sara Miller  Icon.png',
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
      }
    ]
  };

  const COUNTRY_STATES = {
    Bangladesh: ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi'],
    'United States (US)': ['California', 'New York', 'Texas', 'Florida'],
    Canada: ['Ontario', 'Quebec', 'British Columbia'],
    UK: ['England', 'Scotland', 'Wales']
  };

  const FREELANCER_TYPES = ['Independent', 'Agency', 'Part-time', 'Full-time'];
  const ENGLISH_LEVELS = ['Conversational', 'Fluent', 'Native', 'Basic'];

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

  function getStoredUser() {
    return safeParse(localStorage.getItem('user')) || safeParse(localStorage.getItem('currentUser')) || {};
  }

  function getProfile() {
    const stored = getStoredUser();
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
      education: Array.isArray(stored.education) && stored.education.length ? stored.education : DEFAULT_PROFILE.education.slice()
    };
  }

  function setStoredUser(profile) {
    localStorage.setItem('user', JSON.stringify(profile));
    localStorage.setItem('currentUser', JSON.stringify(profile));
  }

  function buildSelect(selectElement, values, selectedValue) {
    selectElement.innerHTML = values
      .map((value) => `<option value="${value}">${value}</option>`)
      .join('');
    selectElement.value = selectedValue || values[0];
  }

  function addChip(container, text) {
    if (!text) return;
    const chip = document.createElement('span');
    chip.className = 'chip';
    const label = document.createElement('span');
    label.textContent = text;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Remove ${text}`);
    button.textContent = '×';
    button.addEventListener('click', () => chip.remove());
    chip.append(label, button);
    container.appendChild(chip);
  }

  function syncChipField(input, preview, hiddenName) {
    const sync = () => {
      const items = Array.from(preview.querySelectorAll('.chip span:first-child')).map((node) => node.textContent.trim()).filter(Boolean);
      input.dataset.values = JSON.stringify(items);
      input.value = '';
      input.setAttribute('data-hidden-name', hiddenName);
    };

    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ',') return;
      event.preventDefault();
      const value = input.value.replace(/,$/, '').trim();
      if (!value) return;
      addChip(preview, value);
      sync();
    });

    preview.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') sync();
    });

    return sync;
  }

  function renderEducationItem(item = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'education_item';
    wrapper.innerHTML = `
      <div class="education_top">
        <div>
          <div class="form_row">
            <label>School / institution</label>
            <input type="text" class="education_school" />
          </div>
        </div>
        <button type="button" class="icon_btn education_remove">Delete</button>
      </div>
      <div class="two_col_grid mini_row">
        <div class="form_row">
          <label>Degree</label>
          <input type="text" class="education_degree" />
        </div>
        <div class="form_row">
          <label>Description</label>
          <input type="text" class="education_description" />
        </div>
      </div>
      <div class="two_col_grid mini_row">
        <div class="form_row">
          <label>Start</label>
          <input type="text" class="education_from" />
        </div>
        <div class="form_row">
          <label>End</label>
          <input type="text" class="education_to" />
        </div>
      </div>
    `;
    wrapper.querySelector('.education_school').value = item.school || '';
    wrapper.querySelector('.education_degree').value = item.degree || '';
    wrapper.querySelector('.education_description').value = item.description || '';
    wrapper.querySelector('.education_from').value = item.from || '';
    wrapper.querySelector('.education_to').value = item.to || '';
    wrapper.querySelector('.education_remove').addEventListener('click', () => wrapper.remove());
    return wrapper;
  }

  function populateEducation(listElement, education) {
    listElement.innerHTML = '';
    education.forEach((item) => listElement.appendChild(renderEducationItem(item)));
  }

  function populateForm() {
    const profile = getProfile();

    document.getElementById('fieldFirstName').value = profile.firstName;
    document.getElementById('fieldLastName').value = profile.lastName;
    document.getElementById('fieldTitle').value = profile.title;
    document.getElementById('fieldBio').textContent = profile.bio;
    document.getElementById('fieldRate').value = profile.hourlyRate;

    buildSelect(document.getElementById('fieldCountry'), Object.keys(COUNTRY_STATES), profile.country);
    buildSelect(document.getElementById('fieldState'), COUNTRY_STATES[profile.country] || COUNTRY_STATES.Bangladesh, profile.state);
    buildSelect(document.getElementById('fieldFreelancerType'), FREELANCER_TYPES, profile.freelancerType);
    buildSelect(document.getElementById('fieldEnglishLevel'), ENGLISH_LEVELS, profile.englishLevel);

    const avatarPreview = document.getElementById('avatarPreview');
    avatarPreview.src = profile.avatar || '/Assests/AI solution Icon';
    avatarPreview.onerror = () => {
      avatarPreview.src = 'https://via.placeholder.com/120x120?text=Avatar';
    };

    const skillsInput = document.getElementById('fieldSkills');
    const skillsPreview = document.getElementById('skillsPreview');
    profile.skills.forEach((skill) => addChip(skillsPreview, skill));
    syncChipField(skillsInput, skillsPreview, 'skills');

    const languagesInput = document.getElementById('fieldLanguages');
    const languagesPreview = document.getElementById('languagesPreview');
    profile.languages.forEach((language) => addChip(languagesPreview, language));
    syncChipField(languagesInput, languagesPreview, 'languages');

    const educationList = document.getElementById('educationList');
    populateEducation(educationList, profile.education);

    document.getElementById('fieldCountry').addEventListener('change', (event) => {
      buildSelect(document.getElementById('fieldState'), COUNTRY_STATES[event.target.value] || COUNTRY_STATES.Bangladesh, '');
    });

    document.getElementById('fieldAvatarFile').addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        avatarPreview.src = String(reader.result || '');
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('addEducationBtn').addEventListener('click', () => {
      educationList.appendChild(renderEducationItem());
    });
  }

  function collectChipValues(previewSelector) {
    return Array.from(document.querySelectorAll(`${previewSelector} .chip span:first-child`))
      .map((node) => node.textContent.trim())
      .filter(Boolean);
  }

  function collectEducation() {
    return Array.from(document.querySelectorAll('.education_item')).map((item) => ({
      school: item.querySelector('.education_school').value.trim(),
      degree: item.querySelector('.education_degree').value.trim(),
      description: item.querySelector('.education_description').value.trim(),
      from: item.querySelector('.education_from').value.trim(),
      to: item.querySelector('.education_to').value.trim()
    })).filter((entry) => entry.school || entry.degree || entry.description || entry.from || entry.to);
  }

  async function handleSave(event) {
    event.preventDefault();
    const profile = getProfile();

    profile.firstName = document.getElementById('fieldFirstName').value.trim();
    profile.lastName = document.getElementById('fieldLastName').value.trim();
    profile.name = `${profile.firstName} ${profile.lastName}`.trim();
    profile.title = document.getElementById('fieldTitle').value.trim();
    profile.bio = document.getElementById('fieldBio').textContent.trim();
    profile.country = document.getElementById('fieldCountry').value;
    profile.state = document.getElementById('fieldState').value;
    profile.freelancerType = document.getElementById('fieldFreelancerType').value;
    profile.englishLevel = document.getElementById('fieldEnglishLevel').value;
    profile.hourlyRate = Number(document.getElementById('fieldRate').value || 0);
    profile.skills = collectChipValues('#skillsPreview');
    profile.languages = collectChipValues('#languagesPreview');
    profile.education = collectEducation();
    profile.avatar = document.getElementById('avatarPreview').src;

    setStoredUser(profile);

    try {
      if (window.updateData && profile.id) {
        await updateData(`/users/${profile.id}`, profile);
      }
    } catch (error) {
      console.warn('API save failed', error);
    }

    window.location.href = '/pages/user_profile.html';
  }

  document.addEventListener('DOMContentLoaded', () => {
    populateForm();
    const form = document.getElementById('profileForm');
    form.addEventListener('submit', handleSave);
  });
})();