// ─────────────────────────────────────────────────────────────────
//  K-REBORN  ·  Saju Engine  (사주 팔자 분석 엔진)
// ─────────────────────────────────────────────────────────────────
import { Solar, Lunar } from 'lunar-javascript';

export type ElementEn = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

// ── Heavenly Stems (천간) ─────────────────────────────────────────
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEMS_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// ── Earthly Branches (지지) ──────────────────────────────────────
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCHES_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// ── Five-Element mappings ───────────────────────────────��─────────
const STEM_EL_CHAR: string[] = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
const STEM_EL_EN: ElementEn[] = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
const BR_EL_CHAR: string[] = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
const BR_EL_EN: ElementEn[] = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];
const BR_ANIMAL_EMOJI: string[] = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐴', '🐑', '🐒', '🐓', '🐕', '🐗'];

// ── Types ─────────────────────────────────────────────────────────
export interface Pillar {
  stem: string; stemKr: string;
  branch: string; branchKr: string;
  stemEl: string; branchEl: string;
  stemElEn: ElementEn; branchElEn: ElementEn;
  branchAnimalEmoji?: string;
}

export interface SajuData {
  year: Pillar; month: Pillar; day: Pillar; hour: Pillar;
  elements: Record<ElementEn, number>;
  dominantElement: ElementEn;
  lackingElement: ElementEn;
  dayMasterIndex: number;
  isLunar?: boolean;
}

export interface NeighborhoodInfo {
  name: string; nameKr: string;
  description: string; vibe: string;
}

export interface SoulmateProfile {
  name: string; nameRomanized: string;
  trait1: string; trait2: string; trait3: string;
  description: string; compatibilityScore: number;
}

export interface RadarDataPoint {
  element: string; elementKr: string;
  value: number; fullMark: number;
}

export interface KoreanIdentity {
  surname: string; givenName: string;
  fullName: string; fullNameRomanized: string;
  nameMeaning: string;
  career: string; careerKr: string; careerDescription: string;
  personality: string;
  neighborhood: NeighborhoodInfo;
  soulmate: SoulmateProfile;
  saju: SajuData;
  elementRadar: RadarDataPoint[];
}

// ── Career by Day Master (일간) ───────────────────────────────────
const CAREER_MAP = [
  {
    en: 'Creative Director', kr: '크리에이티브 디렉터',
    desc: '甲木의 개척 정신으로, 당신은 스튜디오와 문화 브랜드를 이끄는 리더로 태어났습니다. 타인이 보지 못하는 미래를 먼저 보는 비저너리. Korea\'s creative scene was waiting for you.'
  },
  {
    en: 'Artist & Florist', kr: '아티스트 / 플로리스트',
    desc: '乙木처럼 유연하고 아름다운 당신. 한국의 예술계와 플로럴 인더스트리는 당신의 섬세한 터치로 꽃피울 것입니다. Adaptability is your superpower.'
  },
  {
    en: 'Media Personality', kr: '방송인 / 마케터',
    desc: '丙火의 카리스마로 스크린을 밝히는 당신. 방송인, 브랜드 스트래티지스트로서 대중의 마음을 움직이는 따뜻한 힘을 가졌습니다.'
  },
  {
    en: 'Beauty Artist & Designer', kr: '뷰티 아티스트 / 디자이너',
    desc: '丁火의 집중된 예술혼. 한국의 K-뷰티 산업은 당신의 정밀한 미적 감각을 위해 존재합니다. Refinement is your medium.'
  },
  {
    en: 'Architect & Entrepreneur', kr: '건축가 / 사업가',
    desc: '戊土, 산처럼 웅장하고 흔들리지 않는 당신. 서울의 스카이라인을 바꿀 건물, 세대를 이어갈 기업을 세울 운명입니다.'
  },
  {
    en: 'Educator & Counselor', kr: '교육자 / 상담사',
    desc: '己土, 비옥한 토지처럼 사람을 키우는 당신. 교실에서, 코칭에서, 상담실에서 — 당신이 닿은 곳마다 성장이 일어납니다.'
  },
  {
    en: 'Legal Expert & Finance', kr: '법조인 / 금융 전문가',
    desc: '庚金, 단련된 강철. 한국의 최고 로펌과 금융기관은 당신의 날카로운 판단력과 흔들리지 않는 원칙을 기다립니다.'
  },
  {
    en: 'Doctor & Jewelry Designer', kr: '의사 / 주얼리 디자이너',
    desc: '辛金, 연마된 보석. 몸을 치유하거나 착용 가능한 예술을 창조하거나 — 당신은 과학과 아름다움의 교차점에서 일합니다.'
  },
  {
    en: 'IT Developer & Author', kr: 'IT 개발자 / 작가',
    desc: '壬水, 끝없이 흐르는 지성. 한국의 테크 씬 또는 독자의 내면을 흔드는 소설. 깊이가 당신의 언어입니다.'
  },
  {
    en: 'Researcher & Philosopher', kr: '연구자 / 철학자',
    desc: '癸水, 고요하고 깊은 호수. 학계의 브레이크스루, 또는 한국이 생각하는 방식을 바꿀 철학적 사유. 통찰이 당신의 소명입니다.'
  },
];

