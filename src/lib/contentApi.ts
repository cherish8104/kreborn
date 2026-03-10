import { supabase } from './supabase';
import type { ElementEn } from '../app/utils/sajuEngine';

export async function getKoreanSurnameFromDB(seed: number) {
    if (!supabase) return null;
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

export async function getKoreanNameFromDB(element: ElementEn, gender: 'male' | 'female', seed: number) {
    if (!supabase) return null;
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

export function generateShareCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function saveUserGeneration(
    userId: string,
    email: string,
    originalName: string,
    generatedKoreanName: string,
    sajuData: any,
    shareCode: string,
    identityData?: any,
    userInputData?: any
) {
    if (!supabase) return;
    try {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: userId,
                email,
                original_name: originalName,
                generated_korean_name: generatedKoreanName,
                saju_data: sajuData,
                share_code: shareCode,
                identity_data: identityData ?? null,
                user_input_data: userInputData ?? null,
            });

        if (error) console.error('[ContentDB] Error saving user generation', error.message);
    } catch (err) {
        console.error('[ContentDB] Exception saving user generation', err);
    }
}

export async function getUserByShareCode(shareCode: string) {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from('users')
            .select('identity_data, user_input_data, generated_korean_name, original_name')
            .eq('share_code', shareCode)
            .single();

        if (error || !data) return null;
        return data;
    } catch (err) {
        console.error('[ContentDB] Error fetching shared result', err);
        return null;
    }
}
