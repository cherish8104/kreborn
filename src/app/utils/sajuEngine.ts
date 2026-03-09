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

// ── Career by Day Master (일간) — 3 options each, seed-selected ──
const CAREER_MAP = [
  [ // 甲(0)
    { en: 'Creative Director', kr: '크리에이티브 디렉터', desc: '甲木의 개척 정신으로, 당신은 스튜디오와 문화 브랜드를 이끄는 리더로 태어났습니다. 타인이 보지 못하는 미래를 먼저 보는 비저너리. Korea\'s creative scene was waiting for you.' },
    { en: 'Startup Founder', kr: '스타트업 창업자', desc: '甲木의 돌파력으로 아무도 가지 않은 길을 개척하는 당신. 서울의 스타트업 씬은 당신의 리스크 감수력과 비전이 세상을 바꿀 무대입니다.' },
    { en: 'Film & Content Director', kr: '영화감독 / 콘텐츠 디렉터', desc: '甲木처럼 수직으로 성장하는 당신의 스토리텔링. 스크린 위에 세계를 창조하고, 한국 콘텐츠의 글로벌 무대를 이끄는 크리에이터.' },
  ],
  [ // 乙(1)
    { en: 'Artist & Florist', kr: '아티스트 / 플로리스트', desc: '乙木처럼 유연하고 아름다운 당신. 한국의 예술계와 플로럴 인더스트리는 당신의 섬세한 터치로 꽃피울 것입니다. Adaptability is your superpower.' },
    { en: 'Fashion Designer', kr: '패션 디자이너', desc: '乙木의 유연함과 미적 감각으로 계절마다 새로운 언어를 만드는 당신. K-패션의 글로벌 무대에서 당신의 이름이 트렌드가 됩니다.' },
    { en: 'Interior Designer', kr: '인테리어 디자이너', desc: '乙木처럼 공간의 결을 읽고 생명을 불어넣는 당신. 서울의 럭셔리 레지던스와 감성 상업 공간은 당신의 손을 기다리고 있습니다.' },
  ],
  [ // 丙(2)
    { en: 'Media Personality', kr: '방송인 / 마케터', desc: '丙火의 카리스마로 스크린을 밝히는 당신. 방송인, 브랜드 스트래티지스트로서 대중의 마음을 움직이는 따뜻한 힘을 가졌습니다.' },
    { en: 'Actor & Entertainer', kr: '배우 / 엔터테이너', desc: '丙火처럼 무대 위에서 빛나는 당신. 한국 엔터테인먼트의 글로벌 확장 속에서, 당신의 존재감은 스크린을 넘어 세계를 사로잡습니다.' },
    { en: 'Brand Strategist', kr: '브랜드 스트래티지스트', desc: '丙火의 영향력으로 브랜드에 영혼을 불어넣는 당신. 소비자의 감정을 움직이는 이야기를 설계하고, 시장을 이끄는 전략가.' },
  ],
  [ // 丁(3)
    { en: 'Beauty Artist & Designer', kr: '뷰티 아티스트 / 디자이너', desc: '丁火의 집중된 예술혼. 한국의 K-뷰티 산업은 당신의 정밀한 미적 감각을 위해 존재합니다. Refinement is your medium.' },
    { en: 'Perfumer & Sensory Artist', kr: '조향사 / 감각 아티스트', desc: '丁火의 섬세하고 집중된 불꽃처럼, 당신은 보이지 않는 감각을 작품으로 만듭니다. 향기와 음악, 미각으로 세상에 깊은 인상을 남깁니다.' },
    { en: 'Curator & Art Director', kr: '큐레이터 / 아트 디렉터', desc: '丁火의 예리한 심미안으로 세상의 아름다움을 선별하고 편집하는 당신. 갤러리와 문화 기관에서 시대의 취향을 정의하는 사람.' },
  ],
  [ // 戊(4)
    { en: 'Architect & Entrepreneur', kr: '건축가 / 사업가', desc: '戊土, 산처럼 웅장하고 흔들리지 않는 당신. 서울의 스카이라인을 바꿀 건물, 세대를 이어갈 기업을 세울 운명입니다.' },
    { en: 'Real Estate Developer', kr: '부동산 개발자', desc: '戊土의 대지처럼 공간을 소유하고 가치를 창조하는 당신. 서울의 랜드마크 프로젝트가 당신의 이름을 도시에 새깁니다.' },
    { en: 'Product Designer', kr: '프로덕트 디자이너', desc: '戊土의 안정적이고 묵직한 에너지로 세상에 필요한 것을 만드는 당신. 수백만 명이 매일 사용할 제품의 근본적인 경험을 설계합니다.' },
  ],
  [ // 己(5)
    { en: 'Educator & Counselor', kr: '교육자 / 상담사', desc: '己土, 비옥한 토지처럼 사람을 키우는 당신. 교실에서, 코칭에서, 상담실에서 — 당신이 닿은 곳마다 성장이 일어납니다.' },
    { en: 'Life Coach & Wellness Expert', kr: '라이프코치 / 웰니스 전문가', desc: '己土의 포용력으로 사람들의 삶을 변화시키는 당신. 한국의 웰니스 시장에서 심신의 균형을 이끄는 가이드로 빛납니다.' },
    { en: 'Social Entrepreneur', kr: '소셜 앙트레프레너', desc: '己土의 공감과 실용성을 겸비한 당신. 이익과 사회적 가치를 동시에 추구하는 비즈니스로 세상을 더 나은 곳으로 만드는 사람.' },
  ],
  [ // 庚(6)
    { en: 'Legal Expert & Finance', kr: '법조인 / 금융 전문가', desc: '庚金, 단련된 강철. 한국의 최고 로펌과 금융기관은 당신의 날카로운 판단력과 흔들리지 않는 원칙을 기다립니다.' },
    { en: 'Management Consultant', kr: '경영 컨설턴트', desc: '庚金의 분석력과 결단력으로 기업의 문제를 날카롭게 진단하는 당신. 글로벌 컨설팅 펌에서 당신의 조언은 시장의 방향을 바꿉니다.' },
    { en: 'Investment Strategist', kr: '투자 전략가', desc: '庚金처럼 시장의 노이즈를 걷어내고 본질적 가치를 보는 당신. 서울 금융시장의 중심에서 냉정하고 정확한 판단으로 승리합니다.' },
  ],
  [ // 辛(7)
    { en: 'Doctor & Jewelry Designer', kr: '의사 / 주얼리 디자이너', desc: '辛金, 연마된 보석. 몸을 치유하거나 착용 가능한 예술을 창조하거나 — 당신은 과학과 아름다움의 교차점에서 일합니다.' },
    { en: 'Aesthetic Surgeon', kr: '성형외과 전문의', desc: '辛金의 정밀함과 미적 감각이 만나는 곳. 한국이 세계에 자랑하는 성형 의학의 최전선에서, 당신의 손은 예술 그 자체입니다.' },
    { en: 'Pharmaceutical Researcher', kr: '제약 연구자', desc: '辛金의 섬세하고 끈질긴 탐구 정신으로 생명의 비밀을 파고드는 당신. 한국 바이오 산업의 돌파구를 만드는 과학자.' },
  ],
  [ // 壬(8)
    { en: 'IT Developer & Author', kr: 'IT 개발자 / 작가', desc: '壬水, 끝없이 흐르는 지성. 한국의 테크 씬 또는 독자의 내면을 흔드는 소설. 깊이가 당신의 언어입니다.' },
    { en: 'Music Producer', kr: '음악 프로듀서', desc: '壬水처럼 경계 없이 흐르는 당신의 음악적 상상력. K-POP과 글로벌 음악 씬의 교차점에서, 당신의 비트는 세계를 움직입니다.' },
    { en: 'Creative Technologist', kr: '크리에이티브 테크놀로지스트', desc: '壬水의 유동적 지성으로 기술과 예술의 경계를 허무는 당신. AI, 인터랙티브 미디어, 몰입형 경험의 최전선에서 미래를 만듭니다.' },
  ],
  [ // 癸(9)
    { en: 'Researcher & Philosopher', kr: '연구자 / 철학자', desc: '癸水, 고요하고 깊은 호수. 학계의 브레이크스루, 또는 한국이 생각하는 방식을 바꿀 철학적 사유. 통찰이 당신의 소명입니다.' },
    { en: 'Data Scientist', kr: '데이터 사이언티스트', desc: '癸水의 깊은 직관과 분석력으로 데이터의 심연에서 의미를 건져올리는 당신. 한국 IT 산업의 미래를 숫자로 설계하는 사람.' },
    { en: 'Psychiatrist', kr: '정신과 전문의 / 심층 심리학자', desc: '癸水처럼 인간의 무의식 깊숙이 흘러드는 당신. 마음의 가장 어두운 곳에 빛을 비추며, 사람들이 자신의 깊이와 화해하도록 돕습니다.' },
  ],
];

