 const citiesByCountry = {
    ukraine: ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro'],
    poland: ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan'],
    germany: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    usa: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    canada: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa']
};

const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const messageContainer = document.getElementById('messageContainer');
const passwordToggles = document.querySelectorAll('.password-toggle');
const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');
const loader = document.querySelector('.loader');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        forms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${tabName}Form`) {
                form.classList.add('active');
            }
        });
    });
});

passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordFieldId = toggle.getAttribute('data-for');
        const passwordField = document.getElementById(passwordFieldId);
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            `;
        } else {
            passwordField.type = 'password';
            toggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            `;
        }
    });
});

countrySelect.addEventListener('change', function() {
    const selectedCountry = this.value;
    
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    if (selectedCountry) {
        citySelect.disabled = false;
        
        citiesByCountry[selectedCountry].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase();
            option.textContent = city;
            citySelect.appendChild(option);
        });
    } else {
        citySelect.disabled = true;
    }
});

function showError(inputElement, message) {
    const errorElement = document.getElementById(`${inputElement.id}Error`);
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
}

function showSuccess(inputElement) {
    const errorElement = document.getElementById(`${inputElement.id}Error`);
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
    return true;
}

function validateName(inputElement, fieldName) {
    const value = inputElement.value.trim();
    
    if (value === '') {
        showError(inputElement, `${fieldName} is required`);
        return false;
    } else if (value.length < 3) {
        showError(inputElement, `${fieldName} must be at least 3 characters`);
        return false;
    } else if (value.length > 15) {
        showError(inputElement, `${fieldName} must be less than 15 characters`);
        return false;
    } else {
        return showSuccess(inputElement);
    }
}

function validateEmail(inputElement) {
    const value = inputElement.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (value === '') {
        showError(inputElement, 'Email is required');
        return false;
    } else if (!emailRegex.test(value)) {
        showError(inputElement, 'Please enter a valid email address');
        return false;
    } else {
        return showSuccess(inputElement);
    }
}

function validatePassword(inputElement) {
    const value = inputElement.value;
    
    if (value === '') {
        showError(inputElement, 'Password is required');
        return false;
    } else if (value.length < 6) {
        showError(inputElement, 'Password must be at least 6 characters');
        return false;
    } else {
        return showSuccess(inputElement);
    }
}

function validateConfirmPassword(passwordInput, confirmInput) {
    const passwordValue = passwordInput.value;
    const confirmValue = confirmInput.value;
    
    if (confirmValue === '') {
        showError(confirmInput, 'Please confirm your password');
        return false;
    } else if (confirmValue !== passwordValue) {
        showError(confirmInput, 'Passwords do not match');
        return false;
    } else {
        return showSuccess(confirmInput);
    }
}

function validatePhone(inputElement) {
    const value = inputElement.value.trim();
    const phoneRegex = /^\+380\d{9}$/;
    
    if (value === '') {
        showError(inputElement, 'Phone number is required');
        return false;
    } else if (!phoneRegex.test(value)) {
        showError(inputElement, 'Please enter a valid Ukrainian phone number (+380XXXXXXXXX)');
        return false;
    } else {
        return showSuccess(inputElement);
    }
}

function validateBirthDate(inputElement) {
    const value = inputElement.value;
    
    if (value === '') {
        showError(inputElement, 'Date of birth is required');
        return false;
    }
    
    const birthDate = new Date(value);
    const today = new Date();
    
    if (birthDate > today) {
        showError(inputElement, 'Date of birth cannot be in the future');
        return false;
    }
    
    const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age < 12) {
        showError(inputElement, 'You must be at least 12 years old to register');
        return false;
    } else {
        return showSuccess(inputElement);
    }
}

function validateRadio(name, errorId) {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    const errorElement = document.getElementById(errorId);
    
    let isChecked = false;
    radioButtons.forEach(radio => {
        if (radio.checked) {
            isChecked = true;
        }
    });
    
    if (!isChecked) {
        errorElement.textContent = `Please select your ${name}`;
        errorElement.classList.add('visible');
        return false;
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
        return true;
    }
}

function validateSelect(selectElement, fieldName) {
    const value = selectElement.value;
    
    if (value === '') {
        showError(selectElement, `Please select your ${fieldName}`);
        return false;
    } else {
        return showSuccess(selectElement);
    }
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    
    const isUsernameValid = usernameInput.value.trim() !== '' ? showSuccess(usernameInput) : showError(usernameInput, 'Username is required');
    const isPasswordValid = validatePassword(passwordInput);
    
    if (isUsernameValid && isPasswordValid) {
        loader.classList.add('active');
        
        setTimeout(() => {
            loader.classList.remove('active');
            
            showMessage('Successfully logged in!');
            
            loginForm.reset();
            
            document.querySelectorAll('.form-control').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
        }, 1500);
    }
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const phoneInput = document.getElementById('phone');
    const birthDateInput = document.getElementById('birthDate');
    const countryInput = document.getElementById('country');
    const cityInput = document.getElementById('city');
    
    const isFirstNameValid = validateName(firstNameInput, 'First Name');
    const isLastNameValid = validateName(lastNameInput, 'Last Name');
    const isEmailValid = validateEmail(emailInput);
    const isPasswordValid = validatePassword(passwordInput);
    const isConfirmPasswordValid = validateConfirmPassword(passwordInput, confirmPasswordInput);
    const isPhoneValid = validatePhone(phoneInput);
    const isBirthDateValid = validateBirthDate(birthDateInput);
    const isSexValid = validateRadio('sex', 'sexError');
    const isCountryValid = validateSelect(countryInput, 'country');
    const isCityValid = countryInput.value ? validateSelect(cityInput, 'city') : true;
    
    if (
        isFirstNameValid && 
        isLastNameValid && 
        isEmailValid && 
        isPasswordValid && 
        isConfirmPasswordValid && 
        isPhoneValid && 
        isBirthDateValid && 
        isSexValid && 
        isCountryValid && 
        isCityValid
    ) {
        loader.classList.add('active');
        
        setTimeout(() => {
            loader.classList.remove('active');
            
            showMessage('Registration successful! Welcome aboard!');
            
            registerForm.reset();
            citySelect.disabled = true;
            
            document.querySelectorAll('.form-control').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
        }, 1500);
    }
});

document.getElementById('firstName').addEventListener('input', function() {
    validateName(this, 'First Name');
});

document.getElementById('lastName').addEventListener('input', function() {
    validateName(this, 'Last Name');
});

document.getElementById('email').addEventListener('input', function() {
    validateEmail(this);
});

document.getElementById('password').addEventListener('input', function() {
    validatePassword(this);
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword.value !== '') {
        validateConfirmPassword(this, confirmPassword);
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    validateConfirmPassword(document.getElementById('password'), this);
});

document.getElementById('phone').addEventListener('input', function() {
    validatePhone(this);
});

document.getElementById('birthDate').addEventListener('input', function() {
    validateBirthDate(this);
});

document.getElementById('country').addEventListener('change', function() {
    validateSelect(this, 'country');
});

document.getElementById('city').addEventListener('change', function() {
    validateSelect(this, 'city');
});

document.getElementById('loginUsername').addEventListener('input', function() {
    if (this.value.trim() !== '') {
        showSuccess(this);
    } else {
        showError(this, 'Username is required');
    }
});

document.getElementById('loginPassword').addEventListener('input', function() {
    validatePassword(this);
});

function showMessage(message) {
    messageContainer.textContent = message;
    messageContainer.classList.add('show');
    
    setTimeout(() => {
        messageContainer.classList.remove('show');
    }, 3000);
}