// ── Neighborhoods by dominant element ────────────────────────────
export const NEIGHBORHOOD_MAP: Record<ElementEn, NeighborhoodInfo> = {
  wood: {
    name: 'Hongdae', nameKr: '홍대 · 홍익대학교 앞',
    description: '한국 청년 문화와 창조성의 심장. 벽화, 독립 갤러리, 라이브 뮤직, 아방가르드 카페 속에서 당신의 木 기운이 자유롭게 피어납니다.',
    vibe: 'Creative · Free-spirited · Bohemian',
  },
  fire: {
    name: 'Gangnam', nameKr: '강남구 · 압구정 로데오',
    description: '야망이 럭셔리를 만나는 곳. 미슐랭 레스토랑, 글로벌 패션 하우스, 파워 코리더가 즐비한 이 ZIP 코드는 당신의 火 에너지가 사령탑에 앉을 자리입니다.',
    vibe: 'Dynamic · Prestigious · High-achieving',
  },
  earth: {
    name: 'Bukchon', nameKr: '북촌 한옥마을',
    description: '600년 된 한옥과 궁궐 사이에 보존된 세계. 전통이 살아있는 예술인 이 동네에서 당신의 土 기운은 가장 깊은 울림을 찾습니다.',
    vibe: 'Grounded · Traditional · Serene',
  },
  metal: {
    name: 'Hannam-dong', nameKr: '한남동',
    description: '교양 있는 엘리트들의 가장 탐나는 주소. 컨셉 스토어, 프라이빗 아트 갤러리, 쉐프\'s 테이블 레스토랑이 자리한 이곳은 당신의 金 기운이 완전히 빛나는 무대입니다.',
    vibe: 'Refined · Exclusive · Understated luxury',
  },
  water: {
    name: 'Mapo-gu', nameKr: '마포구 · 연남동',
    description: '한강변을 따라 독립 출판사, 스페셜티 커피 로스터, 언더그라운드 뮤직이 흐르는 마포. 당신의 水 에너지는 이 고유한 전류 속에서 가장 자유롭게 흐릅니다.',
    vibe: 'Intellectual · Artistic · Fluid',
  },
};

// ── Name Database (Surnames & Given Names separated) ────────────────────
const SURNAMES = [
  { char: '김', romanized: 'Kim', meaning: '"황금, 빛나는 고귀함" — 금(金)을 상징' },
  { char: '이', romanized: 'Lee', meaning: '"오얏나무, 인내와 결실" — 자두 나무의 강인함' },
  { char: '박', romanized: 'Park', meaning: '"밝고 관대한" — 둥근 우주와 밝은 빛' },
  { char: '최', romanized: 'Choi', meaning: '"높은 산, 흔들리지 않는" — 가장 높은 정상' },
  { char: '정', romanized: 'Jung', meaning: '"고요하고 바른" — 깊고 고요한 안정감' },
  { char: '강', romanized: 'Kang', meaning: '"편안한 강줄기" — 생명에게 물을 내어주는 강' },
  { char: '조', romanized: 'Jo', meaning: '"새로운 아침" — 세상을 깨우는 첫 햇살' },
  { char: '윤', romanized: 'Yun', meaning: '"조화와 윤택함" — 만물을 기르는 윤택한 땅' },
  { char: '장', romanized: 'Jang', meaning: '"크게 확장하는" — 넓은 세상을 향해 뻗어가는 기상' },
  { char: '임', romanized: 'Lim', meaning: '"수풀, 생명의 터전" — 나무가 우거진 깊은 숲' }
];

