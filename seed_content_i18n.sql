-- ─────────────────────────────────────────────────────────────────
-- K-REBORN · Multilingual Content Migration
-- 1) ALTER UNIQUE constraints to include 'language'
-- 2) INSERT translated rows for en, ja, zh, th
-- ─────────────────────────────────────────────────────────────────

-- ========== STEP 1: SCHEMA MIGRATION ==========
-- Drop old single-column UNIQUE constraints and recreate as composite (key + language)

-- zodiac: animal UNIQUE → (animal, language)
ALTER TABLE public.saju_content_zodiac DROP CONSTRAINT IF EXISTS saju_content_zodiac_animal_key;
ALTER TABLE public.saju_content_zodiac ADD CONSTRAINT saju_content_zodiac_animal_lang_key UNIQUE (animal, language);

-- day_master: day_master_id UNIQUE → (day_master_id, language)
ALTER TABLE public.saju_content_day_master DROP CONSTRAINT IF EXISTS saju_content_day_master_day_master_id_key;
ALTER TABLE public.saju_content_day_master ADD CONSTRAINT saju_content_day_master_id_lang_key UNIQUE (day_master_id, language);

-- daily_scenario: day_master_id UNIQUE → (day_master_id, language)
-- Also need to drop the FK constraint first, then re-add without UNIQUE
ALTER TABLE public.saju_content_daily_scenario DROP CONSTRAINT IF EXISTS saju_content_daily_scenario_day_master_id_key;
ALTER TABLE public.saju_content_daily_scenario DROP CONSTRAINT IF EXISTS saju_content_daily_scenario_day_master_id_fkey;
ALTER TABLE public.saju_content_daily_scenario ADD CONSTRAINT saju_content_daily_scenario_id_lang_key UNIQUE (day_master_id, language);

-- narrative_past: stem_key UNIQUE → (stem_key, language)
ALTER TABLE public.saju_content_narrative_past DROP CONSTRAINT IF EXISTS saju_content_narrative_past_stem_key_key;
ALTER TABLE public.saju_content_narrative_past ADD CONSTRAINT saju_content_narrative_past_stem_lang_key UNIQUE (stem_key, language);

-- narrative_youth: branch_key UNIQUE → (branch_key, language)
ALTER TABLE public.saju_content_narrative_youth DROP CONSTRAINT IF EXISTS saju_content_narrative_youth_branch_key_key;
ALTER TABLE public.saju_content_narrative_youth ADD CONSTRAINT saju_content_narrative_youth_branch_lang_key UNIQUE (branch_key, language);

-- narrative_future: branch_key UNIQUE → (branch_key, language)
ALTER TABLE public.saju_content_narrative_future DROP CONSTRAINT IF EXISTS saju_content_narrative_future_branch_key_key;
ALTER TABLE public.saju_content_narrative_future ADD CONSTRAINT saju_content_narrative_future_branch_lang_key UNIQUE (branch_key, language);


-- ========== STEP 2: ZODIAC TRANSLATIONS ==========

-- English
INSERT INTO public.saju_content_zodiac (animal, kr, emoji, trait, language) VALUES
('Rat', '쥐', '🐀', 'Wise and agile Rat. Talented, resourceful, and highly adaptable.', 'en'),
('Ox', '소', '🐂', 'Diligent and patient Ox. Achieves great things through steady, silent effort.', 'en'),
('Tiger', '호랑이', '🐅', 'Courageous and charismatic Tiger. A born leader with natural authority.', 'en'),
('Rabbit', '토끼', '🐇', 'Elegant and delicate Rabbit. Loves peace and overflows with creativity.', 'en'),
('Dragon', '용', '🐉', 'Strong and idealistic Dragon. Born with the most auspicious energy of the 12 zodiac.', 'en'),
('Snake', '뱀', '🐍', 'Profound and intuitive Snake. Pierces through truth with wisdom and insight.', 'en'),
('Horse', '말', '🐴', 'Free-spirited and passionate Horse. A blazing force of energy.', 'en'),
('Goat', '양', '🐑', 'Gentle and artistic Goat. Blessed with creativity and deep empathy.', 'en'),
('Monkey', '원숭이', '🐒', 'Clever and versatile Monkey. A master problem-solver.', 'en'),
('Rooster', '닭', '🐓', 'Diligent and perfectionist Rooster. Possesses sharp observational skills.', 'en'),
('Dog', '개', '🐕', 'Loyal and just Dog. Trust and sincerity are the weapons of life.', 'en'),
('Pig', '돼지', '🐗', 'Generous and good-natured Pig. Blessed with fortune and beloved by all.', 'en')
ON CONFLICT (animal, language) DO NOTHING;

-- Japanese
INSERT INTO public.saju_content_zodiac (animal, kr, emoji, trait, language) VALUES
('Rat', '쥐', '🐀', '知恵深く機敏な子年。才能豊かで適応力に優れています。', 'ja'),
('Ox', '소', '🐂', '誠実で忍耐強い丑年。黙々と努力し、大きな成果を生み出します。', 'ja'),
('Tiger', '호랑이', '🐅', '勇猛でカリスマ溢れる寅年。生まれながらのリーダーシップの持ち主。', 'ja'),
('Rabbit', '토끼', '🐇', '優雅で繊細な卯年。平和を愛し、創造力が豊かです。', 'ja'),
('Dragon', '용', '🐉', '力強く理想的な辰年。十二支の中で最も吉運を持って生まれます。', 'ja'),
('Snake', '뱀', '🐍', '深遠で直感的な巳年。知恵と洞察力で真実を見抜きます。', 'ja'),
('Horse', '말', '🐴', '自由で情熱的な午年。炎のように燃えるエネルギーの持ち主。', 'ja'),
('Goat', '양', '🐑', '温和で芸術的な未年。創造力と共感能力に優れています。', 'ja'),
('Monkey', '원숭이', '🐒', '聡明で多才な申年。問題解決の達人。', 'ja'),
('Rooster', '닭', '🐓', '勤勉で完璧主義の酉年。鋭い観察力の持ち主。', 'ja'),
('Dog', '개', '🐕', '忠実で正義感ある戌年。信頼と誠実さが人生の武器。', 'ja'),
('Pig', '돼지', '🐗', 'おおらかで素朴な亥年。福に恵まれ、人々に愛されます。', 'ja')
ON CONFLICT (animal, language) DO NOTHING;

-- Chinese
INSERT INTO public.saju_content_zodiac (animal, kr, emoji, trait, language) VALUES
('Rat', '쥐', '🐀', '聪慧敏捷的鼠年。才华横溢，适应力极强。', 'zh'),
('Ox', '소', '🐂', '勤勉坚韧的牛年。默默耕耘，终成大器。', 'zh'),
('Tiger', '호랑이', '🐅', '英勇果敢的虎年。天生的领袖，魅力非凡。', 'zh'),
('Rabbit', '토끼', '🐇', '优雅细腻的兔年。热爱和平，创意无限。', 'zh'),
('Dragon', '용', '🐉', '刚健理想的龙年。十二生肖中最具吉祥之气。', 'zh'),
('Snake', '뱀', '🐍', '深邃直觉的蛇年。以智慧与洞察力看透真相。', 'zh'),
('Horse', '말', '🐴', '自由奔放的马年。如火焰般热情洋溢。', 'zh'),
('Goat', '양', '🐑', '温柔艺术的羊年。创造力与共情能力出众。', 'zh'),
('Monkey', '원숭이', '🐒', '聪颖多才的猴年。解决问题的高手。', 'zh'),
('Rooster', '닭', '🐓', '勤奋完美的鸡年。拥有敏锐的观察力。', 'zh'),
('Dog', '개', '🐕', '忠诚正直的狗年。信任与真诚是人生的利器。', 'zh'),
('Pig', '돼지', '🐗', '宽厚纯朴的猪年。福气满满，深受众人喜爱。', 'zh')
ON CONFLICT (animal, language) DO NOTHING;

-- Thai
INSERT INTO public.saju_content_zodiac (animal, kr, emoji, trait, language) VALUES
('Rat', '쥐', '🐀', 'ปีชวดผู้ฉลาดและว่องไว มีความสามารถหลากหลายและปรับตัวเก่ง', 'th'),
('Ox', '소', '🐂', 'ปีฉลูผู้ขยันและอดทน ทำงานหนักอย่างเงียบๆ จนสร้างผลงานยิ่งใหญ่', 'th'),
('Tiger', '호랑이', '🐅', 'ปีขาลผู้กล้าหาญและมีเสน่ห์ เป็นผู้นำโดยกำเนิด', 'th'),
('Rabbit', '토끼', '🐇', 'ปีเถาะผู้สง่างามและละเอียดอ่อน รักสันติภาพและเปี่ยมด้วยความคิดสร้างสรรค์', 'th'),
('Dragon', '용', '🐉', 'ปีมะโรงผู้แข็งแกร่งและมีอุดมการณ์ เกิดมาพร้อมพลังมงคลที่สุดใน 12 นักษัตร', 'th'),
('Snake', '뱀', '🐍', 'ปีมะเส็งผู้ลึกซึ้งและมีสัญชาตญาณ ใช้ปัญญาและการหยั่งรู้เข้าถึงความจริง', 'th'),
('Horse', '말', '🐴', 'ปีมะเมียผู้รักอิสระและเต็มไปด้วยพลัง เปรียบดั่งเปลวไฟที่ลุกโชน', 'th'),
('Goat', '양', '🐑', 'ปีมะแมผู้อ่อนโยนและมีศิลปะ มีความคิดสร้างสรรค์และเข้าอกเข้าใจผู้อื่น', 'th'),
('Monkey', '원숭이', '🐒', 'ปีวอกผู้ฉลาดและมีความสามารถรอบด้าน เป็นผู้เชี่ยวชาญในการแก้ปัญหา', 'th'),
('Rooster', '닭', '🐓', 'ปีระกาผู้ขยันและเป็นนักสมบูรณ์แบบ มีพลังการสังเกตที่แหลมคม', 'th'),
('Dog', '개', '🐕', 'ปีจอผู้ซื่อสัตย์และยุติธรรม ความไว้วางใจและความจริงใจคืออาวุธแห่งชีวิต', 'th'),
('Pig', '돼지', '🐗', 'ปีกุนผู้ใจกว้างและซื่อตรง มีโชคลาภและเป็นที่รักของทุกคน', 'th')
ON CONFLICT (animal, language) DO NOTHING;


-- ========== STEP 3: DAY MASTER TRANSLATIONS ==========

