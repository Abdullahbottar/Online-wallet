const express=require('express');
const router=express.Router();
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
//api call to send bill transaction
router.post('/api/requestbill/:session_id', async (req, res) => {
    const { session_id } = req.params;
    const { amount, bill_number, bill_name } = req.body;
    if (!session_id) {
        return res.status(400).json('Session id not given'); 
    }
    if (isNaN(amount)) {
        return res.status(400).json('Amount must be an integer');
    }
    if (!amount || !bill_number || !bill_name) {
        return res.status(400).json('Amount, account number, or bill name not given');
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
    const { data:billData, error: billError } = await supabase
        .from('bills_detail')
        .select('amount')
        .eq('bill_number', bill_number)
        .eq('bill_name', bill_name)
        .single();
    if (billError) {
        return res.status(500).json('Error fetching bill name ${bill_name} account data');
    }
    if (!billData) {
        return res.status(404).json('bill name ${bill_name} account data not found');
    }
    const billAmount=billData.amount;
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
    if(amount<billAmount){
        return res.status(400).json('Amount is less than bill amount');
    }
    try {
        const otp = generateOTP(); 
        let info = await transporter.sendMail({
            from: '"ONLINE WALLET" <flexable333@gmail.com>',
            to: email,
            subject: 'Verify Your Email for Bill Transaction',
            text: `Your OTP ${otp}} to confirm transaction to bill ${bill_name} bill id ${bill_number} of amount ${billAmount}`,
            html: `<b>Your OTP ${otp} to confirm transaction to bill ${bill_name} bill id ${bill_number} of amount ${billAmount}</b>`,
        });
        const { data, error: insertError } = await supabase
            .from('pending_transaction_bills')
            .insert([
                {
                    phonenumber,
                    email,
                    otp,
                    account_number: bill_number,
                    company_name: bill_name,
                    amount: billAmount,
                    session_id,
                },
            ]);
        if (insertError) {
            return res.status(500).json('Error inserting transaction data');
        }
        res.status(200).json('Transaction initiated, OTP sent');
    } 
    catch (err) {
        return res.status(500).json('Error sending email');
    }
});

//api call to send bill transaction
router.post('/api/sendbill/:session_id', async (req, res) => {
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
    const { data: userEmailData, error: userEmailError } = await supabase
        .from('account')
        .select('email, first_name, last_name')
        .eq('phonenumber', phonenumber)
        .single();
    if (userEmailError) {
        return res.status(500).json('Error fetching email');
    }
    if (!userEmailData) {
        return res.status(404).json('Email not found');
    }
    const { email, first_name, last_name } = userEmailData;
    const { data: billData, error: billError } = await supabase
        .from('pending_transaction_bills')
        .select('amount, company_name, otp, account_number')
        .eq('phonenumber', phonenumber)
        .eq('otp', otp)
        .single();
    if (billError) {
        return res.status(500).json('Error fetching pending transaction data');
    }
    if (!billData) {
        return res.status(404).json('Pending transaction data not found');
    }
    const { amount, company_name, account_number } = billData;
    if (otp !== billData.otp) {
        return res.status(400).json('Invalid OTP');
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
    const userBalance = userData.amount;
    const newAmount = userBalance -amount;
    const { error: updateError } = await supabase
        .from('accountinfo')
        .update({ amount: newAmount })
        .eq('phonenumber', phonenumber);
    if (updateError) {
        return res.status(500).json('Error updating user data');
    }
    try {
        const { data: transactionData, error: transactionError } = await supabase
            .from('transaction_history')
            .insert([{ phonenumber, email, first_name, last_name, amount: amount, sent_to: account_number, company_or_ewallet_name: company_name }]);
        if (transactionError) {
            return res.status(500).json('Error inserting transaction data');
        }
        const { data: deleteData, error: deleteError } = await supabase
            .from('pending_transaction_bills')
            .delete()
            .eq('otp', otp);
        if (deleteError) {
            return res.status(500).json('Error deleting pending transaction data');
        }
        const { data: billdeleteData, error: billdeleteError } = await supabase
            .from('bills_detail')
            .delete()
            .eq('bill_number', account_number)
            .eq('bill_name', company_name);
        if (billdeleteError) {
            return res.status(500).json('Error deleting bill data');
        }
        res.status(200).json('Transaction successful');
    } catch (err) {
        return res.status(500).json('Error processing the transaction');
    }
});


module.exports=router;