type GivenNameEntry = { given: string; romanized: string; meaning: string };

const GIVEN_NAME_DB: Record<ElementEn, { female: GivenNameEntry[]; male: GivenNameEntry[] }> = {
  wood: {
    female: [
      { given: '가람', romanized: 'Ka-ram', meaning: '"아름다운 흐르는 강" — 가람은 강의 순수한 우리말. 생명을 주는 은혜의 상징.' },
      { given: '지원', romanized: 'Ji-won', meaning: '"지혜를 향한 열망" — 지(志)는 원대한 뜻, 원(願)은 가장 높은 진리를 향한 간절한 소망.' },
      { given: '나린', romanized: 'Na-rin', meaning: '"우아한 비상" — 아침 안개를 가르며 날아오르는 학의 고요한 우아함에서 영감을 얻은 이름.' },
      { given: '가현', romanized: 'Ka-hyeon', meaning: '"꽃피는 지혜" — 가(佳)는 빛나는 아름다움, 현(賢)은 숲 천장처럼 자라나는 지혜를 담고 있습니다.' },
      { given: '하린', romanized: 'Ha-rin', meaning: '"맑은 숲의 빛" — 고대 나무를 통해 스며드는 햇빛처럼 명확함과 방향을 가져다주는 사람.' },
    ],
    male: [
      { given: '준서', romanized: 'Jun-seo', meaning: '"동쪽 빛의 선도자" — 준(俊)은 탁월한 명석함, 서(書)는 지식의 불후의 유산을 상징합니다.' },
      { given: '지훈', romanized: 'Ji-hun', meaning: '"지혜롭고 웅장함" — 내면의 지혜의 숲이 타인에게 빛을 발하는 길잡이 봉화가 되는 이름.' },
      { given: '가온', romanized: 'Ka-on', meaning: '"아름다움의 중심" — 가온은 "중심"을 뜻하는 우리말. 모든 생명 에너지가 모이는 곳.' },
      { given: '도현', romanized: 'Do-hyeon', meaning: '"상승하는 탁월함" — 도(道)는 위대한 지혜의 길, 현(賢)은 그 빛나는 발현입니다.' },
      { given: '지호', romanized: 'Ji-ho', meaning: '"지혜의 호수" — 깊이와 고요함이 공존하는 곳, 그 경계에서 세상을 비추는 사람.' },
    ],
  },
  fire: {
    female: [
      { given: '다인', romanized: 'Da-in', meaning: '"빛나는 인자함" — 다(多)는 풍요, 인(仁)은 유교의 덕목. 아낌없이 베푸는 따뜻함.' },
      { given: '나은', romanized: 'Na-eun', meaning: '"부드럽고 아름다운 온기" — 밤을 녹이는 새벽빛처럼 조용하고 세심한 돌봄으로 다가오는 이름.' },
      { given: '도아', romanized: 'Do-a', meaning: '"새벽 경계의 우아함" — 도(道)와 아(雅)가 만나, 첫 빛에 비춰진 세련된 아름다움을 만들어냅니다.' },
      { given: '리나', romanized: 'Ri-na', meaning: '"빛나고 온화함" — 리(麗)는 찬란한 아름다움, 나(那)는 영원하고 고요한 우아함을 담고 있습니다.' },
      { given: '다연', romanized: 'Da-yeon', meaning: '"풍요롭고 아름다움" — 결코 줄어들지 않는 불꽃처럼, 이 이름은 무한한 광채를 구현합니다.' },
    ],
    male: [
      { given: '도윤', romanized: 'Do-yun', meaning: '"인도하는 빛" — 도(道)는 빛나는 길, 윤(允)은 당신의 불꽃이 타인을 진실로 이끌 것이라는 약속.' },
      { given: '나훈', romanized: 'Na-hun', meaning: '"따뜻하고 웅장한 광채" — 가장 강렬한 대낮의 태양 에너지를 담은 이름.' },
      { given: '리한', romanized: 'Ri-han', meaning: '"날카로운 깨달음" — 먹구름을 뚫고 갑자기 쏟아지는 햇빛처럼 혼란을 정리하는 사람.' },
      { given: '단아', romanized: 'Dan-a', meaning: '"순수하고 우아한 불꽃" — 단(端)은 곧은 덕, 아(雅)는 강렬한 불을 통해 정제된 미적 우아함.' },
      { given: '민준', romanized: 'Min-jun', meaning: '"밝고 예리한 광채" — 지성이 방을 밝히고, 야망이 고귀한 목적으로 타오르는 사람.' },
    ],
  },
  earth: {
    female: [
      { given: '아인', romanized: 'A-in', meaning: '"평화로운 지혜" — 아(雅)는 고요함과 우아함, 인(仁)은 모든 생명에 대한 깊이 뿌리내린 연민.' },
      { given: '하은', romanized: 'Ha-eun', meaning: '"하늘로부터 내리는 깊은 축복" — 하(河)는 깊이, 은(恩)은 비가 비옥한 땅을 적시듯 흐르는 은혜.' },
      { given: '아영', romanized: 'A-young', meaning: '"영원한 봄의 은혜" — 아(雅)는 시대를 초월한 우아함, 영(英)은 덕 속에 깊이 뿌리내린 찬란한 꽃.' },
      { given: '하린', romanized: 'Ha-rin', meaning: '"온화하고 뿌리내린 빛" — 따스한 안정감이 땅만큼이나 믿음직스럽고 영양분을 주는 사람.' },
      { given: '아름', romanized: 'A-reum', meaning: '"아름다움 그 자체" — 아름은 "아름다운"을 뜻하는 우리말. 한 숨 속에 담긴 시.' },
    ],
    male: [
      { given: '하준', romanized: 'Ha-jun', meaning: '"고귀하고 뿌리내린 기초" — 하(河)는 깊이 흐르고, 준(俊)은 높이 솟는다: 안정적이면서도 탁월한 사람.' },
      { given: '영준', romanized: 'Young-jun', meaning: '"영원한 탁월함의 기둥" — 영(英)은 영원히 꽃피고, 준(俊)은 타인이 의지하는 기둥으로 서 있습니다.' },
      { given: '태양', romanized: 'Tae-yang', meaning: '"위대한 태양" — 태(太)는 궁극의 장엄함, 양(陽)은 태양 에너지: 거대한 생명력을 담은 이름.' },
      { given: '현준', romanized: 'Hyun-jun', meaning: '"지혜롭고 우뚝 솟음" — 대지의 지혜가 기초가 되어 타인이 그 위에 세계를 세우는 사람.' },
      { given: '흥민', romanized: 'Heung-min', meaning: '"사람들의 기운을 높이는" — 흥(興)은 에너지와 기쁨의 상승, 민(民)은 이 사람이 끌어올리는 집단의 마음.' },
    ],
  },
  metal: {
    female: [
      { given: '서연', romanized: 'Seo-yeon', meaning: '"서쪽의 우아함" — 서(西)는 金의 방향이 지닌 세련된 미, 연(蓮)은 순수함 속에 피어나는 연꽃.' },
      { given: '재희', romanized: 'Jae-hee', meaning: '"귀중한 기쁨" — 재(才)는 희귀한 재능, 희(喜)는 흠 없고 진실한 순수한 형태로 증류된 기쁨.' },
      { given: '서아', romanized: 'Seo-a', meaning: '"순수한 아침의 명료함" — 하늘이 연마된 은처럼 맑고 선명할 때의 새벽빛의 질감.' },
      { given: '지안', romanized: 'Ji-an', meaning: '"고요한 평온" — 지(知)는 깊이 아는 것, 안(안)은 그로부터 오는 평화: 모든 것의 중심에 있는 고요.' },
      { given: '수아', romanized: 'Su-a', meaning: '"우아하고 순수함" — 돌릴 때마다 새로운 빛의 면을 드러내는 완벽하게 연마된 보석처럼.' },
    ],
    male: [
      { given: '서준', romanized: 'Seo-jun', meaning: '"서쪽의 우아한 기둥" — 서(書)는 학문의 전통, 준(俊)은 그것을 존중하고 발전시키는 탁월한 정신.' },
      { given: '재원', romanized: 'Jae-won', meaning: '"귀중한 원천" — 재(才)는 탁월한 능력, 원(源)은 위대한 것이 흘러나오는 최초의 샘.' },
      { given: '진서', romanized: 'Jin-seo', meaning: '"진정한 학자" — 진(眞)은 절대적인 진정성, 서(書)는 金이 목소리를 내는 문자에 대한 사랑과 정밀함.' },
      { given: '서진', romanized: 'Seo-jin', meaning: '"순수하고 전진함" — 서(西)는 金의 방향, 진(進)은 장애물을 뚫고 나아가는 사람의 전진 움직임.' },
      { given: '준혁', romanized: 'Jun-hyuk', meaning: '"탁월하고 빛나는" — 준(俊)은 탁월함, 혁(赫)은 연마된 금속이 발하는 찬란한 광채.' },
    ],
  },
  water: {
    female: [
      { given: '민주', romanized: 'Min-ju', meaning: '"깊은 곳의 온화한 진주" — 민(珉)은 아름다운 옥 같은 돌, 주(珠)는 귀중한 진주: 보물이 되는 깊이.' },
      { given: '서윤', romanized: 'Seo-yun', meaning: '"흐르는 서쪽의 우아함" — 다양한 분위기의 풍경을 지나 인내롭고 아름다운 길을 찾는 강처럼.' },
      { given: '민아', romanized: 'Min-a', meaning: '"깊고 아름다움" — 민(岷)은 높은 산의 원천, 아(雅)는 그 높이에서 흐르는 물의 우아함.' },
      { given: '수연', romanized: 'Su-yeon', meaning: '"우아한 물" — 수(水)는 물 자체, 연(蓮)은 오직 그 아래의 깊이 때문에 피어나는 연꽃.' },
      { given: '하은', romanized: 'Ha-eun', meaning: '"축복의 강" — 하(河)는 위대한 강, 은(恩)은 그것이 지나가는 모든 곳에 가져다주는 은혜.' },
    ],
    male: [
      { given: '민준', romanized: 'Min-jun', meaning: '"깊은 지혜" — 민(敏)은 물처럼 흐르는 날카로운 지성, 준(俊)은 그 지성이 세상에서 취하는 탁월한 형태.' },
      { given: '민서', romanized: 'Min-seo', meaning: '"맑은 학자" — 민(珉)은 귀중하고 투명함, 서(書)는 강이 생명을 운반하듯 담겨진 지혜.' },
      { given: '현우', romanized: 'Hyun-woo', meaning: '"깊은 비" — 현(玄)은 신비로운 깊이, 우(雨)는 변화를 가져오기 위해 먹구름에서 내리는 비.' },
      { given: '수호', romanized: 'Su-ho', meaning: '"지키는 흐름" — 수(守)는 수호, 호(浩)는 깊은 물의 힘으로 보호하는 사람의 광대한 영역.' },
      { given: '민재', romanized: 'Min-jae', meaning: '"깊고 재능 있는" — 민(敏)은 水의 예리한 지성으로 흐르고, 재(才)는 그것이 형성하고 앞으로 나아가는 탁월한 재능.' },
    ],
  },
};


