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
const GYEOKGUK_I18N: Record<string, Record<string, GyeokgukInfo>> = {
        ko: {
                wood: { name: '木旺格', hanja: '木旺格', desc: '나무의 왕성한 기운이 사주를 지배하는 격. 창조와 성장의 힘이 폭발적이다.' },
                fire: { name: '炎上格', hanja: '炎上格', desc: '불이 활활 타오르는 격. 카리스마와 열정으로 세상을 비추는 운명이다.' },
                earth: { name: '稼穡格', hanja: '稼穡格', desc: '대지의 풍요로운 기운을 품은 격. 사람을 키우고 기반을 다지는 운명이다.' },
                metal: { name: '從革格', hanja: '從革格', desc: '금속의 단단하고 예리한 격. 원칙과 정확함으로 세상을 바꾸는 운명이다.' },
                water: { name: '潤下格', hanja: '潤下格', desc: '물이 아래로 흘러 모이는 격. 지식과 통찰로 세상에 스며드는 운명이다.' },
        },
        en: {
                wood: { name: '木旺格', hanja: '木旺格', desc: 'A destiny dominated by the vigorous energy of Wood. The power of creation and growth is explosive.' },
                fire: { name: '炎上格', hanja: '炎上格', desc: 'A destiny where fire blazes brightly. A fate that illuminates the world with charisma and passion.' },
                earth: { name: '稼穡格', hanja: '稼穡格', desc: 'A destiny embracing the abundant energy of Earth. A fate of nurturing people and building foundations.' },
                metal: { name: '從革格', hanja: '從革格', desc: 'A destiny of solid and sharp Metal. A fate that changes the world through principle and precision.' },
                water: { name: '潤下格', hanja: '潤下格', desc: 'A destiny where water flows and gathers below. A fate that permeates the world with knowledge and insight.' },
        },
        ja: {
                wood: { name: '木旺格', hanja: '木旺格', desc: '木の旺盛なエネルギーが四柱を支配する格。創造と成長の力が爆発的です。' },
                fire: { name: '炎上格', hanja: '炎上格', desc: '火が燃え盛る格。カリスマと情熱で世界を照らす運命です。' },
                earth: { name: '稼穡格', hanja: '稼穡格', desc: '大地の豊かなエネルギーを抱く格。人を育て基盤を築く運命です。' },
                metal: { name: '從革格', hanja: '從革格', desc: '金属の硬く鋭い格。原則と正確さで世界を変える運命です。' },
                water: { name: '潤下格', hanja: '潤下格', desc: '水が下に流れ集まる格。知識と洞察で世界に浸透する運命です。' },
        },
        zh: {
                wood: { name: '木旺格', hanja: '木旺格', desc: '木的旺盛能量主宰命盘的格局。创造与成长的力量极为强大。' },
                fire: { name: '炎上格', hanja: '炎上格', desc: '火焰熊熊燃烧的格局。以魅力和热情照亮世界的命运。' },
                earth: { name: '稼穡格', hanja: '稼穡格', desc: '怀抱大地丰饶能量的格局。培育他人、奠定基础的命运。' },
                metal: { name: '從革格', hanja: '從革格', desc: '金属坚硬锐利的格局。以原则和精准改变世界的命运。' },
                water: { name: '潤下格', hanja: '潤下格', desc: '水向下流聚的格局。以知识和洞察渗透世界的命运。' },
        },
        th: {
                wood: { name: '木旺格', hanja: '木旺格', desc: 'ชะตาที่ถูกครอบงำด้วยพลังงานอันแข็งแกร่งของธาตุไม้ พลังแห่งการสร้างสรรค์และการเติบโตนั้นระเบิดออกมา' },
                fire: { name: '炎上格', hanja: '炎上格', desc: 'ชะตาที่ไฟลุกโชติช่วง ชะตากรรมที่ส่องสว่างให้โลกด้วยบารมีและความหลงใหล' },
                earth: { name: '稼穡格', hanja: '稼穡格', desc: 'ชะตาที่โอบอุ้มพลังงานอันอุดมสมบูรณ์ของธาตุดิน ชะตากรรมแห่งการเลี้ยงดูผู้คนและสร้างรากฐาน' },
                metal: { name: '從革格', hanja: '從革格', desc: 'ชะตาแห่งธาตุทองที่แข็งแกร่งและคมกริบ ชะตากรรมที่เปลี่ยนแปลงโลกด้วยหลักการและความแม่นยำ' },
                water: { name: '潤下格', hanja: '潤下格', desc: 'ชะตาที่น้ำไหลรวมตัวกันด้านล่าง ชะตากรรมที่แทรกซึมเข้าสู่โลกด้วยความรู้และการหยั่งรู้' },
        },
};
export const GYEOKGUK = GYEOKGUK_I18N.ko;

