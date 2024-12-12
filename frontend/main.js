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
async function login() {
    const phonenumber = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    if (!phonenumber || !password) {
        alert("Please fill out all fields!");
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phonenumber, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('session_id', data.session_id);
            window.location.href = 'home_page.html';
        } else {
            alert(data.error || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while logging in. Please check your connection and try again.");
    }
}

// Signup Functionality
function signup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-repassword").value;
    const phoneNumber = document.getElementById("signup-phone").value;
    const firstName = document.getElementById("signup-firstname").value;
    const lastName = document.getElementById("signup-lastname").value;
    if (!email || !password || !confirmPassword || !phoneNumber || !firstName || !lastName) {
        alert("Please fill in all fields.");
        return;
    }
    fetch('http://localhost:3000/api/verifiyMail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            confirm_password: confirmPassword,
            phoneNumber,
            first_name: firstName,
            last_name: lastName,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert("An OTP has been sent to your email!");
            showOtpForm(); 
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error during signup:', error);
        alert('An error occurred during signup.');
    });
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
    const otpInputs = Array.from(document.querySelectorAll('.otp-input-container input'));
    const otp = otpInputs.map(input => input.value).join('');
    if (otp.length !== 6) {
        alert("Please enter the complete OTP.");
        return;
    }
    const email = document.getElementById("signup-email").value;
    fetch('http://localhost:3000/api/confirmotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            otp: otp
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            showLogin();
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error during OTP verification:', error);
        alert('An error occurred during OTP verification.');
    });
}
function redirectToForgotPassword() {
    window.location.href = "forget_password.html"; 
}
showLogin();