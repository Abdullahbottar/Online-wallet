// forget_password.js

// Function to validate phone number
function validatePhoneNumber() {
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const phoneRegex = /^03\d{9}$/; // Pakistan phone number format (e.g., 03*********).

    if (phoneRegex.test(phoneNumber)) {
        alert("Phone number validated. Please enter your new password.");
        showNewPasswordForm();  // Show the new password form
    } else {
        alert("Invalid phone number. Please enter a valid phone number.");
    }
}

// Function to show the new password form after phone number validation
function showNewPasswordForm() {
    // Hide the phone number form and show the new password form
    document.getElementById('phone-form').style.display = 'none';  
    document.getElementById('new-password-form').style.display = 'block';  
}

// Function to submit new password
function submitNewPassword() {
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (newPassword && confirmPassword && newPassword === confirmPassword) {
        alert("New password set. Please verify OTP.");
        showOtpForm();  // Show OTP verification form
    } else {
        alert("Passwords do not match or are empty. Please try again.");
    }
}

// Function to show OTP form after setting the new password
function showOtpForm() {
    document.getElementById('new-password-form').style.display = 'none';  // Hide new password form
    document.getElementById('otp-form').style.display = 'block';  // Show OTP form
}

// Function to verify OTP
function verifyOtp() {
    const otpInputs = Array.from(document.querySelectorAll('.otp-input-container input'));  // Get OTP input fields
    const otp = otpInputs.map(input => input.value).join('');  // Get OTP entered by user

    const correctOtp = "123456";  // Example OTP for simulation

    if (otp === correctOtp) {
        alert("OTP verified successfully! You can now login.");
        window.location.href = "main.html";  // Redirect to login page
    } else {
        alert("Invalid OTP. Please try again.");
    }
}

// Restrict input to numeric values only (for OTP)
function isNumber(event) {
    const charCode = event.which || event.keyCode;
    return charCode >= 48 && charCode <= 57; // Only allow numbers (0-9)
}

// Handle input and move focus forward when a box is filled
function handleInput(currentBox, nextBoxId) {
    if (currentBox.value.length === 1 && nextBoxId) {
        document.getElementById(nextBoxId).focus();  // Move to the next box when a number is entered
    }
}

// Handle backspace key to move to the previous box
function handleBackspace(currentBox, prevBoxId) {
    if (event.key === "Backspace") {
        if (currentBox.value === "" && prevBoxId) {
            const previousBox = document.getElementById(prevBoxId);
            previousBox.value = "";  // Clear the previous box's value
            previousBox.focus();  // Move focus to the previous box
        }
    }
}
