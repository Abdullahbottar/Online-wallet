const express=require('express');
const router= express.Router();
const supabase=require('./supabaseClient');

router.post('/api/addEwallet', async(req,res)=>{
    const {ewallet_name} =req.body;
    if(!ewallet_name){
        return res.status(400).json({message:'ewallet_name is required'});
    }
    try{
        const {data,error}=await supabase
        .from('ewallet')
        .insert([{ewallet_name}]);
        if(error){
            return res.status(400).json({message:error.message});
        }
        return res.status(200).json({message:'ewallet added successfully',data});
    }
    catch{
        return res.status(500).json({message:'internal server error'});
    }
});

module.exports=router;