import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
    'saju_content_zodiac',
    'saju_content_day_master',
    'saju_content_daily_scenario',
    'saju_content_narrative_past',
    'saju_content_narrative_youth',
    'saju_content_narrative_future',
    'saju_content_soulmate',
    'saju_content_neighborhood',
    'saju_content_surnames',
    'saju_content_names'
];

async function verify() {
    console.log('--- Database Seeding Verification ---');
    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`[${table}] ❌ Error: ${error.message}`);
        } else {
            console.log(`[${table}] ✅ Rows: ${count}`);
        }
    }
}

verify();
