const express=require('express');
const router=express.Router();
const supabase=require('./supabaseClient');

router.get('/api/viewAccount/:session_id', async (req, res) => {
    const { session_id } = req.params;
    if (!session_id) {
        return res.status(400).json({ message: 'session_id is required' });
    }
    const { data: sessionData, error: sessionError } = await supabase
        .from('sessionid')
        .select('phonenumber')
        .eq('session_id', session_id)
        .single();
    if (sessionError) {
        return res.status(500).json({ message: 'Error fetching session data' });
    }
    if (!sessionData) {
        return res.status(404).json({ message: 'Session data not found' });
    }
    const { phonenumber } = sessionData;
    try {
        const { data: userData, error: userError } = await supabase
            .from('accountinfo')
            .select('first_name, last_name, amount')
            .eq('phonenumber', phonenumber)
            .single();
        if (userError) {
            throw userError;
        } 
        if (!userData) {
            return res.status(404).json({ error: 'User data not found' });
        }
        const fullName = `${userData.first_name} ${userData.last_name || ''}`.trim();
        return res.status(200).json({
            fullName: fullName,
            amount: userData.amount
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports=router