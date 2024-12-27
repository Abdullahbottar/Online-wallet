// Function to process Raast transfer and show OTP form
async function processTransfer() {
    const paymentType = document.getElementById('payment-type').value.trim();
    const raastId = document.getElementById('raast-id').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const sessionId = localStorage.getItem('session_id'); 
    if (!paymentType) {
        alert("Please select a payment type.");
        return;
    }
    if(!raastId){
        alert("Please enter your Raast ID.");
        return;
    }
    if(!amount || isNaN(amount) || Number(amount) <= 0){
        alert("Please enter a valid amount.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/requestewallet/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount,
                ewallets_number: raastId,
                ewallet_name: paymentType
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert("An OTP has been sent to your registered email!");
            document.getElementById('transfer-section').classList.remove('active');
            document.getElementById('otp-section').classList.add('active'); 
        } else {
            alert(data.message || "Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
}

async function verifyOtp() {
    const otpInputs = Array.from(document.querySelectorAll('.otp-input-container input'));
    const otp = otpInputs.map(input => input.value).join('');
    const sessionId = localStorage.getItem('session_id');
    try {
        const response = await fetch(`http://localhost:3000/api/sendewallet/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp })
        });
        const data = await response.json();
        if (response.ok) {
            alert("OTP verified successfully! Transfer completed.");
            location.reload(); 
        } else {
            alert(data.message || "Invalid OTP. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
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
function handleBackspace(currentBox, prevBoxId, event) {
    if (event.key === "Backspace") {
        if (currentBox.value === "" && prevBoxId) {
            const previousBox = document.getElementById(prevBoxId);
            previousBox.value = ""; // Clear the previous box's value
            previousBox.focus(); // Move focus to the previous box
        }
    }
}
