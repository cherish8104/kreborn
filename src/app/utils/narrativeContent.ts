// ─────────────────────────────────────────────────────────────────
//  K-REBORN · Narrative Content Layer
//  모든 lookup 테이블을 sajuEngine과 분리하여 단일 파일로 관리.
//  FullScript는 getNarrative(saju) 한 번만 호출하면 됨.
// ─────────────────────────────────────────────────────────────────
import type { SajuData } from './sajuEngine';

// ── Types ─────────────────────────────────────────────────────────
export interface ZodiacInfo {
        animal: string; kr: string; emoji: string; trait: string;
}

export interface DayMasterDeep {
        title: string; hanja: string; nature: string;
        strength: string[]; caution: string[];
        koreanStyle: string;
        luckyColor: string; luckyColorHex: string; luckyNumber: number;
}

export interface DailyScenario {
        morning: string; afternoon: string; evening: string;
}

export interface NarrativeChapter {
        title: string; keyword: string; narrative: string;
}

export interface FutureChapter extends NarrativeChapter {
        peak: string;
}

export interface GyeokgukInfo {
        name: string; hanja: string; desc: string;
}

export interface PastLifeJoseon {
        title: string; role: string; desc: string;
}

export interface KDramaPersona {
        archetype: string; trope: string; desc: string;
}

export interface LuckyEnhancers {
        color: string; item: string; place: string; action: string;
}

export interface NarrativeResult {
        zodiac: ZodiacInfo;
        dayMaster: DayMasterDeep;
        scenario: DailyScenario;
        pastData: NarrativeChapter;
        youthData: NarrativeChapter;
        futureData: FutureChapter;
        gyeokguk: GyeokgukInfo;
        pastLife: PastLifeJoseon;
        kDrama: KDramaPersona;
        luckyData: LuckyEnhancers;
}

// ── Zodiac Basic Mapping ───────────────────────────────────────────
const ZODIAC_BASICS: Record<string, { kr: string, emoji: string, animal: string }> = {
    '子': { kr: '쥐', emoji: '🐀', animal: 'Rat' },
    '丑': { kr: '소', emoji: '🐂', animal: 'Ox' },
    '寅': { kr: '호랑이', emoji: '🐅', animal: 'Tiger' },
    '卯': { kr: '토끼', emoji: '🐇', animal: 'Rabbit' },
    '辰': { kr: '용', emoji: '🐉', animal: 'Dragon' },
    '巳': { kr: '뱀', emoji: '🐍', animal: 'Snake' },
    '午': { kr: '말', emoji: '🐴', animal: 'Horse' },
    '未': { kr: '양', emoji: '🐑', animal: 'Goat' },
    '申': { kr: '원숭이', emoji: '🐒', animal: 'Monkey' },
    '酉': { kr: '닭', emoji: '🐓', animal: 'Rooster' },
    '戌': { kr: '개', emoji: '🐕', animal: 'Dog' },
    '亥': { kr: '돼지', emoji: '🐗', animal: 'Pig' }
};

// ── 격국 (오행 dominant 기준) ─────────────────────────────────
export const GYEOKGUK: Record<string, GyeokgukInfo> = {
        wood: { name: '木旺格', hanja: '木旺格', desc: '나무의 왕성한 기운이 사주를 지배하는 격. 창조와 성장의 힘이 폭발적이다.' },
        fire: { name: '炎上格', hanja: '炎上格', desc: '불이 활활 타오르는 격. 카리스마와 열정으로 세상을 비추는 운명이다.' },
        earth: { name: '稼穡格', hanja: '稼穡格', desc: '대지의 풍요로운 기운을 품은 격. 사람을 키우고 기반을 다지는 운명이다.' },
        metal: { name: '從革格', hanja: '從革格', desc: '금속의 단단하고 예리한 격. 원칙과 정확함으로 세상을 바꾸는 운명이다.' },
        water: { name: '潤下格', hanja: '潤下格', desc: '물이 아래로 흘러 모이는 격. 지식과 통찰로 세상에 스며드는 운명이다.' },
};

