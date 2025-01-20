// Main initialization function
function initializeLoginPage() {
    const state = {
        isLoading: false,
        errorMessage: '',
        successMessage: ''
    };

    // Cache DOM elements
    const elements = {
        form: document.getElementById('loginForm'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        remember: document.querySelector('input[name="remember"]'),
        submitButton: document.querySelector('.btn-primary'),
        googleButton: document.querySelector('.btn-google'),
        forgotPassword: document.querySelector('.forgot-password')
    };

    // Validate required elements exist
    if (!validateRequiredElements(elements)) {
        console.error('Required form elements not found');
        return;
    }

    // Setup form validation and submission
    setupFormHandling(elements, state);

    // Setup Google login
    setupGoogleLogin(elements.googleButton);

    // Setup forgot password
    setupForgotPassword(elements);

    // Setup accessibility
    setupAccessibility(elements);

    // Cleanup function
    return () => {
        removeEventListeners(elements);
    };
}

// Form validation and setup
function setupFormHandling(elements, state) {
    const { form, email, password, submitButton } = elements;

    form.setAttribute('novalidate', true);
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset state
        clearMessages();
        
        // Validate form
        if (!validateForm(email, password)) {
            return;
        }

        // Update UI state
        updateLoadingState(true, submitButton);

        try {
            // Simulate API call
            await handleLogin({
                email: email.value,
                password: password.value,
                remember: elements.remember.checked
            });

            showSuccessMessage('Login successful! Redirecting...');
            
            // Simulate redirect
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);

        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            updateLoadingState(false, submitButton);
        }
    });

    // Real-time validation
    email.addEventListener('input', () => validateEmail(email));
    password.addEventListener('input', () => validatePassword(password));
}

// Validation functions
function validateForm(emailElement, passwordElement) {
    const isEmailValid = validateEmail(emailElement);
    const isPasswordValid = validatePassword(passwordElement);
    return isEmailValid && isPasswordValid;
}

function validateEmail(emailElement) {
    const email = emailElement.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(emailElement, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError(emailElement, 'Please enter a valid email address');
        return false;
    }

    clearFieldError(emailElement);
    return true;
}

function validatePassword(passwordElement) {
    const password = passwordElement.value;
    
    if (!password) {
        showFieldError(passwordElement, 'Password is required');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError(passwordElement, 'Password must be at least 6 characters');
        return false;
    }

    clearFieldError(passwordElement);
    return true;
}

// UI Update functions
function showFieldError(element, message) {
    const errorDiv = getOrCreateErrorElement(element);
    errorDiv.textContent = message;
    element.setAttribute('aria-invalid', 'true');
    element.setAttribute('aria-describedby', errorDiv.id);
}

function clearFieldError(element) {
    const errorDiv = document.getElementById(`${element.id}-error`);
    if (errorDiv) {
        errorDiv.textContent = '';
    }
    element.removeAttribute('aria-invalid');
    element.removeAttribute('aria-describedby');
}

function getOrCreateErrorElement(element) {
    let errorDiv = document.getElementById(`${element.id}-error`);
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = `${element.id}-error`;
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        element.parentNode.insertBefore(errorDiv, element.nextSibling);
    }
    
    return errorDiv;
}

function updateLoadingState(isLoading, button) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Logging in...' : 'Login';
    button.setAttribute('aria-busy', isLoading);
}

// Message handling
function showSuccessMessage(message) {
    const messageDiv = createMessageElement('success-message');
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'status');
}

function showErrorMessage(message) {
    const messageDiv = createMessageElement('error-message');
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
}

function createMessageElement(className) {
    clearMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = className;
    document.querySelector('.login-form').prepend(messageDiv);
    return messageDiv;
}

function clearMessages() {
    const messages = document.querySelectorAll('.success-message, .error-message');
    messages.forEach(message => message.remove());
}

// API handling
async function handleLogin(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate API validation
    if (credentials.email === 'error@test.com') {
        throw new Error('Invalid credentials');
    }
    
    // Return simulated successful response
    return {
        success: true,
        user: {
            email: credentials.email
        }
    };
}

// Additional features setup
function setupGoogleLogin(button) {
    if (!button) return;

    button.addEventListener('click', async () => {
        try {
            button.disabled = true;
            // Implement actual Google OAuth login here
            console.log('Initiating Google login...');
        } catch (error) {
            showErrorMessage('Google login failed. Please try again.');
        } finally {
            button.disabled = false;
        }
    });
}

function setupForgotPassword(elements) {
    const { forgotPassword, email } = elements;
    
    if (!forgotPassword) return;

    forgotPassword.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            showErrorMessage('Please enter a valid email address first');
            return;
        }

        try {
            // Implement actual password reset functionality here
            await simulatePasswordReset(email.value);
            showSuccessMessage('Password reset link has been sent to your email');
        } catch (error) {
            showErrorMessage('Failed to send reset link. Please try again.');
        }
    });
}

// Accessibility enhancements
function setupAccessibility(elements) {
    const { form, submitButton } = elements;

    // Add proper ARIA labels
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Login form');
    
    // Add keyboard navigation
    submitButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitButton.click();
        }
    });
}

// Cleanup function
function removeEventListeners(elements) {
    const { form, email, password, googleButton, forgotPassword } = elements;
    
    if (form) form.removeEventListener('submit', () => {});
    if (email) email.removeEventListener('input', () => {});
    if (password) password.removeEventListener('input', () => {});
    if (googleButton) googleButton.removeEventListener('click', () => {});
    if (forgotPassword) forgotPassword.removeEventListener('click', () => {});
}

// Helper function to validate required elements
function validateRequiredElements(elements) {
    return Object.entries(elements).every(([key, element]) => {
        if (!element) {
            console.error(`Required element "${key}" not found`);
            return false;
        }
        return true;
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initializeLoginPage);

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showErrorMessage('An unexpected error occurred. Please try again.');
});

// Handle page unload
window.addEventListener('unload', () => {
    // Cleanup any necessary resources
    removeEventListeners(document.querySelectorAll('*'));
});