-- English
INSERT INTO public.saju_content_day_master (day_master_id, title, hanja, nature, strength, caution, korean_style, lucky_color, lucky_color_hex, lucky_number, language) VALUES
(0, 'Day Master 甲 · Wood', '甲', 'Great Tree', ARRAY['Pioneering leadership','Indomitable will','Creative vision'], ARRAY['Unilateral decisions','Lack of flexibility'], 'Brewery CEO in Seoul Seongsu-dong', 'Green', '#4ade80', 3, 'en'),
(1, 'Day Master 乙 · Wood', '乙', 'Flower', ARRAY['Delicate sensitivity','Flexible adaptability','Artistic sensibility'], ARRAY['Indecisiveness','Dependency'], 'Gallery owner in Hongdae', 'Light Green', '#86efac', 8, 'en'),
(2, 'Day Master 丙 · Fire', '丙', 'Sun', ARRAY['Bright and vibrant energy','Strong expressiveness','Leadership'], ARRAY['Impulsive decisions','Lack of persistence'], 'Star TV anchor', 'Orange', '#fb923c', 7, 'en'),
(3, 'Day Master 丁 · Fire', '丁', 'Lantern', ARRAY['Concentration','Perfectionism','Warm charisma'], ARRAY['Excessive perfectionism','Burnout'], 'K-Beauty brand creative director', 'Red', '#f87171', 2, 'en'),
(4, 'Day Master 戊 · Earth', '戊', 'Mountain', ARRAY['Unwavering determination','Long-term thinking','Trustworthiness'], ARRAY['Resistance to change','Rigidity'], 'Executive strategist at a top corporation', 'Ochre', '#fbbf24', 5, 'en'),
(5, 'Day Master 己 · Earth', '己', 'Fertile Soil', ARRAY['Delicate embrace','Consideration','Steady growth'], ARRAY['Over-consideration','Self-sacrifice'], 'University professor of education', 'Yellow', '#fde68a', 0, 'en'),
(6, 'Day Master 庚 · Metal', '庚', 'Sword', ARRAY['Sense of justice','Decisiveness','Sharp analytical skills'], ARRAY['Coldness','Authoritarian attitude'], 'Top law firm attorney', 'White', '#e2e8f0', 4, 'en'),
(7, 'Day Master 辛 · Metal', '辛', 'Jewel', ARRAY['Perfect aesthetic sense','Precision','Aristocratic elegance'], ARRAY['Sensitivity','Critical tendency'], 'Plastic surgeon & jewelry artist in Gangnam', 'Silver', '#cbd5e1', 9, 'en'),
(8, 'Day Master 壬 · Water', '壬', 'Ocean', ARRAY['Vast intellectual curiosity','Flexible thinking','Philosophical depth'], ARRAY['Loss of direction','Scattered focus'], 'Senior AI engineer at a tech giant', 'Blue', '#60a5fa', 1, 'en'),
(9, 'Day Master 癸 · Water', '癸', 'Rain & Dew', ARRAY['Delicate intuition','Insight','Inner depth'], ARRAY['Excessive introversion','Anxiety'], 'Neuroscience researcher at a top institute', 'Indigo', '#818cf8', 6, 'en')
ON CONFLICT (day_master_id, language) DO NOTHING;

-- Japanese
INSERT INTO public.saju_content_day_master (day_master_id, title, hanja, nature, strength, caution, korean_style, lucky_color, lucky_color_hex, lucky_number, language) VALUES
(0, '甲木の日干', '甲', '大樹', ARRAY['先駆者的リーダーシップ','不屈の意志','創造的ビジョン'], ARRAY['独断的な決定','柔軟性の欠如'], 'ソウル聖水洞のブルワリーCEO', '緑', '#4ade80', 3, 'ja'),
(1, '乙木の日干', '乙', '草花', ARRAY['繊細な感受性','柔軟な適応力','芸術的センス'], ARRAY['優柔不断','依存性'], '弘大のギャラリーオーナー', '黄緑', '#86efac', 8, 'ja'),
(2, '丙火の日干', '丙', '太陽', ARRAY['明るく活発なエネルギー','強い表現力','リーダーシップ'], ARRAY['衝動的な決定','持続性の不足'], 'テレビ看板アナウンサー', 'オレンジ', '#fb923c', 7, 'ja'),
(3, '丁火の日干', '丁', '灯火', ARRAY['集中力','完璧主義','温かいカリスマ'], ARRAY['過度な完璧主義','燃え尽き'], 'K-ビューティブランドのクリエイティブディレクター', '赤', '#f87171', 2, 'ja'),
(4, '戊土の日干', '戊', '高山', ARRAY['揺るぎない意志','長期的思考','信頼感'], ARRAY['変化への抵抗','硬直性'], '大手企業の幹部戦略家', '黄土色', '#fbbf24', 5, 'ja'),
(5, '己土の日干', '己', '田土', ARRAY['繊細な包容力','思いやり','着実な成長'], ARRAY['過剰な配慮','自己犠牲'], '大学教育学教授', '黄色', '#fde68a', 0, 'ja'),
(6, '庚金の日干', '庚', '利剣', ARRAY['正義感','決断力','鋭い分析力'], ARRAY['冷淡さ','強圧的態度'], '大手法律事務所の弁護士', '白', '#e2e8f0', 4, 'ja'),
(7, '辛金の日干', '辛', '珠玉', ARRAY['完璧な美的センス','精密さ','気品'], ARRAY['繊細さ','批判的傾向'], '江南の美容外科院長兼ジュエリー作家', '銀色', '#cbd5e1', 9, 'ja'),
(8, '壬水の日干', '壬', '大海', ARRAY['広大な知的好奇心','柔軟な思考','哲学的深さ'], ARRAY['方向性の喪失','集中力の分散'], '大手テック企業のシニアAIエンジニア', '青', '#60a5fa', 1, 'ja'),
(9, '癸水の日干', '癸', '雨露', ARRAY['繊細な直感','洞察力','内面の深さ'], ARRAY['過度な内向性','不安感'], 'トップ研究所の脳科学研究者', '紺色', '#818cf8', 6, 'ja')
ON CONFLICT (day_master_id, language) DO NOTHING;

-- Chinese
INSERT INTO public.saju_content_day_master (day_master_id, title, hanja, nature, strength, caution, korean_style, lucky_color, lucky_color_hex, lucky_number, language) VALUES
(0, '甲木日主', '甲', '大树', ARRAY['开拓者的领导力','不屈的意志','创造性远见'], ARRAY['独断专行','缺乏灵活性'], '首尔圣水洞精酿啤酒厂CEO', '绿色', '#4ade80', 3, 'zh'),
(1, '乙木日主', '乙', '草花', ARRAY['细腻的感受力','灵活的适应力','艺术感觉'], ARRAY['优柔寡断','依赖性'], '弘大画廊经营者', '嫩绿', '#86efac', 8, 'zh'),
(2, '丙火日主', '丙', '太阳', ARRAY['明亮活泼的能量','强大的表现力','领导力'], ARRAY['冲动决策','缺乏持久性'], '电视台当家主播', '橙色', '#fb923c', 7, 'zh'),
(3, '丁火日主', '丁', '灯火', ARRAY['专注力','完美主义','温暖的魅力'], ARRAY['过度完美主义','倦怠'], 'K-美妆品牌创意总监', '红色', '#f87171', 2, 'zh'),
(4, '戊土日主', '戊', '高山', ARRAY['坚定不移的意志','长远思考','可信赖'], ARRAY['抗拒变化','僵化'], '顶级企业高管战略家', '土黄', '#fbbf24', 5, 'zh'),
(5, '己土日主', '己', '田土', ARRAY['细腻的包容力','体贴入微','稳步成长'], ARRAY['过度体贴','自我牺牲'], '大学教育学教授', '黄色', '#fde68a', 0, 'zh'),
(6, '庚金日主', '庚', '利剑', ARRAY['正义感','决断力','敏锐的分析力'], ARRAY['冷漠','强势态度'], '顶级律师事务所律师', '白色', '#e2e8f0', 4, 'zh'),
(7, '辛金日主', '辛', '珠玉', ARRAY['完美的审美','精密','贵族气质'], ARRAY['敏感','批判倾向'], '江南整形外科院长兼珠宝艺术家', '银色', '#cbd5e1', 9, 'zh'),
(8, '壬水日主', '壬', '大海', ARRAY['广阔的求知欲','灵活的思维','哲学深度'], ARRAY['迷失方向','注意力分散'], '顶级科技公司资深AI工程师', '蓝色', '#60a5fa', 1, 'zh'),
(9, '癸水日主', '癸', '雨露', ARRAY['细腻的直觉','洞察力','内心深度'], ARRAY['过度内向','焦虑'], '顶尖研究所脑科学研究员', '靛蓝', '#818cf8', 6, 'zh')
ON CONFLICT (day_master_id, language) DO NOTHING;