// ── Soulmate Database ─────────────────────────────────────────────
export const SOULMATE_DB: Record<ElementEn, { female: SoulmateProfile[]; male: SoulmateProfile[] }> = {
  wood: {
    female: [{ name: '이서진', nameRomanized: 'Seo-jin Lee', trait1: 'Meticulous & Principled', trait2: 'Quietly Confident', trait3: 'Appreciates Depth', description: '庚金의 에너지. 당신의 광대한 木 에너지를 단단하게 잡아주는 구조와 결단력의 명료함을 지닌 사람. 당신이 자유롭게 뻗어 나가는 곳에서, 그녀는 당신에게 우아한 형태를 부여합니다.', compatibilityScore: 94 }],
    male: [{ name: '강재우', nameRomanized: 'Jae-woo Kang', trait1: 'Decisive & Structured', trait2: 'Quietly Ambitious', trait3: 'Understated Elegance', description: '庚金의 에너지. 당신의 광범위한 비전에 아름다운 형태를 부여하는 정확하고 흔들리지 않는 신념을 가진 사람. 당신이 자유롭게 상상하는 곳에서, 그는 흠잡을 데 없이 실행합니다.', compatibilityScore: 94 }],
  },
  fire: {
    female: [{ name: '박수현', nameRomanized: 'Su-hyeon Park', trait1: 'Deeply Calm', trait2: 'Intellectually Vast', trait3: 'Emotionally Intuitive', description: '壬水의 에너지. 당신의 찬란한 불꽃을 식히고 집중시키는 고요한 지성으로 흐르는 사람. 당신의 열정은 그녀의 반영을 통해 깊이를 찾고, 그녀의 고요한 물은 당신의 따뜻함 안에서 색깔을 찾습니다.', compatibilityScore: 91 }],
    male: [{ name: '김민우', nameRomanized: 'Min-woo Kim', trait1: 'Introspective & Wise', trait2: 'Deeply Calm', trait3: 'Intellectually Boundless', description: '壬水의 에너지. 당신의 불꽃이 필요로 하면서도 저항하는 깊은 고요함을 지닌 사람. 그의 존재 안에서 당신의 열정은 철학적 토대를 찾고, 그의 광대한 지성은 따뜻함을 찾습니다.', compatibilityScore: 91 }],
  },
  earth: {
    female: [{ name: '최가은', nameRomanized: 'Ka-eun Choi', trait1: 'Imaginative & Free', trait2: 'Spontaneously Warm', trait3: 'Creatively Fearless', description: '甲木의 에너지. 당신의 깊이 뿌리내린 패턴에서 당신을 깨워내는 창의적 불안과 개척 정신을 가진 사람. 당신의 안정��� 그녀의 탁월한 아이디어가 꽃피울 토양이 됩니다.', compatibilityScore: 89 }],
    male: [{ name: '이지훈', nameRomanized: 'Ji-hun Lee', trait1: 'Creatively Visionary', trait2: 'Boldly Original', trait3: 'Restlessly Alive', description: '甲木의 에너지. 당신의 안정적인 Earth가 열망하면서도 두려워하는 창의적 불과 개척 정신을 가진 사람. 당신은 그에게 절실히 필요한 기반을 주고, 그는 당신에게 진정한 성장만이 제공할 수 있는 방향을 줍니다.', compatibilityScore: 89 }],
  },
  metal: {
    female: [{ name: '정나은', nameRomanized: 'Na-eun Jung', trait1: 'Warmly Intuitive', trait2: 'Brilliantly Charismatic', trait3: 'Emotionally Generous', description: '丁火의 에너지. 당신의 金 빛남을 최고의 광채로 연마하는 부드럽고 찬란한 따뜻함을 가진 사람. 당신의 정밀함이 그녀의 빛 속에서 빛나게 되고, 그녀의 불꽃은 당신의 정제된 형태에서 완벽한 용기를 찾습니다.', compatibilityScore: 96 }],
    male: [{ name: '박도현', nameRomanized: 'Do-hyeon Park', trait1: 'Deeply Passionate', trait2: 'Radiantly Warm', trait3: 'Charismatically Alive', description: '丙火의 에너지. 당신의 金 에너지를 진정한 빛남으로 정제하는 강력한 힘. 당신이 정밀함에서 완벽을 추구하는 곳에서, 그는 진정한 연결의 원초적 힘에서 그것을 찾습니다.', compatibilityScore: 96 }],
  },
  water: {
    female: [{ name: '조하영', nameRomanized: 'Ha-young Jo', trait1: 'Steady & Reliable', trait2: 'Grounded in Tradition', trait3: 'Profoundly Patient', description: '己土의 에너지. 당신의 흐르는 水 본성에 아름다운 정의를 부여하는 강둑. 그녀 없이는 무한한 반영 속에서 자신을 잃을 수 있지만, 그녀와 함께라면 당신의 깊이는 심연이 아닌 목적지가 됩니다.', compatibilityScore: 88 }],
    male: [{ name: '윤태현', nameRomanized: 'Tae-hyeon Yun', trait1: 'Immovably Grounded', trait2: 'Quietly Strong', trait3: 'Traditionally Rooted', description: '戊土의 에너지. 당신의 Water가 주위를 흐르고, 통과하고, 결국 형성하는 산. 그의 흔들리지 않는 안정성이 당신의 광대한 지성에 필요한 용기를 제공합니다.', compatibilityScore: 88 }],
  },
};

