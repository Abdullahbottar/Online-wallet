const express=require('express');
const router=express.Router();
const supabase=require('./supabaseClient');

router.post('/api/insertCompany',async(req,res)=>{
    const {company_name}=req.body;
    if(!company_name){
        return res.status(400).json({error:'company_name is required'});
    }
    try{
        const {data,error}=await supabase
        .from('bill_company')
        .insert([{company_name}]);
        if(error){
            throw error;
        }
        return res.status(200).json('Company added successfully');
    }
    catch{
        return res.status(500).json({error:'Internal server error'});
    }
});

module.exports=router;