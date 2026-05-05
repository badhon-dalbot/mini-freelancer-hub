// Tab switching
const tabs = document.querySelectorAll('.signin_tab');
const signInLink = document.querySelector('.create-account-text a');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('signin_tab_active'));
    
    // Add active class to clicked tab
    tab.classList.add('signin_tab_active');
    
    // Navigate based on tab content
    if (tab.textContent.includes('Create Account')) {
      window.location.href = '/pages/register.html';
    }
  });
});

// Link to register page
if (signInLink) {
  signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/pages/register.html';
  });
}

// Form submission
const signInForm = document.querySelector('.primary_button');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

async function handleSignIn() {
  const loginUrl = 'https://freelancerhubbackend.onrender.com/auth/login';
  const payload = {
    email: emailInput.value,  
    password: passwordInput.value
  };

  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
      showMessage('Sign in successful! Redirecting...', 'success');
      // Store token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setTimeout(() => {
        window.location.href = '/pages/employee-dashboard.html';
      }, 1500);
    } else {
      showMessage('Invalid credentials. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);

    if (isCorsOrNetworkError(error)) {
      const fallbackUser = validateLoginLocally(payload);
      if (fallbackUser) {
        localStorage.setItem('token', 'local-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        showMessage('Server blocked by CORS. Logged in locally for now. Redirecting...', 'info');
        setTimeout(() => {
          window.location.href = '/pages/employee-dashboard.html';
        }, 1500);
      } else {
        showMessage('No local account found. Please register first.', 'error');
      }
    } else {
      showMessage('Sign in failed. Please try again.', 'error');
    }
  }
}
if (signInForm) {
  signInForm.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Validation
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
      showMessage('Please enter your password', 'error');
      passwordInput.focus();
      return;
    }
    
    if (passwordInput.value.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      passwordInput.focus();
      return;
    }
    
    // Call API handler
    handleSignIn();
  });
}




// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isCorsOrNetworkError(error) {
  if (!error) {
    return false;
  }

  const message = String(error.message || '').toLowerCase();
  return error.name === 'TypeError' || message.includes('failed to fetch') || message.includes('networkerror');
}

function validateLoginLocally(payload) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === payload.email && u.password === payload.password);
  return user || null;
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
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    signInForm.click();
  }
});