-- Thai
INSERT INTO public.saju_content_day_master (day_master_id, title, hanja, nature, strength, caution, korean_style, lucky_color, lucky_color_hex, lucky_number, language) VALUES
(0, 'วันเกิดธาตุไม้ 甲', '甲', 'ต้นไม้ใหญ่', ARRAY['ความเป็นผู้นำบุกเบิก','ความมุ่งมั่นไม่ย่อท้อ','วิสัยทัศน์สร้างสรรค์'], ARRAY['ตัดสินใจเผด็จการ','ขาดความยืดหยุ่น'], 'CEO โรงเบียร์คราฟต์ย่านซองซู โซล', 'เขียว', '#4ade80', 3, 'th'),
(1, 'วันเกิดธาตุไม้ 乙', '乙', 'ดอกไม้', ARRAY['ความอ่อนไหวละเอียดอ่อน','ความยืดหยุ่นในการปรับตัว','สุนทรียะทางศิลปะ'], ARRAY['ลังเลใจ','พึ่งพาผู้อื่น'], 'เจ้าของแกลเลอรี่ย่านฮงแด', 'เขียวอ่อน', '#86efac', 8, 'th'),
(2, 'วันเกิดธาตุไฟ 丙', '丙', 'ดวงอาทิตย์', ARRAY['พลังงานสดใสและกระตือรือร้น','การแสดงออกที่แข็งแกร่ง','ความเป็นผู้นำ'], ARRAY['ตัดสินใจหุนหันพลันแล่น','ขาดความต่อเนื่อง'], 'ผู้ประกาศข่าวดัง', 'ส้ม', '#fb923c', 7, 'th'),
(3, 'วันเกิดธาตุไฟ 丁', '丁', 'ตะเกียง', ARRAY['สมาธิ','ความสมบูรณ์แบบ','เสน่ห์อบอุ่น'], ARRAY['สมบูรณ์แบบเกินไป','หมดไฟ'], 'ครีเอทีฟไดเรกเตอร์แบรนด์ K-Beauty', 'แดง', '#f87171', 2, 'th'),
(4, 'วันเกิดธาตุดิน 戊', '戊', 'ภูเขาสูง', ARRAY['ความตั้งใจแน่วแน่','การคิดระยะยาว','ความน่าเชื่อถือ'], ARRAY['ต่อต้านการเปลี่ยนแปลง','ความแข็งกระด้าง'], 'นักกลยุทธ์ระดับผู้บริหาร', 'เหลืองดิน', '#fbbf24', 5, 'th'),
(5, 'วันเกิดธาตุดิน 己', '己', 'ดินอุดม', ARRAY['ความเอื้ออาทรละเอียดอ่อน','ความเอาใจใส่','การเติบโตอย่างมั่นคง'], ARRAY['เอาใจใส่มากเกินไป','เสียสละตนเอง'], 'อาจารย์มหาวิทยาลัยสาขาศึกษาศาสตร์', 'เหลือง', '#fde68a', 0, 'th'),
(6, 'วันเกิดธาตุทอง 庚', '庚', 'ดาบคม', ARRAY['ความยุติธรรม','ความเด็ดขาด','การวิเคราะห์ที่แหลมคม'], ARRAY['เย็นชา','ท่าทีเผด็จการ'], 'ทนายความสำนักงานกฎหมายชั้นนำ', 'ขาว', '#e2e8f0', 4, 'th'),
(7, 'วันเกิดธาตุทอง 辛', '辛', 'อัญมณี', ARRAY['สุนทรียะสมบูรณ์แบบ','ความแม่นยำ','ความสง่างาม'], ARRAY['อ่อนไหว','มีแนวโน้มวิพากษ์'], 'ศัลยแพทย์ความงามและนักออกแบบจิวเวลรี่', 'เงิน', '#cbd5e1', 9, 'th'),
(8, 'วันเกิดธาตุน้ำ 壬', '壬', 'มหาสมุทร', ARRAY['ความอยากรู้ทางปัญญาอันกว้างใหญ่','ความคิดยืดหยุ่น','ความลึกซึ้งทางปรัชญา'], ARRAY['สูญเสียทิศทาง','สมาธิกระจาย'], 'วิศวกร AI อาวุโสบริษัทเทคชั้นนำ', 'น้ำเงิน', '#60a5fa', 1, 'th'),
(9, 'วันเกิดธาตุน้ำ 癸', '癸', 'ฝนน้ำค้าง', ARRAY['สัญชาตญาณละเอียดอ่อน','การหยั่งรู้','ความลึกภายใน'], ARRAY['เก็บตัวมากเกินไป','ความวิตกกังวล'], 'นักวิจัยประสาทวิทยาสถาบันชั้นนำ', 'คราม', '#818cf8', 6, 'th')
ON CONFLICT (day_master_id, language) DO NOTHING;


-- ========== STEP 4: DAILY SCENARIO TRANSLATIONS ==========

-- English
INSERT INTO public.saju_content_daily_scenario (day_master_id, morning, afternoon, evening, language) VALUES
(0, 'Americano in hand, arriving at the Seongsu-dong studio 30 minutes before the team. You design the day ahead.', 'Brand pitching meeting. The moment you start speaking, the energy in the room shifts.', 'Whiskey on a rooftop bar in Itaewon with colleagues. The brainstorming session ends at 2 AM.', 'en'),
(1, 'Second floor window seat at a hanok café in Ikseon-dong. You open your sketchbook alongside a hand-drip coffee.', 'Wandering through Dongdaemun fabric market, collecting inspiration for the next collection.', 'Attending a small exhibition opening in Hongdae. You discuss art theory with the artist for an hour.', 'en'),
(2, 'The broadcast station makeup room in Yeouido. The moment you sit in the anchor chair, you transform.', 'Live news broadcast. Three million viewers are waiting for your voice.', 'Dinner with producers at a Korean restaurant in Gangnam. You sketch next season''s program like a painting.', 'en'),
(3, 'Cheongdam-dong beauty studio. Launch morning for your new palette.', 'Beauty editor interviews and photo shoot directing. Every shot matches the image in your mind.', 'Opening of your small solo exhibition at a Garosu-gil gallery. Your touch lives in every piece.', 'en'),
(4, '42nd floor executive office of the 63 Building in Yeouido. Seoul stretches below you.', 'Strategic M&A negotiations with global partners. Your single word moves billions.', 'Business dinner on a Han River cruise. You architect the future against Seoul''s night skyline.', 'en'),
(5, 'Seoul National University lecture hall. 200 students await your opening words.', 'Reviewing papers in the research office. You are writing a new paradigm for Korean education.', 'A quiet bowl of gukbap near Gwanghwamun Square. You organize next semester''s syllabus in your notebook.', 'en'),
(6, '35th floor of a major law firm in Seocho-dong. The courthouse is visible through the window.', 'Final arguments at the Constitutional Court. Your logic is razor-sharp.', 'Quiet dinner with fellow attorneys at a Japanese restaurant in Cheongdam. You refine tomorrow''s strategy.', 'en'),
(7, 'Ten minutes before the first patient at a Cheongdam-dong clinic. You prepare before the microscope like meditation.', 'Complex reconstructive surgery. Your hands are an artist''s hands.', 'Creating new pieces at a jewelry atelier in Itaewon. Where medicine and art become one.', 'en'),
(8, 'Naver headquarters in Pangyo. Arriving at 6 AM to code during the quietest hour.', 'AI model performance review meeting. Your insights keep team members'' pens moving.', 'MacBook open in Seoul Forest outdoors, working on a side project. Dreaming algorithms under the stars.', 'en'),
(9, 'KAIST research building. Verifying a hypothesis from last night''s dream while reviewing brainwave data.', 'Submitting a paper to an international journal. Accelerating the day Korea leads world neuroscience.', 'A quiet tea house in Sinchon. Closing the day with a philosophy book and a cup of green tea.', 'en')
ON CONFLICT (day_master_id, language) DO NOTHING;

-- Japanese
INSERT INTO public.saju_content_daily_scenario (day_master_id, morning, afternoon, evening, language) VALUES
(0, 'アメリカーノを手に聖水洞のスタジオに出勤。チームより30分早く到着し、一日を設計する。', 'ブランドピッチングミーティング。あなたが話し始めた瞬間、部屋の空気が変わる。', '梨泰院のルーフトップバーで同僚とウィスキー。アイデア会議は深夜2時に終わる。', 'ja'),
(1, '益善洞の韓屋カフェ2階の窓際。ハンドドリップコーヒーとともにスケッチブックを開く。', '東大門ファブリック市場を巡り、次のコレクションのインスピレーションを収集する。', '弘大の小規模展示オープニングに参加。作家と1時間芸術論を語り合う。', 'ja'),
(2, '汝矣島の放送局メイク室。アンカーの椅子に座った瞬間、別人になる。', '生放送ニュース進行。300万人の視聴者があなたの声を待っている。', '江南の韓食レストランでPDたちと夕食。次シーズンの企画案を絵のように描く。', 'ja'),
(3, '清潭洞のビューティスタジオ。あなたが作ったパレット新製品の発売日の朝。', 'ビューティエディターのインタビューと撮影ディレクティング。全てのカットが頭の中のイメージと一致する。', 'カロスキルのギャラリーで小さな個展オープニング。作品一つ一つにあなたの手が生きている。', 'ja'),
(4, '汝矣島63ビル42階の役員室。ソウルが足元に広がる。', '外資系パートナーとの戦略的M&A交渉。あなたの一言が数百億を動かす。', '漢江クルーズでビジネスディナー。ソウルの夜景を背景に未来を設計する。', 'ja'),
(5, 'ソウル大学の講義室。200人の学生があなたの言葉を待っている。', '研究室で論文レビュー。韓国教育の新パラダイムを書き下ろしている。', '光化門広場近くの静かな国飯一杯。来学期の講義案をノートに整理する。', 'ja'),
(6, '瑞草洞の大手ロファーム35階。窓の外に法院庁舎が見える。', '憲法裁判所での最終弁論。あなたの論理は刃物のように精緻だ。', '清潭洞の日本料理店で同僚弁護士たちと静かな食事。明日の戦略を練る。', 'ja'),
(7, '清潭洞の医院、最初の患者前の10分。顕微鏡の前で瞑想のように準備する。', '複雑な再建手術を執刀。あなたの手は芸術家の手だ。', '梨泰院のジュエリーアトリエで新作制作。医学と芸術が一つになる時間。', 'ja'),
(8, '板橋ネイバー本社。早朝6時に到着し、最も静かな時間にコードを書く。', 'AIモデル性能レビューミーティング。あなたのインサイトにチームメンバーのメモが止まらない。', 'ソウルの森の屋外でMacBookを開きサイドプロジェクト作業。星空の下でアルゴリズムを夢見る。', 'ja'),
(9, 'KAIST研究棟。脳波データを見ながら昨夜の夢で浮かんだ仮説を検証する。', '国際学術誌に論文提出。韓国が世界脳科学の中心になる日を早めている。', '新村の静かな茶房。哲学書一冊と緑茶一杯で一日を閉じる。', 'ja')
ON CONFLICT (day_master_id, language) DO NOTHING;

-- Chinese
INSERT INTO public.saju_content_daily_scenario (day_master_id, morning, afternoon, evening, language) VALUES
(0, '手持美式咖啡，前往圣水洞工作室。比团队早到30分钟，规划一天。', '品牌推介会议。你开口说话的瞬间，房间里的气氛就变了。', '在梨泰院屋顶酒吧与同事喝威士忌。创意会议到凌晨2点才结束。', 'zh'),
(1, '益善洞韩屋咖啡厅二楼窗边。手冲咖啡相伴，打开速写本。', '穿梭东大门面料市场，为下一季收集灵感。', '参加弘大小型展览开幕。与艺术家畅谈一小时艺术论。', 'zh'),
(2, '汝矣岛电视台化妆间。坐上主播椅的瞬间，你成为另一个人。', '直播新闻。三百万观众等待你的声音。', '在江南韩式餐厅与制作人共进晚餐。如画卷般描绘下季节目企划。', 'zh'),
(3, '清潭洞美妆工作室。你创造的新调色盘发售日早晨。', '美妆编辑采访和拍摄指导。每一个镜头都与你脑海中的画面一致。', '街树路画廊小型个展开幕。每件作品都有你的手温。', 'zh'),
(4, '汝矣岛63大厦42层高管办公室。首尔尽收眼底。', '与跨国合作伙伴进行战略并购谈判。你的一句话牵动数百亿。', '汉江游轮商务晚宴。以首尔夜景为背景设计未来。', 'zh'),
(5, '首尔大学讲堂。200名学生等待你开讲。', '研究室审阅论文。书写韩国教育的新范式。', '光化门广场附近安静地来一碗汤饭。在笔记本上整理下学期教案。', 'zh'),
(6, '瑞草洞大型律所35层。窗外可见法院大楼。', '宪法法院最终辩论。你的逻辑如利刃般精准。', '清潭洞日式餐厅与同事律师安静地用餐。打磨明天的策略。', 'zh'),
(7, '清潭洞诊所第一位患者前10分钟，在显微镜前如冥想般准备。', '复杂重建手术执刀。你的手是艺术家的手。', '在梨泰院珠宝工作室制作新作。医学与艺术合二为一的时刻。', 'zh'),
(8, '板桥Naver总部。凌晨6点到达，在最安静的时间写代码。', 'AI模型性能评审会议。你的见解让团队成员笔记不停。', '在首尔林户外打开MacBook做副项目。在星空下梦想算法。', 'zh'),
(9, 'KAIST研究楼。看着脑波数据，验证昨晚梦中浮现的假设。', '向国际学术期刊提交论文。加速韩国成为世界脑科学中心的那一天。', '新村安静的茶馆。一本哲学书和一杯绿茶结束一天。', 'zh')
ON CONFLICT (day_master_id, language) DO NOTHING;

