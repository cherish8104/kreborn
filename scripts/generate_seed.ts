import * as fs from 'fs';
import { ZODIAC_MAP, DAY_MASTER_DEEP, DAILY_SCENARIOS, PAST_BY_STEM, YOUTH_BY_BRANCH, FUTURE_BY_STEM } from '../src/app/utils/narrativeContent';
import { NEIGHBORHOOD_MAP, SOULMATE_DB } from '../src/app/utils/sajuEngine';

// We need to generate 500 male and 500 female names for our 5 elements.
// Total 1000 names. Meaning 100 names per element per gender.

// Popular/Modern Korean Name Syllables categorization
const Surnames = [
    { s: '김', m: '金 (성씨 김) - 찬란하고 고귀한 금의 기운을 담은 조선 최고의 명문가 성씨' },
    { s: '이', m: '李 (성씨 이) - 오얏나무 아래서 지혜를 나누는 어질고 따뜻한 성실의 성씨' },
    { s: '박', m: '朴 (성씨 박) - 소박하고 정직한 기운으로 세상을 품는 단단한 근원의 성씨' },
    { s: '최', m: '崔 (성씨 최) - 높고 상서로운 기운으로 이상을 향해 나아가는 리더의 성씨' },
    { s: '정', m: '鄭 (성씨 정) - 바르고 온화한 마음으로 조화를 이루는 안정된 토대의 성씨' },
    { s: '강', m: '姜 (성씨 강) - 강인한 생명력으로 거침없이 도전하는 개척자의 성씨' },
    { s: '조', m: '趙 (성씨 조) - 밝고 투명한 지혜로 사물을 꿰뚫어 보는 통찰의 성씨' },
    { s: '윤', m: '尹 (성씨 윤) - 다스리고 보살피는 부드러운 카리스마를 지닌 명예의 성씨' },
    { s: '장', m: '張 (성씨 장) - 베풀고 넓게 품어주는 넉넉한 도량과 신뢰의 성씨' },
    { s: '임', m: '林 (성씨 임) - 푸른 숲처럼 상쾌하고 변함없는 절개를 지닌 성장의 성씨' },
    { s: '서', m: '徐 (성씨 서) - 천천히 깊게 스며드는 우아한 품격과 학문의 성씨' },
    { s: '신', m: '愼 (성씨 신) - 삼가고 신중하게 정석을 걷는 성실하고 맑은 기운의 성씨' },
    { s: '안', m: '安 (성씨 안) - 평안하고 편안한 기운으로 모두를 안락하게 하는 성씨' },
    { s: '송', m: '宋 (성씨 송) - 상서로운 소나무처럼 늘 푸르고 곧은 기운의 성씨' },
    { s: '유', m: '劉 (성씨 유) - 흐르는 물처럼 유연하고 지혜로운 적응력의 성씨' },
    { s: '한', m: '韓 (성씨 한) - 하나로 뭉치는 큰 기운과 포용력을 지닌 우두머리의 성씨' },
    { s: '오', m: '吳 (성씨 오) - 즐겁고 화목한 기운으로 주변을 활기차게 만드는 성씨' },
    { s: '황', m: '黃 (성씨 황) - 대지의 황금빛처럼 풍요롭고 결실을 맺는 완성의 성씨' },
    { s: '고', m: '高 (성씨 고) - 높고 빼어난 기운으로 대중의 존경을 받는 기품의 성씨' }
];

const ElementMeaning = {
    wood: {
        desc: '아름답게 피어나는 생명력과 지혜',
        charsM: ['준', '건', '우', '훈', '동', '규', '근', '영', '본', '재'],
        charsF: ['가', '린', '원', '다', '하', '송', '주', '아', '현', '서']
    },
    fire: {
        desc: '따뜻하고 밝게 빛나는 열정과 온기',
        charsM: ['태', '도', '윤', '환', '찬', '민', '호', '진', '성', '희'],
        charsF: ['나', '리', '은', '다', '연', '지', '유', '아', '효', '희']
    },
    earth: {
        desc: '세상을 품어주는 단단한 대지의 포용력',
        charsM: ['은', '하', '준', '재', '현', '석', '기', '범', '상', '원'],
        charsF: ['아', '인', '은', '영', '지', '윤', '보', '미', '예', '담']
    },
    metal: {
        desc: '연마된 보석처럼 흔들리지 않는 맑은 원칙',
        charsM: ['서', '진', '재', '혁', '승', '종', '철', '수', '정', '경'],
        charsF: ['서', '연', '희', '안', '수', '채', '영', '정', '진', '예']
    },
    water: {
        desc: '깊고 맑게 흐르는 총명함과 깊은 이해심',
        charsM: ['민', '재', '현', '우', '호', '수', '율', '결', '온', '윤'],
        charsF: ['민', '아', '주', '수', '연', '해', '윤', '솔', '슬', '빈']
    }
};

