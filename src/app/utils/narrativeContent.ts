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

// ── Zodiac (띠) ───────────────────────────────────────────────────
export const ZODIAC_MAP: Record<string, ZodiacInfo> = {
  '子': { animal:'Rat',    kr:'쥐',     emoji:'🐀', trait:'지혜롭고 민첩한 쥐띠. 재주가 많고 적응력이 뛰어나다.' },
  '丑': { animal:'Ox',     kr:'소',     emoji:'🐂', trait:'성실하고 인내력 강한 소띠. 묵묵히 노력해 큰 성과를 만든다.' },
  '寅': { animal:'Tiger',  kr:'호랑이', emoji:'🐅', trait:'용맹하고 카리스마 넘치는 호랑이띠. 타고난 리더십의 소유자.' },
  '卯': { animal:'Rabbit', kr:'토끼',   emoji:'🐇', trait:'우아하고 섬세한 토끼띠. 평화를 사랑하고 창의력이 풍부하다.' },
  '辰': { animal:'Dragon', kr:'용',     emoji:'🐉', trait:'강인하고 이상적인 용띠. 12지지 중 가장 길한 기운을 타고난다.' },
  '巳': { animal:'Snake',  kr:'뱀',     emoji:'🐍', trait:'심오하고 직관적인 뱀띠. 지혜와 통찰력으로 진실을 꿰뚫는다.' },
  '午': { animal:'Horse',  kr:'말',     emoji:'🐴', trait:'자유롭고 열정적인 말띠. 불꽃처럼 타오르는 에너지의 소유자.' },
  '未': { animal:'Goat',   kr:'양',     emoji:'🐑', trait:'온화하고 예술적인 양띠. 창의력과 공감능력이 뛰어나다.' },
  '申': { animal:'Monkey', kr:'원숭이', emoji:'🐒', trait:'영리하고 다재다능한 원숭이띠. 문제 해결의 달인.' },
  '酉': { animal:'Rooster',kr:'닭',     emoji:'🐓', trait:'부지런하고 완벽주의적인 닭띠. 날카로운 관찰력의 소유자.' },
  '戌': { animal:'Dog',    kr:'개',     emoji:'🐕', trait:'충직하고 정의로운 개띠. 신뢰와 성실함이 인생의 무기다.' },
  '亥': { animal:'Pig',    kr:'돼지',   emoji:'🐗', trait:'넉넉하고 순박한 돼지띠. 복이 많고 사람들에게 사랑받는다.' },
};

