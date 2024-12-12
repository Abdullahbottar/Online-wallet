// Mock transaction data
const transactions = [
    { id: "T001", date: "2024-12-10", type: "Easypaisa", details: "Phone Payment", amount: "500 PKR" },
    { id: "T002", date: "2024-12-09", type: "Meezan Bank Transfer", details: "Account: 1234567890", amount: "15,000 PKR" },
    { id: "T003", date: "2024-12-08", type: "Jazzcash", details: "Wallet Payment", amount: "2,000 PKR" },
    { id: "T004", date: "2024-12-07", type: "Standard Chartered Bank Transfer", details: "Account: 9876543210", amount: "25,000 PKR" },
    { id: "T005", date: "2024-12-06", type: "Sadapay", details: "Merchant Payment", amount: "1,000 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T009", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T0010", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T003", date: "2024-12-08", type: "Jazzcash", details: "Wallet Payment", amount: "2,000 PKR" },
    { id: "T004", date: "2024-12-07", type: "Standard Chartered Bank Transfer", details: "Account: 9876543210", amount: "25,000 PKR" },
    { id: "T005", date: "2024-12-06", type: "Sadapay", details: "Merchant Payment", amount: "1,000 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T009", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T0010", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    { id: "T006", date: "2024-12-05", type: "Habib Bank Limited Transfer", details: "Account: 1112223334", amount: "10,000 PKR" },
    { id: "T007", date: "2024-12-04", type: "Nayapay", details: "Bill Payment", amount: "750 PKR" },
    

];

// Populate the table with transaction data
function loadTransactions() {
    const transactionBody = document.getElementById("transaction-body");
    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.type}</td>
            <td>${transaction.details}</td>
            <td>${transaction.amount}</td>
        `;
        transactionBody.appendChild(row);
    });
}

// Load transactions on page load
window.onload = loadTransactions;
