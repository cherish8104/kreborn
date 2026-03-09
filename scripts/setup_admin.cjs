const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

let envConfig = {};
try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length) {
            envConfig[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
        }
    });
} catch (e) {
    try {
        const envFile = fs.readFileSync('.env', 'utf8');
        envFile.split('\n').forEach(line => {
            const [key, ...values] = line.split('=');
            if (key && values.length) {
                envConfig[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
            }
        });
    } catch (err) { }
}

const supabaseUrl = envConfig['VITE_SUPABASE_URL'] || '';
const supabaseAnonKey = envConfig['VITE_SUPABASE_ANON_KEY'] || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing supabase credentials in .env.local or .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdmin() {
    console.log('Attempting to sign up admin user...');

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
    }
}

setupAdmin();
