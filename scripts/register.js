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

// Form submission
if (registerForm) {
  registerForm.addEventListener('click', (e) => {
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
    
    // If validation passes
    showMessage('Registration successful! Redirecting...', 'success');
    console.log('Register data:', {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    });
    
    // Simulate redirect after 1.5 seconds
    setTimeout(() => {
      window.location.href = '/pages/employee-dashboard.html';
    }, 1500);
  });
}

// Social button handlers
const socialButtons = document.querySelectorAll('.social_button');
socialButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const provider = button.textContent.trim();
    showMessage(`Registering with ${provider}...`, 'info');
    console.log('OAuth with:', provider);
    
    // Simulate OAuth flow
    setTimeout(() => {
      showMessage(`${provider} registration would redirect to auth...`, 'success');
    }, 1000);
  });
});

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