// ── Day Master 일주론 심층 데이터 ────────────────────────────────
export const DAY_MASTER_DEEP: Record<number, DayMasterDeep> = {
  0: { title:'甲木 일간', hanja:'甲', nature:'大樹',
       strength:['선구자적 리더십','불굴의 의지','창의적 비전'],
       caution:['독단적 결정','융통성 부족'],
       koreanStyle:'서울 성수동 브루어리 CEO',
       luckyColor:'초록', luckyColorHex:'#4ade80', luckyNumber:3 },
  1: { title:'乙木 일간', hanja:'乙', nature:'草花',
       strength:['섬세한 감수성','유연한 적응력','예술적 감각'],
       caution:['우유부단함','의존성'],
       koreanStyle:'홍대 앞 갤러리 운영자',
       luckyColor:'연두', luckyColorHex:'#86efac', luckyNumber:8 },
  2: { title:'丙火 일간', hanja:'丙', nature:'太陽',
       strength:['밝고 활발한 에너지','강한 표현력','리더십'],
       caution:['충동적 결정','지속성 부족'],
       koreanStyle:'MBC 간판 앵커',
       luckyColor:'주황', luckyColorHex:'#fb923c', luckyNumber:7 },
  3: { title:'丁火 일간', hanja:'丁', nature:'燈火',
       strength:['집중력','완벽주의','따뜻한 카리스마'],
       caution:['과도한 완벽주의','번아웃'],
       koreanStyle:'K-뷰티 브랜드 크리에이티브 디렉터',
       luckyColor:'빨강', luckyColorHex:'#f87171', luckyNumber:2 },
  4: { title:'戊土 일간', hanja:'戊', nature:'高山',
       strength:['흔들리지 않는 의지','장기적 사고','신뢰감'],
       caution:['변화에 대한 저항','경직성'],
       koreanStyle:'삼성전자 임원급 전략가',
       luckyColor:'황토', luckyColorHex:'#fbbf24', luckyNumber:5 },
  5: { title:'己土 일간', hanja:'己', nature:'田土',
       strength:['섬세한 포용력','배려심','꾸준한 성장'],
       caution:['과잉 배려','자기희생'],
       koreanStyle:'서울대 교육학과 교수',
       luckyColor:'노랑', luckyColorHex:'#fde68a', luckyNumber:0 },
  6: { title:'庚金 일간', hanja:'庚', nature:'利劍',
       strength:['정의감','결단력','날카로운 분석력'],
       caution:['냉정함','강압적 태도'],
       koreanStyle:'김앤장 법률사무소 변호사',
       luckyColor:'흰색', luckyColorHex:'#e2e8f0', luckyNumber:4 },
  7: { title:'辛金 일간', hanja:'辛', nature:'珠玉',
       strength:['완벽한 미적 감각','정밀함','귀족적 품위'],
       caution:['예민함','비판적 성향'],
       koreanStyle:'강남 성형외과 원장 겸 주얼리 작가',
       luckyColor:'은색', luckyColorHex:'#cbd5e1', luckyNumber:9 },
  8: { title:'壬水 일간', hanja:'壬', nature:'大海',
       strength:['광대한 지적 호기심','유연한 사고','철학적 깊이'],
       caution:['방향성 상실','집중력 분산'],
       koreanStyle:'네이버 AI 연구소 시니어 엔지니어',
       luckyColor:'파랑', luckyColorHex:'#60a5fa', luckyNumber:1 },
  9: { title:'癸水 일간', hanja:'癸', nature:'雨露',
       strength:['섬세한 직관','통찰력','내면의 깊이'],
       caution:['과도한 내성적 성향','불안감'],
       koreanStyle:'KAIST 뇌과학 연구자',
       luckyColor:'남색', luckyColorHex:'#818cf8', luckyNumber:6 },
};