// ── 조선시대 전생 (일간 기준) ──────────────────────────────────
const PAST_LIFE_JOSEON_I18N: Record<string, Record<number, PastLifeJoseon>> = {
        ko: {
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
        },
        en: {
                0: { title: 'The Greatest Merchant of Hanyang', role: 'Head of the Six Licensed Stores (大行首)', desc: 'With the pioneering spirit of Wood, you opened new trade routes and amassed great wealth. Your merchant guild controlled the economy of Hanyang.' },
                1: { title: 'Royal Court Painter', role: 'Painter of Dohwaseo (圖畵署 畵員)', desc: 'With the delicacy of Eul (乙), you poured your soul into every brushstroke. Your flower-and-bird paintings were the most beloved artworks in the palace.' },
                2: { title: 'A Reformer Ahead of His Time', role: 'Grand Master of Seonggyungwan (大司成)', desc: 'With the blazing passion of Byeong (丙), you criticized outdated systems and championed new learning. Countless young scholars followed you.' },
                3: { title: 'The Secret Intelligence Chief', role: 'Royal Secretary of Seungjeongwon (承政院 注書)', desc: 'With the sharpness and secrecy of Jeong (丁), you became the king\'s eyes and ears. Every palace secret was recorded and erased by your brush.' },
                4: { title: 'The Great General Who Guarded the Border', role: 'Northern Military Commander (兵馬節度使)', desc: 'With the steadfastness of Mu (戊), you defended the border without wavering. The fortress you guarded was a wall of despair for enemies.' },
                5: { title: 'The Healer Who Saved the People', role: 'Royal Physician (內醫院 御醫)', desc: 'With the compassion of Gi (己), you saved lives. As a master of acupuncture, you gave new life to the sick regardless of their social status.' },
                6: { title: 'The Incorruptible Inspector', role: 'Chief Censor of Saheonbu (大司憲)', desc: 'With the razor-sharp principles of Gyeong (庚), you made corrupt officials tremble. A true bamboo of Joseon who never hesitated to speak truth before the king.' },
                7: { title: 'The Hidden Power Behind the Throne', role: 'Royal In-law Chief Secretary (都承旨)', desc: 'With the sophisticated mind of Sin (辛), you always prevailed in court intrigues. A strategist who hid cold cunning beneath elegant silk robes.' },
                8: { title: 'The Wandering Poet', role: 'Traveling Scholar of Eight Provinces', desc: 'With the freedom of Im (壬), you declined official posts and wandered the mountains. Your poems have been recited for hundreds of years.' },
                9: { title: 'The Royal Astronomer', role: 'Director of the Royal Observatory (觀象監 提調)', desc: 'With the deep intuition of Gye (癸), you read the orbits of stars and prophesied the nation\'s fate. Your predictions were always without error.' },
        },
        ja: {
                0: { title: '漢陽一の大商人', role: '六矣廛大行首 (大行首)', desc: '木の開拓精神で新しい貿易路を開き、莫大な富を築きました。あなたの商団は漢陽の経済を握っていました。' },
                1: { title: '王室専属の画員', role: '図画署画員 (圖畵署 畵員)', desc: '乙の繊細さで筆先に魂を込めました。あなたが描いた花鳥画は宮中で最も愛された芸術品でした。' },
                2: { title: '時代を先駆けた改革者', role: '成均館大司成 (大司成)', desc: '丙の炎のような情熱で古い制度を批判し、新しい学問を唱えました。多くの若い儒生があなたに従いました。' },
                3: { title: '秘密を抱く情報責任者', role: '承政院注書 (承政院 注書)', desc: '丁の鋭さと秘密主義で王の目と耳となりました。宮中のすべての秘密があなたの筆で記録され消されました。' },
                4: { title: '国境を守った大将軍', role: '北方兵馬節度使 (兵馬節度使)', desc: '戊の重厚さで揺るぎなく国境を守りました。あなたが守る城壁は敵にとって嘆きの壁でした。' },
                5: { title: '民を救った医官', role: '内医院御医 (內醫院 御醫)', desc: '己の包容力で人を救いました。鍼術の達人として身分を問わず病む人々に新しい命を与えました。' },
                6: { title: '剛直な監察官', role: '司憲府大司憲 (大司憲)', desc: '庚の厳格な原則で汚職官吏を震え上がらせました。王の前でも直言を躊躇しなかった朝鮮の真の竹。' },
                7: { title: '陰の権力者', role: '王室外戚都承旨 (都承旨)', desc: '辛の精巧な頭脳で宮中の暗闘で常に勝利しました。華やかな絹の衣の下に冷たい知略を隠した戦略家でした。' },
                8: { title: '世を旅した風流人', role: '八道遊覧の士', desc: '壬の自由さで官職を辞退し山川を彷徨いました。あなたが残した時調は数百年経っても詠まれています。' },
                9: { title: '天文を読む観象監', role: '観象監提調 (觀象監 提調)', desc: '癸の深い直感で星の軌道を読み国家の運命を予言しました。あなたの策略はいつも寸分の狂いもありませんでした。' },
        },
        zh: {
                0: { title: '汉阳第一巨商', role: '六矣廛大行首 (大行首)', desc: '以木的开拓精神开辟新贸易路线，积累了巨大的财富。你的商团掌控着汉阳的经济。' },
                1: { title: '王室专属画员', role: '图画署画员 (圖畵署 畵員)', desc: '以乙的细腻在笔尖倾注灵魂。你所绘的花鸟画是宫中最受喜爱的艺术品。' },
                2: { title: '超越时代的改革家', role: '成均馆大司成 (大司成)', desc: '以丙的烈火般热情批判旧制度，倡导新学问。无数年轻儒生追随着你。' },
                3: { title: '怀揣秘密的情报主管', role: '承政院注书 (承政院 注書)', desc: '以丁的敏锐和隐秘成为王的耳目。宫中一切秘密都在你笔下记录和抹去。' },
                4: { title: '守卫边境的大将军', role: '北方兵马节度使 (兵馬節度使)', desc: '以戊的沉稳坚定不移地守护边境。你守护的城墙对敌人来说如同绝望之壁。' },
                5: { title: '救济百姓的医官', role: '内医院御医 (內醫院 御醫)', desc: '以己的包容力救人活命。作为针术大师，不分贵贱为病患赐予新生。' },
                6: { title: '刚正的监察官', role: '司宪府大司宪 (大司憲)', desc: '以庚的凛冽原则让贪官污吏闻风丧胆。在王面前也毫不犹豫直言的朝鲜真正的青竹。' },
                7: { title: '隐秘的权力实权者', role: '王室外戚都承旨 (都承旨)', desc: '以辛的精密头脑在宫廷暗斗中始终胜出。在华丽锦袍下隐藏冷静谋略的战略家。' },
                8: { title: '游历天下的风流客', role: '八道游览书生', desc: '以壬的自由放弃官职，漫游山川。你留下的诗篇数百年后仍被传唱。' },
                9: { title: '解读天文的观象监', role: '观象监提调 (觀象監 提調)', desc: '以癸的深邃直觉阅读星辰轨道，预言国家命运。你的谋略从无一丝偏差。' },
        },
        th: {
                0: { title: 'พ่อค้าผู้ยิ่งใหญ่ที่สุดแห่งฮันยาง', role: 'หัวหน้าร้านค้าหกแห่ง (大行首)', desc: 'ด้วยจิตวิญญาณบุกเบิกของธาตุไม้ คุณเปิดเส้นทางการค้าใหม่และสะสมความมั่งคั่งมหาศาล สมาคมพ่อค้าของคุณควบคุมเศรษฐกิจแห่งฮันยาง' },
                1: { title: 'จิตรกรราชสำนักส่วนพระองค์', role: 'จิตรกรแห่งโดฮวาซอ (圖畵署 畵員)', desc: 'ด้วยความละเอียดอ่อนของอึล (乙) คุณเทจิตวิญญาณลงทุกปลายพู่กัน ภาพดอกไม้และนกของคุณเป็นงานศิลปะที่รักที่สุดในพระราชวัง' },
                2: { title: 'นักปฏิรูปผู้ล้ำหน้ายุคสมัย', role: 'อาจารย์ใหญ่แห่งซองกยุนกวัน (大司成)', desc: 'ด้วยความหลงใหลอันเร่าร้อนของบยอง (丙) คุณวิพากษ์ระบบเก่าและเรียกร้องการเรียนรู้ใหม่ นักปราชญ์หนุ่มมากมายติดตามคุณ' },
                3: { title: 'หัวหน้าข่าวกรองผู้เก็บความลับ', role: 'เลขาธิการราชวังซึงจองวอน (承政院 注書)', desc: 'ด้วยความเฉียบคมและลับเร้นของจอง (丁) คุณกลายเป็นหูตาของพระราชา ทุกความลับในวังถูกบันทึกและลบไปด้วยพู่กันของคุณ' },
                4: { title: 'แม่ทัพผู้พิทักษ์ชายแดน', role: 'ผู้บัญชาการทหารภาคเหนือ (兵馬節度使)', desc: 'ด้วยความมั่นคงของมู (戊) คุณปกป้องชายแดนอย่างไม่สั่นคลอน กำแพงที่คุณเฝ้าเป็นกำแพงแห่งความสิ้นหวังสำหรับศัตรู' },
                5: { title: 'แพทย์ผู้ช่วยชีวิตราษฎร', role: 'แพทย์หลวง (內醫院 御醫)', desc: 'ด้วยความเมตตาของกี (己) คุณช่วยชีวิตผู้คน ในฐานะปรมาจารย์ฝังเข็ม คุณให้ชีวิตใหม่แก่ผู้ป่วยโดยไม่เลือกชนชั้น' },
                6: { title: 'ผู้ตรวจการที่ซื่อสัตย์', role: 'หัวหน้าผู้ตรวจแห่งซาฮอนบู (大司憲)', desc: 'ด้วยหลักการอันเฉียบขาดของคยอง (庚) คุณทำให้ขุนนางฉ้อราษฎร์สั่นสะท้าน ไผ่แท้แห่งโชซอนที่ไม่เคยลังเลที่จะพูดความจริงต่อหน้าพระราชา' },
                7: { title: 'ผู้ทรงอำนาจเบื้องหลัง', role: 'เลขาธิการสูงสุดผู้เป็นญาติราชวงศ์ (都承旨)', desc: 'ด้วยสมองอันแยบยลของชิน (辛) คุณมีชัยในการแย่งชิงอำนาจในราชสำนักเสมอ นักยุทธศาสตร์ที่ซ่อนความเฉลียวฉลาดภายใต้เสื้อผ้าไหมอันหรูหรา' },
                8: { title: 'กวีผู้ท่องเที่ยว', role: 'นักปราชญ์ผู้เดินทางแปดจังหวัด', desc: 'ด้วยอิสรภาพของอิม (壬) คุณปฏิเสธตำแหน่งราชการและเดินทางท่องไปตามขุนเขา บทกวีของคุณถูกขับร้องมานับร้อยปี' },
                9: { title: 'นักดาราศาสตร์หลวง', role: 'ผู้อำนวยการหอดูดาวหลวง (觀象監 提調)', desc: 'ด้วยสัญชาตญาณอันลึกซึ้งของกเย (癸) คุณอ่านวงโคจรของดวงดาวและทำนายชะตากรรมของชาติ การทำนายของคุณไม่เคยผิดพลาด' },
        },
};
export const PAST_LIFE_JOSEON = PAST_LIFE_JOSEON_I18N.ko;

