const express= require('express');
const router= express.Router();
const supabase= require('./supabaseClient');
const bcrypt=require('bcrypt');

//api call to change first name
router.put('/api/updateFirstName/:session_id', async (req, res) => {
    const { session_id} = req.params;
    const {first_name } = req.body;
    if (!session_id || !first_name) {
        return res.status(400).json({ error: 'Session ID and First Name are required' });
    }
    try {
        const { data: sessionData, error: sessionError } = await supabase
            .from('sessionid')
            .select('phonenumber')
            .eq('session_id', session_id)
            .single();
        if (sessionError || !sessionData) {
            return res.status(404).json({ error: 'Invalid session ID' });
        }
        const phonenumber = sessionData.phonenumber;
        const { data: account, error: accountError } = await supabase
            .from('account')
            .select('phonenumber')
            .eq('phonenumber', phonenumber)
            .single();
        if (accountError || !account) {
            return res.status(404).json({ error: 'phonenumber not found in account table' });
        }
        const { data: updatedData, error: updateError } = await supabase
            .from('account')
            .update({ first_name })
            .eq('phonenumber', phonenumber)
            .select('first_name');
        if (updateError) {
            console.error('Error updating first name:', updateError);
            return res.status(500).json({ error: 'Error updating first name' });
        }
        res.status(200).json({
            message: 'First name updated successfully',
            updatedData,
        });
    } catch (error) {
        console.error('Error during updating first name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// api call to change last name using session_id
router.put('/api/updateLastName/:session_id', async (req, res) => {
    const { session_id }=req.params;
    const { last_name }=req.body;
    if (!session_id || !last_name) {
        return res.status(400).json({ error: 'Session ID and Last Name are required' });
    }
    try {
        const { data: sessionData, error: sessionError } = await supabase
            .from('sessionid')
            .select('phonenumber')
            .eq('session_id', session_id)
            .single();
        if (sessionError || !sessionData) {
            return res.status(404).json({ error: 'Invalid session ID' });
        }
        const phonenumber = sessionData.phonenumber;
        const { data: account, error: accountError } = await supabase
            .from('account')
            .select('phonenumber')
            .eq('phonenumber', phonenumber)
            .single();
        if (accountError || !account) {
            return res.status(404).json({ error: 'phonenumber not found in account table' });
        }
        const { data: updatedData, error: updateError } = await supabase
            .from('account')
            .update({ last_name })
            .eq('phonenumber', phonenumber)
            .select('last_name');
        if (updateError) {
            console.error('Error updating last name:', updateError);
            return res.status(500).json({ error: 'Error updating last name' });
        }
        res.status(200).json({
            message: 'Last name updated successfully',
            updatedData,
        });
    } catch (error) {
        console.error('Error during updating last name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//api call to update password
router.put('/api/updatePassword/:session_id', async (req, res) => {
    const { session_id }= req.params;
    const { old_password, new_password, confirm_password } = req.body;
    if (!session_id || !old_password || !new_password || !confirm_password) {
        return res.status(400).json({ error: 'Session ID, Old Password, New Password, and Confirm Password are required' });
    }
    if (new_password.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }
    if (new_password !== confirm_password) {
        return res.status(400).json({ error: 'New password and confirm password do not match' });
    }
    try {
        const { data: sessionData, error: sessionError } = await supabase
            .from('sessionid')
            .select('phonenumber')
            .eq('session_id', session_id)
            .single();
        if (sessionError || !sessionData) {
            return res.status(404).json({ error: 'Invalid session ID' });
        }
        const phonenumber = sessionData.phonenumber;
        const { data: account, error: accountError } = await supabase
            .from('account')
            .select('phonenumber, password')
            .eq('phonenumber', phonenumber)
            .single();
        if (accountError || !account) {
            return res.status(404).json({ error: 'phonenumber not found in account table' });
        }
        const isPasswordValid = await bcrypt.compare(old_password, account.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid old password' });
        }
        const hashedPassword = await bcrypt.hash(new_password, 10);
        const { data: updatedData, error: updateError } = await supabase
            .from('account')
            .update({ password: hashedPassword })
            .eq('phonenumber', phonenumber)
            .select('phonenumber');
        if (updateError) {
            console.error('Error updating password:', updateError);
            return res.status(500).json({ error: 'Error updating password' });
        }
        res.status(200).json({
            message: 'Password updated successfully',
            updatedData,
        });
    } catch (error) {
        console.error('Error during updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports=router;