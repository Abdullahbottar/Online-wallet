const express= require('express');
const supabase=require('./supabaseClient');
const app = express();
const signupRouter=require('./signup');
const loginRouter=require('./login');
const personalRoutes=require('./personal');
const banksRouter=require('./banks');
const billRouter=require('./billCompany');
const ewalletRouter= require('./ewallet');
const accountinfoRouter=require('./insertaccount');
const requestTransactionBankRouter=require('./bankTransaction');
const requestewalletRouter=require('./ewalletTransaction');
app.use(express.json());
app.use(signupRouter);
app.use(loginRouter);
app.use(personalRoutes);
app.use(banksRouter);
app.use(billRouter);
app.use(ewalletRouter);
app.use(accountinfoRouter);
app.use(requestTransactionBankRouter);
app.use(requestewalletRouter);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

//api call for signup