// ── K-드라마 페르소나 (dominantElement 기준) ───────────────────
const K_DRAMA_PERSONA_I18N: Record<string, Record<string, KDramaPersona>> = {
        ko: {
                wood: { archetype: '성장형 주인공', trope: '이태원 클라쓰의 불굴의 창업자', desc: '아무리 짓밟혀도 다시 일어나는 꺾이지 않는 잡초. 결국 자신의 크루를 이끌고 업계 1위로 올라서는 서사의 주인공입니다.' },
                fire: { archetype: '매운맛 안티히어로', trope: '더 글로리의 치밀한 복수자', desc: '모두의 시선을 사로잡는 압도적인 카리스마. 한번 목표를 정하면 모든 것을 불태워서라도 끝을 보는 강렬한 에너지를 가졌습니다.' },
                earth: { archetype: '숨겨진 재벌 3세', trope: '사랑의 불시착의 든든한 보호자', desc: '평소엔 평범하고 묵묵해 보이지만, 위기의 순간 압도적인 자본력과 권력으로 내 사람을 지켜내는 든든한 산 같은 존재입니다.' },
                metal: { archetype: '냉철한 프로페셔널', trope: '빈센조의 무자비한 해결사', desc: '슈트핏이 완벽하게 어울리는 피도 눈물도 없는 전문가. 그러나 내 사람에게는 한없이 약해지는 츤데레 매력의 소유자입니다.' },
                water: { archetype: '미스터리 천재', trope: '비밀의 숲의 감정 없는 검사', desc: '남들이 보지 못하는 이면을 꿰뚫어 보는 통찰력. 조용하지만 가장 판을 크게 흔드는 세계관 최강의 두뇌 캐릭터입니다.' },
        },
        en: {
                wood: { archetype: 'The Underdog Protagonist', trope: 'The Indomitable Entrepreneur from Itaewon Class', desc: 'An unbreakable weed that rises no matter how many times it\'s trampled. The hero who leads their crew to the top of the industry.' },
                fire: { archetype: 'The Fierce Anti-Hero', trope: 'The Meticulous Avenger from The Glory', desc: 'Overwhelming charisma that captivates everyone. Possessing an intense energy that burns everything to see things through once a goal is set.' },
                earth: { archetype: 'The Hidden Chaebol Heir', trope: 'The Steadfast Protector from Crash Landing on You', desc: 'Appears ordinary and quiet normally, but in moments of crisis, a mountain-like presence who protects their people with overwhelming wealth and power.' },
                metal: { archetype: 'The Cold Professional', trope: 'The Ruthless Fixer from Vincenzo', desc: 'A bloodless, tearless expert who looks perfect in a suit. Yet irresistibly soft toward loved ones — the ultimate tsundere.' },
                water: { archetype: 'The Mystery Genius', trope: 'The Emotionless Prosecutor from Stranger', desc: 'Insight that sees through what others cannot. Quiet but the ultimate mastermind who shakes the game the hardest.' },
        },
        ja: {
                wood: { archetype: '成長型主人公', trope: '梨泰院クラスの不屈の起業家', desc: 'どんなに踏みつけられても立ち上がる折れない雑草。最終的に自分のクルーを率いて業界1位に上り詰める物語の主人公です。' },
                fire: { archetype: '辛口アンチヒーロー', trope: 'ザ・グローリーの緻密な復讐者', desc: '全員の視線を釘付けにする圧倒的なカリスマ。一度目標を定めたらすべてを燃やしてでもやり遂げる強烈なエネルギーの持ち主です。' },
                earth: { archetype: '隠れた財閥3世', trope: '愛の不時着の頼もしい守護者', desc: '普段は平凡で物静かに見えるが、危機の瞬間に圧倒的な資本力と権力で大切な人を守り抜く頼もしい山のような存在です。' },
                metal: { archetype: '冷徹なプロフェッショナル', trope: 'ヴィンチェンツォの無慈悲な解決者', desc: 'スーツが完璧に似合う血も涙もない専門家。しかし大切な人にはとことん弱くなるツンデレの魅力の持ち主です。' },
                water: { archetype: 'ミステリー天才', trope: '秘密の森の感情なき検事', desc: '他人には見えない裏側を見抜く洞察力。静かだが最も大きく盤面を揺るがす世界観最強の頭脳キャラクターです。' },
        },
        zh: {
                wood: { archetype: '成长型主角', trope: '梨泰院Class的不屈创业者', desc: '无论被践踏多少次都能重新站起的不折之草。最终带领自己的团队登上行业第一的故事主角。' },
                fire: { archetype: '狠辣反英雄', trope: '黑暗荣耀的缜密复仇者', desc: '吸引所有人目光的压倒性魅力。一旦设定目标，即使燃烧一切也要看到结局的强烈能量。' },
                earth: { archetype: '隐藏的财阀三代', trope: '爱的迫降的坚实守护者', desc: '平时看起来平凡沉默，但在危机时刻以压倒性的资本和权力守护自己人的可靠如山的存在。' },
                metal: { archetype: '冷酷的专业人士', trope: '黑道律师文森佐的无情解决者', desc: '完美驾驭西装的铁血专家。但对自己人却无比柔软的傲娇魅力拥有者。' },
                water: { archetype: '神秘天才', trope: '秘密森林的无情检察官', desc: '看穿他人看不到的另一面的洞察力。安静但最能撼动全局的世界观最强大脑角色。' },
        },
        th: {
                wood: { archetype: 'พระเอกสู้ชีวิต', trope: 'ผู้ประกอบการที่ไม่ยอมแพ้จาก Itaewon Class', desc: 'วัชพืชที่ไม่มีวันหักไม่ว่าจะถูกเหยียบกี่ครั้ง พระเอกของเรื่องราวที่นำทีมของตัวเองขึ้นสู่อันดับหนึ่งของวงการ' },
                fire: { archetype: 'แอนตี้ฮีโร่สายดุ', trope: 'ผู้แก้แค้นอันแยบยลจาก The Glory', desc: 'บารมีอันล้นหลามที่ดึงดูดสายตาทุกคน พลังงานอันเข้มข้นที่เผาผลาญทุกสิ่งเพื่อบรรลุเป้าหมายที่ตั้งไว้' },
                earth: { archetype: 'ทายาทแชโบลที่ซ่อนตัว', trope: 'ผู้พิทักษ์ที่มั่นคงจาก Crash Landing on You', desc: 'ดูธรรมดาและเงียบขรึมในยามปกติ แต่ในยามวิกฤต เป็นภูเขาที่มั่นคงที่ปกป้องคนของตัวเองด้วยอำนาจและทรัพย์สินอันท่วมท้น' },
                metal: { archetype: 'มืออาชีพเลือดเย็น', trope: 'นักแก้ปัญหาไร้ปรานีจาก Vincenzo', desc: 'ผู้เชี่ยวชาญเลือดเย็นที่ใส่สูทได้สมบูรณ์แบบ แต่อ่อนโยนสุดขีดกับคนที่รัก — สุดยอดแห่งเสน่ห์ซึนเดเระ' },
                water: { archetype: 'อัจฉริยะลึกลับ', trope: 'อัยการไร้อารมณ์จาก Stranger', desc: 'สายตาที่มองทะลุสิ่งที่คนอื่นมองไม่เห็น เงียบแต่เป็นจอมยุทธ์ผู้สั่นสะเทือนสถานการณ์มากที่สุด' },
        },
};
export const K_DRAMA_PERSONA = K_DRAMA_PERSONA_I18N.ko;

