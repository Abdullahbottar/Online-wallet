// Function to validate phone number and initiate the password change
function validatePhoneNumber() {
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const phoneRegex = /^03\d{9}$/;
    if (phoneRegex.test(phoneNumber)) {
        alert("Phone number validated. Please check your email for OTP.");
        fetch('http://localhost:3000/api/initiatePasswordChange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phonenumber: phoneNumber }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); 
                showOtpForm();  
            } else if (data.error) {
                alert(data.error);  
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send OTP. Please try again.');
        });
    } else {
        alert("Invalid phone number. Please enter a valid phone number.");
    }
}


// Function to show the new password form after phone number validation
function showNewPasswordForm() {
    // Hide the phone number form and show the new password form
    document.getElementById('otp-form').style.display = 'none';  
    document.getElementById('new-password-form').style.display = 'block';  
}

// Function to submit new password
function submitNewPassword() {
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim(); 
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }
        fetch('http://localhost:3000/api/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phonenumber: phoneNumber,  
                password: newPassword,
                confirm_password: confirmPassword
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); 
                window.location.href = "main.html";  
            } else if (data.error) {
                alert(data.error);  
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to change password. Please try again.');
        });
    } else {
        alert("Passwords do not match or are empty. Please try again.");
    }
}

// Function to show OTP form
function showOtpForm() {
    document.getElementById('phone-form').style.display = 'none';  // Hide new password form
    document.getElementById('otp-form').style.display = 'block';  // Show OTP form
}

// Function to verify OTP
function verifyOtp() {
    const otpInputs = Array.from(document.querySelectorAll('.otp-input-container input'));  
    const otp = otpInputs.map(input => input.value).join('');  
    const phoneNumber = document.getElementById('phone-number').value.trim();  

    fetch('http://localhost:3000/api/confirmpasswordotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phonenumber: phoneNumber, otp: otp }),  
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);  
            showNewPasswordForm();  
        } else if (data.error) {
            alert(data.error);  
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to verify OTP. Please try again.');
    });
}

// Restrict input to numeric values only (for OTP)
function isNumber(event) {
    const charCode = event.which || event.keyCode;
    return charCode >= 48 && charCode <= 57;  // Only allow numbers (0-9)
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