// ── 한국 생활 시나리오 ────────────────────────────────────────────
export const DAILY_SCENARIOS: Record<number, DailyScenario> = {
  0: { morning:'아메리카노 한 잔 들고 성수동 스튜디오 출근. 팀원들보다 30분 먼저 도착해 하루를 설계한다.',
       afternoon:'브랜드 피칭 미팅. 당신이 말을 시작하는 순간 방 안의 공기가 달라진다.',
       evening:'이태원 루프탑 바에서 동료들과 위스키 한 잔. 아이디어 회의는 새벽 2시에 끝난다.' },
  1: { morning:'익선동 한옥 카페 2층 창가 자리. 핸드드립 커피와 함께 스케치북을 펼친다.',
       afternoon:'동대문 패브릭 시장을 누비며 다음 컬렉션의 영감을 수집한다.',
       evening:'홍대 소규모 전시 오프닝에 참석. 작가와 한 시간 동안 예술론을 나눈다.' },
  2: { morning:'여의도 방송국 분장실. 뉴스 앵커 의자에 앉는 순간 다른 사람이 된다.',
       afternoon:'생방송 뉴스 진행. 300만 시청자가 당신의 목소리를 기다린다.',
       evening:'강남 한식당에서 PD들과 저녁 식사. 다음 시즌 프로그램 기획안을 그림처럼 그린다.' },
  3: { morning:'청담동 뷰티 스튜디오. 당신이 만든 팔레트 신제품 출시일 아침.',
       afternoon:'뷰티 에디터 인터뷰와 화보 촬영 디렉팅. 모든 컷이 당신의 머릿속 그림과 일치한다.',
       evening:'가로수길 전시관에서 작은 개인전 오프닝. 작품마다 당신의 손길이 살아있다.' },
  4: { morning:'여의도 63빌딩 42층 임원실. 서울이 발아래 펼쳐진다.',
       afternoon:'외국계 파트너사와 전략적 M&A 협상. 당신의 한 마디가 수백억을 움직인다.',
       evening:'한강 크루즈 비즈니스 디너. 서울의 야경을 배경으로 미래를 설계한다.' },
  5: { morning:'서울대학교 강의실. 200명의 학생들이 당신이 열기를 기다린다.',
       afternoon:'연구실에서 논문 검토. 한국 교육의 새 패러다임을 써 내려간다.',
       evening:'광화문 광장 근처 조용한 국밥 한 그릇. 다음 학기 강의안을 노트에 정리한다.' },
  6: { morning:'서초동 대형 로펌 35층. 창밖으로 법원 청사가 보인다.',
       afternoon:'헌법재판소 최종 변론. 당신의 논리는 칼날처럼 정교하다.',
       evening:'청담동 일식집에서 동료 변호사들과 조용한 식사. 내일의 전략을 다듬는다.' },
  7: { morning:'청담동 의원 첫 환자 전 10분, 현미경 앞에서 명상처럼 준비한다.',
       afternoon:'복잡한 재건 수술 집도. 당신의 손은 예술가의 손이다.',
       evening:'이태원 주얼리 아틀리에에서 신작 제작. 의학과 예술이 하나가 되는 시간.' },
  8: { morning:'판교 네이버 본사. 새벽 6시에 도착해 가장 조용한 시간에 코드를 짠다.',
       afternoon:'AI 모델 성능 리뷰 미팅. 당신의 인사이트에 팀원들이 메모를 멈추지 않는다.',
       evening:'서울숲 야외에서 맥북을 펴고 사이드 프로젝트 작업. 별빛 아래 알고리즘을 꿈꾼다.' },
  9: { morning:'카이스트 연구동. 뇌파 데이터를 보며 어제 꿈에서 떠오른 가설을 검증한다.',
       afternoon:'국제 학술지 논문 제출. 한국이 세계 뇌과학의 중심이 되는 날을 앞당긴다.',
       evening:'신촌 조용한 찻집. 철학책 한 권과 녹차 한 잔으로 하루를 닫는다.' },
};

