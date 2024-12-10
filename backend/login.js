const express=require('express');
const router=express.Router();
const supabase=require("./supabaseClient");

const nodemailer=require('nodemailer');
const crypto= require('crypto');
const bcrypt=require('bcrypt');

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'flexable333@gmail.com',
        pass:'fztb bowq aqgq hyyi'
    }
});

function isValidEmail(email){
    const regex=/^l2[2-5]\d{4}@lhr\.nu\.edu\.pk$/;
    return regex.test(email);
}

function generateOTP(){
    return crypto.randomInt(100000,999999).toString();
}

function checkPhone(phoneNumber){
    const regex=/^03\d{9}$/;
    return regex.test(phoneNumber);
}

//api call to login
router.post('/api/login', async (req, res) => {
    const { phonenumber, password } = req.body;
    if (!phonenumber || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const { data: account, error: accountError } = await supabase
            .from('account')
            .select('*')
            .eq('phonenumber', phonenumber)
            .single();
        if (accountError || !account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        await supabase
            .from('sessionid')
            .delete()
            .eq('phonenumber', phonenumber);
        const { data: session, error: sessionError } = await supabase
            .from('sessionid')
            .insert([{ phonenumber, valid: true }])
            .select('session_id')
            .single();
        if (sessionError) {
            return res.status(500).json({ error: 'Error creating session' });
        }
        const { session_id } = session;
        res.status(200).json({ message: 'Login successful', session_id });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/api/initiatePasswordChange', async (req, res) => {
    const { phonenumber } = req.body;
    if (!phonenumber) {
        return res.status(400).json({ error: 'phone number is required' });
    }
    if (!checkPhone(phonenumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }
    const { data: accountData, error: accountError } = await supabase
      .from('account')
      .select('email')
      .eq('phonenumber', phonenumber)
      .single();
    const email=accountData.email;
    if (accountError || !accountData) {
        return res.status(404).json({ error: 'Account not found' });
    }
    const otp = generateOTP();
    try {
        let info = await transporter.sendMail({
            from: '"ONLINE WALLET" <flexable333@gmail.com>',
            to: email,
            subject: 'Password Change OTP',
            text: `Your OTP is: ${otp}`,
            html: `<b>Your OTP is: ${otp}</b>`,
        });
        await supabase
            .from('initiatepasswordchange')
            .delete()
            .eq('phonenumber', phonenumber);
        const { data, error: insertError } = await supabase
            .from('initiatepasswordchange')
            .insert([
                {
                    phonenumber,
                    otp,
                },
            ]);
        if (insertError) {
            console.error('Error storing OTP in initiatePasswordChange table:', insertError);
            return res.status(500).json({ error: 'Error storing OTP in initiatePasswordChange table' });
        }
        res.status(200).json({ message: 'OTP sent successfully, please check your email' });
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        res.status(500).json({ error: 'Failed to send OTP email' });
    }
  });
  
  
  //password change api call
  router.post('/api/changepassword', async (req, res) => {
    const { phonenumber, otp, password, confirm_password } = req.body;
    if (!phonenumber || !otp || !password || !confirm_password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!checkPhone(phonenumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    const { data: verificationData, error: verificationError } = await supabase
      .from('initiatepasswordchange')
      .select('*')
      .eq('phonenumber', phonenumber)
      .single();
    if (verificationError || !verificationData) {
        return res.status(404).json({ error: 'No verification data found' });
    }
    if (verificationData.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { error: updateError } = await supabase
      .from('account')
      .update({ password: hashedPassword })
      .eq('phonenumber', phonenumber);
    if (updateError) {
        return res.status(500).json({ error: 'Error updating password' });
    }
    const { error: deleteError } = await supabase
      .from('initiatepasswordchange')
      .delete()
      .eq('phonenumber', phonenumber);
    if (deleteError) {
        console.error('Supabase deletion error:', deleteError);
        return res.status(500).json({ error: deleteError.message || 'Error deleting verification data' });
    }
    res.status(200).json({ message: 'Password changed successfully' });
  });
  

//logout by session id
router.post('/api/logoutbysessionid/:session_id', async (req, res) => {
    const { session_id } = req.params;
    if (!session_id) {
        return res.status(400).json({ error: 'Session ID is required' });
    }
    try {
        const { error: sessionError } = await supabase
            .from('sessionid')
            .delete()
            .eq('session_id', session_id);
  
        if (sessionError) {
            return res.status(500).json({ error: 'Error deleting session' });
        }
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout process:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports=router;