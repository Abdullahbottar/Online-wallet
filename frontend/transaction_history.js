async function fetchTransactionHistory(sessionId) {
    try {
        const response = await fetch(`http://localhost:3000/api/transactionHistory/${sessionId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch transaction history');
        }
        const data = await response.json();
        return data.transactions;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Populate the table with fetched transaction data
async function loadTransactions() {
    const transactionBody = document.getElementById("transaction-body");
    const sessionId = localStorage.getItem('session_id'); 
    const transactions = await fetchTransactionHistory(sessionId);
    transactionBody.innerHTML = "";
    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.transaction_date}</td>
            <td>${transaction.company_or_ewallet_name}</td>
            <td>${transaction.sent_to}</td>
            <td>${transaction.amount}</td>
        `;
        transactionBody.appendChild(row);
    });
}

// Load transactions on page load
window.onload = loadTransactions;
