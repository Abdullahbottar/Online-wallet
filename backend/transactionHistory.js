const express=require('express');
const router=express.Router();
const supabase=require('./supabaseClient');

router.get('/api/transactionHistory/:session_id',async (req,res)=>{
    const {session_id}=req.params;
    if(!session_id){
        return res.status(400).json({message:'session_id is required'});
    }
    const {data: sessionData,error: sessionError}=await supabase
    .from('sessionid')
    .select('phonenumber')
    .eq('session_id',session_id)
    .single();
    if(sessionError){
        return res.status(500).json({message:'Error fetching session data'});
    }
    if(!sessionData){
        return res.status(404).json({message:'Session data not found'});
    }
    const {phonenumber}=sessionData;
    const{data:userData,error:userError}=await supabase
    .from('account')
    .select('email,first_name,last_name')
    .eq('phonenumber',phonenumber)
    .single();
    if(userError){
        return res.status(500).json({message:'Error fetching user data'});
    }
    if(!userData){
        return res.status(404).json({message:'User data not found'});
    }
    const {email,first_name,last_name}=userData;
    const{data:transactionData,error:transactionError}=await supabase
    .from('transaction_history')
    .select('id,amount,company_or_ewallet_name,sent_to,transaction_date')
    .eq('phonenumber',phonenumber);
    if(transactionError){
        return res.status(500).json({message:'Error fetching transaction data'});
    }
    if(!transactionData){
        return res.status(404).json({message:'Transaction data not found'});
    }
    const formattedTransactionData = transactionData.map(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        const formattedDate = transactionDate.toISOString().split('T')[0]; 
        return {
            ...transaction,
            transaction_date: formattedDate
        };
    });
    const fullName = `${first_name} ${last_name}`;
    return res.status(200).json({
        message: 'Transaction data fetched successfully',
        user: {
            fullName
        },
        transactions: formattedTransactionData
    });
});

module.exports=router;