// ── 과거 내러티브 (년주 천간 기준) ──────────────────────────────
export const PAST_BY_STEM: Record<string, NarrativeChapter> = {
  '甲': { title:'개척자의 혈통', keyword:'先驅 · 개척',
          narrative:'당신의 가문에는 남보다 먼저 새길을 여는 DNA가 흐릅니다. 어린 시절부터 \"왜?\"를 멈추지 않았고, 선생님들은 당신을 \"유독 고집스러운 아이\"라 불렀을 것입니다. 그 고집은 사실 甲木의 뿌리 — 하늘을 향해 자라려는 불굴의 의지였습니다.' },
  '乙': { title:'감수성의 씨앗', keyword:'感性 · 유연',
          narrative:'유년의 당신은 남들이 지나치는 것들을 유독 오래 바라보았습니다. 꽃 한 송이, 교실 창밖의 빗줄기, 친구의 표정 변화. 乙木의 기운은 환경에 맞추어 유연하게 자라는 덩굴처럼, 당신의 어린 시절을 섬세한 관찰과 풍부한 감수성으로 채웠습니다.' },
  '丙': { title:'빛의 기원', keyword:'光明 · 열정',
          narrative:'어린 시절의 당신은 방에서 가장 밝은 존재였습니다. 발표 때 손을 번쩍 들고, 운동회에서 앞장서고, 무대에 오를 때 두려움 대신 설렘을 느꼈던 아이. 丙火의 태양 에너지는 태어날 때부터 당신 안에서 타오르고 있었습니다.' },
  '丁': { title:'집중의 불꽃', keyword:'精密 · 완성',
          narrative:'당신의 유년은 \"하나에 꽂히면 끝을 봐야 하는\" 기질로 가득했습니다. 레고 하나를 완성할 때까지 밥도 잊고, 그림 하나를 완벽하게 만들 때까지 지우개가 닳도록 반복했던 아이. 丁火의 집중된 불꽃이 일찍부터 당신 안에 깃들었습니다.' },
  '戊': { title:'산의 침묵', keyword:'泰山 · 근원',
          narrative:'어린 시절의 당신은 또래보다 조금 더 무게감이 있었습니다. 쉽게 흥분하지 않고, 결정을 내리면 잘 바꾸지 않았으며, 친구들은 무의식적으로 당신에게 기댔습니다. 戊土의 산 기운은 아주 어릴 때부터 당신을 든든한 중심으로 만들었습니다.' },
  '己': { title:'비옥한 토양', keyword:'包容 · 배양',
          narrative:'어릴 적 당신의 집은 친구들이 자주 모이는 곳이었을 것입니다. 누군가 상처받으면 먼저 다가가고, 외로운 아이의 옆자리에 자연스레 앉았던 아이. 己土의 기름진 대지처럼, 당신은 주변을 싹틔우는 따뜻한 토양으로 자라났습니다.' },
  '庚': { title:'단련의 서막', keyword:'鍛鍊 · 원칙',
          narrative:'유년의 당신에게 불공평함은 참을 수 없는 것이었습니다. 규칙이 지켜지지 않을 때, 약자가 억울하게 당할 때 목소리를 높였습니다. 庚金의 날선 검처럼, 당신의 어린 시절은 원칙과 정의를 향한 날카로운 감각이 형성되는 시간이었습니다.' },
  '辛': { title:'보석의 원석', keyword:'精製 · 심미',
          narrative:'어린 시절부터 당신의 눈은 달랐습니다. 같은 물건도 더 아름다운 것을 고르고, 방을 꾸미는 방식이 어른스러웠으며, 이미 어릴 때부터 \"미적 감각이 있다\"는 말을 들었을 것입니다. 辛金의 정제된 빛이 원석 형태로 당신 안에 잠들어 있었습니다.' },
  '壬': { title:'깊은 강의 시작', keyword:'智慧 · 호기심',
          narrative:'당신의 유년기는 질문으로 가득했습니다. 왜 하늘은 파란지, 사람은 왜 죽는지, 우주 끝에는 무엇이 있는지. 부모님도 답하기 어려운 질문을 쏟아내던 아이. 壬水의 대해처럼 광대한 지적 호기심이 그 시절부터 당신을 이끌었습니다.' },
  '癸': { title:'안개 속 직관', keyword:'洞察 · 감응',
          narrative:'어릴 때부터 당신은 뭔가 달랐습니다. 말하지 않아도 상대방의 감정을 느끼고, 일이 일어나기 전에 이미 알 것 같은 느낌을 받았습니다. 癸水의 안개비처럼 조용하고 깊은 직관이 아주 어린 시절부터 당신의 내면에 스며 있었습니다.' },
};