const CommonPrefix = {
    male: ['민', '준', '서', '도', '지', '현', '우', '태', '재', '시', '하', '건', '정', '승', '윤'],
    female: ['서', '지', '하', '민', '수', '다', '채', '유', '예', '아', '은', '시아', '윤', '주', '소']
};

const CommonSuffix = {
    male: ['준', '우', '진', '현', '호', '윤', '재', '성', '원', '훈', '민', '율', '결', '빈', '환'],
    female: ['연', '아', '은', '진', '희', '윤', '인', '원', '린', '영', '수', '정', '율', '솔', '빈']
};

function generateNames() {
    const names = [];
    const generatedSet = new Set();
    const elements = ['wood', 'fire', 'earth', 'metal', 'water'];

    for (const el of elements) {
        const data = ElementMeaning[el];

        // Generate 100 male
        let mCount = 0;
        while (mCount < 100) {
            const p = CommonPrefix.male[Math.floor(Math.random() * CommonPrefix.male.length)];
            const s = CommonSuffix.male[Math.floor(Math.random() * CommonSuffix.male.length)];
            const eC = data.charsM[Math.floor(Math.random() * data.charsM.length)];

            // We mix a generic popular prefix/suffix with an element-specific character
            const isPrefix = Math.random() > 0.5;
            let nameStr = isPrefix ? `${eC}${s}` : `${p}${eC}`;

            // If by chance eC and s/p are same, retry
            if (nameStr[0] === nameStr[1]) continue;

            if (!generatedSet.has('male' + nameStr)) {
                generatedSet.add('male' + nameStr);
                names.push({
                    gender: 'male',
                    element: el,
                    given_name: nameStr,
                    romanized: generateRomanization(nameStr),
                    meaning: `"${data.desc}" — 세상을 이롭게 하는 맑은 기운을 담은 아름다운 이름입니다.`
                });
                mCount++;
            }
        }

        // Generate 100 female
        let fCount = 0;
        while (fCount < 100) {
            const p = CommonPrefix.female[Math.floor(Math.random() * CommonPrefix.female.length)];
            const s = CommonSuffix.female[Math.floor(Math.random() * CommonSuffix.female.length)];
            const eC = data.charsF[Math.floor(Math.random() * data.charsF.length)];

            const isPrefix = Math.random() > 0.5;
            // Handle "시아" case
            let nameStr = '';
            if (p.length > 1) {
                nameStr = p;
            } else {
                nameStr = isPrefix ? `${eC}${s}` : `${p}${eC}`;
            }

            if (nameStr.length > 2) nameStr = nameStr.substring(0, 2);
            if (nameStr[0] === nameStr[1]) continue;

            if (!generatedSet.has('female' + nameStr)) {
                generatedSet.add('female' + nameStr);
                names.push({
                    gender: 'female',
                    element: el,
                    given_name: nameStr,
                    romanized: generateRomanization(nameStr),
                    meaning: `"${data.desc}" — 투명하고 단단하게 성장하는 다정한 기운을 담은 아름다운 이름입니다.`
                });
                fCount++;
            }
        }
    }
    return names;
}