// ── Personality by day master ─────────────────────────────────────
const PERSONALITIES = [
  'The Visionary Pioneer — 담대하고 성장 지향적이며, 타인이 보지 못하는 미래를 먼저 보는 타고난 리더.',
  'The Elegant Adaptor — 세련되고 유연하며, 어떤 환경에서도 뛰어난 사회적 지능으로 읽어내는 사람.',
  'The Magnetic Illuminator — 카리스마 있고 관대하며, 그저 입장하는 것만으로 모든 공간을 밝히는 사람.',
  'The Precise Beautifier — 세부 지향적이고 심미적이며, 날것의 재료를 지속적인 예술로 변환하는 사람.',
  'The Immovable Mountain — 원칙적이고 전략적이며, 트렌드를 초월하는 구조와 제국을 건설하는 사람.',
  'The Nurturing Harvester — 인내심 있고 공감적이며, 사람과 아이디어를 깊은 배려로 키우는 사람.',
  'The Decisive Edge — 명쾌하고 원칙적이며, 혼란을 뚫고 본질적인 진실을 찾아내는 사람.',
  'The Refined Gemstone — 안목 있고 완벽주의자이며, 손에 닿는 모든 것에 독특한 광채를 가져오는 사람.',
  'The Boundless Ocean — 깊이 지적이고 철학적이며, 대부분이 헤아릴 수 있는 것보다 더 많은 깊이를 가진 사람.',
  'The Still Lake — 내성적이고 통찰력 있으며, 완벽하게 고요함으로써 타인이 놓치는 명료함을 보는 사람.',
];