// ── 조선시대 전생 (일간 기준) ──────────────────────────────────
export const PAST_LIFE_JOSEON: Record<number, PastLifeJoseon> = {
        0: { title: '한양 최고의 거상', role: '육의전 대행수 (大行首)', desc: '목(木)의 개척 정신으로 새로운 무역로를 개척하며 막대한 부를 쌓았습니다. 당신의 상단은 한양의 경제를 쥐락펴락했습니다.' },
        1: { title: '왕실 전속 화원', role: '도화서 화원 (圖畵署 畵員)', desc: '을(乙)의 섬세함으로 붓끝에 혼을 담았습니다. 당신이 그린 화조도는 궁중에서 가장 사랑받는 예술품이었습니다.' },
        2: { title: '시대를 앞서간 개혁가', role: '성균관 대사성 (大司成)', desc: '병(丙)의 불꽃같은 열정으로 낡은 제도를 비판하고 새로운 학문을 부르짖었습니다. 수많은 젊은 유생들이 당신을 따랐습니다.' },
        3: { title: '비밀을 품은 정보책임자', role: '승정원 주서 (承政院 注書)', desc: '정(丁)의 예리함과 은밀함으로 왕의 눈과 귀가 되었습니다. 궐내의 모든 비밀이 당신의 붓끝에서 기록되고 지워졌습니다.' },
        4: { title: '국경을 지킨 대장군', role: '북방 병마절도사 (兵馬節度使)', desc: '무(戊)의 묵직함으로 흔들림 없이 국경을 수호했습니다. 당신이 지키는 성벽은 적들에게 통곡의 벽과 같았습니다.' },
        5: { title: '백성을 구휼한 의원', role: '내의원 어의 (內醫院 御醫)', desc: '기(己)의 포용력으로 사람을 살렸습니다. 침술의 달인으로서 신분 고하를 막론하고 아픈 이들에게 새 생명을 주었습니다.' },
        6: { title: '강직한 감찰관', role: '사헌부 대사헌 (大司憲)', desc: '경(庚)의 서슬 퍼런 원칙으로 탐관오리들을 벌벌 떨게 했습니다. 왕 앞에서도 직언을 서슴지 않았던 조선의 진정한 대나무.' },
        7: { title: '은밀한 권력의 실세', role: '왕실 외척 도승지 (都承旨)', desc: '신(辛)의 정교한 두뇌로 궁중 암투에서 언제나 승리했습니다. 화려한 비단옷 속에 차가운 지략을 숨긴 전략가였습니다.' },
        8: { title: '세상을 유랑한 풍류객', role: '팔도 유람 선비', desc: '임(壬)의 자유로움으로 관직을 마다하고 산천을 떠돌았습니다. 당신이 남긴 시조들은 수백 년이 지나도 불리고 있습니다.' },
        9: { title: '천문을 읽는 관상감', role: '관상감 제조 (觀象監 提調)', desc: '계(癸)의 깊은 직관으로 별의 궤도를 읽고 국가의 운명을 예언했습니다. 당신의 책략은 언제나 한 치의 오차도 없었습니다.' },
};

// ── K-드라마 페르소나 (dominantElement 기준) ───────────────────
export const K_DRAMA_PERSONA: Record<string, KDramaPersona> = {
        wood: { archetype: '성장형 주인공', trope: '이태원 클라쓰의 불굴의 창업자', desc: '아무리 짓밟혀도 다시 일어나는 꺾이지 않는 잡초. 결국 자신의 크루를 이끌고 업계 1위로 올라서는 서사의 주인공입니다.' },
        fire: { archetype: '매운맛 안티히어로', trope: '더 글로리의 치밀한 복수자', desc: '모두의 시선을 사로잡는 압도적인 카리스마. 한번 목표를 정하면 모든 것을 불태워서라도 끝을 보는 강렬한 에너지를 가졌습니다.' },
        earth: { archetype: '숨겨진 재벌 3세', trope: '사랑의 불시착의 든든한 보호자', desc: '평소엔 평범하고 묵묵해 보이지만, 위기의 순간 압도적인 자본력과 권력으로 내 사람을 지켜내는 든든한 산 같은 존재입니다.' },
        metal: { archetype: '냉철한 프로페셔널', trope: '빈센조의 무자비한 해결사', desc: '슈트핏이 완벽하게 어울리는 피도 눈물도 없는 전문가. 그러나 내 사람에게는 한없이 약해지는 츤데레 매력의 소유자입니다.' },
        water: { archetype: '미스터리 천재', trope: '비밀의 숲의 감정 없는 검사', desc: '남들이 보지 못하는 이면을 꿰뚫어 보는 통찰력. 조용하지만 가장 판을 크게 흔드는 세계관 최강의 두뇌 캐릭터입니다.' },
};

// ── 행운의 오행 처방 (lackingElement 기준) ────────────────────
export const LUCKY_ENHANCERS: Record<string, LuckyEnhancers> = {
        wood: { color: '포레스트 그린', item: '우드 톤의 룸 스프레이나 향수', place: '식물이 많은 수목원이나 숲길', action: '아침 일찍 일어나 새로운 취미 시작하기' },
        fire: { color: '선셋 오렌지', item: '향초나 은은한 조명의 무드등', place: '햇빛이 잘 드는 남향의 대형 카페', action: '사람들이 많은 모임에서 먼저 대화 주도하기' },
        earth: { color: '어스 브라운', item: '세라믹 다기 세트나 테라코타 화분', place: '흙을 밟을 수 있는 조용한 등산로', action: '다이어리에 감정 정리하며 명상하기' },
        metal: { color: '문라이트 실버', item: '메탈 소재의 고급스러운 시계나 주얼리', place: '현대적인 건축미가 돋보이는 미술관', action: '미뤄둔 공간의 정리정돈과 미니멀리즘 실천' },
        water: { color: '오션 네이비', item: '투명한 크리스탈 오브제나 어항', place: '탁 트인 바다나 잔잔한 강변', action: '밤 시간에 혼자만의 책 읽기나 반신욕하기' },
};


