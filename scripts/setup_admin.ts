import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdmin() {
    console.log('Attempting to sign up admin user...');

    // We try to sign up the admin user using Auth 
    // This assumes email confirmations are off, or they will need to be confirmed in dashboard.
    const { data, error } = await supabase.auth.signUp({
        email: 'dydwls022@admin.com',
        password: '031924as@@',
    });

    if (error) {
        if (error.message.includes('User already registered')) {
            console.log('Admin user already exists. You can proceed to login.');
        } else {
            console.error('Error creating admin user:', error.message);
        }
    } else {
        console.log('Admin user signed up successfully!', data.user?.id);
        console.log('NOTE: If email confirmation is enabled on Supabase, please disable it or mark the user as confirmed in the Supabase Dashboard > Authentication > Users.');
    }
}

setupAdmin();
