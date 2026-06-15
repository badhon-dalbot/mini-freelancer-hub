document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const tabs = document.querySelectorAll(".gig_tab");
  const panels = document.querySelectorAll(".gig_panel");
  const form = document.getElementById("createGigForm");
  const saveContinueBtn = document.querySelector(".save_continue_button");
  const saveMessage = document.getElementById("saveMessage");

  // Tags Elements
  const tagsInput = document.getElementById("taskTags");
  const tagListContainer = document.getElementById("tagList");
  let tagsArray = [];

  // Budget Elements
  const minBudgetInput = document.getElementById("minBudget");
  const maxBudgetInput = document.getElementById("maxBudget");

  // File Upload Elements
  const fileInput = document.getElementById("gigAttachments");
  const attachmentListContainer = document.getElementById("attachmentList");
  let uploadedFiles = [];

  // FAQ Elements
  const addFaqBtn = document.getElementById("addFaqButton");
  const faqListContainer = document.getElementById("faqList");
  let faqCount = 0;

  // AI Buttons (Placeholders for features)
  const aiTitleBtn = document.getElementById("aiTitleButton");
  const aiIntroBtn = document.getElementById("aiIntroButton");

  // --- Tab Navigation System ---
  const tabOrder = ["introduction", "pricing", "media", "faq"];
  let currentTabIdx = 0;

  function switchTab(targetTabName) {
    tabs.forEach((tab) => {
      if (tab.getAttribute("data-tab") === targetTabName) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    panels.forEach((panel) => {
      if (panel.getAttribute("data-panel") === targetTabName) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    currentTabIdx = tabOrder.indexOf(targetTabName);

    // Update footer button UI based on current tab
    if (currentTabIdx === tabOrder.length - 1) {
      saveContinueBtn.textContent = "Publish Gig";
      saveMessage.textContent =
        "Review details and click 'Publish Gig' to make it live.";
    } else {
      saveContinueBtn.textContent = "Save & Continue";
      saveMessage.textContent =
        "Click 'Save & Continue' to add latest changes made by you";
    }
  }

  // Direct tab clicking
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      // Optional: Prevent skipping forward without basic section validations
      if (validateCurrentPanel()) {
        switchTab(targetTab);
      }
    });
  });

  // --- Tag Management System ---
  tagsInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagValue = tagsInput.value.trim().toLowerCase();

      if (tagValue && !tagsArray.includes(tagValue)) {
        tagsArray.push(tagValue);
        renderTags();
      }
      tagsInput.value = "";
    }
  });

  function renderTags() {
    tagListContainer.innerHTML = "";
    tagsArray.forEach((tag, index) => {
      const tagItem = document.createElement("span");
      tagItem.className = "tag_item";
      tagItem.innerHTML = `
                ${tag}
                <button type="button" data-index="${index}" aria-label="Remove tag">&times;</button>
            `;
      tagListContainer.appendChild(tagItem);
    });
  }

  tagListContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const indexToRemove = e.target.getAttribute("data-index");
      tagsArray.splice(indexToRemove, 1);
      renderTags();
    }
  });

  // --- Media / Attachments System ---
  fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);

    // Enforce maximum restriction limit (5 files total)
    if (uploadedFiles.length + files.length > 5) {
      alert("You can upload a maximum of 5 files.");
      fileInput.value = ""; // Reset file state picker
      return;
    }

    files.forEach((file) => {
      // Basic validation check for standard formatting types matching UI label
      const allowedExtensions = /(\.png|\.jpg|\.jpeg|\.pdf|\.docx)$/i;
      if (!allowedExtensions.exec(file.name)) {
        alert(
          `File type not allowed for: ${file.name}. Please upload PNG, JPG, PDF, or DOCX.`,
        );
        return;
      }
      uploadedFiles.push(file);
    });

    renderAttachments();
    fileInput.value = ""; // Clear file picker so user can pick identical file names again
  });

  function renderAttachments() {
    attachmentListContainer.innerHTML = "";
    uploadedFiles.forEach((file, index) => {
      const li = document.createElement("li");
      li.className = "attachment_item";

      // Format size readability
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

      li.innerHTML = `
                <span class="file_name">${file.name} <small>(${sizeInMB} MB)</small></span>
                <button class="remove_file_btn" type="button" data-index="${index}">&times;</button>
            `;
      attachmentListContainer.appendChild(li);
    });
  }

  attachmentListContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove_file_btn")) {
      const indexToRemove = e.target.getAttribute("data-index");
      uploadedFiles.splice(indexToRemove, 1);
      renderAttachments();
    }
  });

  // --- FAQ System (Dynamic Addition) ---
  addFaqBtn.addEventListener("click", () => {
    faqCount++;
    const faqBlock = document.createElement("div");
    faqBlock.className = "faq_block";
    faqBlock.id = `faqBlock_${faqCount}`;
    faqBlock.innerHTML = `
            <div class="faq_header">
                <h3>FAQ Entry #${faqCount}</h3>
                <button type="button" class="remove_faq_btn" data-faq-id="faqBlock_${faqCount}">&times; Remove</button>
            </div>
            <label for="faqQuestion_${faqCount}">Question:</label>
            <input id="faqQuestion_${faqCount}" name="faq_q_${faqCount}" type="text" placeholder="e.g. Do you support multi-language frameworks?" required>
            
            <label for="faqAnswer_${faqCount}">Answer:</label>
            <textarea id="faqAnswer_${faqCount}" name="faq_a_${faqCount}" rows="3" placeholder="Provide a brief, transparent response." required></textarea>
        `;
    faqListContainer.appendChild(faqBlock);
  });

  faqListContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove_faq_btn")) {
      const targetBlockId = e.target.getAttribute("data-faq-id");
      const elementToRemove = document.getElementById(targetBlockId);
      if (elementToRemove) {
        elementToRemove.remove();
      }
    }
  });

  // --- AI Writer Mechanics (Mock Implementations) ---
  if (aiTitleBtn) {
    aiTitleBtn.addEventListener("click", () => {
      const category =
        document.getElementById("taskCategory").value || "development tasks";
      document.getElementById("taskTitle").value =
        `Expert ${category} solutions tailor-made for your business architecture`;
    });
  }

  if (aiIntroBtn) {
    aiIntroBtn.addEventListener("click", () => {
      document.getElementById("taskIntroduction").value =
        "Welcome to this specialized service hub. We deliver modern architectures using cleaner methodologies, structured code conventions, standard responsive patterns, and seamless documentation configurations to transform project conceptualized roadmaps into high-performance engines.";
    });
  }

  // --- Panel Validation Logic ---
  function validateCurrentPanel() {
    const activePanel = document.querySelector(".gig_panel.active");
    const inputs = activePanel.querySelectorAll(
      "input[required], select[required], textarea[required]",
    );
    let panelValid = true;

    // Clear existing local warnings
    activePanel.querySelectorAll(".error_text").forEach((el) => el.remove());

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        panelValid = false;
        input.classList.add("input_error");

        // Append custom validation text nodes safely inline
        const errSpan = document.createElement("span");
        errSpan.className = "error_text";
        errSpan.style.color = "#e63946";
        errSpan.style.fontSize = "0.85rem";
        errSpan.style.display = "block";
        errSpan.style.marginTop = "4px";
        errSpan.textContent = "This field cannot be empty.";

        if (
          !input.nextElementSibling ||
          !input.nextElementSibling.classList.contains("error_text")
        ) {
          input.parentNode.insertBefore(errSpan, input.nextSibling);
        }
      } else {
        input.classList.remove("input_error");
      }
    });

    // Specific logical balance rules validation (Pricing logic matching limits context)
    if (tabOrder[currentTabIdx] === "pricing") {
      const minBudget = parseFloat(minBudgetInput.value);
      const maxBudget = parseFloat(maxBudgetInput.value);

      if (minBudget && maxBudget && minBudget > maxBudget) {
        panelValid = false;
        alert("Minimum Budget cannot exceed your Maximum Budget threshold.");
        minBudgetInput.classList.add("input_error");
        maxBudgetInput.classList.add("input_error");
      }
    }

    return panelValid;
  }

  // --- Multi-Step Form Submission Pipeline ---
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Control structural defaults manually

    // Complete form validations on the active visible panel card frame context
    if (!validateCurrentPanel()) {
      return;
    }

    // If it's not the final step, proceed to the next tab layout
    if (currentTabIdx < tabOrder.length - 1) {
      const nextTabName = tabOrder[currentTabIdx + 1];
      switchTab(nextTabName);
    } else {
      // Execution block for final data packaging payload (Final step "Publish")
      const formData = new FormData(form);

      // Build key/value pairs safely for asynchronous handling configurations
      const finalizedData = {
        taskTitle: formData.get("taskTitle"),
        taskCategory: formData.get("taskCategory"),
        taskCountry: formData.get("taskCountry"),
        taskIntroduction: formData.get("taskIntroduction"),
        priceType: formData.get("priceType"),
        deliveryTime: formData.get("deliveryTime"),
        minBudget: formData.get("minBudget"),
        maxBudget: formData.get("maxBudget"),
        tags: tagsArray,
        faqs: [],
      };

      // Capture active custom generated dynamic FAQ blocks cleanly
      const dynamicFaqBlocks = faqListContainer.querySelectorAll(".faq_block");
      dynamicFaqBlocks.forEach((block) => {
        const qInput = block.querySelector("input");
        const aTextarea = block.querySelector("textarea");
        if (qInput.value.trim() && aTextarea.value.trim()) {
          finalizedData.faqs.push({
            question: qInput.value.trim(),
            answer: aTextarea.value.trim(),
          });
        }
      });

      console.log("Form Successfully Authenticated & Compiled:", finalizedData);
      console.log(
        "Pending uploaded media file instances data stream size count:",
        uploadedFiles,
      );

      // Simulation of production visual workflow notification pipelines
      alert("Success! Your Freelancer Hub Gig was cleanly published.");

      // Reset configurations or route toward core operational landing parameters
      form.reset();
      tagsArray = [];
      uploadedFiles = [];
      faqListContainer.innerHTML = "";
      renderTags();
      renderAttachments();
      switchTab("introduction");
      window.location.href = "/pages/user-dashboard.html";
    }
  });
});
