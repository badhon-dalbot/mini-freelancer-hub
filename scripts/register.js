// Tab switching
const tabs = document.querySelectorAll('.signin_tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('signin_tab_active'));
    
    // Add active class to clicked tab
    tab.classList.add('signin_tab_active');
    
    // Navigate based on tab content
    if (tab.textContent.includes('Sign In')) {
      window.location.href = '/pages/signin.html';
    }
  });
});

// Form elements
const registerForm = document.querySelector('.primary_button');
const firstNameInput = document.getElementById('firstname');
const lastNameInput = document.getElementById('lastname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');

// API configuration
const REGISTER_ENDPOINT = 'https://freelancerhubbackend.onrender.com/auth/register';

// Form submission
if (registerForm) {
  registerForm.addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Validation
    if (!firstNameInput.value.trim()) {
      showMessage('Please enter your first name', 'error');
      firstNameInput.focus();
      return;
    }
    
    if (firstNameInput.value.trim().length < 2) {
      showMessage('First name must be at least 2 characters', 'error');
      firstNameInput.focus();
      return;
    }
    
    if (!lastNameInput.value.trim()) {
      showMessage('Please enter your last name', 'error');
      lastNameInput.focus();
      return;
    }
    
    if (lastNameInput.value.trim().length < 2) {
      showMessage('Last name must be at least 2 characters', 'error');
      lastNameInput.focus();
      return;
    }
    
    if (!emailInput.value.trim()) {
      showMessage('Please enter your email', 'error');
      emailInput.focus();
      return;
    }
    
    if (!isValidEmail(emailInput.value)) {
      showMessage('Please enter a valid email address', 'error');
      emailInput.focus();
      return;
    }
    
    if (!passwordInput.value.trim()) {
      showMessage('Please enter a password', 'error');
      passwordInput.focus();
      return;
    }
    
    if (passwordInput.value.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      passwordInput.focus();
      return;
    }
    
    if (!confirmPasswordInput.value.trim()) {
      showMessage('Please confirm your password', 'error');
      confirmPasswordInput.focus();
      return;
    }
    
    if (passwordInput.value !== confirmPasswordInput.value) {
      showMessage('Passwords do not match', 'error');
      confirmPasswordInput.focus();
      return;
    }
    
    const payload = {
      firstname: firstNameInput.value.trim(),
      lastname: lastNameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      password: passwordInput.value,
    };

    try {
      setRegisterLoading(true);

      const savedUser = await requestJSON(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      showMessage('Registration successful! Redirecting...', 'success');

      localStorage.setItem('currentUser', JSON.stringify(savedUser));

      setTimeout(() => {
        window.location.href = '/pages/employee-dashboard.html';
      }, 1200);
    } catch (error) {
      console.error('Registration request failed:', error);

      if (isCorsOrNetworkError(error)) {
        const fallbackUser = saveUserLocally(payload);
        localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
        showMessage('Server blocked by CORS. Saved locally for now. Redirecting...', 'info');

        setTimeout(() => {
          window.location.href = '/pages/employee-dashboard.html';
        }, 1200);
      } else {
        showMessage(error.message || 'Failed to save your data. Please try again.', 'error');
      }
    } finally {
      setRegisterLoading(false);
    }
  });
}





// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function requestJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function isCorsOrNetworkError(error) {
  if (!error) {
    return false;
  }

  const message = String(error.message || '').toLowerCase();
  return error.name === 'TypeError' || message.includes('failed to fetch') || message.includes('networkerror');
}

function saveUserLocally(payload) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const existingIndex = users.findIndex(user => user.email === payload.email);

  const userRecord = {
    id: existingIndex > -1 ? users[existingIndex].id : Date.now(),
    ...payload,
    source: 'local-fallback'
  };

  if (existingIndex > -1) {
    users[existingIndex] = { ...users[existingIndex], ...userRecord };
  } else {
    users.push(userRecord);
  }

  localStorage.setItem('users', JSON.stringify(users));
  return userRecord;
}

function setRegisterLoading(isLoading) {
  if (!registerForm) {
    return;
  }

  registerForm.disabled = isLoading;
  registerForm.textContent = isLoading ? 'Saving...' : 'Register →';
}

function showMessage(message, type) {
  // Remove existing messages
  const existingMessage = document.querySelector('.auth_message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.className = `auth_message auth_message_${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 4.5rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideDown 0.3s ease;
    ${type === 'error' ? 'background: #fee; color: #c33;' : ''}
    ${type === 'success' ? 'background: #efe; color: #3c3;' : ''}
    ${type === 'info' ? 'background: #eef; color: #33c;' : ''}
  `;
  
  document.body.appendChild(messageDiv);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    messageDiv.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Enter key to submit
confirmPasswordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    registerForm.click();
  }
});