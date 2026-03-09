import { supabase } from './supabase';
import type { ElementEn } from '../app/utils/sajuEngine';

/**
 * Fetches a surname from the DB based on a deterministic seed.
 */
export async function getKoreanSurnameFromDB(seed: number) {
    try {
        const { data, error } = await supabase.from('saju_content_surnames').select('surname, meaning');
        if (error || !data || data.length === 0) return null;
        const index = seed % data.length;
        return data[index];
    } catch (err) {
        console.error('[ContentDB] Error fetching surname', err);
        return null;
    }
}

/**
 * NEW: Fetches a deterministic Korean name from the 1000 names DB.
 */
export async function getKoreanNameFromDB(element: ElementEn, gender: 'male' | 'female', seed: number) {
    try {
        const { data, error } = await supabase
            .from('saju_content_names')
            .select('given_name, romanized, meaning')
            .eq('element', element)
            .eq('gender', gender);

        if (error || !data || data.length === 0) return null;

        const index = seed % data.length;
        const entry = data[index];
        return {
            given: entry.given_name,
            romanized: entry.romanized,
            meaning: entry.meaning
        };
    } catch (err) {
        console.error('[ContentDB] Error fetching names', err);
        return null;
    }
}


/**
 * Saves generated user saju to the `users` table.
 */
export async function saveUserGeneration(
    userId: string,
    email: string,
    originalName: string,
    generatedKoreanName: string,
    sajuData: any
) {
    try {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: userId,
                email,
                original_name: originalName,
                generated_korean_name: generatedKoreanName,
                saju_data: sajuData,
            });

        if (error) console.error('[ContentDB] Error saving user generation', error.message);
    } catch (err) {
        console.error('[ContentDB] Exception saving user generation', err);
    }
}
