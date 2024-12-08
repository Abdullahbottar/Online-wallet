const express= require('express');
const supabase=require('./supabaseClient');
const app = express();

const signupRouter=require('./signup');
const loginRouter=require('./login');
app.use(express.json());
app.use(signupRouter);
app.use(loginRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

//api call for signup
