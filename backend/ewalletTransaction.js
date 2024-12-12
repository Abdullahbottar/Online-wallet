const express = require('express');
const router = express.Router();
const supabase=require('./supabaseClient');
const nodemailer=require('nodemailer');
const crypto= require('crypto');
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'flexable333@gmail.com',
        pass:'fztb bowq aqgq hyyi'
    }
});
function generateOTP(){
    return crypto.randomInt(100000,999999).toString();
}
//api call to send transaction to online wallet
router.post('/api/requestewallet/:session_id', async (req, res) => {
    const { session_id } = req.params;
    const { amount, ewallets_number, ewallet_name } = req.body;
    if (!session_id) {
        return res.status(400).json('Session id not given'); 
    }
    if (isNaN(amount)) {
        return res.status(400).json('Amount must be an integer');
    }
    if (!amount || !ewallets_number || !ewallet_name) {
        return res.status(400).json('Amount, account number, or ewallet name not given');
    }
    const { data: sessionData, error: sessionError } = await supabase
        .from('sessionid')
        .select('phonenumber')
        .eq('session_id', session_id)
        .single();
    if (sessionError) {
        return res.status(500).json('Error fetching session data');
    }
    if (!sessionData) {
        return res.status(404).json('Session data not found');
    }
    const { phonenumber} = sessionData;
    const {data:userEmailData,error:userEmailError}=await supabase
    .from('account')
    .select('email')
    .eq('phonenumber',phonenumber)
    .single();
    if(userEmailError){
        return res.status(500).json('Error fetching email');
    }
    if(!userEmailData){
        return res.status(404).json('Email not found');
    }
    const email=userEmailData.email;
    const { data: ewalletAccountData, error: ewalletAccountError } = await supabase
        .from('ewallets_accounts')
        .select('ewallets_number, ewallet_name')
        .eq('ewallets_number', ewallets_number)
        .eq('ewallet_name', ewallet_name)
        .single();
    if (ewalletAccountError) {
        return res.status(500).json('Error fetching online wallet ${ewallet_name} account data');
    }
    if (!ewalletAccountData) {
        return res.status(404).json('online wallet ${ewallet_name} account data not found');
    }
    const { data: userData, error: userError } = await supabase
        .from('accountinfo')
        .select('amount')
        .eq('phonenumber', phonenumber)
        .single();
    if (userError) {
        return res.status(500).json('Error fetching user data');
    }
    if (!userData) {
        return res.status(404).json('User data not found');
    }
    if (userData.amount < amount) {
        return res.status(400).json('Insufficient funds');
    }
    try {
        const otp = generateOTP(); 
        let info = await transporter.sendMail({
            from: '"ONLINE WALLET" <flexable333@gmail.com>',
            to: email,
            subject: 'Verify Your Email for Online wallet Transaction',
            text: `Your OTP is: ${otp} to confirm transaction to online wallet ${ewallet_name} account ${ewallets_number} of amount ${amount}`,
            html: `<b>Your OTP is: ${otp} to confirm transaction to online wallet ${ewallet_name} account ${ewallets_number} of amount ${amount}</b>`,
        });
        const { data, error: insertError } = await supabase
            .from('pending_transaction_ewallet')
            .insert([
                {
                    phonenumber,
                    email,
                    otp,
                    account_number: ewallets_number,
                    ewallet_name,
                    amount,
                    session_id,
                },
            ]);
        if (insertError) {
            return res.status(500).json('Error inserting transaction data');
        }
        res.status(200).json('Transaction initiated, OTP sent');
    } 
    catch (err) {
        console.log(err);
        return res.status(500).json('Error sending email');
    }
});

//api call to send transaction to online account
router.post('/api/sendewallet/:session_id', async (req, res) => {
    const { session_id } = req.params;
    const { otp } = req.body;
    if (!session_id) {
        return res.status(400).json('Session id not given');
    }
    if (!otp) {
        return res.status(400).json('OTP not given');
    }
    const { data: sessionData, error: sessionError } = await supabase
        .from('sessionid')
        .select('phonenumber')
        .eq('session_id', session_id)
        .single();
    if (sessionError) {
        return res.status(500).json('Error fetching session data');
    }
    if (!sessionData) {
        return res.status(404).json('Session data not found');
    }
    const { phonenumber } = sessionData;
    const {data:userEmailData,error:userEmailError}=await supabase
    .from('account')
    .select('email,first_name, last_name')
    .eq('phonenumber',phonenumber)
    .single();
    if(userEmailError){
        return res.status(500).json('Error fetching email');
    }
    if(!userEmailData){
        return res.status(404).json('Email not found');
    }
    const {email,first_name, last_name}=userEmailData;
    const { data: pendingTransactionData, error: pendingTransactionError } = await supabase
        .from('pending_transaction_ewallet') 
        .select('amount,ewallet_name,otp, account_number')
        .eq('phonenumber', phonenumber)
        .eq('otp', otp)
        .single();
    if (pendingTransactionError) {
        return res.status(500).json('Error fetching pending transaction data');
    }
    if (!pendingTransactionData) {
        return res.status(404).json('Pending transaction data not found');
    }
    const { amount, ewallet_name,totp, account_number } = pendingTransactionData;
    if (otp !== pendingTransactionData.otp) {
        return res.status(400).json('Invalid OTP');
    }
    try {
        const { data: transactionData, error: transactionError } = await supabase
            .from('transaction_history')
            .insert([{ phonenumber, email, first_name, last_name, amount,sent_to: account_number,company_or_ewallet_name: ewallet_name }]);
        if (transactionError) {
            return res.status(500).json('Error inserting transaction data');
        }
        const { data: userData, error: userError } = await supabase
            .from('accountinfo')
            .select('amount')
            .eq('phonenumber', phonenumber)
            .single();
        if (userError) {
            return res.status(500).json('Error fetching user data');
        }
        if (!userData) {
            return res.status(404).json('User data not found');
        }
        const { error: updateError } = await supabase
            .from('accountinfo')
            .update({ amount: userData.amount - amount })
            .eq('phonenumber', phonenumber);
        if (updateError) {
            return res.status(500).json('Error updating user data');
        }
        const { data: deleteData, error: deleteError } = await supabase
            .from('pending_transaction_ewallet')
            .delete()
            .eq('otp', otp);
        if (deleteError) {
            return res.status(500).json('Error deleting pending transaction data');
        }
        res.status(200).json('Transaction successful');
    } catch (err) {
        return res.status(500).json('Error processing the transaction');
    }
});

module.exports = router;