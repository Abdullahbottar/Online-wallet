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
        const sessionId = localStorage.getItem('session_id');
        if (!firstName || !lastName) {
            alert("Please enter both first name and last name.");
            return;
        }
        fetch(`http://localhost:3000/api/updateName/${sessionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert(`Your name has been updated to: ${firstName} ${lastName}`);
                window.location.href = 'home_page.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the name.');
        });
    }

    // Handle password update
    if (selectedOption === 'password') {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const sessionId = localStorage.getItem('session_id'); 
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Please fill out all password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("The new password and confirm password do not match.");
            return;
        }
        fetch(`http://localhost:3000/api/updatePassword/${sessionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert("Your password has been updated successfully!");
                window.location.href = 'home_page.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the password.');
        });
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