const romMap = {
    '가': 'Ga', '건': 'Geon', '경': 'Gyeong', '결': 'Gyeol', '규': 'Gyu', '근': 'Geun', '기': 'Gi',
    '나': 'Na',
    '다': 'Da', '담': 'Dam', '도': 'Do', '동': 'Dong',
    '리': 'Ri', '린': 'Rin', '율': 'Yul',
    '민': 'Min', '미': 'Mi',
    '박': 'Bak', '보': 'Bo', '본': 'Bon', '범': 'Beom', '빈': 'Bin',
    '상': 'Sang', '서': 'Seo', '석': 'Seok', '성': 'Seong', '소': 'So', '솔': 'Sol', '수': 'Su', '승': 'Seung', '시': 'Si', '시아': 'Sia', '슬': 'Seul',
    '아': 'A', '안': 'An', '연': 'Yeon', '영': 'Yeong', '예': 'Ye', '온': 'On', '우': 'Woo', '원': 'Won', '유': 'Yu', '윤': 'Yun', '은': 'Eun', '인': 'In',
    '재': 'Jae', '정': 'Jeong', '종': 'Jong', '주': 'Ju', '준': 'Jun', '지': 'Ji', '진': 'Jin',
    '채': 'Chae', '찬': 'Chan', '철': 'Cheol',
    '태': 'Tae',
    '하': 'Ha', '해': 'Hae', '현': 'Hyun', '호': 'Ho', '환': 'Hwan', '훈': 'Hun', '희': 'Hee'
};

function generateRomanization(name) {
    let r = '';
    for (let i = 0; i < name.length; i++) {
        const c = name[i];
        // Find matching romanization or fallback
        const rC = romMap[c] || 'Hyun';
        r += i === 0 ? rC : '-' + rC.toLowerCase();
    }
    return r;
}