// ── Neighborhoods by dominant element — 3 options each, seed-selected ──
export const NEIGHBORHOOD_MAP: Record<ElementEn, NeighborhoodInfo[]> = {
  wood: [
    {
      name: 'Hongdae', nameKr: '홍대 · 홍익대학교 앞',
      description: '한국 청년 문화와 창조성의 심장. 벽화, 독립 갤러리, 라이브 뮤직, 아방가르드 카페 속에서 당신의 木 기운이 자유롭게 피어납니다.',
      vibe: 'Creative · Free-spirited · Bohemian',
    },
    {
      name: 'Seongsu-dong', nameKr: '성수동 · 서울의 브루클린',
      description: '낡은 공장이 갤러리와 브랜드 쇼룸으로 재탄생한 서울의 브루클린. 당신의 木 기운처럼 낡은 것 위에서 새로운 생명이 움트는 이 동네는 창조적 재생의 상징입니다.',
      vibe: 'Regenerative · Trend-setting · Industrial-chic',
    },
    {
      name: 'Sinchon', nameKr: '신촌 · 대학로',
      description: '젊음과 지성이 만나는 곳. 대학가의 자유로운 토론, 소극장, 독립서점이 어우러진 신촌에서 당신의 木 에너지는 지식과 예술로 무한히 뻗어 나갑니다.',
      vibe: 'Youthful · Intellectual · Avant-garde',
    },
  ],
  fire: [
    {
      name: 'Gangnam', nameKr: '강남구 · 압구정 로데오',
      description: '야망이 럭셔리를 만나는 곳. 미슐랭 레스토랑, 글로벌 패션 하우스, 파워 코리더가 즐비한 이 ZIP 코드는 당신의 火 에너지가 사령탑에 앉을 자리입니다.',
      vibe: 'Dynamic · Prestigious · High-achieving',
    },
    {
      name: 'Cheongdam-dong', nameKr: '청담동 · 럭셔리 코리아',
      description: '한국 럭셔리의 최정점. 세계 최고 패션 하우스의 플래그십이 즐비한 청담에서 당신의 火 기운은 최고의 무대 위에서 타오릅니다.',
      vibe: 'Ultra-luxury · Aspirational · Power-forward',
    },
    {
      name: 'Yeouido', nameKr: '여의도 · 서울의 맨해튼',
      description: '한국 금융과 방송이 집결한 파워 허브. IFC, 국회, 주요 방송사가 집중된 여의도에서 당신의 火 에너지는 영향력의 진원지가 됩니다.',
      vibe: 'Powerful · Ambitious · Center-stage',
    },
  ],
  earth: [
    {
      name: 'Bukchon', nameKr: '북촌 한옥마을',
      description: '600년 된 한옥과 궁궐 사이에 보존된 세계. 전통이 살아있는 예술인 이 동네에서 당신의 土 기운은 가장 깊은 울림을 찾습니다.',
      vibe: 'Grounded · Traditional · Serene',
    },
    {
      name: 'Insadong', nameKr: '인사동 · 전통문화의 거리',
      description: '고미술상, 전통 찻집, 장인 공방이 늘어선 인사동. 한국 전통문화의 살아있는 아카이브 속에서 당신의 土 기운은 뿌리와 정체성의 의미를 찾습니다.',
      vibe: 'Culturally Rich · Artisanal · Time-honoured',
    },
    {
      name: 'Jongno', nameKr: '종로 · 역사의 심장',
      description: '조선의 도읍지부터 현대 서울까지, 수백 년의 역사가 켜켜이 쌓인 종로. 당신의 土 에너지는 이 깊은 대지 위에서 가장 단단한 뿌리를 내립니다.',
      vibe: 'Historic · Rooted · Enduring',
    },
  ],
  metal: [
    {
      name: 'Hannam-dong', nameKr: '한남동',
      description: '교양 있는 엘리트들의 가장 탐나는 주소. 컨셉 스토어, 프라이빗 아트 갤러리, 쉐프\'s 테이블 레스토랑이 자리한 이곳은 당신의 金 기운이 완전히 빛나는 무대입니다.',
      vibe: 'Refined · Exclusive · Understated luxury',
    },
    {
      name: 'Seocho', nameKr: '서초동 · 반포',
      description: '대한민국 법조계와 전문직 엘리트의 주소. 가로수길의 세련됨과 반포의 고급 주거가 교차하는 이곳에서 당신의 金 기운은 완벽한 질서 속에 빛납니다.',
      vibe: 'Professional · Meticulous · Prestigious',
    },
    {
      name: 'Pyeongchang-dong', nameKr: '평창동 · 예술가의 마을',
      description: '북한산을 배경으로 미술관, 컬렉터의 저택, 조각공원이 자리한 평창동. 당신의 金 기운은 이 조용하고 유일한 동네에서 가장 순수하게 연마됩니다.',
      vibe: 'Artistic · Exclusive · Contemplative',
    },
  ],
  water: [
    {
      name: 'Mapo-gu', nameKr: '마포구 · 연남동',
      description: '한강변을 따라 독립 출판사, 스페셜티 커피 로스터, 언더그라운드 뮤직이 흐르는 마포. 당신의 水 에너지는 이 고유한 전류 속에서 가장 자유롭게 흐릅니다.',
      vibe: 'Intellectual · Artistic · Fluid',
    },
    {
      name: 'Euljiro', nameKr: '을지로 · 힙지로',
      description: '인쇄소와 철물상 골목 사이로 모던 바와 크리에이티브 스튜디오가 스며든 을지로. 당신의 水 기운은 이 오래된 도시의 지하 물줄기처럼 은밀하고 강렬하게 흐릅니다.',
      vibe: 'Underground · Subversive · Deeply Creative',
    },
    {
      name: 'Haebangchon', nameKr: '해방촌 · 녹사평',
      description: '남산 아래 언덕에 자리한 국제적이고 보헤미안한 동네. 다양한 문화가 뒤섞인 이 거리에서 당신의 水 에너지는 경계를 녹이고 자유롭게 흘러 다닙니다.',
      vibe: 'Cosmopolitan · Free-flowing · Boundary-less',
    },
  ],
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


// ── Soulmate Database — 3 options each, seed-selected ────────────
export const SOULMATE_DB: Record<ElementEn, { female: SoulmateProfile[]; male: SoulmateProfile[] }> = {
  wood: {
    female: [
      { name: '이서진', nameRomanized: 'Seo-jin Lee', trait1: 'Meticulous & Principled', trait2: 'Quietly Confident', trait3: 'Appreciates Depth', description: '庚金의 에너지. 당신의 광대한 木 에너지를 단단하게 잡아주는 구조와 결단력의 명료함을 지닌 사람. 당신이 자유롭게 뻗어 나가는 곳에서, 그녀는 당신에게 우아한 형태를 부여합니다.', compatibilityScore: 94 },
      { name: '한수아', nameRomanized: 'Su-a Han', trait1: 'Deeply Intuitive', trait2: 'Philosophically Calm', trait3: 'Boundlessly Curious', description: '壬水의 에너지. 물이 나무를 키우듯, 그녀의 깊은 지성이 당신의 성장을 조용히 뒷받침합니다. 당신의 행동력과 그녀의 통찰이 만나는 곳에서 둘 다 가장 빛납니다.', compatibilityScore: 90 },
      { name: '김나영', nameRomanized: 'Na-young Kim', trait1: 'Warmly Passionate', trait2: 'Creatively Bold', trait3: 'Energetically Alive', description: '丁火의 에너지. 당신이 나무라면, 그녀는 당신 안에서 타오르는 불꽃. 두 사람이 함께할 때 木火가 상생하며, 세상이 감지할 수 있는 에너지를 발산합니다.', compatibilityScore: 87 },
    ],
    male: [
      { name: '강재우', nameRomanized: 'Jae-woo Kang', trait1: 'Decisive & Structured', trait2: 'Quietly Ambitious', trait3: 'Understated Elegance', description: '庚金의 에너지. 당신의 광범위한 비전에 아름다운 형태를 부여하는 정확하고 흔들리지 않는 신념을 가진 사람. 당신이 자유롭게 상상하는 곳에서, 그는 흠잡을 데 없이 실행합니다.', compatibilityScore: 94 },
      { name: '정민호', nameRomanized: 'Min-ho Jung', trait1: 'Quietly Vast', trait2: 'Intellectually Deep', trait3: 'Endlessly Patient', description: '癸水의 에너지. 고요한 호수처럼 당신의 성장을 묵묵히 받쳐주는 사람. 그의 깊은 내면은 당신의 에너지가 방향을 찾을 때 언제나 맑은 거울이 되어줍니다.', compatibilityScore: 89 },
      { name: '박도훈', nameRomanized: 'Do-hun Park', trait1: 'Charismatically Radiant', trait2: 'Boldly Inspiring', trait3: 'Energetically Generous', description: '丙火의 에너지. 당신의 개척 정신에 빛나는 무대를 선사하는 사람. 나무가 불을 키우듯, 두 사람의 상승 에너지는 서로를 더 넓은 세계로 이끕니다.', compatibilityScore: 86 },
    ],
  },
  fire: {
    female: [
      { name: '박수현', nameRomanized: 'Su-hyeon Park', trait1: 'Deeply Calm', trait2: 'Intellectually Vast', trait3: 'Emotionally Intuitive', description: '壬水의 에너지. 당신의 찬란한 불꽃을 식히고 집중시키는 고요한 지성으로 흐르는 사람. 당신의 열정은 그녀의 반영을 통해 깊이를 찾고, 그녀의 고요한 물은 당신의 따뜻함 안에서 색깔을 찾습니다.', compatibilityScore: 91 },
      { name: '윤서영', nameRomanized: 'Seo-young Yun', trait1: 'Grounded & Steady', trait2: 'Warmly Nurturing', trait3: 'Quietly Supportive', description: '己土의 에너지. 당신의 火 기운을 흡수하고 길러주는 비옥한 대지. 당신의 강렬한 에너지가 그녀의 안정 속에서 지속 가능한 불꽃으로 타오릅니다.', compatibilityScore: 88 },
      { name: '이채원', nameRomanized: 'Chae-won Lee', trait1: 'Creatively Alive', trait2: 'Passionately Bold', trait3: 'Fearlessly Expressive', description: '甲木의 에너지. 당신의 불꽃을 더욱 크게 키우는 나무. 두 사람의 火木 상생이 만드는 창의적 에너지는 주변 모든 것에 활기를 불어넣습니다.', compatibilityScore: 85 },
    ],
    male: [
      { name: '김민우', nameRomanized: 'Min-woo Kim', trait1: 'Introspective & Wise', trait2: 'Deeply Calm', trait3: 'Intellectually Boundless', description: '壬水의 에너지. 당신의 불꽃이 필요로 하면서도 저항하는 깊은 고요함을 지닌 사람. 그의 존재 안에서 당신의 열정은 철학적 토대를 찾고, 그의 광대한 지성은 따뜻함을 찾습니다.', compatibilityScore: 91 },
      { name: '조태양', nameRomanized: 'Tae-yang Jo', trait1: 'Solidly Present', trait2: 'Generously Patient', trait3: 'Enduringly Loyal', description: '戊土의 에너지. 당신의 거센 火 에너지가 아무리 타올라도 흔들리지 않는 산. 그의 든든함이 당신의 열정에 방향과 지속성을 부여합니다.', compatibilityScore: 87 },
      { name: '최준혁', nameRomanized: 'Jun-hyuk Choi', trait1: 'Boldly Visionary', trait2: 'Energetically Alive', trait3: 'Inspiring & Growth-oriented', description: '甲木의 에너지. 당신이 더 높이 타오를 수 있도록 연료를 공급하는 나무. 두 사람이 함께하면 서로의 불꽃과 성장 에너지가 맞물려 멈출 수 없는 추진력이 됩니다.', compatibilityScore: 85 },
    ],
  },
  earth: {
    female: [
      { name: '최가은', nameRomanized: 'Ka-eun Choi', trait1: 'Imaginative & Free', trait2: 'Spontaneously Warm', trait3: 'Creatively Fearless', description: '甲木의 에너지. 당신의 깊이 뿌리내린 패턴에서 당신을 깨워내는 창의적 불안과 개척 정신을 가진 사람. 당신의 안정이 그녀의 탁월한 아이디어가 꽃피울 토양이 됩니다.', compatibilityScore: 89 },
      { name: '서민아', nameRomanized: 'Min-a Seo', trait1: 'Brilliantly Sharp', trait2: 'Quietly Precise', trait3: 'Elegantly Focused', description: '辛金의 에너지. 당신의 土 기운이 만들어내는 것을 더욱 빛나게 연마하는 사람. 토지가 금을 품듯, 당신의 안정 속에서 그녀의 섬세한 능력이 가장 순수하게 발현됩니다.', compatibilityScore: 86 },
      { name: '장하린', nameRomanized: 'Ha-rin Jang', trait1: 'Radiantly Warm', trait2: 'Passionately Expressive', trait3: 'Naturally Magnetic', description: '丙火의 에너지. 당신의 대지에 빛을 내리쬐어 생명을 키우는 태양. 그녀의 따뜻한 에너지가 당신의 土 기운과 만나 모든 것이 자라나는 풍요로운 환경을 만듭니다.', compatibilityScore: 84 },
    ],
    male: [
      { name: '이지훈', nameRomanized: 'Ji-hun Lee', trait1: 'Creatively Visionary', trait2: 'Boldly Original', trait3: 'Restlessly Alive', description: '甲木의 에너지. 당신의 안정적인 Earth가 열망하면서도 두려워하는 창의적 불과 개척 정신을 가진 사람. 당신은 그에게 절실히 필요한 기반을 주고, 그는 당신에게 진정한 성장만이 제공할 수 있는 방향을 줍니다.', compatibilityScore: 89 },
      { name: '임재원', nameRomanized: 'Jae-won Lim', trait1: 'Precisely Brilliant', trait2: 'Artfully Refined', trait3: 'Quietly Powerful', description: '庚金의 에너지. 당신이 쌓아 올린 것 위에서 빛나는 금속. 土生金의 이치처럼, 당신의 견고한 토대가 그의 탁월한 능력을 세상에 드러나게 합니다.', compatibilityScore: 86 },
      { name: '한도윤', nameRomanized: 'Do-yun Han', trait1: 'Warmly Charismatic', trait2: 'Inspiringly Radiant', trait3: 'Generously Energetic', description: '丁火의 에너지. 당신의 大地를 따뜻하게 데워주는 집중된 불꽃. 그의 정제된 열정이 당신의 土 에너지와 공명하며, 둘 다 가장 풍요로운 형태로 꽃피우게 합니다.', compatibilityScore: 83 },
    ],
  },
  metal: {
    female: [
      { name: '정나은', nameRomanized: 'Na-eun Jung', trait1: 'Warmly Intuitive', trait2: 'Brilliantly Charismatic', trait3: 'Emotionally Generous', description: '丁火의 에너지. 당신의 金 빛남을 최고의 광채로 연마하는 부드럽고 찬란한 따뜻함을 가진 사람. 당신의 정밀함이 그녀의 빛 속에서 빛나게 되고, 그녀의 불꽃은 당신의 정제된 형태에서 완벽한 용기를 찾습니다.', compatibilityScore: 96 },
      { name: '오하은', nameRomanized: 'Ha-eun Oh', trait1: 'Fluidly Intelligent', trait2: 'Quietly Perceptive', trait3: 'Deeply Adaptive', description: '壬水의 에너지. 金生水의 이치처럼, 당신의 정밀한 金 기운이 그녀의 깊고 유연한 지성을 낳습니다. 그녀의 부드러운 흐름이 당신의 날카로움을 더욱 빛나게 합니다.', compatibilityScore: 91 },
      { name: '배서윤', nameRomanized: 'Seo-yun Bae', trait1: 'Steadily Grounded', trait2: 'Artfully Nurturing', trait3: 'Patiently Strong', description: '己土의 에너지. 土生金의 이치처럼, 당신의 金 기운을 탄생시킨 대지. 그녀의 포용적인 안정감이 당신이 가장 순수하게 빛나는 환경을 만들어줍니다.', compatibilityScore: 88 },
    ],
    male: [
      { name: '박도현', nameRomanized: 'Do-hyeon Park', trait1: 'Deeply Passionate', trait2: 'Radiantly Warm', trait3: 'Charismatically Alive', description: '丙火의 에너지. 당신의 金 에너지를 진정한 빛남으로 정제하는 강력한 힘. 당신이 정밀함에서 완벽을 추구하는 곳에서, 그는 진정한 연결의 원초적 힘에서 그것을 찾습니다.', compatibilityScore: 96 },
      { name: '신현준', nameRomanized: 'Hyun-jun Shin', trait1: 'Intellectually Fluid', trait2: 'Boundlessly Curious', trait3: 'Creatively Flowing', description: '癸水의 에너지. 당신의 金 기운이 만들어낸 고요하고 깊은 물. 그의 통찰력 있는 사색이 당신의 날카로운 세계에 부드러운 깊이와 의미를 더합니다.', compatibilityScore: 90 },
      { name: '황태준', nameRomanized: 'Tae-jun Hwang', trait1: 'Solidly Dependable', trait2: 'Warmly Generous', trait3: 'Quietly Powerful', description: '戊土의 에너지. 당신이 존재할 수 있는 토대를 제공하는 산. 그의 흔들리지 않는 지지와 견고한 가치관이 당신의 金 기운을 더욱 선명하게 빛나게 합니다.', compatibilityScore: 87 },
    ],
  },
  water: {
    female: [
      { name: '조하영', nameRomanized: 'Ha-young Jo', trait1: 'Steady & Reliable', trait2: 'Grounded in Tradition', trait3: 'Profoundly Patient', description: '己土의 에너지. 당신의 흐르는 水 본성에 아름다운 정의를 부여하는 강둑. 그녀 없이는 무한한 반영 속에서 자신을 잃을 수 있지만, 그녀와 함께라면 당신의 깊이는 심연이 아닌 목적지가 됩니다.', compatibilityScore: 88 },
      { name: '권지안', nameRomanized: 'Ji-an Kwon', trait1: 'Precisely Refined', trait2: 'Quietly Brilliant', trait3: 'Elegantly Perceptive', description: '辛金의 에너지. 金生水의 이치처럼, 그녀의 연마된 예리함이 당신 안으로 흘러들어옵니다. 그녀의 섬세한 눈이 당신의 깊이에서 세상이 보지 못하는 보석을 발견합니다.', compatibilityScore: 92 },
      { name: '문서아', nameRomanized: 'Seo-a Moon', trait1: 'Deeply Intuitive', trait2: 'Quietly Powerful', trait3: 'Philosophically Alive', description: '壬水의 에너지. 두 물줄기가 만나 더 깊은 강을 이루듯, 서로의 깊이와 지성이 공명하는 관계. 둘이 함께할 때 세상 어느 누구도 헤아리지 못할 깊이에 이릅니다.', compatibilityScore: 85 },
    ],
    male: [
      { name: '윤태현', nameRomanized: 'Tae-hyeon Yun', trait1: 'Immovably Grounded', trait2: 'Quietly Strong', trait3: 'Traditionally Rooted', description: '戊土의 에너지. 당신의 Water가 주위를 흐르고, 통과하고, 결국 형성하는 산. 그의 흔들리지 않는 안정성이 당신의 광대한 지성에 필요한 용기를 제공합니다.', compatibilityScore: 88 },
      { name: '손재진', nameRomanized: 'Jae-jin Son', trait1: 'Sharply Insightful', trait2: 'Elegantly Precise', trait3: 'Beautifully Discerning', description: '庚金의 에너지. 金生水처럼, 그의 단련된 명료함이 당신의 깊이를 낳습니다. 그의 날카로운 결단력이 당신의 유동적 사고에 빛나는 방향을 제시합니다.', compatibilityScore: 91 },
      { name: '노민재', nameRomanized: 'Min-jae Noh', trait1: 'Boundlessly Thoughtful', trait2: 'Philosophically Deep', trait3: 'Quietly Visionary', description: '壬水의 에너지. 두 개의 깊은 물이 만나 광활한 바다를 이루듯, 두 사람의 지성과 통찰이 결합될 때 세상이 아직 묻지 못한 질문들에 함께 답합니다.', compatibilityScore: 85 },
    ],
  },
};

// ── Personality by day master — 3 options each, seed-selected ─────
const PERSONALITIES = [
  [ // 甲(0) — Wood, pioneer
    'The Visionary Pioneer — 담대하고 성장 지향적이며, 타인이 보지 못하는 미래를 먼저 보는 타고난 리더.',
    'The Pathfinder — 두려움 없이 새로운 길을 개척하며, 장벽을 기회로 바꾸는 불굴의 의지를 가진 사람.',
    'The Forest Architect — 거대한 비전으로 세상을 재설계하며, 나무가 하늘을 향해 자라듯 끊임없이 위를 향하는 사람.',
  ],
  [ // 乙(1) — Flexible wood
    'The Elegant Adaptor — 세련되고 유연하며, 어떤 환경에서도 뛰어난 사회적 지능으로 읽어내는 사람.',
    'The Graceful Navigator — 역경을 유연하게 흘러가며, 주변 환경과 조화를 이루면서도 자신의 본질을 잃지 않는 사람.',
    'The Subtle Influencer — 직접적인 힘 대신 부드러운 영향력으로 세상을 움직이는, 겉모습 뒤에 강인한 내면을 가진 사람.',
  ],
  [ // 丙(2) — Brilliant fire
    'The Magnetic Illuminator — 카리스마 있고 관대하며, 그저 입장하는 것만으로 모든 공간을 밝히는 사람.',
    'The Solar Charisma — 주위 사람들에게 에너지를 주고 영감을 불어넣는 태양 같은 존재감. 당신이 있는 곳에 활기가 넘칩니다.',
    'The Warm Leader — 사람들을 열정과 진심으로 이끌며, 집단의 사기를 높이고 비전을 현실로 만드는 자연스러운 리더.',
  ],
  [ // 丁(3) — Focused fire
    'The Precise Beautifier — 세부 지향적이고 심미적이며, 날것의 재료를 지속적인 예술로 변환하는 사람.',
    'The Refined Artisan — 완벽함을 추구하며, 평범한 것에서 비범한 아름다움을 발견하고 만들어내는 장인 정신의 소유자.',
    'The Illuminated Creator — 집중된 창의적 에너지로 하나의 분야에서 독보적인 경지에 도달하는 사람.',
  ],
  [ // 戊(4) — Mountain earth
    'The Immovable Mountain — 원칙적이고 전략적이며, 트렌드를 초월하는 구조와 제국을 건설하는 사람.',
    'The Foundation Builder — 견고한 토대 위에 장기적인 유산을 세우며, 흔들리지 않는 신뢰감으로 주변을 이끄는 사람.',
    'The Strategic Anchor — 혼란 속에서도 중심을 잡고, 조직과 관계에서 없어서는 안 될 안정의 축이 되는 사람.',
  ],
  [ // 己(5) — Fertile earth
    'The Nurturing Harvester — 인내심 있고 공감적이며, 사람과 아이디어를 깊은 배려로 키우는 사람.',
    'The Fertile Ground — 타인의 성장을 위한 최적의 환경을 만들고, 모든 관계에서 최선을 이끌어내는 사람.',
    'The Patient Cultivator — 씨앗을 뿌리고 가꾸는 농부처럼, 결과가 보이지 않을 때도 꾸준히 돌보며 기다리는 사람.',
  ],
  [ // 庚(6) — Hard metal
    'The Decisive Edge — 명쾌하고 원칙적이며, 혼란을 뚫고 본질적인 진실을 찾아내는 사람.',
    'The Steel Resolver — 어려운 결단도 망설임 없이 내리며, 가장 복잡한 문제에서도 명확한 해결책을 제시하는 사람.',
    'The Iron Will — 강인한 의지로 장벽을 돌파하며, 단련된 금속처럼 압력 속에서 더욱 강해지는 사람.',
  ],
  [ // 辛(7) — Refined metal
    'The Refined Gemstone — 안목 있고 완벽주의자이며, 손에 닿는 모든 것에 독특한 광채를 가져오는 사람.',
    'The Luminous Perfectionist — 타협 없는 기준으로 자신과 자신의 작업을 끊임없이 연마하여 세상에서 가장 빛나는 존재가 되는 사람.',
    'The Crystalline Mind — 투명하고 정밀한 사고로 복잡한 것들을 명료하게 만들며, 섬세한 아름다움을 알아보는 희귀한 눈을 가진 사람.',
  ],
  [ // 壬(8) — Ocean water
    'The Boundless Ocean — 깊이 지적이고 철학적이며, 대부분이 헤아릴 수 있는 것보다 더 많은 깊이를 가진 사람.',
    'The Infinite Thinker — 지식의 모든 영역을 유영하며, 타인이 상상하지 못하는 연결고리를 발견하는 광대한 지성의 소유자.',
    'The Deep Current — 표면 아래에서 조용히 흐르며, 때가 되면 강력한 영향력으로 세상을 바꾸는 거대한 내적 힘을 가진 사람.',
  ],
  [ // 癸(9) — Still water
    'The Still Lake — 내성적이고 통찰력 있으며, 완벽하게 고요함으로써 타인이 놓치는 명료함을 보는 사람.',
    'The Clear Mirror — 조용한 관찰과 깊은 성찰로 세상의 진실을 반영하며, 진정한 지혜를 나누는 사람.',
    'The Quiet Sage — 말이 적지만 한마디 한마디에 깊이가 있으며, 오랜 내면의 수련으로 평범함 속에서 비범함을 보는 사람.',
  ],
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

  // Deterministic seed from name + saju pillars
  const sajuKey = saju.year.stem + saju.year.branch + saju.month.branch + saju.day.stem;
  const seed = (originalName + sajuKey).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0);

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

  const careerPool = CAREER_MAP[dayMasterIndex];
  const career = careerPool[seed % careerPool.length];
  const neighborhoodPool = NEIGHBORHOOD_MAP[dominantElement];
  const neighborhood = neighborhoodPool[seed % neighborhoodPool.length];
  const personalityPool = PERSONALITIES[dayMasterIndex];
  const personality = personalityPool[seed % personalityPool.length];

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
