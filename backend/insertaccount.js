const express=require('express');
const router= express.Router();
const supabase=require('./supabaseClient');

//api call to make user account
router.post('/api/createAccount',async (req, res)=>{
    const {phonenumber, amount}=req.body;
    if(!phonenumber || !amount){
        return res.status(400).json({message:"Please provide phone number and amount"});
    }
    try{
        const {data: accountData,error}=await supabase
        .from('account')
        .select('email,first_name,last_name')
        .eq('phonenumber',phonenumber)
        .single();
        if(error){
            return res.status(400).json({message:error.message});
        }
        if (!accountData) {
            return res.status(404).json({ error: 'Account not found' });
        }
        const { email, first_name, last_name } = accountData;
        const { data, insertError } = await supabase
        .from('accountinfo')
        .insert([
          {
            email,
            phonenumber,
            first_name,
            last_name,
            amount,
          },
        ]);
        if (insertError) {
            return res.status(400).json({ error: insertError.message });
       }
        return res.status(201).json({ message: 'Account info inserted successfully', data });
    } 
    catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports=router;