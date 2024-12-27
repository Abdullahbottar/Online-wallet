async function fetchAccountDetails(sessionId) {
    try {
        const response = await fetch(`http://localhost:3000/api/viewAccount/${sessionId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch account details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function loadAccountDetails() {
    const accountNameElement = document.getElementById('account-name');
    const accountBalanceElement = document.getElementById('account-balance');
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        accountNameElement.textContent = "Error: No session ID found";
        accountBalanceElement.textContent = "Unable to load balance";
        return;
    }
    const accountDetails = await fetchAccountDetails(sessionId);
    if (accountDetails) {
        accountNameElement.textContent = `Name: ${accountDetails.fullName}`;
        accountBalanceElement.textContent = `Balance: Rupees ${accountDetails.amount.toFixed(2)}`;
    } else {
        accountNameElement.textContent = "Error loading account name";
        accountBalanceElement.textContent = "Error loading balance";
    }
}
window.onload = loadAccountDetails;