// ── 행운의 오행 처방 (lackingElement 기준) ────────────────────
const LUCKY_ENHANCERS_I18N: Record<string, Record<string, LuckyEnhancers>> = {
        ko: {
                wood: { color: '포레스트 그린', item: '우드 톤의 룸 스프레이나 향수', place: '식물이 많은 수목원이나 숲길', action: '아침 일찍 일어나 새로운 취미 시작하기' },
                fire: { color: '선셋 오렌지', item: '향초나 은은한 조명의 무드등', place: '햇빛이 잘 드는 남향의 대형 카페', action: '사람들이 많은 모임에서 먼저 대화 주도하기' },
                earth: { color: '어스 브라운', item: '세라믹 다기 세트나 테라코타 화분', place: '흙을 밟을 수 있는 조용한 등산로', action: '다이어리에 감정 정리하며 명상하기' },
                metal: { color: '문라이트 실버', item: '메탈 소재의 고급스러운 시계나 주얼리', place: '현대적인 건축미가 돋보이는 미술관', action: '미뤄둔 공간의 정리정돈과 미니멀리즘 실천' },
                water: { color: '오션 네이비', item: '투명한 크리스탈 오브제나 어항', place: '탁 트인 바다나 잔잔한 강변', action: '밤 시간에 혼자만의 책 읽기나 반신욕하기' },
        },
        en: {
                wood: { color: 'Forest Green', item: 'Wood-toned room spray or perfume', place: 'An arboretum or forest trail rich with plants', action: 'Wake up early and start a new hobby' },
                fire: { color: 'Sunset Orange', item: 'Scented candles or a warm mood lamp', place: 'A large south-facing cafe filled with sunlight', action: 'Take the lead in conversations at social gatherings' },
                earth: { color: 'Earth Brown', item: 'Ceramic tea set or terracotta planter', place: 'A quiet hiking trail where you can feel the earth', action: 'Journal your emotions and practice meditation' },
                metal: { color: 'Moonlight Silver', item: 'An elegant metal watch or jewelry', place: 'A museum with stunning modern architecture', action: 'Declutter your space and practice minimalism' },
                water: { color: 'Ocean Navy', item: 'Crystal objet or an aquarium', place: 'An open ocean view or a calm riverside', action: 'Read a book alone or take a half-bath at night' },
        },
        ja: {
                wood: { color: 'フォレストグリーン', item: 'ウッドトーンのルームスプレーや香水', place: '植物が多い植物園や森の道', action: '朝早く起きて新しい趣味を始める' },
                fire: { color: 'サンセットオレンジ', item: 'キャンドルやムードランプ', place: '日当たりの良い南向きの大きなカフェ', action: '人が多い集まりで率先して会話をリードする' },
                earth: { color: 'アースブラウン', item: 'セラミック茶器セットやテラコッタの植木鉢', place: '土を踏める静かなハイキングコース', action: '日記で感情を整理しながら瞑想する' },
                metal: { color: 'ムーンライトシルバー', item: 'メタル素材の高級時計やジュエリー', place: '現代的な建築美が際立つ美術館', action: '後回しにしていた空間の整理整頓とミニマリズムの実践' },
                water: { color: 'オーシャンネイビー', item: '透明なクリスタルオブジェや水槽', place: '開放的な海や穏やかな川辺', action: '夜に一人で読書や半身浴をする' },
        },
        zh: {
                wood: { color: '森林绿', item: '木质调的室内喷雾或香水', place: '植物繁茂的植物园或林荫小路', action: '早起开始一个新爱好' },
                fire: { color: '日落橙', item: '香薰蜡烛或温馨氛围灯', place: '阳光充足的朝南大型咖啡馆', action: '在社交聚会中主动引导对话' },
                earth: { color: '大地棕', item: '陶瓷茶具套装或陶土花盆', place: '能踩到泥土的安静登山步道', action: '用日记整理情绪并冥想' },
                metal: { color: '月光银', item: '金属材质的高级手表或珠宝', place: '现代建筑美感突出的美术馆', action: '整理拖延已久的空间，实践极简主义' },
                water: { color: '海洋藏青', item: '透明水晶装饰品或鱼缸', place: '开阔的大海或平静的河边', action: '夜晚独自阅读或泡半身浴' },
        },
        th: {
                wood: { color: 'ฟอเรสต์กรีน', item: 'สเปรย์ห้องหรือน้ำหอมโทนไม้', place: 'สวนพฤกษศาสตร์หรือทางเดินป่าที่เต็มไปด้วยพืชพรรณ', action: 'ตื่นแต่เช้าและเริ่มงานอดิเรกใหม่' },
                fire: { color: 'ซันเซ็ตออเรนจ์', item: 'เทียนหอมหรือโคมไฟบรรยากาศ', place: 'คาเฟ่ใหญ่หันหน้าทิศใต้ที่เต็มไปด้วยแสงแดด', action: 'เป็นผู้นำการสนทนาในงานสังคม' },
                earth: { color: 'เอิร์ธบราวน์', item: 'ชุดชาเซรามิกหรือกระถางเทอราคอตต้า', place: 'เส้นทางเดินป่าเงียบสงบที่สัมผัสดินได้', action: 'บันทึกอารมณ์ในไดอารี่และฝึกสมาธิ' },
                metal: { color: 'มูนไลท์ซิลเวอร์', item: 'นาฬิกาหรือเครื่องประดับโลหะหรูหรา', place: 'พิพิธภัณฑ์ศิลปะที่มีสถาปัตยกรรมสมัยใหม่โดดเด่น', action: 'จัดระเบียบพื้นที่ที่ผัดวันประกันพรุ่งและฝึกมินิมอลลิสม์' },
                water: { color: 'โอเชียนเนวี', item: 'ออบเจ่คริสตัลใสหรือตู้ปลา', place: 'วิวทะเลเปิดกว้างหรือริมแม่น้ำอันสงบ', action: 'อ่านหนังสือคนเดียวหรือแช่น้ำครึ่งตัวตอนกลางคืน' },
        },
};
export const LUCKY_ENHANCERS = LUCKY_ENHANCERS_I18N.ko;