function escapeSql(str) {
    if (!str) return '';
    return str.replace(/'/g, "''");
}

function arrayToSql(arr) {
    if (!arr || arr.length === 0) return "'{}'";
    return `ARRAY['${arr.map(escapeSql).join("','")}']::text[]`;
}


function main() {
    let out = `-- SEED DATA FOR K-REBORN RELATIONAL DB SCHEMA\n\n`;

    // 1. Zodiac
    out += `-- ========== ZODIAC ==========\n`;
    for (const [key, val] of Object.entries(ZODIAC_MAP)) {
        out += `INSERT INTO public.saju_content_zodiac (animal, kr, emoji, trait, language) VALUES ('${escapeSql(val.animal)}', '${escapeSql(val.kr)}', '${escapeSql(val.emoji)}', '${escapeSql(val.trait)}', 'ko') ON CONFLICT (animal) DO NOTHING;\n`;
    }

    // 2. Day Master
    out += `\n-- ========== DAY MASTER ==========\n`;
    for (const [key, val] of Object.entries(DAY_MASTER_DEEP)) {
        out += `INSERT INTO public.saju_content_day_master (day_master_id, title, hanja, nature, strength, caution, korean_style, lucky_color, lucky_color_hex, lucky_number, language) VALUES (${key}, '${escapeSql(val.title)}', '${escapeSql(val.hanja)}', '${escapeSql(val.nature)}', ${arrayToSql(val.strength)}, ${arrayToSql(val.caution)}, '${escapeSql(val.koreanStyle)}', '${escapeSql(val.luckyColor)}', '${escapeSql(val.luckyColorHex)}', ${val.luckyNumber}, 'ko') ON CONFLICT (day_master_id) DO NOTHING;\n`;
    }

    // 3. Daily Scenarios
    out += `\n-- ========== DAILY SCENARIO ==========\n`;
    for (const [key, val] of Object.entries(DAILY_SCENARIOS)) {
        out += `INSERT INTO public.saju_content_daily_scenario (day_master_id, morning, afternoon, evening, language) VALUES (${key}, '${escapeSql(val.morning)}', '${escapeSql(val.afternoon)}', '${escapeSql(val.evening)}', 'ko') ON CONFLICT (day_master_id) DO NOTHING;\n`;
    }

    // 4. Past Narrative
    out += `\n-- ========== NARRATIVE PAST ==========\n`;
    for (const [key, val] of Object.entries(PAST_BY_STEM)) {
        out += `INSERT INTO public.saju_content_narrative_past (stem_key, title, keyword, narrative, language) VALUES ('${escapeSql(key)}', '${escapeSql(val.title)}', '${escapeSql(val.keyword)}', '${escapeSql(val.narrative)}', 'ko') ON CONFLICT (stem_key) DO NOTHING;\n`;
    }

    // 5. Youth Narrative
    out += `\n-- ========== NARRATIVE YOUTH ==========\n`;
    for (const [key, val] of Object.entries(YOUTH_BY_BRANCH)) {
        out += `INSERT INTO public.saju_content_narrative_youth (branch_key, title, keyword, narrative, language) VALUES ('${escapeSql(key)}', '${escapeSql(val.title)}', '${escapeSql(val.keyword)}', '${escapeSql(val.narrative)}', 'ko') ON CONFLICT (branch_key) DO NOTHING;\n`;
    }

    // 6. Future Narrative
    out += `\n-- ========== NARRATIVE FUTURE ==========\n`;
    for (const [key, val] of Object.entries(FUTURE_BY_STEM)) {
        out += `INSERT INTO public.saju_content_narrative_future (branch_key, title, keyword, narrative, peak, language) VALUES ('${escapeSql(key)}', '${escapeSql(val.title)}', '${escapeSql(val.keyword)}', '${escapeSql(val.narrative)}', '${escapeSql(val.peak)}', 'ko') ON CONFLICT (branch_key) DO NOTHING;\n`;
    }

    // 7. Soulmate
    out += `\n-- ========== SOULMATE ==========\n`;
    for (const [el, genders] of Object.entries(SOULMATE_DB)) {
        if (genders.male && genders.male.length > 0) {
            const v = genders.male[0];
            out += `INSERT INTO public.saju_content_soulmate (element, gender, name, name_romanized, trait1, trait2, trait3, description, compatibility_score, language) VALUES ('${el}', 'male', '${escapeSql(v.name)}', '${escapeSql(v.nameRomanized)}', '${escapeSql(v.trait1)}', '${escapeSql(v.trait2)}', '${escapeSql(v.trait3)}', '${escapeSql(v.description)}', ${v.compatibilityScore}, 'ko') ON CONFLICT (element, gender) DO NOTHING;\n`;
        }
        if (genders.female && genders.female.length > 0) {
            const v = genders.female[0];
            out += `INSERT INTO public.saju_content_soulmate (element, gender, name, name_romanized, trait1, trait2, trait3, description, compatibility_score, language) VALUES ('${el}', 'female', '${escapeSql(v.name)}', '${escapeSql(v.nameRomanized)}', '${escapeSql(v.trait1)}', '${escapeSql(v.trait2)}', '${escapeSql(v.trait3)}', '${escapeSql(v.description)}', ${v.compatibilityScore}, 'ko') ON CONFLICT (element, gender) DO NOTHING;\n`;
        }
    }

    // 8. Neighborhood
    out += `\n-- ========== NEIGHBORHOOD ==========\n`;
    for (const [el, val] of Object.entries(NEIGHBORHOOD_MAP)) {
        out += `INSERT INTO public.saju_content_neighborhood (element, name, name_kr, description, vibe, language) VALUES ('${el}', '${escapeSql(val.name)}', '${escapeSql(val.nameKr)}', '${escapeSql(val.description)}', '${escapeSql(val.vibe)}', 'ko') ON CONFLICT (element) DO NOTHING;\n`;
    }

    // 9. Surnames
    out += `\n-- ========== SURNAMES ==========\n`;
    for (const sObj of Surnames) {
        out += `INSERT INTO public.saju_content_surnames (surname, meaning, language) VALUES ('${escapeSql(sObj.s)}', '${escapeSql(sObj.m)}', 'ko') ON CONFLICT (surname) DO NOTHING;\n`;
    }

    // 10. Names
    out += `\n-- ========== 1000 NAMES ==========\n`;
    const generatedNames = generateNames();
    let nameStatementsCount = 0;
    for (const n of generatedNames) {
        out += `INSERT INTO public.saju_content_names (element, gender, given_name, romanized, meaning, language) VALUES ('${n.element}', '${n.gender}', '${escapeSql(n.given_name)}', '${escapeSql(n.romanized)}', '${escapeSql(n.meaning)}', 'ko') ON CONFLICT (given_name, gender) DO NOTHING;\n`;
        nameStatementsCount++;
    }

    fs.writeFileSync('seed_content.sql', out, 'utf8');
    console.log(`Successfully generated seed_content.sql with templates and ${nameStatementsCount} names!`);
}

main();