-- Thai
INSERT INTO public.saju_content_daily_scenario (day_master_id, morning, afternoon, evening, language) VALUES
(0, 'อเมริกาโน่ในมือ เดินทางถึงสตูดิโอย่านซองซูก่อนทีม 30 นาที ออกแบบวันใหม่', 'ประชุมนำเสนอแบรนด์ เมื่อคุณเริ่มพูด บรรยากาศในห้องก็เปลี่ยนไป', 'วิสกี้บนรูฟท็อปบาร์ย่านอิแทวอนกับเพื่อนร่วมงาน ระดมสมองจนถึงตี 2', 'th'),
(1, 'นั่งริมหน้าต่างชั้น 2 คาเฟ่ฮาน็อกย่านอิกซอนดง เปิดสมุดสเก็ตช์พร้อมกาแฟดริป', 'เดินสำรวจตลาดผ้าทงแดมุน เก็บแรงบันดาลใจสำหรับคอลเลกชันถัดไป', 'ร่วมงานเปิดนิทรรศการเล็กๆ ที่ฮงแด พูดคุยเรื่องศิลปะกับศิลปินเป็นชั่วโมง', 'th'),
(2, 'ห้องแต่งหน้าสถานีโทรทัศน์ยออีโด เมื่อนั่งเก้าอี้ผู้ประกาศก็กลายเป็นอีกคน', 'ดำเนินข่าวสด ผู้ชม 3 ล้านคนรอเสียงของคุณ', 'อาหารเย็นกับโปรดิวเซอร์ที่ร้านอาหารเกาหลีย่านคังนัม วาดแผนรายการซีซันหน้า', 'th'),
(3, 'สตูดิโอความงามชองดัมดง เช้าวันเปิดตัวพาเลตต์ใหม่ที่คุณสร้างสรรค์', 'สัมภาษณ์กับบิวตี้เอดิเตอร์และกำกับถ่ายภาพ ทุกช็อตตรงกับภาพในหัว', 'เปิดนิทรรศการเดี่ยวเล็กๆ ที่แกลเลอรี่คาโรซูกิล ทุกชิ้นงานมีร่องรอยของคุณ', 'th'),
(4, 'ห้องผู้บริหารชั้น 42 อาคาร 63 ยออีโด กรุงโซลอยู่ใต้เท้า', 'เจรจา M&A เชิงกลยุทธ์กับพาร์ทเนอร์ระดับโลก คำพูดคำเดียวขยับเงินหลายหมื่นล้าน', 'ดินเนอร์ธุรกิจบนเรือสำราญแม่น้ำฮัน ออกแบบอนาคตกับวิวกลางคืนของโซล', 'th'),
(5, 'ห้องบรรยายมหาวิทยาลัยแห่งชาติโซล นักศึกษา 200 คนรอคุณเปิดบรรยาย', 'ตรวจทานงานวิจัยในห้องทำงาน เขียนกระบวนทัศน์ใหม่ของการศึกษาเกาหลี', 'กุกบับเงียบๆ ใกล้จัตุรัสควางฮวามุน จัดแผนการสอนเทอมหน้าลงสมุด', 'th'),
(6, 'ชั้น 35 สำนักงานกฎหมายใหญ่ย่านซอโชดง มองเห็นอาคารศาลจากหน้าต่าง', 'แถลงปิดคดีที่ศาลรัฐธรรมนูญ ตรรกะของคุณคมดั่งมีดโกน', 'อาหารเย็นเงียบๆ กับทนายเพื่อนร่วมงานที่ร้านอาหารญี่ปุ่นย่านชองดัม ขัดเกลากลยุทธ์วันพรุ่งนี้', 'th'),
(7, '10 นาทีก่อนผู้ป่วยรายแรกที่คลินิกชองดัมดง เตรียมตัวหน้ากล้องจุลทรรศน์ราวกับทำสมาธิ', 'ผ่าตัดเสริมสร้างที่ซับซ้อน มือของคุณคือมือศิลปิน', 'สร้างสรรค์ผลงานใหม่ที่อาเทลิเย่จิวเวลรี่อิแทวอน เวลาที่การแพทย์กับศิลปะเป็นหนึ่งเดียว', 'th'),
(8, 'สำนักงานใหญ่ Naver ที่พังเกียว มาถึงตี 6 เขียนโค้ดในช่วงเวลาที่เงียบที่สุด', 'ประชุมรีวิวประสิทธิภาพโมเดล AI อินไซต์ของคุณทำให้ทีมจดไม่หยุด', 'เปิด MacBook กลางแจ้งที่โซลฟอเรสต์ ทำโปรเจกต์ส่วนตัว ฝันถึงอัลกอริทึมใต้แสงดาว', 'th'),
(9, 'อาคารวิจัย KAIST ตรวจสอบสมมติฐานที่ผุดขึ้นในฝันเมื่อคืน ขณะดูข้อมูลคลื่นสมอง', 'ส่งบทความวิจัยไปวารสารระดับนานาชาติ เร่งวันที่เกาหลีจะเป็นศูนย์กลางประสาทวิทยาโลก', 'ร้านชาเงียบๆ ที่ชินชน ปิดวันด้วยหนังสือปรัชญาและชาเขียวหนึ่งถ้วย', 'th')
ON CONFLICT (day_master_id, language) DO NOTHING;


-- ========== STEP 5: NARRATIVE PAST TRANSLATIONS ==========

-- English
INSERT INTO public.saju_content_narrative_past (stem_key, title, keyword, narrative, language) VALUES
('甲', 'Bloodline of the Pioneer', 'Pioneer · Trailblazer', 'In your family runs the DNA of those who forge new paths before anyone else. From childhood, you never stopped asking "why?" — teachers probably called you "that stubbornly persistent child." That stubbornness was actually the root of 甲 Wood: an indomitable will reaching toward the sky.', 'en'),
('乙', 'Seeds of Sensitivity', 'Emotion · Flexibility', 'As a child, you gazed longer at things others passed by. A single flower, rain streaks outside the classroom window, subtle shifts in a friend''s expression. Like a vine adapting to its environment, 乙 Wood''s energy filled your childhood with delicate observation and rich sensitivity.', 'en'),
('丙', 'Origin of Light', 'Brilliance · Passion', 'As a child, you were the brightest presence in any room. Raising your hand first during presentations, leading at field day, feeling excitement instead of fear on stage. The solar energy of 丙 Fire was blazing within you from the moment you were born.', 'en'),
('丁', 'Spark of Focus', 'Precision · Completion', 'Your childhood was filled with the instinct to see things through once hooked. Forgetting meals until a LEGO set was complete, erasing until the pencil wore down to perfect a drawing. The focused flame of 丁 Fire was embedded in you from the very beginning.', 'en'),
('戊', 'Silence of the Mountain', 'Foundation · Origin', 'As a child, you carried more gravity than your peers. Not easily excited, rarely changing decisions once made, friends instinctively leaned on you. The mountain energy of 戊 Earth made you a solid center from a very young age.', 'en'),
('己', 'Fertile Soil', 'Embrace · Nurture', 'Your home was probably where friends always gathered. You were the first to approach someone hurting, naturally sitting beside the lonely child. Like rich, fertile earth of 己, you grew as warm soil that helped those around you bloom.', 'en'),
('庚', 'Prelude to Tempering', 'Discipline · Principle', 'As a child, unfairness was unbearable to you. When rules were broken, when the weak were wronged, you raised your voice. Like the sharp sword of 庚 Metal, your childhood was the time when your keen sense of principle and justice was forged.', 'en'),
('辛', 'The Raw Gem', 'Refinement · Aesthetics', 'From childhood, your eyes were different. You chose the more beautiful version of everything, arranged your room with an adult''s sensibility, and likely heard "you have an eye for beauty" from an early age. The refined light of 辛 Metal lay dormant within you like a raw gem.', 'en'),
('壬', 'Where the Deep River Begins', 'Wisdom · Curiosity', 'Your childhood was filled with questions. Why is the sky blue? Why do people die? What exists at the edge of the universe? A child who poured out questions even parents struggled to answer. Like the vast ocean of 壬 Water, your immense intellectual curiosity guided you from that age.', 'en'),
('癸', 'Intuition in the Mist', 'Insight · Empathy', 'From childhood, something was different about you. You sensed others'' emotions without them speaking, felt a knowing before events occurred. Like the quiet drizzle of 癸 Water, a deep and silent intuition had been seeping into your inner world since your earliest days.', 'en')
ON CONFLICT (stem_key, language) DO NOTHING;