import { supabase } from '../../lib/supabase';

// ── Helper: resolve i18n lookup table by language ────────────
function getGyeokguk(lang: string) { return GYEOKGUK_I18N[lang] ?? GYEOKGUK_I18N.ko; }
function getPastLife(lang: string) { return PAST_LIFE_JOSEON_I18N[lang] ?? PAST_LIFE_JOSEON_I18N.ko; }
function getKDrama(lang: string) { return K_DRAMA_PERSONA_I18N[lang] ?? K_DRAMA_PERSONA_I18N.ko; }
function getLucky(lang: string) { return LUCKY_ENHANCERS_I18N[lang] ?? LUCKY_ENHANCERS_I18N.ko; }

export async function getNarrative(saju: SajuData, language: string = 'ko'): Promise<NarrativeResult> {
        const idx = saju.dayMasterIndex;
        const branchChar = saju.year.branch;
        const zodiacBasics = ZODIAC_BASICS[branchChar] || ZODIAC_BASICS['子'];
        const lang = language || 'ko';

        // Resolve i18n lookup tables
        const gyeokgukTable = getGyeokguk(lang);
        const pastLifeTable = getPastLife(lang);
        const kDramaTable = getKDrama(lang);
        const luckyTable = getLucky(lang);

        try {
                if (!supabase) throw new Error('Supabase not configured');

                // Helper: query with language filter, fallback without filter for ko rows that may lack a language column
                const queryWithLang = async (table: string, filterCol: string, filterVal: string | number) => {
                        const res = await supabase!.from(table).select('*').eq(filterCol, filterVal).eq('language', lang).single();
                        if (!res.error) return res;
                        // Fallback: try 'ko' if the requested language row is missing
                        const fallback = await supabase!.from(table).select('*').eq(filterCol, filterVal).eq('language', 'ko').single();
                        return fallback;
                };

                const [
                        dbZodiac,
                        dbDayMaster,
                        dbScenario,
                        dbPast,
                        dbYouth,
                        dbFuture,
                ] = await Promise.all([
                        queryWithLang('saju_content_zodiac', 'kr', zodiacBasics.kr),
                        queryWithLang('saju_content_day_master', 'day_master_id', idx),
                        queryWithLang('saju_content_daily_scenario', 'day_master_id', idx),
                        queryWithLang('saju_content_narrative_past', 'stem_key', saju.year.stem),
                        queryWithLang('saju_content_narrative_youth', 'branch_key', saju.month.branch),
                        queryWithLang('saju_content_narrative_future', 'branch_key', saju.hour.branch),
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
                        gyeokguk: gyeokgukTable[saju.dominantElement] ?? gyeokgukTable['wood'],
                        pastLife: pastLifeTable[idx] ?? pastLifeTable[0],
                        kDrama: kDramaTable[saju.dominantElement] ?? kDramaTable['wood'],
                        luckyData: luckyTable[saju.lackingElement] ?? luckyTable['water'],
                };
        } catch (err) {
                console.warn('[NarrativeDB] Error fetching relational content', err);
                return {
                        zodiac: { animal: zodiacBasics.animal, kr: zodiacBasics.kr, emoji: zodiacBasics.emoji, trait: '' },
                        dayMaster: { title: '', hanja: '', nature: '', strength: [], caution: [], koreanStyle: '', luckyColor: '', luckyColorHex: '#c9a96e', luckyNumber: 0 },
                        scenario: { morning: '', afternoon: '', evening: '' },
                        pastData: { title: '', keyword: '', narrative: '' },
                        youthData: { title: '', keyword: '', narrative: '' },
                        futureData: { title: '', keyword: '', narrative: '', peak: '' },
                        gyeokguk: gyeokgukTable[saju.dominantElement] ?? gyeokgukTable['wood'],
                        pastLife: pastLifeTable[idx] ?? pastLifeTable[0],
                        kDrama: kDramaTable[saju.dominantElement] ?? kDramaTable['wood'],
                        luckyData: luckyTable[saju.lackingElement] ?? luckyTable['water'],
                };
        }
}
