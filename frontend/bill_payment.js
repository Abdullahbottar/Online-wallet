// Function to process bill payment and show OTP form
async function processBillPayment() {
    const company = document.getElementById('company-select').value.trim();
    const billNumber = document.getElementById('bill-number').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const sessionId = localStorage.getItem('session_id');
    if (!company) {
        alert("Please select a company.");
        return;
    }
    if (!billNumber) {
        alert("Please enter your Customer ID/Reference Number.");
        return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/requestbill/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Number(amount),
                bill_number: billNumber,
                bill_name: company
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(`An OTP has been sent to your registered email for payment to ${company}!`);
            document.getElementById('bill-payment-section').classList.remove('active'); 
            document.getElementById('otp-section').classList.add('active'); 
        } else {
            alert(result); 
        }
    } catch (error) {
        alert('Error processing the request. Please try again.');
    }
}

function isNumber(event) {
    const charCode = event.which || event.keyCode;
    return charCode >= 48 && charCode <= 57; 
}

function handleInput(currentBox, nextBoxId) {
    if (currentBox.value.length === 1 && nextBoxId) {
        document.getElementById(nextBoxId).focus(); 
    }
}

function handleBackspace(currentBox, prevBoxId) {
    if (event.key === "Backspace") {
        if (currentBox.value === "" && prevBoxId) {
            const previousBox = document.getElementById(prevBoxId);
            previousBox.value = ""; 
            previousBox.focus(); 
        }
    }
}

async function verifyOtp() {
    const otpInputs = Array.from(document.querySelectorAll('.otp-input-container input'));
    const otp = otpInputs.map(input => input.value).join('');
    const sessionId = localStorage.getItem('session_id');
    try {
        const response = await fetch(`http://localhost:3000/api/sendbill/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp }),
        });
        const result = await response.json();
        if (response.ok) {
            alert("OTP verified successfully! Payment completed.");
            location.reload(); 
        } else {
            alert(result); 
        }
    } catch (error) {
        alert('Error verifying OTP. Please try again.');
    }
}