// ─────────────────────────────────────────────────────────────────
// ── Helper: make a Pillar ─────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
function makePillar(si: number, bi: number): Pillar {
  return {
    stem: STEMS[si], stemKr: STEMS_KR[si],
    branch: BRANCHES[bi], branchKr: BRANCHES_KR[bi],
    stemEl: STEM_EL_CHAR[si], branchEl: BR_EL_CHAR[bi],
    stemElEn: STEM_EL_EN[si], branchElEn: BR_EL_EN[bi],
  };
}

// ─────────────────────────────────────────────────────────────────
// ── Pillar Calculators ────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
function yearPillar(year: number): Pillar {
  const si = ((year - 4) % 10 + 10) % 10;
  const bi = ((year - 4) % 12 + 12) % 12;
  return makePillar(si, bi);
}

function monthPillar(year: number, month: number): Pillar {
  // Branch: Jan→寅(2) … Nov→子(0) … Dec→丑(1)
  const bi = ((month + 1) % 12 + 12) % 12;
  const yearSi = ((year - 4) % 10 + 10) % 10;
  const bases = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const si = (bases[yearSi] + (month - 1)) % 10;
  return makePillar(si, bi);
}

function dayPillarStemIndex(year: number, month: number, day: number): number {
  // Reference: Jan 1 2000 = position 10 in 60-cycle (甲戌)
  const diff = Math.floor(
    (new Date(year, month - 1, day).getTime() - new Date(2000, 0, 1).getTime()) / 86400000
  );
  return ((diff + 10) % 60 + 60) % 60 % 10;
}

