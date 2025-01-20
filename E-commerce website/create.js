// Form validation and submission handler
class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.fields = {
            firstName: document.getElementById('firstName'),
            lastName: document.getElementById('lastName'),
            email: document.getElementById('email'),
            confirmEmail: document.getElementById('confirmEmail'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword'),
            phone: document.getElementById('phone'),
            gender: document.getElementById('gender'),
            dateOfBirth: document.getElementById('dateOfBirth'),
            newsletter: document.getElementById('newsletter')
        }; 
        
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[A-Za-z\s-']+$/
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[A-Za-z\s-']+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            password: {
                required: true,
                minLength: 8,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            },
            phone: {
                required: true,
                pattern: /^\d{3}-\d{3}-\d{4}$/
            },
            dateOfBirth: {
                required: true,
                validate: this.validateAge.bind(this)
            }
        };

        this.init();
    }

    init() {
        // Add form submit handler
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Add real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                field.addEventListener('input', () => this.validateField(fieldName));
                field.addEventListener('blur', () => this.validateField(fieldName));
            }
        });

        // Add special handlers
        this.fields.phone.addEventListener('input', this.formatPhoneNumber.bind(this));
        this.fields.confirmEmail.addEventListener('input', () => this.validateEmailMatch());
        this.fields.confirmPassword.addEventListener('input', () => this.validatePasswordMatch());
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const rules = this.validationRules[fieldName];
        const value = field.value.trim();
        
        if (!rules) return true;

        // Clear previous errors
        this.clearFieldError(field);

        // Required check
        if (rules.required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Minimum length check
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, `Must be at least ${rules.minLength} characters`);
            return false;
        }

        // Pattern check
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, this.getPatternErrorMessage(fieldName));
            return false;
        }

        // Custom validation
        if (rules.validate && !rules.validate(value)) {
            return false;
        }

        return true;
    }

    validateEmailMatch() {
        const email = this.fields.email.value;
        const confirmEmail = this.fields.confirmEmail.value;

        if (confirmEmail && email !== confirmEmail) {
            this.showFieldError(this.fields.confirmEmail, 'Emails do not match');
            return false;
        }

        this.clearFieldError(this.fields.confirmEmail);
        return true;
    }

    validatePasswordMatch() {
        const password = this.fields.password.value;
        const confirmPassword = this.fields.confirmPassword.value;

        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError(this.fields.confirmPassword, 'Passwords do not match');
            return false;
        }

        this.clearFieldError(this.fields.confirmPassword);
        return true;
    }

    validateAge(dateString) {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 13) {
            this.showFieldError(this.fields.dateOfBirth, 'You must be at least 13 years old');
            return false;
        }

        return true;
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !value[2] ? value[1] 
                : !value[3] ? `${value[1]}-${value[2]}`
                : `${value[1]}-${value[2]}-${value[3]}`;
        }
    }

    showFieldError(field, message) {
        field.classList.add('input-error');
        
        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
        field.setAttribute('aria-invalid', 'true');
    }

    clearFieldError(field) {
        field.classList.remove('input-error');
        
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.remove();
        }
        field.removeAttribute('aria-invalid');
    }

    getPatternErrorMessage(fieldName) {
        const messages = {
            firstName: 'Please enter a valid first name',
            lastName: 'Please enter a valid last name',
            email: 'Please enter a valid email address',
            password: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            phone: 'Please enter a valid phone number (e.g., 333-333-3333)'
        };
        return messages[fieldName] || 'Invalid format';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        Object.keys(this.validationRules).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        // Additional validation for matching fields
        if (!this.validateEmailMatch() || !this.validatePasswordMatch()) {
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Creating Account...';
        this.form.classList.add('loading');

        try {
            // Simulate API call
            await this.submitForm();
            
            // Show success message
            this.showSuccessMessage('Account created successfully! Redirecting...');
            
            // Simulate redirect
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (error) {
            this.showErrorMessage(error.message || 'An error occurred. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            this.form.classList.remove('loading');
        }
    }

    async submitForm() {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const shouldSucceed = Math.random() > 0.5;
                if (shouldSucceed) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Registration failed. Please try again.'));
                }
            }, 1500);
        });
    }

    showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        messageDiv.setAttribute('role', 'alert');
        this.form.insertBefore(messageDiv, this.form.firstChild);
    }

    showErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'error-message';
        messageDiv.textContent = message;
        messageDiv.setAttribute('role', 'alert');
        this.form.insertBefore(messageDiv, this.form.firstChild);
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationForm();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});