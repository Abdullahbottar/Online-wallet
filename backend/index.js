const express= require('express');
const { createClient }= require('@supabase/supabase-js');
const supabaseUrl = 'https://rposarrnorvgftockhpi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb3NhcnJub3J2Z2Z0b2NraHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NDkxNzEsImV4cCI6MjA0ODEyNTE3MX0.OJ4kPY1MVD_PvLQY147mmRqIdUpRk1rIBlhTYJj8SYM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const app = express();
app.use(express.json());


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


const nodemailer=require('nodemailer');
const crypto= require('crypto');
const bycrpt=require('bcrypt');

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'flexable333@gmail.com',
        pass:'fztb bowq aqgq hyyi'
    }
});

function isvalidEmail(email){
    const regex=/^l2[2-5]\d{4}@lhr\.nu\.edu\.pk$/;
    return regex.test(email);
}

function generateOTP(){
    return crypto.randomInt(100000,999999).toString();
}


//api call for signup