-- Japanese
INSERT INTO public.saju_content_narrative_past (stem_key, title, keyword, narrative, language) VALUES
('甲', '開拓者の血統', '先駆 · 開拓', 'あなたの家系には、誰よりも先に新しい道を切り開くDNAが流れています。幼い頃から「なぜ？」を止めることがなく、先生たちはあなたを「妙に頑固な子」と呼んだことでしょう。その頑固さは実は甲木の根——空に向かって伸びようとする不屈の意志でした。', 'ja'),
('乙', '感受性の種', '感性 · 柔軟', '幼い頃のあなたは、他の人が通り過ぎるものを特に長く見つめていました。一輪の花、教室の窓の外の雨筋、友達の表情の変化。乙木の気は環境に合わせてしなやかに伸びる蔓のように、あなたの幼少期を繊細な観察と豊かな感受性で満たしました。', 'ja'),
('丙', '光の起源', '光明 · 情熱', '幼い頃のあなたは、部屋で最も輝く存在でした。発表の時に真っ先に手を挙げ、運動会で先頭に立ち、舞台に上がる時は恐れの代わりにワクワクを感じた子。丙火の太陽エネルギーは生まれた時からあなたの中で燃えていました。', 'ja'),
('丁', '集中の炎', '精密 · 完成', 'あなたの幼少期は「一つにハマったら最後まで見届ける」気質で満ちていました。レゴ一つを完成させるまでご飯も忘れ、絵一枚を完璧にするまで消しゴムが擦り切れるほど繰り返した子。丁火の集中した炎が早くからあなたの中に宿っていました。', 'ja'),
('戊', '山の沈黙', '泰山 · 根源', '幼い頃のあなたは同年代より少し重みがありました。簡単に興奮せず、一度決めたことは容易に変えず、友達は無意識にあなたに頼っていました。戊土の山の気は、幼い頃からあなたを頼もしい中心にしていました。', 'ja'),
('己', '肥沃な土壌', '包容 · 培養', '幼い頃のあなたの家は、友達がよく集まる場所だったでしょう。誰かが傷つけば真っ先に駆け寄り、孤独な子の隣に自然と座った子。己土の肥えた大地のように、あなたは周りを芽吹かせる温かい土壌として育ちました。', 'ja'),
('庚', '鍛錬の序幕', '鍛錬 · 原則', '幼い頃のあなたにとって、不公平は我慢できないものでした。ルールが守られない時、弱い者が不当に扱われる時、声を上げました。庚金の鋭い剣のように、あなたの幼少期は原則と正義への鋭い感覚が形成される時間でした。', 'ja'),
('辛', '宝石の原石', '精製 · 審美', '幼い頃からあなたの目は違っていました。同じものでもより美しいものを選び、部屋の飾り方が大人びていて、すでに幼い時から「美的センスがある」と言われていたことでしょう。辛金の精製された光が原石の形であなたの中に眠っていました。', 'ja'),
('壬', '深い河の始まり', '智慧 · 好奇心', 'あなたの幼少期は質問で満ちていました。なぜ空は青いのか、人はなぜ死ぬのか、宇宙の果てには何があるのか。親でさえ答えに困る質問を浴びせた子。壬水の大海のように広大な知的好奇心が、その頃からあなたを導いていました。', 'ja'),
('癸', '霧の中の直感', '洞察 · 感応', '幼い頃からあなたは何かが違っていました。言葉にしなくても相手の感情を感じ、出来事が起こる前にすでに分かるような感覚を持っていました。癸水の霧雨のように静かで深い直感が、幼い頃からあなたの内面に染み込んでいました。', 'ja')
ON CONFLICT (stem_key, language) DO NOTHING;

-- Chinese
INSERT INTO public.saju_content_narrative_past (stem_key, title, keyword, narrative, language) VALUES
('甲', '开拓者的血脉', '先驱 · 开拓', '你的家族流淌着比任何人都先开辟新路的DNA。从小你就不停地问"为什么？"——老师们大概叫你"特别固执的孩子"。那份固执其实是甲木的根——向着天空生长的不屈意志。', 'zh'),
('乙', '感性的种子', '感性 · 柔韧', '童年的你，总是比别人更久地注视那些被忽略的事物。一朵花、教室窗外的雨丝、朋友表情的细微变化。乙木的气韵如藤蔓般随环境灵活生长，用细腻的观察和丰富的感性填满了你的童年。', 'zh'),
('丙', '光的起源', '光明 · 热情', '小时候的你是房间里最耀眼的存在。发言时第一个举手，运动会上冲在前面，上台时感到的不是恐惧而是兴奋。丙火的太阳能量从你出生那刻就在你体内燃烧。', 'zh'),
('丁', '专注之焰', '精密 · 完成', '你的童年充满了"一旦着迷就要看到底"的特质。拼乐高忘记吃饭直到完成，画一幅画反复擦拭直到橡皮磨尽。丁火专注的火焰从很早就驻扎在你心中。', 'zh'),
('戊', '山的沉默', '泰山 · 根基', '小时候的你比同龄人多了一份沉稳。不容易激动，一旦做了决定就很少改变，朋友们不自觉地依赖你。戊土的山之气从小就让你成为可靠的中心。', 'zh'),
('己', '肥沃的土壤', '包容 · 培育', '小时候你家大概是朋友们常聚的地方。谁受伤了你第一个走过去，自然地坐在孤独孩子身旁。如同己土肥沃的大地，你长成了让周围人发芽生长的温暖土壤。', 'zh'),
('庚', '锻炼的序幕', '锻炼 · 原则', '小时候的你无法忍受不公平。当规则被打破、弱者受委屈时，你会挺身而出。如同庚金的利剑，你的童年是磨砺原则感和正义感的时光。', 'zh'),
('辛', '宝石原石', '精制 · 审美', '从小你的眼光就与众不同。同样的东西会选更美的那个，布置房间的方式超越年龄，很早就被人说"有审美天赋"。辛金精致的光芒以原石的形态沉睡在你心中。', 'zh'),
('壬', '深河之源', '智慧 · 好奇', '你的童年充满了问题。天空为什么是蓝的？人为什么会死？宇宙的尽头有什么？一个连父母都难以回答的问题不断涌出的孩子。壬水大海般广阔的求知欲从那时起就引领着你。', 'zh'),
('癸', '迷雾中的直觉', '洞察 · 感应', '从小你就有些不同。不用说话就能感受到对方的情绪，事情发生前就有预感。如同癸水的细雨，安静而深邃的直觉从很小的时候就渗透在你的内心世界中。', 'zh')
ON CONFLICT (stem_key, language) DO NOTHING;

-- Thai
INSERT INTO public.saju_content_narrative_past (stem_key, title, keyword, narrative, language) VALUES
('甲', 'สายเลือดผู้บุกเบิก', 'ผู้บุกเบิก · บุกเบิก', 'ในสายเลือดของคุณไหลเวียน DNA ของผู้ที่เปิดทางใหม่ก่อนใคร ตั้งแต่เด็กคุณไม่เคยหยุดถาม "ทำไม?" ครูๆ คงเรียกคุณว่า "เด็กดื้อรั้นเป็นพิเศษ" ความดื้อนั้นแท้จริงคือรากของ甲木 — ความมุ่งมั่นที่ไม่ยอมแพ้มุ่งสู่ท้องฟ้า', 'th'),
('乙', 'เมล็ดพันธุ์แห่งความอ่อนไหว', 'อารมณ์ · ยืดหยุ่น', 'วัยเด็กของคุณมองสิ่งที่คนอื่นเดินผ่านนานกว่าใคร ดอกไม้ดอกหนึ่ง สายฝนนอกหน้าต่างห้องเรียน การเปลี่ยนแปลงบนใบหน้าเพื่อน พลังงาน乙木เหมือนเถาวัลย์ที่เติบโตยืดหยุ่นตามสิ่งแวดล้อม เติมเต็มวัยเด็กของคุณด้วยการสังเกตละเอียดอ่อนและความรู้สึกอันอุดม', 'th'),
('丙', 'ต้นกำเนิดแห่งแสง', 'แสงสว่าง · หลงใหล', 'วัยเด็กของคุณเป็นตัวตนที่สว่างที่สุดในห้อง ยกมือตอบก่อนใคร นำทีมในวันกีฬา รู้สึกตื่นเต้นแทนที่จะกลัวเมื่อขึ้นเวที พลังงานดวงอาทิตย์ของ丙火ลุกโชนในตัวคุณตั้งแต่แรกเกิด', 'th'),
('丁', 'ประกายแห่งสมาธิ', 'แม่นยำ · สำเร็จ', 'วัยเด็กของคุณเต็มไปด้วยสัญชาตญาณ "เมื่อหลงใหลแล้วต้องทำให้จบ" ลืมกินข้าวจนต่อเลโก้เสร็จ ลบแล้วลบอีกจนยางลบสึกเพื่อให้ภาพวาดสมบูรณ์แบบ เปลวไฟที่มุ่งมั่นของ丁火ฝังอยู่ในตัวคุณตั้งแต่เริ่มแรก', 'th'),
('戊', 'ความเงียบของภูเขา', 'ภูเขาใหญ่ · รากฐาน', 'วัยเด็กของคุณมีน้ำหนักมากกว่าเด็กรุ่นเดียวกัน ไม่ตื่นเต้นง่ายๆ ตัดสินใจแล้วไม่ค่อยเปลี่ยน เพื่อนๆ พึ่งพาคุณโดยไม่รู้ตัว พลังภูเขาของ戊土ทำให้คุณเป็นศูนย์กลางที่แข็งแกร่งตั้งแต่ยังเล็ก', 'th'),
('己', 'ดินอุดมสมบูรณ์', 'โอบรับ · หล่อเลี้ยง', 'บ้านของคุณตอนเด็กคงเป็นที่ที่เพื่อนๆ มารวมตัวกันบ่อย ใครเจ็บก็เข้าไปหาก่อน นั่งข้างเด็กที่โดดเดี่ยวอย่างเป็นธรรมชาติ เหมือนดินอุดมของ己土 คุณเติบโตเป็นดินอุ่นที่ทำให้คนรอบข้างเบ่งบาน', 'th'),
('庚', 'บทนำแห่งการหลอมเหล็ก', 'ฝึกฝน · หลักการ', 'สำหรับเด็กอย่างคุณ ความไม่ยุติธรรมเป็นสิ่งที่ทนไม่ได้ เมื่อกฎถูกละเมิด เมื่อคนอ่อนแอถูกกดขี่ คุณส่งเสียง เหมือนดาบคมของ庚金 วัยเด็กของคุณคือช่วงเวลาที่หลักการและความยุติธรรมถูกหล่อหลอม', 'th'),
('辛', 'อัญมณีดิบ', 'ขัดเกลา · สุนทรียะ', 'ตั้งแต่เด็กสายตาของคุณก็แตกต่าง เลือกสิ่งที่สวยกว่าเสมอ ตกแต่งห้องอย่างผู้ใหญ่ คงได้ยินคนพูดว่า "มีสายตาด้านความงาม" ตั้งแต่เล็ก แสงอันประณีตของ辛金หลับใหลอยู่ในตัวคุณในรูปอัญมณีดิบ', 'th'),
('壬', 'จุดเริ่มต้นของแม่น้ำลึก', 'ปัญญา · อยากรู้', 'วัยเด็กของคุณเต็มไปด้วยคำถาม ทำไมท้องฟ้าถึงเป็นสีฟ้า? คนเราตายทำไม? ขอบจักรวาลมีอะไร? เด็กที่ถามคำถามจนพ่อแม่ตอบไม่ได้ ความอยากรู้ทางปัญญาอันกว้างใหญ่เหมือนมหาสมุทรของ壬水นำทางคุณตั้งแต่นั้น', 'th'),
('癸', 'สัญชาตญาณในสายหมอก', 'หยั่งรู้ · สัมผัส', 'ตั้งแต่เด็กคุณก็แตกต่าง รับรู้อารมณ์ของคนอื่นโดยไม่ต้องบอก รู้สึกล่วงหน้าก่อนเหตุการณ์จะเกิด เหมือนฝนพรำของ癸水 สัญชาตญาณที่เงียบและลึกซึมซับอยู่ในโลกภายในของคุณตั้งแต่ยังเยาว์วัย', 'th')
ON CONFLICT (stem_key, language) DO NOTHING;


