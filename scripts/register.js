// // Tab switching
const tabs = document.querySelectorAll(".signin_tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    tabs.forEach((t) => t.classList.remove("signin_tab_active"));

    // Add active class to clicked tab
    tab.classList.add("signin_tab_active");

    // Navigate based on tab content
    if (tab.textContent.includes("Sign In")) {
      window.location.href = "/pages/signin.html";
    }
  });
});

const url = "https://freelancerhubbackend.onrender.com/api/register";

// عناصر
const registerForm = document.getElementById("registerForm");
const firstNameInput = document.getElementById("firstname");
const lastNameInput = document.getElementById("lastname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm_password");

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show message
function showMessage(message, type = "info") {
  const existing = document.querySelector(".auth_message");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.className = `auth_message ${type}`;
  div.textContent = message;

  div.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 9999;
    ${type === "error" ? "background:#fee;color:#c33;" : ""}
    ${type === "success" ? "background:#efe;color:#2c7;" : ""}
    ${type === "info" ? "background:#eef;color:#33c;" : ""}
  `;

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

// Loading state
function setLoading(isLoading) {
  const btn = registerForm.querySelector('button[type="submit"]');
  if (!btn) return;

  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Registering..." : "Register →";
}

// API helper
// Optimized API helper
async function requestJSON(url, options) {
  const res = await fetch(url, options);

  if (res.status === 404) {
    throw new Error(
      `The URL path is incorrect (404). Check if the route exists on your backend.`,
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(
      `Server returned status ${res.status}, but failed to parse JSON data.`,
    );
  }

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

// Submit
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // console.log('Form working ✅');

    // Validation
    if (!firstNameInput.value.trim()) {
      showMessage("Enter first name", "error");
      return;
    }

    if (firstNameInput.value.trim().length < 2) {
      showMessage("First name must be at least 2 characters", "error");
      return;
    }

    if (!lastNameInput.value.trim()) {
      showMessage("Enter last name", "error");
      return;
    }

    if (lastNameInput.value.trim().length < 2) {
      showMessage("Last name must be at least 2 characters", "error");
      return;
    }

    if (!emailInput.value.trim()) {
      showMessage("Enter email", "error");
      return;
    }

    if (!isValidEmail(emailInput.value)) {
      showMessage("Invalid email", "error");
      return;
    }

    if (!passwordInput.value) {
      showMessage("Enter password", "error");
      return;
    }

    if (passwordInput.value.length < 6) {
      showMessage("Password must be at least 6 characters", "error");
      return;
    }

    if (!confirmPasswordInput.value) {
      showMessage("Confirm your password", "error");
      return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      showMessage("Passwords do not match", "error");
      return;
    }

    const payload = {
      firstname: firstNameInput.value.trim(),
      lastname: lastNameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      password: passwordInput.value,
      role: document.querySelector('input[name="role"]:checked')?.value || "client",
    };

    try {
      setLoading(true);

      const user = await requestJSON(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      localStorage.setItem("currentUser", JSON.stringify(user));

      showMessage("Registration successful! Redirecting...", "success");

      setTimeout(() => {
        window.location.href = "/pages/signin.html";
      }, 1200);
    } catch (error) {
      console.error(error);
      showMessage(error.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  });
}
