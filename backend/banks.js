const express=require('express');
const router= express.Router();
const supabase=require('./supabaseClient');

//api call to enter banks
router.post('/api/addBanks', async (req,res)=>{
    const {bank_name}= req.body;
    if(!bank_name){
        res.status(400).json({error: 'Bank name is required'});
    }
    try{
        const {data,error}= await supabase
        .from('banks')
        .insert([{bank_name}]);
        if(error){
            throw error;
        }
        res.status(201).json({message: 'Bank added successfully'});
    }
    catch{
        res.status(500).json({error: 'Internal server error'});
    }
});

module.exports=router;