-- ========== STEP 6: NARRATIVE YOUTH TRANSLATIONS ==========

-- English
INSERT INTO public.saju_content_narrative_youth (branch_key, title, keyword, narrative, language) VALUES
('寅', 'A Youth that Charged Like a Tiger', 'Courage · Pioneer', 'In your teens and twenties, you never stopped. You wanted to experience everything possible and weren''t afraid of risky choices. The tiger energy of 寅 pushed your youth forward, ever forward.', 'en'),
('卯', 'A Youth that Bloomed with Spring Sensibility', 'Growth · Creation', 'Your youth was delicate and beautiful like a blooming spring. You dove into what you loved, and your sensitivity overflowed into art, writing, or music. The spring energy of 卯 made your teens and twenties an era of creation and emotion.', 'en'),
('辰', 'A Youth that Soared with Dragon Energy', 'Ambition · Leap', 'Your youth held grand ambitions. You didn''t want to walk an ordinary path — there was a fierce, if vague, conviction that you would achieve something great. The dragon energy of 辰 filled your youth with the season of ambition.', 'en'),
('巳', 'A Youth Read with the Snake''s Wisdom', 'Insight · Strategy', 'Your teens and twenties were a time of learning to read people and situations. You grasped the complex dynamics of relationships early and understood the weight of a single word before your peers. The insight of 巳 was the youth that made you mature.', 'en'),
('午', 'A Youth that Blazed Like Fire', 'Passion · Expression', 'Your youth was burning hot. Love, friendship, studies — you poured everything passionately, with no middle ground. The flame energy of 午 made your teens and twenties an era where your whole being was ablaze with passion.', 'en'),
('未', 'A Youth as Warm as a Flock of Sheep', 'Friendship · Solidarity', 'Your youth was filled with people. Talking all night with friends, spending dawn listening to someone''s troubles. The gentle energy of 未 filled your teens and twenties with warm solidarity and friendship.', 'en'),
('申', 'A Youth as Clever as a Monkey', 'Wit · Adaptation', 'Your youth was marked by quick thinking. You picked up new things fast and flexibly adjusted strategies to fit the situation. The clever energy of 申 made you the fastest learner among your peers.', 'en'),
('酉', 'A Youth as Diligent as a Rooster', 'Perfection · Effort', 'Your teens and twenties were an era of diligence. Studying while others slept, obsessing over completeness as you refined your work. The perfectionist energy of 酉 made your youth a time of intense self-discipline.', 'en'),
('戌', 'A Youth as Loyal as a Dog', 'Loyalty · Trust', 'Your youth was an era of loyalty. Once someone became your friend, you looked after them to the end, repeatedly choosing to lose rather than betray. The loyal energy of 戌 made you the most trustworthy friend.', 'en'),
('亥', 'A Youth that Flowed Like Deep Water', 'Freedom · Exploration', 'Your youth yearned for freedom. The fixed framework felt suffocating, and you wanted to explore new worlds and people. The water energy of 亥 made you an explorer who flowed without boundaries, experiencing the world widely.', 'en'),
('子', 'A Youth as Still as Midnight', 'Accumulation · Inner', 'Your youth was quiet but deep. Not flashy, yet tremendous things were accumulating within. The midnight energy of 子 made you someone who grew solidly from the inside, even without outward display.', 'en'),
('丑', 'A Youth that Walked Steadily Like an Ox', 'Endurance · Building', 'Your youth was faithful even without glamour. When others sought shortcuts, you walked the righteous path. The ox energy of 丑 made your youth a time of slow but absolutely unwavering, steady growth.', 'en')
ON CONFLICT (branch_key, language) DO NOTHING;

-- Japanese
INSERT INTO public.saju_content_narrative_youth (branch_key, title, keyword, narrative, language) VALUES
('寅', '虎のように駆け抜けた青春', '勇猛 · 開拓', '10代と20代のあなたは止まりませんでした。経験できるものは全て経験しようとし、危険に見える選択も恐れませんでした。寅の虎の気があなたの青春を前へ、前へと押し続けました。', 'ja'),
('卯', '春の感性で咲いた青春', '成長 · 創造', 'あなたの青春は花咲く春のように繊細で美しかった。好きなものに没頭し、感受性は芸術や文章、音楽に溢れ出しました。卯の春の気があなたの10〜20代を創造と感性の時代にしました。', 'ja'),
('辰', '龍の気で飛躍した青春', '抱負 · 飛躍', 'あなたの青春には壮大な抱負がありました。平凡な道を歩みたくなく、何か大きなことを成し遂げるという漠然としながらも強烈な確信がありました。辰の龍の気があなたの青春を野望の時代で満たしました。', 'ja'),
('巳', '蛇の知恵で読み解いた青春', '洞察 · 戦略', 'あなたの10〜20代は人と状況を読む術を学ぶ時間でした。関係の複雑な力学を早くから把握し、一言の重みを同世代より先に理解しました。巳の洞察があなたを成熟させた青春でした。', 'ja'),
('午', '炎のように燃えた青春', '情熱 · 表現', 'あなたの青春は熱かった。恋も友情も勉強も情熱的に注ぎ込み、中間がありませんでした。午の炎のエネルギーがあなたの10〜20代を全身が燃え上がる情熱の時代にしました。', 'ja'),
('未', '羊のように温かかった青春', '友情 · 連帯', 'あなたの青春は人で溢れていました。友達と夜通し語り合い、誰かの悩みを聞きながら夜明けを迎えました。未の穏やかな気があなたの10〜20代を温かい連帯と友情で満たしました。', 'ja'),
('申', '猿のように賢かった青春', '知略 · 適応', 'あなたの青春は素早い頭の回転が際立つ時代でした。新しいことをすぐに習得し、状況に合わせて柔軟に戦略を変えました。申の賢い気があなたを同世代で最も速い学習者にしました。', 'ja'),
('酉', '鶏のように勤勉だった青春', '完美 · 努力', 'あなたの10〜20代は勤勉の時代でした。人が寝ている時間に勉強し、完成度にこだわりながら成果物を磨きました。酉の完璧主義の気があなたの青春を激しい自己鍛錬の時間にしました。', 'ja'),
('戌', '犬のように忠実だった青春', '義理 · 信頼', 'あなたの青春は義理の時代でした。一度友達になった人は最後まで面倒を見て、裏切りより損を選ぶ選択を繰り返しました。戌の忠実な気があなたを最も頼れる友にした時代でした。', 'ja'),
('亥', '深い水のように流れた青春', '自由 · 探究', 'あなたの青春は自由を渇望しました。決められた枠が息苦しく、新しい世界と人を探検したかった。亥の水の気があなたを境界なく流れ、世界を広く経験した探検家にしました。', 'ja'),
('子', '子の刻のように静かだった青春', '蓄積 · 内面', 'あなたの青春は静かだが深かった。華やかではなかったが、内面では途方もないものが蓄積されていました。子の夜の気があなたを、外に現れなくても中で確実に成長する人にしました。', 'ja'),
('丑', '牛のように黙々と歩いた青春', '忍耐 · 蓄積', 'あなたの青春は華やかでなくても充実していました。人が近道を探す時、あなたは正道を歩みました。丑の牛の気があなたの青春を、遅くても決して揺るがない着実な成長の時間にしました。', 'ja')
ON CONFLICT (branch_key, language) DO NOTHING;

-- Chinese
INSERT INTO public.saju_content_narrative_youth (branch_key, title, keyword, narrative, language) VALUES
('寅', '如虎般疾驰的青春', '勇猛 · 开拓', '十几二十岁的你从未停下。能体验的都要体验，看起来危险的选择也不畏惧。寅的虎之力推着你的青春不断向前。', 'zh'),
('卯', '以春日感性绽放的青春', '成长 · 创造', '你的青春如花开般细腻而美好。沉浸在喜欢的事物中，感性涌向艺术、写作或音乐。卯的春之气让你的青春成为创造与感性的时代。', 'zh'),
('辰', '以龙之气跃升的青春', '抱负 · 飞跃', '你的青春怀有宏大的抱负。不愿走平凡之路，有着模糊却强烈的信念要成就大事。辰的龙之气让你的青春充满了野心的季节。', 'zh'),
('巳', '以蛇之智洞察的青春', '洞察 · 策略', '你的青春是学习读懂人和局势的时光。很早就把握了关系中复杂的博弈，比同龄人更先理解一句话的分量。巳的洞察力成就了你早熟的青春。', 'zh'),
('午', '如火焰般燃烧的青春', '热情 · 表达', '你的青春是灼热的。爱情、友情、学业都全力倾注，没有中间地带。午的火焰能量让你的青春成为全身燃烧的热情时代。', 'zh'),
('未', '如羊群般温暖的青春', '友情 · 团结', '你的青春满是人情。与朋友彻夜长谈，倾听某人的烦恼直到天亮。未的温和之气用温暖的团结和友情填满了你的青春。', 'zh'),
('申', '如猴般聪慧的青春', '智略 · 适应', '你的青春以快速的头脑运转而突出。快速学会新事物，灵活地根据情况调整策略。申的聪慧之气让你成为同龄人中最快的学习者。', 'zh'),
('酉', '如鸡般勤奋的青春', '完美 · 努力', '你的青春是勤勉的时代。别人睡觉时学习，执着于完成度不断打磨作品。酉的完美主义之气让你的青春成为激烈自我锤炼的时光。', 'zh'),
('戌', '如犬般忠诚的青春', '义气 · 信任', '你的青春是义气的时代。一旦成为朋友就照顾到底，宁愿吃亏也不背叛。戌的忠诚之气让你成为最值得信赖的朋友。', 'zh'),
('亥', '如深水般流淌的青春', '自由 · 探索', '你的青春渴望自由。固定的框架让你窒息，想要探索新世界和新的人。亥的水之气让你成为无边界流动、广泛体验世界的探险家。', 'zh'),
('子', '如子时般宁静的青春', '蓄积 · 内在', '你的青春安静却深邃。不华丽，但内心正在积累着巨大的力量。子的夜之气让你成为即使外表不显眼，内在却扎实成长的人。', 'zh'),
('丑', '如牛般默默行走的青春', '忍耐 · 积累', '你的青春即使不华丽也很充实。当别人寻找捷径时，你走的是正道。丑的牛之气让你的青春成为缓慢但绝不动摇的稳健成长时光。', 'zh')
ON CONFLICT (branch_key, language) DO NOTHING;