// ── 청춘 내러티브 (월주 지지 기준) ──────────────────────────────
export const YOUTH_BY_BRANCH: Record<string, NarrativeChapter> = {
  '寅': { title:'호랑이처럼 질주한 청춘', keyword:'勇猛 · 개척',
          narrative:'10대와 20대의 당신은 멈추지 않았습니다. 경험할 수 있는 것은 모두 경험하려 했고, 위험해 보이는 선택도 두려워하지 않았습니다. 寅의 호랑이 기운이 청춘의 당신을 앞으로, 앞으로 밀었습니다.' },
  '卯': { title:'봄의 감성으로 핀 청춘', keyword:'成長 · 창조',
          narrative:'당신의 청춘은 꽃피는 봄처럼 섬세하고 아름다웠습니다. 좋아하는 것에 빠져들었고, 감수성이 예술이나 글쓰기, 음악으로 흘러넘쳤습니다. 卯의 봄 기운이 당신의 10~20대를 창조와 감성의 시절로 만들었습니다.' },
  '辰': { title:'용의 기운으로 도약한 청춘', keyword:'抱負 · 도약',
          narrative:'당신의 청춘에는 거대한 포부가 있었습니다. 평범한 길을 걷기 싫었고, 뭔가 큰 것을 이루겠다는 막연하지만 강렬한 확신이 있었습니다. 辰의 용 기운이 당신의 청춘을 야망의 시절로 채웠습니다.' },
  '巳': { title:'뱀의 지혜로 읽어낸 청춘', keyword:'洞察 · 전략',
          narrative:'당신의 10~20대는 사람과 상황을 읽는 법을 배우는 시간이었습니다. 관계의 복잡한 역학을 일찍 파악했고, 말 한마디의 무게를 또래보다 먼저 이해했습니다. 巳의 통찰이 당신을 성숙하게 만든 청춘이었습니다.' },
  '午': { title:'불꽃처럼 타오른 청춘', keyword:'熱情 · 표현',
          narrative:'당신의 청춘은 뜨거웠습니다. 사랑도 우정도 공부도 열정적으로 쏟아부었고, 중간이 없었습니다. 午의 불꽃 에너지가 당신의 10~20대를 온 몸이 달아오르는 열정의 시절로 만들었습니다.' },
  '未': { title:'양떼처럼 따뜻했던 청춘', keyword:'友情 · 연대',
          narrative:'당신의 청춘은 사람으로 가득했습니다. 친구들과 밤새 이야기하고, 누군가의 고민을 들어주며 새벽을 보냈습니다. 未의 온화한 기운이 당신의 10~20대를 따뜻한 연대와 우정으로 채웠습니다.' },
  '申': { title:'원숭이처럼 영리했던 청춘', keyword:'智略 · 적응',
          narrative:'당신의 청춘은 빠른 두뇌 회전이 돋보이는 시절이었습니다. 새로운 것을 금방 익히고, 상황에 맞춰 유연하게 전략을 바꾸었습니다. 申의 영리한 기운이 당신을 또래 중 가장 빠른 학습자로 만들었습니다.' },
  '酉': { title:'닭처럼 부지런했던 청춘', keyword:'完美 · 노력',
          narrative:'당신의 10~20대는 성실함의 시절이었습니다. 남들이 자는 시간에 공부하고, 완성도에 집착하며 결과물을 다듬었습니다. 酉의 완벽주의 기운이 당신의 청춘을 치열한 자기 단련의 시간으로 만들었습니다.' },
  '戌': { title:'개처럼 충직했던 청춘', keyword:'義理 · 신뢰',
          narrative:'당신의 청춘은 의리의 시절이었습니다. 한번 친구가 된 사람은 끝까지 챙겼고, 배신보다 손해를 택하는 선택을 반복했습니다. 戌의 충직한 기운이 당신을 가장 믿음직한 친구로 만든 시절이었습니다.' },
  '亥': { title:'깊은 물처럼 흘렀던 청춘', keyword:'自由 · 탐구',
          narrative:'당신의 청춘은 자유를 갈망했습니다. 정해진 틀이 답답했고, 새로운 세계와 사람을 탐험하고 싶었습니다. 亥의 물 기운이 당신을 경계 없이 흐르며 세상을 넓게 경험한 탐험가로 만들었습니다.' },
  '子': { title:'자시처럼 고요했던 청춘', keyword:'蓄積 · 내면',
          narrative:'당신의 청춘은 조용하지만 깊었습니다. 화려하지 않았지만, 내면에서 엄청난 것들이 축적되고 있었습니다. 子의 밤의 기운이 당신을 겉으로 드러나지 않아도 안에서 단단히 성장하는 사람으로 만들었습니다.' },
  '丑': { title:'소처럼 묵묵히 걸은 청춘', keyword:'忍耐 · 蓄積',
          narrative:'당신의 청춘은 화려하지 않아도 충실했습니다. 남들이 지름길을 찾을 때 당신은 정도를 걸었습니다. 丑의 소 기운이 당신의 청춘을 느리지만 절대 흔들리지 않는 묵묵한 성장의 시간으로 만들었습니다.' },
};

