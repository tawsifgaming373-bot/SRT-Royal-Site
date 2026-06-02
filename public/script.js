/* ============================================
   LOGIN FORM VALIDATION & INTERACTION
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = document.querySelector('.submit-btn');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const loginBtn = document.querySelector('.login-btn');

  // Email validation
  const validateEmail = () => {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value) {
      emailError.textContent = 'Email is required';
      emailInput.setAttribute('aria-invalid', 'true');
      return false;
    } else if (!emailRegex.test(value)) {
      emailError.textContent = 'Please enter a valid email';
      emailInput.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      emailError.textContent = '';
      emailInput.setAttribute('aria-invalid', 'false');
      return true;
    }
  };

  // Password validation
  const validatePassword = () => {
    const value = passwordInput.value;
    
    if (!value) {
      passwordError.textContent = 'Password is required';
      passwordInput.setAttribute('aria-invalid', 'true');
      return false;
    } else if (value.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters';
      passwordInput.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      passwordError.textContent = '';
      passwordInput.setAttribute('aria-invalid', 'false');
      return true;
    }
  };

  // Real-time validation on input
  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('change', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);
  passwordInput.addEventListener('change', validatePassword);

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Simulate loading
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';

    // Simulate API call
    setTimeout(() => {
      // Success message
      const successMsg = document.createElement('div');
      successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
      `;
      successMsg.innerHTML = '✓ Sign in successful! (Demo Mode)';
      document.body.appendChild(successMsg);

      // Reset form
      form.reset();
      emailError.textContent = '';
      passwordError.textContent = '';
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Remove success message after 3 seconds
      setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successMsg.remove(), 300);
      }, 3000);
    }, 1200);
  });

  // Login button in navbar
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showForm('login');
      document.getElementById('email').focus();
    });
  }

  const showForm = (mode) => {
    const loginFormBox = document.querySelector('.form-box.login');
    const registerFormBox = document.querySelector('.form-box.register');

    if (mode === 'register') {
      loginFormBox.classList.remove('active');
      registerFormBox.classList.add('active');
      document.getElementById('registerName').focus();
    } else {
      registerFormBox.classList.remove('active');
      loginFormBox.classList.add('active');
      document.getElementById('email').focus();
    }
  };

  const registerLink = document.querySelector('.register-link');
  const loginLink = document.querySelector('.login-link');

  if (registerLink) {
    registerLink.addEventListener('click', function(e) {
      e.preventDefault();
      showForm('register');
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', function(e) {
      e.preventDefault();
      showForm('login');
    });
  }

  // Password visibility toggle
  const togglePwdBtn = document.querySelector('.toggle-password');
  if (togglePwdBtn && passwordInput) {
    togglePwdBtn.addEventListener('click', () => {
      const icon = togglePwdBtn.querySelector('ion-icon');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if (icon) icon.setAttribute('name', 'eye-off-outline');
        togglePwdBtn.setAttribute('aria-label', 'Hide password');
      } else {
        passwordInput.type = 'password';
        if (icon) icon.setAttribute('name', 'eye-outline');
        togglePwdBtn.setAttribute('aria-label', 'Show password');
      }
      passwordInput.focus();
    });
  }
});

/* Add animation styles */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