function dayPillar(year: number, month: number, day: number): Pillar {
  const diff = Math.floor(
    (new Date(year, month - 1, day).getTime() - new Date(2000, 0, 1).getTime()) / 86400000
  );
  const pos = ((diff + 10) % 60 + 60) % 60;
  return makePillar(pos % 10, pos % 12);
}

function hourPillar(hour: number, dayStemIdx: number): Pillar {
  // 子(0)=23|0, 丑(1)=1-2, 寅(2)=3-4 …
  const bi = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const bases = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const si = (bases[dayStemIdx] + bi) % 10;
  return makePillar(si, bi);
}

// ─────────────────────────────────────────────────────────────────
// ── Main: calculateSaju ───────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
export function calculateSaju(
  year: number, month: number, day: number, hour: number, isLunar: boolean = false
): SajuData {
  // Defensive check for NaN
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    console.warn('Invalid date passed to calculateSaju, falling back to 1990-01-01', { year, month, day });
    year = 1990; month = 1; day = 1;
  }
  const h = isNaN(hour) ? 12 : hour;

  let dateObj;
  if (isLunar) {
    const lunar = Lunar.fromYmdHms(year, month, day, h, 0, 0);
    dateObj = lunar.getSolar();
  } else {
    dateObj = Solar.fromYmdHms(year, month, day, h, 0, 0);
  }

  const baZi = dateObj.getLunar().getEightChar();

  const parsePillar = (charStr: string): Pillar => {
    const stemChar = charStr[0];
    const branchChar = charStr[1];
    const si = STEMS.indexOf(stemChar) !== -1 ? STEMS.indexOf(stemChar) : 0;
    const bi = BRANCHES.indexOf(branchChar) !== -1 ? BRANCHES.indexOf(branchChar) : 0;

    return {
      stem: stemChar, stemKr: STEMS_KR[si],
      branch: branchChar, branchKr: BRANCHES_KR[bi],
      stemEl: STEM_EL_CHAR[si], branchEl: BR_EL_CHAR[bi],
      stemElEn: STEM_EL_EN[si], branchElEn: BR_EL_EN[bi],
      branchAnimalEmoji: BR_ANIMAL_EMOJI[bi],
    };
  };

  const yp = parsePillar(baZi.getYear());
  const mp = parsePillar(baZi.getMonth());
  const dp = parsePillar(baZi.getDay());
  const hp = parsePillar(baZi.getTime());

  const dsi = STEMS.indexOf(dp.stem) !== -1 ? STEMS.indexOf(dp.stem) : 0;

  const elements: Record<ElementEn, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  [yp, mp, dp, hp].forEach(p => {
    elements[p.stemElEn]++;
    elements[p.branchElEn]++;
  });

  const entries = Object.entries(elements) as [ElementEn, number][];
  const dominantElement = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
  const lackingElement = entries.reduce((a, b) => b[1] < a[1] ? b : a)[0];

  return {
    year: yp, month: mp, day: dp, hour: hp,
    elements, dominantElement, lackingElement,
    dayMasterIndex: dsi, isLunar
  };
}