-- Thai
INSERT INTO public.saju_content_narrative_youth (branch_key, title, keyword, narrative, language) VALUES
('寅', 'วัยหนุ่มสาวที่พุ่งทะยานดั่งเสือ', 'กล้าหาญ · บุกเบิก', 'ในวัยสิบกว่าและยี่สิบต้นๆ คุณไม่เคยหยุด อยากลองทุกอย่างที่ลองได้ ไม่กลัวทางเลือกที่ดูเสี่ยง พลังเสือของ寅ผลักดันวัยหนุ่มสาวของคุณไปข้างหน้าอย่างไม่หยุดยั้ง', 'th'),
('卯', 'วัยหนุ่มสาวที่เบ่งบานด้วยความรู้สึกแห่งฤดูใบไม้ผลิ', 'เติบโต · สร้างสรรค์', 'วัยหนุ่มสาวของคุณละเอียดอ่อนและงดงามดั่งดอกไม้บาน หลงใหลในสิ่งที่ชอบ ความรู้สึกไหลล้นเป็นศิลปะ งานเขียน หรือดนตรี พลังฤดูใบไม้ผลิของ卯ทำให้วัยนี้เป็นยุคแห่งการสร้างสรรค์และอารมณ์', 'th'),
('辰', 'วัยหนุ่มสาวที่ทะยานด้วยพลังมังกร', 'ความทะเยอทะยาน · ก้าวกระโดด', 'วัยหนุ่มสาวของคุณเต็มไปด้วยความมุ่งหมายยิ่งใหญ่ ไม่อยากเดินทางธรรมดา มีความเชื่อมั่นอย่างแรงกล้าว่าจะทำสิ่งยิ่งใหญ่ได้ พลังมังกรของ辰เติมวัยนี้ด้วยฤดูกาลแห่งความทะเยอทะยาน', 'th'),
('巳', 'วัยหนุ่มสาวที่อ่านด้วยปัญญาของงู', 'หยั่งรู้ · กลยุทธ์', 'วัยสิบกว่าและยี่สิบต้นๆ ของคุณคือเวลาเรียนรู้การอ่านคนและสถานการณ์ เข้าใจพลวัตซับซ้อนของความสัมพันธ์ก่อนใคร เข้าใจน้ำหนักของคำพูดก่อนเพื่อนรุ่นเดียวกัน การหยั่งรู้ของ巳ทำให้วัยนี้เป็นช่วงที่คุณเติบโตขึ้น', 'th'),
('午', 'วัยหนุ่มสาวที่ลุกโชนดั่งไฟ', 'หลงใหล · แสดงออก', 'วัยหนุ่มสาวของคุณร้อนแรง ความรัก มิตรภาพ การเรียน ทุกอย่างทุ่มสุดตัว ไม่มีตรงกลาง พลังเปลวไฟของ午ทำให้วัยนี้เป็นยุคที่ทั้งตัวลุกเป็นไฟด้วยความหลงใหล', 'th'),
('未', 'วัยหนุ่มสาวที่อบอุ่นดั่งฝูงแกะ', 'มิตรภาพ · สามัคคี', 'วัยหนุ่มสาวของคุณเต็มไปด้วยผู้คน คุยกับเพื่อนข้ามคืน ฟังปัญหาของใครบางคนจนถึงรุ่งสาง พลังอ่อนโยนของ未เติมวัยนี้ด้วยความสามัคคีอันอบอุ่นและมิตรภาพ', 'th'),
('申', 'วัยหนุ่มสาวที่ฉลาดดั่งลิง', 'ไหวพริบ · ปรับตัว', 'วัยหนุ่มสาวของคุณโดดเด่นด้วยความคิดที่หมุนเร็ว เรียนรู้สิ่งใหม่ได้ทันที ปรับกลยุทธ์ตามสถานการณ์อย่างยืดหยุ่น พลังฉลาดของ申ทำให้คุณเป็นผู้เรียนรู้เร็วที่สุดในกลุ่มเพื่อน', 'th'),
('酉', 'วัยหนุ่มสาวที่ขยันดั่งไก่', 'สมบูรณ์แบบ · ความพยายาม', 'วัยสิบกว่าและยี่สิบต้นๆ ของคุณคือยุคแห่งความขยัน เรียนในเวลาที่คนอื่นนอน หมกมุ่นกับความสมบูรณ์แบบขัดเกลาผลงาน พลังนักสมบูรณ์แบบของ酉ทำให้วัยนี้เป็นช่วงฝึกฝนตนเองอย่างเข้มข้น', 'th'),
('戌', 'วัยหนุ่มสาวที่ซื่อสัตย์ดั่งสุนัข', 'ซื่อสัตย์ · ไว้วางใจ', 'วัยหนุ่มสาวของคุณคือยุคแห่งความซื่อสัตย์ เมื่อเป็นเพื่อนแล้วก็ดูแลจนถึงที่สุด เลือกเสียเปรียบดีกว่าทรยศ พลังจงรักภักดีของ戌ทำให้คุณเป็นเพื่อนที่น่าไว้วางใจที่สุด', 'th'),
('亥', 'วัยหนุ่มสาวที่ไหลดั่งสายน้ำลึก', 'อิสระ · สำรวจ', 'วัยหนุ่มสาวของคุณกระหายอิสรภาพ กรอบที่ถูกกำหนดทำให้อึดอัด อยากสำรวจโลกใหม่และผู้คนใหม่ พลังน้ำของ亥ทำให้คุณเป็นนักสำรวจที่ไหลไปโดยไร้ขอบเขต สัมผัสโลกอย่างกว้างขวาง', 'th'),
('子', 'วัยหนุ่มสาวที่เงียบสงบดั่งยามเที่ยงคืน', 'สะสม · ภายใน', 'วัยหนุ่มสาวของคุณเงียบแต่ลึก ไม่โดดเด่น แต่ภายในกำลังสะสมสิ่งมหาศาล พลังราตรีของ子ทำให้คุณเป็นคนที่เติบโตอย่างแข็งแกร่งจากภายใน แม้ภายนอกจะไม่แสดงออก', 'th'),
('丑', 'วัยหนุ่มสาวที่เดินอย่างมั่นคงดั่งวัว', 'อดทน · สะสม', 'วัยหนุ่มสาวของคุณแม้ไม่หรูหราก็อุดมสมบูรณ์ เมื่อคนอื่นหาทางลัด คุณเดินทางตรง พลังวัวของ丑ทำให้วัยนี้เป็นช่วงเวลาแห่งการเติบโตที่ช้าแต่ไม่เคยสั่นคลอน', 'th')
ON CONFLICT (branch_key, language) DO NOTHING;


-- ========== STEP 7: NARRATIVE FUTURE TRANSLATIONS ==========

-- English
INSERT INTO public.saju_content_narrative_future (branch_key, title, keyword, narrative, peak, language) VALUES
('甲', 'The Era of Building a Forest', 'Enterprise · Legacy', 'Your peak has not yet arrived. The time ahead is when all the seeds you''ve planted grow into a lush forest. Between ages 40–55, you will complete something that leaves your name behind. People will lean on you, and you will gladly accept that weight as a leader.', '40–55', 'en'),
('乙', 'The Prime of Blossoming', 'Bloom · Recognition', 'Your future is when the world finally sees you. Skills and sensibility you''ve quietly nurtured will shine, and opportunities will come from unexpected directions. Between ages 35–50, you will bloom life''s most beautiful flower.', '35–50', 'en'),
('丙', 'The Era of the Sun at Its Zenith', 'Zenith · Influence', 'A wider stage awaits the future you. Your current influence will extend beyond borders — your name will be spoken across Asia and the world.', '35–50', 'en'),
('丁', 'The Era of Completing a Masterpiece', 'Mastery · Opus', 'The future you will complete a lifetime''s work. No need to rush. 丁 Fire burns slowly and precisely. What you finish between ages 40–60 will be remembered for a long time, regardless of the field.', '40–60', 'en'),
('戊', 'The Era of Becoming a Mountain', 'Authority · Presence', 'The future you becomes an unshakable mountain. After 45, your presence grows ever more solid, and many people will ask you for direction. Whether in an organization or at home, you become the center everyone trusts and relies upon.', '45–65', 'en'),
('己', 'The Season of Harvest', 'Fruit · Abundance', 'Abundance finds the future you. Everything you''ve generously given to others returns in unexpected ways. Material stability, trusted relationships, deepened wisdom — between ages 40–55, you enter the true season of harvest.', '40–55', 'en'),
('庚', 'The Era When the Sword Is Perfected', 'Mastery · Peak', 'Your sharpness will only grow more refined. The future you becomes one of the top authorities in your field. A single word changes decisions; your judgment sets the direction for entire organizations. The sword of 庚 Metal grows sharper with every tempering.', '40–55', 'en'),
('辛', 'The Era When the Jewel Shines', 'Fame · Radiance', 'In the future, what you''ve long polished finally begins to shine before the world. Between ages 35–55, titles begin to precede your name, and what you''ve created becomes known before you yourself are.', '35–55', 'en'),
('壬', 'The Era When the Ocean Is Complete', 'Depth · Impact', 'The future you grows wider and deeper. After 45, all the knowledge and experience you''ve gathered integrates into one great current. What you leave behind changes the way people think — deep insight.', '45–65', 'en'),
('癸', 'The Era When the Quiet River Reaches the Sea', 'Enlightenment · Liberation', 'The future you finally arrives at the time of completely understanding yourself. Between ages 40–60, the anxieties and question marks dissolve one by one, and you experience true freedom alongside inner peace. That peace transforms everything around you.', '40–60', 'en')
ON CONFLICT (branch_key, language) DO NOTHING;