// ── 미래 내러티브 (시주 천간 기준) ──────────────────────────────
export const FUTURE_BY_STEM: Record<string, FutureChapter> = {
  '甲': { title:'숲을 이루는 시대', keyword:'創業 · 유산', peak:'40~55세',
          narrative:'당신의 절정은 아직 오지 않았습니다. 앞으로의 시간은 지금까지 심어온 씨앗들이 울창한 숲을 이루는 시기입니다. 40~55세 사이, 당신은 이름을 남기는 무언가를 완성하게 됩니다. 사람들이 당신에게 기대게 되고, 당신은 그 무게를 기꺼이 받아들이는 리더가 됩니다.' },
  '乙': { title:'꽃이 피는 전성기', keyword:'開花 · 인정', peak:'35~50세',
          narrative:'당신의 미래는 드디어 세상이 당신을 알아보는 시간입니다. 오랫동안 조용히 키워온 실력과 감각이 빛을 발하고, 예상치 못한 방향에서 기회가 찾아옵니다. 35~50세의 당신은 인생의 가장 아름다운 꽃을 피웁니다.' },
  '丙': { title:'태양이 중천에 뜨는 시대', keyword:'全盛 · 영향력', peak:'35~50세',
          narrative:'미래의 당신 앞에는 더 넓은 무대가 기다리고 있습니다. 지금의 영향력이 지역을 넘어 더 넓은 세계로 뻗어 나가고, 당신의 이름은 한국을 넘어 아시아, 그리고 세계에서 언급될 것입니다.' },
  '丁': { title:'마스터피스를 완성하는 시대', keyword:'完成 · 傑作', peak:'40~60세',
          narrative:'미래의 당신은 평생의 작업을 완성하게 됩니다. 서두르지 않아도 됩니다. 丁火는 천천히, 정밀하게 타오르는 불꽃. 40~60세 사이 당신이 완성하는 것은 분야에 관계없이 오랫동안 기억될 것입니다.' },
  '戊': { title:'산이 되는 시대', keyword:'確立 · 권위', peak:'45~65세',
          narrative:'미래의 당신은 흔들리지 않는 산이 됩니다. 45세 이후, 당신의 존재감은 더욱 단단해지고 많은 사람들이 당신에게 방향을 묻습니다. 조직이든 가정이든, 당신은 모두가 믿고 기댈 수 있는 중심이 됩니다.' },
  '己': { title:'수확의 계절', keyword:'結實 · 풍요', peak:'40~55세',
          narrative:'미래의 당신에게 풍요가 찾아옵니다. 지금까지 사람들에게 아낌없이 쏟아온 것들이 예상치 못한 방식으로 되돌아옵니다. 물질적 안정, 신뢰받는 관계, 깊어진 지혜 — 40~55세의 당신은 진정한 수확의 계절을 맞이합니다.' },
  '庚': { title:'명검이 완성되는 시대', keyword:'完鍊 · 최고점', peak:'40~55세',
          narrative:'당신의 날카로움은 앞으로 더욱 정교해집니다. 미래의 당신은 분야에서 최고 권위자 중 한 명이 됩니다. 말 한마디가 결정을 바꾸고, 판단이 조직의 방향을 결정합니다. 庚金의 검은 단련을 거칠수록 예리해집니다.' },
  '辛': { title:'보석이 광채를 내는 시대', keyword:'名聲 · 빛남', peak:'35~55세',
          narrative:'미래의 당신은 오랫동안 갈고 닦아온 것들이 마침내 세상에서 빛나기 시작합니다. 35~55세 사이, 당신의 이름 앞에 수식어가 붙기 시작하고, 당신이 만든 것들이 당신의 존재보다 먼저 알려지게 됩니다.' },
  '壬': { title:'대해가 완성되는 시대', keyword:'深化 · 影響', peak:'45~65세',
          narrative:'미래의 당신은 더 넓고 깊어집니다. 지금까지 모아온 지식과 경험이 45세 이후 하나의 거대한 흐름으로 통합됩니다. 당신이 남기는 것은 사람들의 생각 방식을 바꾸는 깊은 통찰입니다.' },
  '癸': { title:'고요한 강이 바다에 닿는 시대', keyword:'悟道 · 해방', peak:'40~60세',
          narrative:'미래의 당신은 드디어 자기 자신을 완전히 이해하는 시간에 이릅니다. 40~60세 사이, 지금까지의 불안과 물음표들이 하나씩 해소되고, 내면의 고요함과 함께 진정한 자유를 경험하게 됩니다. 그 평화가 당신 주변을 변화시킵니다.' },
};