// ─────────────────────────────────────────────────────────────────
// ── Main: generateKoreanIdentity ─────────────────────────────────
// ─────────────────────────────────────────────────────────────────
export function generateKoreanIdentity(
  saju: SajuData,
  gender: 'male' | 'female',
  originalName: string
): KoreanIdentity {
  const { lackingElement, dominantElement, dayMasterIndex } = saju;

  // Deterministic seed from name
  const seed = originalName.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0);

  // Surname selection
  const surnameEntry = SURNAMES[seed % SURNAMES.length];

  // Given name selection
  const namePool = GIVEN_NAME_DB[lackingElement][gender];
  const givenEntry = namePool[seed % namePool.length];

  const fullName = surnameEntry.char + givenEntry.given;
  const fullNameRomanized = givenEntry.romanized + ' ' + surnameEntry.romanized;
  const combinedMeaning = `${givenEntry.meaning} (성씨 '${surnameEntry.char}': ${surnameEntry.meaning})`;

  const soulmatePool = SOULMATE_DB[lackingElement][gender === 'male' ? 'female' : 'male'];
  const soulmate = soulmatePool[(seed + dayMasterIndex) % soulmatePool.length];

  const career = CAREER_MAP[dayMasterIndex];
  const neighborhood = NEIGHBORHOOD_MAP[dominantElement];
  const personality = PERSONALITIES[dayMasterIndex];

  const total = Object.values(saju.elements).reduce((acc, curr) => acc + curr, 0) || 8;
  const elementRadar: RadarDataPoint[] = [
    { element: '木', elementKr: '목 · Wood', value: Math.round((saju.elements.wood / total) * 100), fullMark: 100 },
    { element: '火', elementKr: '화 · Fire', value: Math.round((saju.elements.fire / total) * 100), fullMark: 100 },
    { element: '土', elementKr: '토 · Earth', value: Math.round((saju.elements.earth / total) * 100), fullMark: 100 },
    { element: '金', elementKr: '금 · Metal', value: Math.round((saju.elements.metal / total) * 100), fullMark: 100 },
    { element: '水', elementKr: '수 · Water', value: Math.round((saju.elements.water / total) * 100), fullMark: 100 },
  ];

  return {
    surname: surnameEntry.char,
    givenName: givenEntry.given,
    fullName: fullName,
    fullNameRomanized: fullNameRomanized,
    nameMeaning: combinedMeaning,
    career: career.en,
    careerKr: career.kr,
    careerDescription: career.desc,
    personality,
    neighborhood,
    soulmate,
    saju,
    elementRadar,
  };
}

// ─────────────────────────────────────────────────────────────────
// ── Utility: element display helpers ─────────────────────────────
// ─────────────────────────────────────────────────────────────────
export const ELEMENT_LABELS: Record<ElementEn, { char: string; kr: string; color: string }> = {
  wood: { char: '木', kr: '목', color: '#4ade80' },
  fire: { char: '火', kr: '화', color: '#fb923c' },
  earth: { char: '土', kr: '토', color: '#fbbf24' },
  metal: { char: '金', kr: '금', color: '#e2e8f0' },
  water: { char: '水', kr: '수', color: '#60a5fa' },
};
