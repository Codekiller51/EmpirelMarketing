document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const errorMessages = {
        name: 'Please enter at least 2 characters, letters only',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number (minimum 10 digits)',
        message: 'Please enter at least 10 characters'
    };

    // Validate individual input
    const validateInput = (input) => {
        const errorElement = input.nextElementSibling;
        let isValid = true;

        if (input.required && !input.value.trim()) {
            errorElement.textContent = 'This field is required';
            isValid = false;
        } else if (input.pattern && !new RegExp(input.pattern).test(input.value)) {
            errorElement.textContent = input.title || errorMessages[input.name];
            isValid = false;
        } else if (input.minLength && input.value.length < input.minLength) {
            errorElement.textContent = `Minimum ${input.minLength} characters required`;
            isValid = false;
        } else {
            errorElement.textContent = '';
        }

        input.setAttribute('aria-invalid', !isValid);
        return isValid;
    };

    // Add input event listeners
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isFormValid = true;

        // Validate all inputs
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            const firstError = form.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Prepare form data
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        try {
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';

            // Send form data to server
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Show success message
            form.reset();
            alert('Thank you for your message. We will get back to you soon!');

        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error sending your message. Please try again later.');
        } finally {
            // Reset submit button
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
    });
}));