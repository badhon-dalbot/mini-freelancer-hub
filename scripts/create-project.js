(function () {
  const draftStorageKey = 'createGigDraft';
  const form = document.getElementById('createGigForm');
  const tabs = Array.from(document.querySelectorAll('.gig_tab'));
  const panels = Array.from(document.querySelectorAll('.gig_panel'));
  const saveMessage = document.getElementById('saveMessage');
  const taskTagsInput = document.getElementById('taskTags');
  const tagList = document.getElementById('tagList');
  const attachmentsInput = document.getElementById('gigAttachments');
  const attachmentList = document.getElementById('attachmentList');
  const faqList = document.getElementById('faqList');
  const addFaqButton = document.getElementById('addFaqButton');
  const aiTitleButton = document.getElementById('aiTitleButton');
  const aiIntroButton = document.getElementById('aiIntroButton');
  const taskTitle = document.getElementById('taskTitle');
  const taskCategory = document.getElementById('taskCategory');
  const taskCountry = document.getElementById('taskCountry');
  const taskIntroduction = document.getElementById('taskIntroduction');

  const draftState = {
    tags: [],
    attachments: [],
    faqs: []
  };

  function setSidebarUser() {
    const sidebarName = document.getElementById('sidebarName');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const topbarProfile = document.getElementById('topbarProfile');

    if (!window.MFHUserSession) {
      return;
    }

    const userProfile = window.MFHUserSession.getCurrentUser();
    const initials = window.MFHUserSession.getInitials(userProfile.displayName);

    if (sidebarName) {
      sidebarName.textContent = userProfile.displayName;
    }

    if (sidebarAvatar) {
      sidebarAvatar.textContent = initials;
    }

    if (topbarProfile) {
      topbarProfile.textContent = initials;
    }
  }

  function setActiveTab(tabName) {
    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    panels.forEach(function (panel) {
      panel.classList.toggle('active', panel.dataset.panel === tabName);
    });
  }

  function getActiveTabIndex() {
    return tabs.findIndex(function (tab) {
      return tab.classList.contains('active');
    });
  }

  function nextTab() {
    const index = getActiveTabIndex();
    const nextIndex = Math.min(index + 1, tabs.length - 1);
    setActiveTab(tabs[nextIndex].dataset.tab);
  }

  function renderTags() {
    if (!tagList) {
      return;
    }

    tagList.innerHTML = draftState.tags
      .map(function (tag, index) {
        return `<span class="tag_chip">${tag}<button type="button" data-remove-tag="${index}" aria-label="Remove tag">x</button></span>`;
      })
      .join('');
  }

  function renderAttachments() {
    if (!attachmentList) {
      return;
    }

    attachmentList.innerHTML = draftState.attachments
      .map(function (fileName) {
        return `<li>${fileName}</li>`;
      })
      .join('');
  }

  function createFaqItem(faq) {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq_item';
    faqItem.innerHTML = `
      <input type="text" placeholder="Question" value="${faq.question || ''}">
      <textarea rows="4" placeholder="Answer">${faq.answer || ''}</textarea>
      <button class="outline_button" type="button" data-remove-faq="true">Remove FAQ</button>
    `;

    return faqItem;
  }

  function renderFaqs() {
    if (!faqList) {
      return;
    }

    faqList.innerHTML = '';

    if (!draftState.faqs.length) {
      draftState.faqs.push({ question: '', answer: '' });
    }

    draftState.faqs.forEach(function (faq) {
      faqList.appendChild(createFaqItem(faq));
    });
  }

  function collectFaqsFromDOM() {
    if (!faqList) {
      return;
    }

    const faqItems = Array.from(faqList.querySelectorAll('.faq_item'));
    draftState.faqs = faqItems.map(function (item) {
      const questionInput = item.querySelector('input');
      const answerInput = item.querySelector('textarea');

      return {
        question: questionInput ? questionInput.value.trim() : '',
        answer: answerInput ? answerInput.value.trim() : ''
      };
    });
  }

  function getFieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value : '';
  }

  function saveDraft() {
    collectFaqsFromDOM();

    const payload = {
      taskTitle: getFieldValue('taskTitle'),
      taskCategory: getFieldValue('taskCategory'),
      taskCountry: getFieldValue('taskCountry'),
      taskIntroduction: getFieldValue('taskIntroduction'),
      priceType: getFieldValue('priceType'),
      deliveryTime: getFieldValue('deliveryTime'),
      minBudget: getFieldValue('minBudget'),
      maxBudget: getFieldValue('maxBudget'),
      tags: draftState.tags,
      attachments: draftState.attachments,
      faqs: draftState.faqs
    };

    localStorage.setItem(draftStorageKey, JSON.stringify(payload));
  }

  function loadDraft() {
    const rawDraft = localStorage.getItem(draftStorageKey);

    if (!rawDraft) {
      return;
    }

    try {
      const parsed = JSON.parse(rawDraft);
      Object.keys(parsed).forEach(function (key) {
        const field = document.getElementById(key);
        if (field && typeof parsed[key] === 'string') {
          field.value = parsed[key];
        }
      });

      draftState.tags = Array.isArray(parsed.tags) ? parsed.tags : [];
      draftState.attachments = Array.isArray(parsed.attachments) ? parsed.attachments : [];
      draftState.faqs = Array.isArray(parsed.faqs) ? parsed.faqs : [];
    } catch {
      // Ignore malformed local draft data.
    }
  }

  function removeErrors() {
    form.querySelectorAll('.field_error').forEach(function (field) {
      field.classList.remove('field_error');
    });
  }

  function validatePanel(panelName) {
    removeErrors();

    const requiredByPanel = {
      introduction: ['taskTitle', 'taskCategory', 'taskCountry', 'taskIntroduction'],
      pricing: ['priceType', 'deliveryTime', 'minBudget', 'maxBudget'],
      media: [],
      faq: []
    };

    const requiredFields = requiredByPanel[panelName] || [];
    let isValid = true;

    requiredFields.forEach(function (fieldId) {
      const field = document.getElementById(fieldId);

      if (!field || String(field.value).trim()) {
        return;
      }

      field.classList.add('field_error');
      isValid = false;
    });

    const minBudgetField = document.getElementById('minBudget');
    const maxBudgetField = document.getElementById('maxBudget');

    if (panelName === 'pricing' && minBudgetField && maxBudgetField) {
      const minValue = Number(minBudgetField.value || 0);
      const maxValue = Number(maxBudgetField.value || 0);

      if (minValue && maxValue && maxValue < minValue) {
        minBudgetField.classList.add('field_error');
        maxBudgetField.classList.add('field_error');
        isValid = false;
      }
    }

    return isValid;
  }

  function addTag(tag) {
    const normalizedTag = String(tag || '').trim();

    if (!normalizedTag || draftState.tags.includes(normalizedTag)) {
      return;
    }

    draftState.tags.push(normalizedTag);
    renderTags();
    saveDraft();
  }

  function hydrateInteractions() {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        saveDraft();
        setActiveTab(tab.dataset.tab);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const activeTab = tabs[getActiveTabIndex()];
      const activePanelName = activeTab ? activeTab.dataset.tab : 'introduction';

      if (!validatePanel(activePanelName)) {
        saveMessage.textContent = 'Please complete required fields before continuing.';
        return;
      }

      saveDraft();

      if (activePanelName === 'faq') {
        saveMessage.textContent = 'Your gig draft has been saved successfully.';
        return;
      }

      nextTab();
      saveMessage.textContent = 'Saved. Continue filling the next section.';
    });

    taskTagsInput.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter') {
        return;
      }

      event.preventDefault();
      addTag(taskTagsInput.value);
      taskTagsInput.value = '';
    });

    tagList.addEventListener('click', function (event) {
      const removeButton = event.target.closest('[data-remove-tag]');

      if (!removeButton) {
        return;
      }

      const removeIndex = Number(removeButton.getAttribute('data-remove-tag'));
      draftState.tags.splice(removeIndex, 1);
      renderTags();
      saveDraft();
    });

    attachmentsInput.addEventListener('change', function () {
      const selectedNames = Array.from(attachmentsInput.files).map(function (file) {
        return file.name;
      });

      draftState.attachments = selectedNames;
      renderAttachments();
      saveDraft();
    });

    addFaqButton.addEventListener('click', function () {
      collectFaqsFromDOM();
      draftState.faqs.push({ question: '', answer: '' });
      renderFaqs();
      saveDraft();
    });

    faqList.addEventListener('click', function (event) {
      const removeButton = event.target.closest('[data-remove-faq]');

      if (!removeButton) {
        return;
      }

      const item = removeButton.closest('.faq_item');
      if (!item) {
        return;
      }

      item.remove();
      collectFaqsFromDOM();
      saveDraft();
    });

    faqList.addEventListener('input', saveDraft);
    form.addEventListener('input', saveDraft);

    aiTitleButton.addEventListener('click', function () {
      const category = taskCategory.value || 'Web Development';
      const country = taskCountry.value || 'global clients';
      taskTitle.value = `Professional ${category} service for ${country}`;
      saveDraft();
    });

    aiIntroButton.addEventListener('click', function () {
      const title = taskTitle.value || 'your project';
      const category = taskCategory.value || 'this category';

      taskIntroduction.value = `I offer ${title.toLowerCase()} with a clear delivery plan and clean communication. This gig focuses on ${category.toLowerCase()} standards and is structured for practical business outcomes.`;
      saveDraft();
    });
  }

  setSidebarUser();
  loadDraft();
  renderTags();
  renderAttachments();
  renderFaqs();
  hydrateInteractions();
})();