// ── 격국 (오행 dominant 기준) ─────────────────────────────────
export const GYEOKGUK: Record<string, GyeokgukInfo> = {
  wood:  { name:'木旺格', hanja:'木旺格', desc:'나무의 왕성한 기운이 사주를 지배하는 격. 창조와 성장의 힘이 폭발적이다.' },
  fire:  { name:'炎上格', hanja:'炎上格', desc:'불이 활활 타오르는 격. 카리스마와 열정으로 세상을 비추는 운명이다.' },
  earth: { name:'稼穡格', hanja:'稼穡格', desc:'대지의 풍요로운 기운을 품은 격. 사람을 키우고 기반을 다지는 운명이다.' },
  metal: { name:'從革格', hanja:'從革格', desc:'금속의 단단하고 예리한 격. 원칙과 정확함으로 세상을 바꾸는 운명이다.' },
  water: { name:'潤下格', hanja:'潤下格', desc:'물이 아래로 흘러 모이는 격. 지식과 통찰로 세상에 스며드는 운명이다.' },
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

// ─────────────────────────────────────────────────────────────────
// ── 단일 진입점: getNarrative(saju)
//    FullScript에서 이 함수 하나만 호출하면 모든 내러티브 데이터가 반환됨
// ─────────────────────────────────────────────────────────────────
export function getNarrative(saju: SajuData): NarrativeResult {
  const idx = saju.dayMasterIndex;
  return {
    zodiac:     ZODIAC_MAP[saju.year.branch]   ?? ZODIAC_MAP['子'],
    dayMaster:  DAY_MASTER_DEEP[idx]           ?? DAY_MASTER_DEEP[0],
    scenario:   DAILY_SCENARIOS[idx]           ?? DAILY_SCENARIOS[0],
    pastData:   PAST_BY_STEM[saju.year.stem]   ?? PAST_BY_STEM['甲'],
    youthData:  YOUTH_BY_BRANCH[saju.month.branch] ?? YOUTH_BY_BRANCH['寅'],
    futureData: FUTURE_BY_STEM[saju.hour.stem] ?? FUTURE_BY_STEM['甲'],
    gyeokguk:   GYEOKGUK[saju.dominantElement] ?? GYEOKGUK['wood'],
    pastLife:   PAST_LIFE_JOSEON[idx]          ?? PAST_LIFE_JOSEON[0],
    kDrama:     K_DRAMA_PERSONA[saju.dominantElement] ?? K_DRAMA_PERSONA['wood'],
    luckyData:  LUCKY_ENHANCERS[saju.lackingElement]  ?? LUCKY_ENHANCERS['water'],
  };
}
