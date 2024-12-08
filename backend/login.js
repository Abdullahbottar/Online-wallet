const express=require('express');
const router=express.Router();
const supabase=require("./supabase");

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