// Function to process bill payment and show OTP form
function processBillPayment() {
    const billNumber = document.getElementById('bill-number').value.trim();
    const amount = document.getElementById('amount').value.trim();

    // Validate user inputs
    if (billNumber && amount) {
        alert("An OTP has been sent to your registered email!");
        document.getElementById('bill-payment-section').classList.remove('active'); // Hide bill payment form
        document.getElementById('otp-section').classList.add('active'); // Show OTP form
    } else {
        alert("Please fill in all the details before proceeding.");
    }
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

    const correctOtp = "123456"; // Example OTP

    if (otp === correctOtp) {
        alert("OTP verified successfully! Payment completed.");
        location.reload(); // Reset the page
    } else {
        alert("Invalid OTP. Please try again.");
    }
}
