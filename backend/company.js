const express=require('express');
const router=express.Router;
const supabase=require('./supabseClient');

router.post('/api/insertCompany',async(req,res)=>{
    const {company_name}=req.body;
    if(!company_name){
        return res.status(400).json({error:'company_name is required'});
    }
    try{
        const {data,error}=await supabase
        .from('bill_comapny')
        .insert([{company_name}]);
        if(error){
            throw error;
        }
        return res.status(200).json(data[0]);
    }
    catch{
        return res.status(500).json({error:'Internal server error'});
    }
});

module.exports=router;