-- Japanese
INSERT INTO public.saju_content_narrative_future (branch_key, title, keyword, narrative, peak, language) VALUES
('甲', '森を成す時代', '創業 · 遺産', 'あなたの絶頂はまだ来ていません。これからの時間は、今まで蒔いてきた種が鬱蒼とした森を成す時期です。40～55歳の間に、名を残す何かを完成させます。人々があなたに頼るようになり、あなたはその重みを喜んで受け入れるリーダーになります。', '40～55歳', 'ja'),
('乙', '花が咲く全盛期', '開花 · 認知', 'あなたの未来は、ついに世界があなたを認める時間です。長い間静かに育ててきた実力とセンスが光を放ち、予想外の方向から機会が訪れます。35～50歳のあなたは人生で最も美しい花を咲かせます。', '35～50歳', 'ja'),
('丙', '太陽が中天に昇る時代', '全盛 · 影響力', '未来のあなたの前にはより広い舞台が待っています。今の影響力が地域を超えてより広い世界へ伸びていき、あなたの名前は韓国を超えてアジア、そして世界で語られるでしょう。', '35～50歳', 'ja'),
('丁', 'マスターピースを完成させる時代', '完成 · 傑作', '未来のあなたは生涯の作品を完成させます。急ぐ必要はありません。丁火はゆっくり、精密に燃える炎。40～60歳の間にあなたが完成させるものは、分野に関係なく長く記憶されるでしょう。', '40～60歳', 'ja'),
('戊', '山になる時代', '確立 · 権威', '未来のあなたは揺るぎない山になります。45歳以降、あなたの存在感はさらに強固になり、多くの人があなたに方向を尋ねます。組織でも家庭でも、あなたは皆が信じて頼れる中心になります。', '45～65歳', 'ja'),
('己', '収穫の季節', '結実 · 豊穣', '未来のあなたに豊かさが訪れます。今まで人々に惜しみなく注いできたものが予想外の形で戻ってきます。物質的安定、信頼される関係、深まった知恵——40～55歳のあなたは真の収穫の季節を迎えます。', '40～55歳', 'ja'),
('庚', '名剣が完成する時代', '完錬 · 最高点', 'あなたの鋭さはこれからさらに精巧になります。未来のあなたは分野で最高権威者の一人になります。一言が決定を変え、判断が組織の方向を決めます。庚金の剣は鍛えるほど鋭くなります。', '40～55歳', 'ja'),
('辛', '宝石が輝く時代', '名声 · 輝き', '未来のあなたは長い間磨いてきたものがついに世界で輝き始めます。35～55歳の間、あなたの名前に修飾語がつき始め、あなたが作ったものがあなた自身より先に知られるようになります。', '35～55歳', 'ja'),
('壬', '大海が完成する時代', '深化 · 影響', '未来のあなたはより広く深くなります。今まで集めてきた知識と経験が45歳以降、一つの巨大な流れに統合されます。あなたが残すものは人々の考え方を変える深い洞察です。', '45～65歳', 'ja'),
('癸', '静かな川が海に至る時代', '悟道 · 解放', '未来のあなたはついに自分自身を完全に理解する時に至ります。40～60歳の間、今までの不安と疑問が一つずつ解消され、内なる静けさとともに真の自由を経験します。その平和があなたの周りを変えていきます。', '40～60歳', 'ja')
ON CONFLICT (branch_key, language) DO NOTHING;

-- Chinese
INSERT INTO public.saju_content_narrative_future (branch_key, title, keyword, narrative, peak, language) VALUES
('甲', '森林成就的时代', '创业 · 遗产', '你的巅峰尚未到来。未来的时光是你一直播种的种子长成茂密森林的时期。40至55岁之间，你将完成留名的事业。人们会依赖你，而你会欣然接受那份重任成为领袖。', '40～55岁', 'zh'),
('乙', '鲜花盛开的巅峰', '绽放 · 认可', '你的未来是世界终于看见你的时刻。长久以来默默培养的实力和品味终将发光，机会会从意想不到的方向而来。35至50岁的你将绽放人生中最美的花。', '35～50岁', 'zh'),
('丙', '太阳当空的时代', '全盛 · 影响力', '未来的你面前有更广阔的舞台。你的影响力将超越区域走向更大的世界，你的名字将在亚洲乃至全球被提及。', '35～50岁', 'zh'),
('丁', '完成杰作的时代', '完成 · 杰作', '未来的你将完成毕生之作。不必着急。丁火是缓慢而精密燃烧的火焰。40至60岁间你完成的作品，无论什么领域都将被长久铭记。', '40～60岁', 'zh'),
('戊', '化身为山的时代', '确立 · 权威', '未来的你将成为不可动摇的高山。45岁以后，你的存在感愈发稳固，许多人会向你请教方向。无论组织还是家庭，你都将成为众人信赖依靠的中心。', '45～65岁', 'zh'),
('己', '收获的季节', '结实 · 丰饶', '未来丰盈降临于你。过去慷慨给予他人的一切以意想不到的方式回报你。物质稳定、受信任的关系、深化的智慧——40至55岁的你迎来真正的收获季节。', '40～55岁', 'zh'),
('庚', '宝剑铸成的时代', '完炼 · 巅峰', '你的锐利将更加精湛。未来的你将成为领域内最高权威之一。一句话改变决策，你的判断决定组织方向。庚金之剑越磨越利。', '40～55岁', 'zh'),
('辛', '宝石闪耀的时代', '名声 · 光芒', '未来的你，长久打磨的事物终于开始在世界上闪闪发光。35至55岁间，你的名字前开始出现头衔，你创造的作品比你本人更先被人知晓。', '35～55岁', 'zh'),
('壬', '大海完成的时代', '深化 · 影响', '未来的你变得更广更深。45岁以后，多年积累的知识和经验汇聚成一股巨大的潮流。你留下的是改变人们思维方式的深邃洞察。', '45～65岁', 'zh'),
('癸', '静河入海的时代', '悟道 · 解脱', '未来的你终于抵达完全理解自己的时刻。40至60岁间，过去的焦虑和疑问逐一消解，伴随内心的宁静体验到真正的自由。那份平静改变着你周围的一切。', '40～60岁', 'zh')
ON CONFLICT (branch_key, language) DO NOTHING;

-- Thai
INSERT INTO public.saju_content_narrative_future (branch_key, title, keyword, narrative, peak, language) VALUES
('甲', 'ยุคแห่งการสร้างผืนป่า', 'สร้างสรรค์ · มรดก', 'จุดสูงสุดของคุณยังมาไม่ถึง เวลาข้างหน้าคือช่วงที่เมล็ดพันธุ์ที่คุณหว่านมาตลอดจะเติบโตเป็นป่าทึบ ระหว่างอายุ 40-55 ปี คุณจะสร้างสิ่งที่ทิ้งชื่อไว้ ผู้คนจะพึ่งพาคุณ และคุณจะยินดีรับภาระนั้นในฐานะผู้นำ', '40-55 ปี', 'th'),
('乙', 'ช่วงเวลาแห่งการเบ่งบาน', 'เบ่งบาน · การยอมรับ', 'อนาคตของคุณคือเวลาที่โลกจะมองเห็นคุณในที่สุด ฝีมือและความรู้สึกที่บ่มเพาะมานานจะเปล่งประกาย โอกาสจะมาจากทิศทางที่คาดไม่ถึง ระหว่างอายุ 35-50 ปี คุณจะเบ่งบานดอกไม้ที่งดงามที่สุดในชีวิต', '35-50 ปี', 'th'),
('丙', 'ยุคแห่งดวงอาทิตย์เที่ยงวัน', 'รุ่งเรืองสุด · อิทธิพล', 'เวทีที่กว้างกว่ารอคุณอยู่ในอนาคต อิทธิพลของคุณจะขยายข้ามพรมแดน ชื่อของคุณจะถูกกล่าวถึงทั่วเอเชียและทั่วโลก', '35-50 ปี', 'th'),
('丁', 'ยุคแห่งการสร้างผลงานชิ้นเอก', 'ความสมบูรณ์ · ผลงานเอก', 'อนาคตของคุณจะเห็นการสร้างผลงานตลอดชีวิตให้สำเร็จ ไม่ต้องรีบ 丁火เป็นเปลวไฟที่เผาไหม้ช้าและแม่นยำ สิ่งที่คุณทำสำเร็จในช่วงอายุ 40-60 ปี จะถูกจดจำไปอีกนาน ไม่ว่าในสาขาใด', '40-60 ปี', 'th'),
('戊', 'ยุคแห่งการกลายเป็นภูเขา', 'สถาปนา · อำนาจ', 'อนาคตของคุณจะกลายเป็นภูเขาที่ไม่สั่นคลอน หลังอายุ 45 ปี ตัวตนของคุณจะแข็งแกร่งยิ่งขึ้น หลายคนจะถามทิศทางจากคุณ ไม่ว่าในองค์กรหรือครอบครัว คุณจะเป็นศูนย์กลางที่ทุกคนไว้วางใจและพึ่งพา', '45-65 ปี', 'th'),
('己', 'ฤดูกาลแห่งการเก็บเกี่ยว', 'ผลิผล · ความอุดม', 'ความอุดมสมบูรณ์จะมาหาคุณในอนาคต ทุกสิ่งที่คุณมอบให้ผู้อื่นอย่างไม่อั้นจะกลับมาในรูปแบบที่คาดไม่ถึง ความมั่นคงทางวัตถุ ความสัมพันธ์ที่ไว้วางใจได้ ปัญญาที่ลึกซึ้ง — ระหว่างอายุ 40-55 ปี คุณจะเข้าสู่ฤดูเก็บเกี่ยวที่แท้จริง', '40-55 ปี', 'th'),
('庚', 'ยุคที่ดาบถูกหลอมสมบูรณ์', 'ฝึกฝนจนสุด · จุดสูงสุด', 'ความคมกริบของคุณจะยิ่งประณีตขึ้น อนาคตของคุณจะเป็นผู้ทรงอำนาจระดับสูงสุดในสาขา คำเดียวเปลี่ยนการตัดสินใจ การวินิจฉัยกำหนดทิศทางองค์กร ดาบ庚金ยิ่งตีทบยิ่งคม', '40-55 ปี', 'th'),
('辛', 'ยุคที่อัญมณีเปล่งประกาย', 'ชื่อเสียง · ความเจิดจรัส', 'ในอนาคต สิ่งที่คุณขัดเกลามานานจะเริ่มส่องแสงต่อโลก ระหว่างอายุ 35-55 ปี คำนำหน้าจะเริ่มปรากฏก่อนชื่อคุณ และสิ่งที่คุณสร้างจะเป็นที่รู้จักก่อนตัวคุณเอง', '35-55 ปี', 'th'),
('壬', 'ยุคที่มหาสมุทรสมบูรณ์', 'ลึกซึ้ง · ผลกระทบ', 'อนาคตของคุณจะกว้างและลึกยิ่งขึ้น หลังอายุ 45 ปี ความรู้และประสบการณ์ที่สะสมมาทั้งหมดจะรวมเป็นกระแสเดียวอันยิ่งใหญ่ สิ่งที่คุณทิ้งไว้คือการหยั่งรู้ลึกซึ้งที่เปลี่ยนวิธีคิดของผู้คน', '45-65 ปี', 'th'),
('癸', 'ยุคที่แม่น้ำเงียบไหลถึงทะเล', 'ตรัสรู้ · หลุดพ้น', 'อนาคตของคุณจะมาถึงเวลาที่เข้าใจตัวเองอย่างสมบูรณ์ ระหว่างอายุ 40-60 ปี ความกังวลและเครื่องหมายคำถามจะคลี่คลายทีละข้อ คุณจะสัมผัสอิสรภาพแท้จริงพร้อมความสงบภายใน ความสงบนั้นจะเปลี่ยนแปลงทุกสิ่งรอบตัวคุณ', '40-60 ปี', 'th')
ON CONFLICT (branch_key, language) DO NOTHING;
