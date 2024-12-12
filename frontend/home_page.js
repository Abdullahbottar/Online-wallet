function bankTransfer() {
   
    window.location.href = 'bank_transfer.html';
}

function Online_transfer() {
   
    window.location.href = 'Online_transfer.html';
}

function billPayment() {
    window.location.href = 'bill_payment.html';
}

function updateInformation() {
    window.location.href = 'update_information.html';
}

function viewAccountBalance() {
    window.location.href = 'account_balance.html';
}

function Transactionhistory() {
    window.location.href = 'Transaction_history.html';
}
const session_id = localStorage.getItem('session_id');
function logout() {
    if (session_id) {
        fetch(`http://localhost:3000/api/logoutbysessionid/${session_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Logout successful') {
                console.log('Logout successful');
                localStorage.removeItem('session_id');
                window.location.href = 'main.html';
            } else {
                console.error('Logout failed:', data.error);
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
    } else {
        console.error('No session ID found');
        window.location.href = 'main.html';
    }
}