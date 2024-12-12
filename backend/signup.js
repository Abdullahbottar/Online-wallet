const express=require('express');
const router=express.Router();
const supabase=require('./supabaseClient');

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
//api call to verifiy email
router.post('/api/verifiyMail',async(req,res)=>{
    const {email,password,confirm_password,phoneNumber,first_name,last_name}=req.body;
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Use your lhr email' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    if(!checkPhone(phoneNumber)){
        return res.status(400).json({error:'Invalid Phone Number'});
    }
    const { data: accountData, error: errorAccount } = await supabase
    .from('account')
    .select('*')
    .eq('phonenumber', phoneNumber)
    .eq('email', email)
    .single();
    if (errorAccount && errorAccount.code !== 'PGRST116') {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (accountData) {
        return res.status(400).json({ error: 'Credentials already exists' });
    }
    const { data: existingVerification, error: verificationError } = await supabase
      .from('verification')
      .select('*')
      .eq('email', email)
      .single();   
    
    if (verificationError && verificationError.code !== 'PGRST116') {
        return res.status(500).json({ error: 'Error checking email existence in verification table' });
    }
    if (existingVerification) {
        const { error: deleteError } = await supabase
          .from('verification')
          .delete()
          .eq('email', email);
        if (deleteError) {
            return res.status(500).json({ error: 'Error deleting existing verification record' });
        }
    }
    const otp=generateOTP();
    try{
        let info = await transporter.sendMail({
            from: '"ONLINE WALLET" <flexable333@gmail.com>',
            to: email,
            subject: 'Verify Your Email for Signup',
            text: `Your OTP is: ${otp}`,
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error: insertError } = await supabase
          .from('verification')
          .insert([
            {
              email,
              otp,
              phonenumber: phoneNumber,
              first_name: first_name,
              last_name: last_name,
              password: hashedPassword,
              confirm_password: hashedPassword, 
            },
          ]);
          if (insertError) {
            console.error('Error storing data in verification table:', insertError);
            return res.status(500).json({ error: insertError.message || 'Error storing data in verification table' });
        }
        res.status(200).json({ message: 'OTP sent to email, please verify' });
    } 
    catch (error) {
        console.error('Failed to send OTP email:', error);
        res.status(500).json({ error: 'Failed to send OTP email' });
    }
});


//api call to verify otp
router.post('/api/confirmotp', async (req, res) => {
    const { email, otp } = req.body;
    const { data: verificationData, error: verificationError } = await supabase
      .from('verification')
      .select('*')
      .eq('email', email)
      .single();
    if (verificationError || !verificationData) {
        return res.status(400).json({ error: 'No verification data found' });
    }
    if (verificationData.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
    const { data: accountData, error: createError } = await supabase.from('account').insert([
        {
            phonenumber: verificationData.phonenumber,
            email: verificationData.email,
            first_name: verificationData.first_name,
            last_name: verificationData.last_name,
            password: verificationData.password,
        },
    ]);
    console.log(createError);
    if (createError) {
        return res.status(500).json({ error: 'Error creating account' });
    }
    const { error: deleteError } = await supabase
      .from('verification')
      .delete()
      .eq('email', email);
    if (deleteError) {
        console.error('Supabase deletion error:', deleteError);
        return res.status(500).json({ error: deleteError.message || 'Error deleting verification data' });
    }
    res.status(200).json({ message: 'Account created successfully' });
});
module.exports=router;