// Function to handle changes in the dropdown selection
document.getElementById('update-option').addEventListener('change', function () {
    // Get the selected option value
    const selectedOption = this.value;

    // Hide all input sections
    document.getElementById('name-fields').style.display = 'none';
    document.getElementById('password-fields').style.display = 'none';

    // Show the relevant input section based on the selected option
    if (selectedOption === 'name') {
        document.getElementById('name-fields').style.display = 'block';
    } else if (selectedOption === 'password') {
        document.getElementById('password-fields').style.display = 'block';
    }
});

// Function to process the form submission
function processUpdateInformation() {
    const selectedOption = document.getElementById('update-option').value;

    // Check if an option is selected
    if (!selectedOption) {
        alert("Please select an option to update.");
        return;
    }

    // Handle name update
    if (selectedOption === 'name') {
        const firstName = document.getElementById('update-firstname').value;
        const lastName = document.getElementById('update-lastname').value;

        // Simple validation for empty fields
        if (!firstName || !lastName) {
            alert("Please enter both first name and last name.");
            return;
        }

        alert(`Your name has been updated to: ${firstName} ${lastName}`);
    }

    // Handle password update
    if (selectedOption === 'password') {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Simple validation for empty fields
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Please fill out all password fields.");
            return;
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            alert("The new password and confirm password do not match.");
            return;
        }

        alert("Your password has been updated successfully!");
    }
}

// Function to handle OTP input validation and transition
function handleInput(currentInput, nextInputId) {
    // Move to next input when the current one is filled
    if (currentInput.value.length === currentInput.maxLength && nextInputId) {
        document.getElementById(nextInputId).focus();
    }
}

// Function to allow only numbers in OTP inputs
function isNumber(event) {
    const key = event.keyCode || event.which;
    return (key >= 48 && key <= 57);
}

// Function to handle backspace behavior between OTP inputs
function handleBackspace(currentInput, previousInputId) {
    if (currentInput.value === '') {
        if (previousInputId) {
            document.getElementById(previousInputId).focus();
        }
    }
}

// Function to verify OTP (for the OTP section)
function verifyOtp() {
    let otp = '';
    for (let i = 1; i <= 6; i++) {
        otp += document.getElementById('otp-' + i).value;
    }

    if (otp.length === 6) {
        alert("OTP Verified Successfully!");
        // Proceed with further steps, like updating the information in the backend
    } else {
        alert("Please enter a valid 6-digit OTP.");
    }
}
