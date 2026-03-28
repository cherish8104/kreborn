import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️  SUPABASE_SERVICE_ROLE_KEY not found, using anon key (INSERT may fail due to RLS)");
}
if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY in .env.local. Please add it first.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const TARGET_LANGS = ['en', 'ja', 'zh', 'th'];

const LANG_NAMES = {
    en: 'English',
    ja: 'Japanese',
    zh: 'Simplified Chinese',
    th: 'Thai',
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateText(text, targetLang) {
    if (!text) return text;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a professional translator specializing in Korean Saju (fortune-telling) and cultural terminology.
Translate the following Korean text into ${LANG_NAMES[targetLang]}.
Keep the nuance natural and engaging. Preserve formatting and emojis.
Respond ONLY with the translated text, no additional comments.

Text to translate:
${text}`,
        });
        return response.text.trim();
    } catch (err) {
        console.error(`Translation error for ${targetLang}:`, err.message);
        return text; // fallback to original
    }
}

async function translateArray(arr, targetLang) {
    if (!arr || !arr.length) return arr;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate this JSON array of Korean strings into ${LANG_NAMES[targetLang]}.
Return ONLY a valid JSON array of strings and nothing else. No markdown formatting.

${JSON.stringify(arr)}`,
        });
        const content = response.text.trim();
        return JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (err) {
        console.error(`Array translation error for ${targetLang}:`, err.message);
        return arr;
    }
}

async function processTable(tableName, textColumns, arrayColumns = [], identifyBy = 'id') {
    console.log(`\n--- Processing Table: ${tableName} ---`);

    // Fetch existing rows
    const { data: rows, error } = await supabase.from(tableName).select('*');
    if (error) {
        console.error(`Error fetching ${tableName}:`, error.message);
        return;
    }

    // Separate original (kr/ko) rows from others
    const koRows = rows.filter(r => r.language === 'ko' || r.language === 'kr' || !r.language);
    const existingTranslations = rows.filter(r => TARGET_LANGS.includes(r.language));

    console.log(`Found ${koRows.length} Korean rows to translate.`);

    for (const row of koRows) {
        for (const lang of TARGET_LANGS) {
            // Check if this specific translation already exists
            const exists = existingTranslations.find(t =>
                t.language === lang &&
                ((identifyBy !== 'id' && t[identifyBy] === row[identifyBy]) ||
                    (tableName === 'saju_content_zodiac' && t.animal === row.animal) ||
                    (tableName === 'saju_content_day_master' && t.day_master_id === row.day_master_id) ||
                    (tableName === 'saju_content_daily_scenario' && t.day_master_id === row.day_master_id) ||
                    (tableName === 'saju_content_narrative_past' && t.stem_key === row.stem_key) ||
                    (tableName === 'saju_content_narrative_youth' && t.branch_key === row.branch_key) ||
                    (tableName === 'saju_content_narrative_future' && t.branch_key === row.branch_key))
            );

            if (exists) {
                console.log(`💡 Translation for ${lang} already exists for ${identifyBy}=${row[identifyBy]}`);
                continue;
            }

            console.log(`🔄 Translating ${tableName} (${identifyBy}=${row[identifyBy]}) to ${lang}...`);

            const newRow = { ...row };
            delete newRow.id; // Let DB generate a new ID
            delete newRow.created_at;
            delete newRow.updated_at;
            newRow.language = lang;

            // Translate text columns
            for (const col of textColumns) {
                if (row[col]) {
                    newRow[col] = await translateText(row[col], lang);
                }
            }
            // Translate array columns
            for (const col of arrayColumns) {
                if (row[col] && row[col].length > 0) {
                    newRow[col] = await translateArray(row[col], lang);
                }
            }

            // Insert new translation
            const { error: insertError } = await supabase.from(tableName).insert([newRow]);
            if (insertError) {
                console.error(`❌ Error inserting ${lang} for ${tableName}:`, insertError.message);
            } else {
                console.log(`✅ Inserted ${lang} for ${tableName}`);
            }

            // Prevent rate limiting (Gemini free: 15 RPM)
            await delay(4500);
        }
    }
}

async function main() {
    console.log("Starting DB Translation Process (Gemini 2.5 Flash)...");

    // Define tables and columns to translate
    await processTable('saju_content_zodiac', ['trait'], [], 'animal');
    await processTable('saju_content_day_master', ['title', 'nature', 'korean_style', 'lucky_color'], ['strength', 'caution'], 'day_master_id');
    await processTable('saju_content_daily_scenario', ['morning', 'afternoon', 'evening'], [], 'day_master_id');
    await processTable('saju_content_narrative_past', ['title', 'keyword', 'narrative'], [], 'stem_key');
    await processTable('saju_content_narrative_youth', ['title', 'keyword', 'narrative'], [], 'branch_key');
    await processTable('saju_content_narrative_future', ['title', 'keyword', 'narrative', 'peak'], [], 'branch_key');

    console.log("\n🎉 Translation Process Completed!");
}

main().catch(console.error);
