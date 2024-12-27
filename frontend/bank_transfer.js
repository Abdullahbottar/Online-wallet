// Function to handle bank transfer and show OTP form
async function bankTransfer() {
    const accountNumber = document.getElementById('account-number').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const bankName = document.getElementById('bank-name').value.trim();
    const sessionId = localStorage.getItem('session_id'); 
    // Validate user inputs
    if (accountNumber && amount && bankName) {
        try {
            const response = await fetch(`http://localhost:3000/api/requestBank/${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_number: accountNumber,
                    amount: amount,
                    bank_name: bankName,
                }),
            });
            const result = await response.json();
            if (response.ok) {
                alert("An OTP has been sent to your registered email!");
                document.getElementById('bank-transfer-section').classList.remove('active'); // Hide bank transfer form
                document.getElementById('otp-section').classList.add('active'); // Show OTP form
            } else {
                alert(result);
            }
        } catch (error) {
            console.error("Error during bank transfer:", error);
            alert("An error occurred during the transaction.");
        }
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
async function verifyOtp() {
    const otpInputs = Array.from(document.querySelectorAll('.otp-input-container input'));
    const otp = otpInputs.map(input => input.value).join('');
    const sessionId = localStorage.getItem('session_id'); 
    try {
        const response = await fetch(`http://localhost:3000/api/sendBank/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp: otp }),
        });
        const result = await response.json();
        if (response.ok) {
            alert("OTP verified successfully! Transfer completed.");
            location.reload(); 
        } else {
            alert(result);
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        alert("An error occurred during OTP verification.");
    }
}
