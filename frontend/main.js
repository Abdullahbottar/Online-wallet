// Show Signup Form
function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('otp-form').style.display = 'none';
}

// Show Login Form
function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('otp-form').style.display = 'none';
}

// Login Functionality
function login() {
    window.location.href = 'home_page.html';  // Redirect to dashboard after login
}

// Signup Functionality
function signup() {
    // Simulate sending an OTP to the user's email
    alert("An OTP has been sent to your email!");
    showOtpForm();  // Show OTP verification form
}

// Show OTP Form
function showOtpForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('otp-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

// Restrict input to numeric values
function isNumber(event) {
    const charCode = event.which || event.keyCode;
    return charCode >= 48 && charCode <= 57; // Only allow numbers (0-9)
}

// Handle input and move focus forward
function handleInput(currentBox, nextBoxId) {
    if (currentBox.value.length === 1 && nextBoxId) {
        document.getElementById(nextBoxId).focus(); // Move to the next box when a number is entered
    }
}

// Handle backspace key to move to the previous box
function handleBackspace(currentBox, prevBoxId) {
    if (event.key === "Backspace") {
        if (currentBox.value === "" && prevBoxId) {
            const previousBox = document.getElementById(prevBoxId);
            previousBox.value = ""; // Clear the previous box's value
            previousBox.focus(); // Move focus to the previous box
        }
    }
}

// Verify OTP Functionality
function verifyOtp() {
    // Gather all OTP inputs
    const otpInputs = Array.from(document.querySelectorAll('.otp-input-container input'));
    const otp = otpInputs.map(input => input.value).join('');

    const correctOtp = "123456"; // Example OTP for simulation

    if (otp === correctOtp) {
        alert("OTP verified successfully! Please log in.");
        showLogin();
    } else {
        alert("Invalid OTP. Enter the valid OTP sent via Email.");
    }
}



// Initially show login form on page load
showLogin();