import { supabase } from '../../lib/supabase';

export async function getNarrative(saju: SajuData, language: string = 'ko'): Promise<NarrativeResult> {
        const idx = saju.dayMasterIndex;
        const branchChar = saju.year.branch;
        const zodiacBasics = ZODIAC_BASICS[branchChar] || ZODIAC_BASICS['子'];

        try {
                // Fetch from New Relational Tables as Single Source of Truth
                const [
                        dbZodiac,
                        dbDayMaster,
                        dbScenario,
                        dbPast,
                        dbYouth,
                        dbFuture,
                        dbSoulmate,
                        dbNeighborhood
                ] = await Promise.all([
                        supabase.from('saju_content_zodiac').select('*').eq('kr', zodiacBasics.kr).single(),
                        supabase.from('saju_content_day_master').select('*').eq('day_master_id', idx).single(),
                        supabase.from('saju_content_daily_scenario').select('*').eq('day_master_id', idx).single(),
                        supabase.from('saju_content_narrative_past').select('*').eq('stem_key', saju.year.stem).single(),
                        supabase.from('saju_content_narrative_youth').select('*').eq('branch_key', saju.month.branch).single(),
                        supabase.from('saju_content_narrative_future').select('*').eq('branch_key', saju.hour.branch).single(),
                        supabase.from('saju_content_soulmate').select('*').eq('element', saju.lackingElement).single(),
                        supabase.from('saju_content_neighborhood').select('*').eq('element', saju.dominantElement).single()
                ]);

                return {
                        zodiac: {
                                animal: zodiacBasics.animal,
                                kr: zodiacBasics.kr,
                                emoji: zodiacBasics.emoji,
                                trait: dbZodiac.data?.trait || ''
                        },
                        dayMaster: {
                                title: dbDayMaster.data?.title || '',
                                hanja: dbDayMaster.data?.hanja || '',
                                nature: dbDayMaster.data?.nature || '',
                                strength: dbDayMaster.data?.strength || [],
                                caution: dbDayMaster.data?.caution || [],
                                koreanStyle: dbDayMaster.data?.korean_style || '',
                                luckyColor: dbDayMaster.data?.lucky_color || '',
                                luckyColorHex: dbDayMaster.data?.lucky_color_hex || '#cccccc',
                                luckyNumber: dbDayMaster.data?.lucky_number || 0
                        },
                        scenario: {
                                morning: dbScenario.data?.morning || '',
                                afternoon: dbScenario.data?.afternoon || '',
                                evening: dbScenario.data?.evening || ''
                        },
                        pastData: {
                                title: dbPast.data?.title || '',
                                keyword: dbPast.data?.keyword || '',
                                narrative: dbPast.data?.narrative || ''
                        },
                        youthData: {
                                title: dbYouth.data?.title || '',
                                keyword: dbYouth.data?.keyword || '',
                                narrative: dbYouth.data?.narrative || ''
                        },
                        futureData: {
                                title: dbFuture.data?.title || '',
                                keyword: dbFuture.data?.keyword || '',
                                narrative: dbFuture.data?.narrative || '',
                                peak: dbFuture.data?.peak || ''
                        },
                        gyeokguk: GYEOKGUK[saju.dominantElement] ?? GYEOKGUK['wood'],
                        pastLife: PAST_LIFE_JOSEON[idx] ?? PAST_LIFE_JOSEON[0],
                        kDrama: K_DRAMA_PERSONA[saju.dominantElement] ?? K_DRAMA_PERSONA['wood'],
                        luckyData: LUCKY_ENHANCERS[saju.lackingElement] ?? LUCKY_ENHANCERS['water'],
                };
        } catch (err) {
                console.warn('[NarrativeDB] Error fetching relational content', err);
                
                // Extremely minimal fallback to prevent UI crash if DB is totally down
                return {
                        zodiac: { animal: zodiacBasics.animal, kr: zodiacBasics.kr, emoji: zodiacBasics.emoji, trait: 'DB Error' },
                        dayMaster: { title: 'DB Error', hanja: '?', nature: 'Error', strength: [], caution: [], koreanStyle: 'Error', luckyColor: 'Error', luckyColorHex: '#000000', luckyNumber: 0 },
                        scenario: { morning: '...', afternoon: '...', evening: '...' },
                        pastData: { title: '...', keyword: '...', narrative: '...' },
                        youthData: { title: '...', keyword: '...', narrative: '...' },
                        futureData: { title: '...', keyword: '...', narrative: '...', peak: '...' },
                        gyeokguk: GYEOKGUK[saju.dominantElement] ?? GYEOKGUK['wood'],
                        pastLife: PAST_LIFE_JOSEON[idx] ?? PAST_LIFE_JOSEON[0],
                        kDrama: K_DRAMA_PERSONA[saju.dominantElement] ?? K_DRAMA_PERSONA['wood'],
                        luckyData: LUCKY_ENHANCERS[saju.lackingElement] ?? LUCKY_ENHANCERS['water'],
                };
        }
}
