import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';

type Tab = 'users' | 'cohort' | 'traffic' | 'payments';

const GOLD = '#c9a96e';
const GOLD_DIM = 'rgba(201,169,110,0.15)';
const BORDER = 'rgba(201,169,110,0.18)';
const BG = '#0a0a0a';
const SURFACE = 'rgba(255,255,255,0.03)';

/* ── Stat Card ───────────────────────────────────────────── */
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="p-5 rounded" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#8a7255', letterSpacing: '0.12em', marginBottom: 8 }}>{label}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: GOLD, lineHeight: 1 }}>{value}</p>
            {sub && <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#5a4e44', marginTop: 4 }}>{sub}</p>}
        </div>
    );
}

/* ── Bar (mini chart) ────────────────────────────────────── */
function MiniBar({ label, value, max, color = GOLD }: { label: string; value: number; max: number; color?: string }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="flex items-center gap-3">
            <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#bba689', width: 90, flexShrink: 0 }}>{label}</span>
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#8a7255', width: 24, textAlign: 'right' }}>{value}</span>
        </div>
    );
}

/* ── Funnel Step ─────────────────────────────────────────── */
function FunnelStep({ label, count, pct, isLast }: { label: string; count: number; pct: number; isLast?: boolean }) {
    return (
        <div className="flex flex-col items-center" style={{ flex: 1 }}>
            <div className="w-full rounded" style={{
                background: `rgba(201,169,110,${0.08 + pct / 100 * 0.3})`,
                border: `1px solid rgba(201,169,110,${0.15 + pct / 100 * 0.4})`,
                padding: '16px 12px', textAlign: 'center'
            }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: GOLD }}>{count}</p>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#bba689', marginTop: 2 }}>{label}</p>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#5a4e44', marginTop: 4 }}>{pct}%</p>
            </div>
            {!isLast && (
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
                    <div style={{ flex: 1, height: 1, background: BORDER }} />
                    <span style={{ color: '#5a4e44', fontSize: 12, padding: '0 6px' }}>→</span>
                    <div style={{ flex: 1, height: 1, background: BORDER }} />
                </div>
            )}
        </div>
    );
}

/* ── Main ────────────────────────────────────────────────── */
export function Admin() {
    const [session, setSession] = useState<any>(null);
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [tab, setTab] = useState<Tab>('users');

    const [users, setUsers] = useState<any[]>([]);
    const [fetching, setFetching] = useState(false);
    const [ga4Fetching, setGa4Fetching] = useState(false);

    // GA4 연동 데이터
    const [ga4, setGa4] = useState<{
        funnel: Record<string, number>;
        daily: { date: string; users: number }[];
        dailyTraffic: { date: string; sessions: number; users: number; newUsers: number }[];
        newVsReturning: { type: string; users: number; sessions: number; engagementRate: number }[];
        landingViews: number;
        channel: { name: string; sessions: number; users: number }[];
        sourceMedium: { name: string; sessions: number; users: number }[];
        country: { name: string; users: number; sessions: number }[];
        device: { name: string; sessions: number; users: number }[];
        cohort: { cohortName: string; weeks: { week: number; active: number; total: number }[] }[];
        loaded: boolean;
        error?: string;
    }>({ funnel: {}, daily: [], dailyTraffic: [], newVsReturning: [], landingViews: 0, channel: [], sourceMedium: [], country: [], device: [], cohort: [], loaded: false });

    useEffect(() => {
        if (!supabase) return;
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) { fetchUsers(); fetchGA4(); }
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) { fetchUsers(); fetchGA4(); }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        const { error } = await supabase!.auth.signInWithPassword({ email: id, password });
        if (error) setErrorMsg('Login failed: ' + error.message);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase!.auth.signOut();
        setUsers([]);
    };

    const fetchUsers = async () => {
        setFetching(true);
        const { data, error } = await supabase!.from('users').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error(error);
            setErrorMsg('데이터 조회 권한이 없습니다.');
        } else {
            setUsers(data || []);
        }
        setFetching(false);
    };

    const fetchGA4 = async () => {
        setGa4Fetching(true);
        setGa4(prev => ({ ...prev, error: undefined }));
        try {
            const { data, error } = await supabase!.functions.invoke('ga4-report');
            console.log('[GA4] invoke result:', { data, error });
            if (error) {
                let errMsg = error?.message ?? String(error);
                try {
                    const body = await (error as any).context?.json?.();
                    console.log('[GA4] error body:', body);
                    if (body?.error) errMsg = body.error;
                } catch { /* ignore */ }
                setGa4(prev => ({ ...prev, loaded: true, error: errMsg }));
                setGa4Fetching(false);
                return;
            }
            if (data?.error) {
                console.log('[GA4] data.error:', data.error);
                setGa4(prev => ({ ...prev, loaded: true, error: data.error }));
                setGa4Fetching(false);
                return;
            }
            // 퍼널 이벤트 카운트 파싱
            const funnel: Record<string, number> = {};
            for (const row of data.funnel?.rows ?? []) {
                funnel[row.dimensionValues[0].value] = parseInt(row.metricValues[0].value, 10);
            }
            // 일별 활성 유저 파싱 (YYYYMMDD → M월 D일)
            const daily = (data.daily?.rows ?? []).map((row: any) => {
                const d = row.dimensionValues[0].value; // "20250310"
                const dt = new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`);
                return {
                    date: dt.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
                    users: parseInt(row.metricValues[0].value, 10),
                };
            });
            const landingViews = parseInt(data.landing?.rows?.[0]?.metricValues?.[0]?.value ?? '0', 10);

            const parseRows2 = (rows: any[], nameIdx = 0, v0 = 0, v1 = 1) =>
                (rows ?? []).map((r: any) => ({
                    name: r.dimensionValues[nameIdx].value,
                    sessions: parseInt(r.metricValues[v0].value, 10),
                    users: parseInt(r.metricValues[v1]?.value ?? '0', 10),
                }));

            const channel = parseRows2(data.channel?.rows);
            const sourceMedium = parseRows2(data.sourceMedium?.rows);
            const country = (data.country?.rows ?? []).map((r: any) => ({
                name: r.dimensionValues[0].value,
                users: parseInt(r.metricValues[0].value, 10),
                sessions: parseInt(r.metricValues[1].value, 10),
            }));
            const device = (data.device?.rows ?? []).map((r: any) => ({
                name: r.dimensionValues[0].value,
                sessions: parseInt(r.metricValues[0].value, 10),
                users: parseInt(r.metricValues[1]?.value ?? '0', 10),
            }));

            // 코호트 리텐션 파싱
            const cohortMap: Record<string, { week: number; active: number; total: number }[]> = {};
            for (const row of data.cohort?.rows ?? []) {
                const name = row.dimensionValues[0].value;
                const week = parseInt(row.dimensionValues[1].value, 10);
                const active = parseInt(row.metricValues[0].value, 10);
                const total = parseInt(row.metricValues[1].value, 10);
                if (!cohortMap[name]) cohortMap[name] = [];
                cohortMap[name].push({ week, active, total });
            }
            const cohort = Object.entries(cohortMap).map(([cohortName, weeks]) => ({
                cohortName,
                weeks: weeks.sort((a, b) => a.week - b.week),
            }));

            // 30일 트래픽 트렌드 파싱
            const dailyTraffic = (data.dailyTraffic?.rows ?? []).map((r: any) => {
                const d = r.dimensionValues[0].value;
                const dt = new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`);
                return {
                    date: dt.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
                    sessions: parseInt(r.metricValues[0].value, 10),
                    users: parseInt(r.metricValues[1].value, 10),
                    newUsers: parseInt(r.metricValues[2].value, 10),
                };
            });

            // 신규 vs 재방문 파싱
            const newVsReturning = (data.newVsReturning?.rows ?? []).map((r: any) => ({
                type: r.dimensionValues[0].value,
                users: parseInt(r.metricValues[0].value, 10),
                sessions: parseInt(r.metricValues[1].value, 10),
                engagementRate: parseFloat(r.metricValues[2].value),
            }));

            setGa4({ funnel, daily, dailyTraffic, newVsReturning, landingViews, channel, sourceMedium, country, device, cohort, loaded: true });
        } catch (e) {
            setGa4(prev => ({ ...prev, loaded: true, error: String(e) }));
        } finally {
            setGa4Fetching(false);
        }
    };

    /* ── Derived stats ── */
    const stats = useMemo(() => {
        const now = new Date();
        const today = users.filter(u => new Date(u.created_at).toDateString() === now.toDateString()).length;
        const week = users.filter(u => (now.getTime() - new Date(u.created_at).getTime()) < 7 * 86400000).length;
        const paid = users.filter(u => u.is_paid).length;

        const byGender: Record<string, number> = {};
        const byNationality: Record<string, number> = {};
        const byElement: Record<string, number> = {};
        const byDayMaster: Record<string, number> = {};
        const byDay: Record<string, number> = {};

        users.forEach(u => {
            const gender = u.gender || u.user_input_data?.gender;
            if (gender) byGender[gender] = (byGender[gender] || 0) + 1;
            const nationality = u.nationality || u.user_input_data?.nationality;
            if (nationality) byNationality[nationality] = (byNationality[nationality] || 0) + 1;
            const el = u.saju_data?.dominantElement;
            if (el) byElement[el] = (byElement[el] || 0) + 1;
            const dm = u.saju_data?.dayMasterTitle;
            if (dm) byDayMaster[dm] = (byDayMaster[dm] || 0) + 1;
            const day = new Date(u.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
            byDay[day] = (byDay[day] || 0) + 1;
        });

        const topNationalities = Object.entries(byNationality).sort((a, b) => b[1] - a[1]).slice(0, 6);
        const topDayMasters = Object.entries(byDayMaster).sort((a, b) => b[1] - a[1]).slice(0, 8);

        // Last 7 days for daily chart
        const last7: { label: string; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
            last7.push({ label, count: byDay[label] || 0 });
        }

        return { today, week, paid, byGender, byElement, topNationalities, topDayMasters, last7 };
    }, [users]);

    const ELEMENT_KR: Record<string, string> = {
        wood: '목 木', fire: '화 火', earth: '토 土', metal: '금 金', water: '수 水'
    };

    /* ── Login screen ── */
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: BG }}>
                <motion.div className="w-full max-w-sm p-8 rounded-lg"
                    style={{ border: `1px solid ${BORDER}`, background: 'linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.9))' }}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="text-center mb-8">
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: GOLD }}>Admin Portal</h1>
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#8a7255', marginTop: 4 }}>K-REBORN 관리자 로그인</p>
                    </div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        {(['ID', 'PASSWORD'] as const).map((lbl, i) => (
                            <div key={lbl}>
                                <label style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#bba689', display: 'block', marginBottom: 4 }}>{lbl}</label>
                                <input
                                    type={i === 1 ? 'password' : 'text'}
                                    value={i === 0 ? id : password}
                                    onChange={e => i === 0 ? setId(e.target.value) : setPassword(e.target.value)}
                                    className="w-full p-3 bg-black text-[#e8dcca] outline-none"
                                    style={{ border: `1px solid ${BORDER}` }}
                                    placeholder={i === 0 ? '이메일 입력' : '비밀번호 입력'}
                                    required
                                />
                            </div>
                        ))}
                        {errorMsg && <p style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center' }}>{errorMsg}</p>}
                        <button type="submit" disabled={loading} className="w-full py-3 mt-4"
                            style={{ background: GOLD, color: BG, fontWeight: 'bold', fontFamily: 'Pretendard, sans-serif' }}>
                            {loading ? '인증 중...' : 'LOGIN'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    /* ── Dashboard ── */
    const NAV: { key: Tab; label: string; icon: string }[] = [
        { key: 'users', label: 'Users', icon: '👤' },
        { key: 'cohort', label: '코호트 분석', icon: '📊' },
        { key: 'traffic', label: '유입채널 분석', icon: '🌐' },
        { key: 'payments', label: '결제 내역', icon: '💳' },
    ];

    return (
        <div className="flex min-h-screen" style={{ background: BG, fontFamily: 'Pretendard, sans-serif' }}>

            {/* ── Sidebar ── */}
            <aside className="flex flex-col" style={{ width: 220, minHeight: '100vh', borderRight: `1px solid ${BORDER}`, background: 'rgba(10,8,6,0.98)', flexShrink: 0 }}>
                {/* Logo */}
                <div className="px-6 py-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: GOLD, letterSpacing: '0.1em' }}>K·REBORN</p>
                    <p style={{ fontSize: '10px', color: '#5a4e44', marginTop: 2, letterSpacing: '0.1em' }}>ADMIN CONSOLE</p>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                    {NAV.map(n => (
                        <button key={n.key} onClick={() => setTab(n.key)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded text-left transition-colors"
                            style={{
                                background: tab === n.key ? GOLD_DIM : 'transparent',
                                border: tab === n.key ? `1px solid rgba(201,169,110,0.3)` : '1px solid transparent',
                                color: tab === n.key ? GOLD : '#8a7255',
                                fontSize: '13px', cursor: 'pointer'
                            }}>
                            <span>{n.icon}</span>
                            <span>{n.label}</span>
                        </button>
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="px-4 py-5" style={{ borderTop: `1px solid ${BORDER}` }}>
                    <p style={{ fontSize: '10px', color: '#5a4e44', marginBottom: 8, wordBreak: 'break-all' }}>{session.user.email}</p>
                    <button onClick={handleLogout} className="w-full py-2 text-xs rounded transition-colors"
                        style={{ border: `1px solid ${BORDER}`, color: '#8a7255', background: 'transparent', cursor: 'pointer' }}>
                        LOGOUT
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 overflow-auto p-8">

                {/* ── TAB: USERS ── */}
                {tab === 'users' && (
                    <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 style={{ fontSize: '22px', color: '#f5f0e8', fontFamily: "'Cormorant Garamond', serif" }}>Users</h2>
                                <p style={{ fontSize: '12px', color: '#5a4e44', marginTop: 2 }}>가입한 전체 유저 목록</p>
                            </div>
                            <button onClick={fetchUsers} disabled={fetching}
                                className="px-4 py-2 text-xs rounded transition-colors"
                                style={{ border: `1px solid ${BORDER}`, color: GOLD, background: 'transparent', cursor: 'pointer' }}>
                                {fetching ? '로딩 중...' : '새로고침 ↻'}
                            </button>
                        </div>

                        {/* Stat cards */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <StatCard label="TOTAL USERS" value={users.length} />
                            <StatCard label="TODAY" value={stats.today} />
                            <StatCard label="THIS WEEK" value={stats.week} />
                            <StatCard label="PAID" value={stats.paid} sub={users.length > 0 ? `전환율 ${Math.round(stats.paid / users.length * 100)}%` : '-'} />
                        </div>

                        {errorMsg && (
                            <div className="p-4 mb-4 rounded text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                                {errorMsg}
                            </div>
                        )}

                        <div className="rounded overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
                                        {['생성일', '이메일', '본명', '성별', '국적', '생년월일(시)', '생성 한국명', '오행/일간', '결과 링크', '결제'].map(h => (
                                            <th key={h} className="px-4 py-3 font-normal whitespace-nowrap" style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.08em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr><td colSpan={6} className="p-10 text-center" style={{ color: '#5a4e44' }}>데이터가 없습니다.</td></tr>
                                    ) : (
                                        users.map(u => (
                                            <tr key={u.id} style={{ borderBottom: `1px solid rgba(201,169,110,0.05)` }}
                                                className="hover:bg-[rgba(201,169,110,0.03)] transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#5a4e44', fontSize: '11px' }}>
                                                    {new Date(u.created_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-4 py-3" style={{ color: '#e8dcca', fontSize: '12px' }}>{u.email || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#bba689' }}>{u.original_name || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#bba689', fontSize: '11px' }}>
                                                    {u.gender === 'male' || u.user_input_data?.gender === 'male' ? '남성' : u.gender === 'female' || u.user_input_data?.gender === 'female' ? '여성' : '-'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#bba689', fontSize: '11px' }}>{u.nationality || u.user_input_data?.nationality || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#bba689', fontSize: '11px' }}>
                                                    {u.birth_year ? `${u.birth_year}.${u.birth_month}.${u.birth_day} (${u.birth_hour}시)` : (u.user_input_data?.birthYear ? `${u.user_input_data.birthYear}.${u.user_input_data.birthMonth}.${u.user_input_data.birthDay} (${u.user_input_data.birthHour}시)` : '-')}
                                                </td>
                                                <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: GOLD }}>{u.generated_korean_name || u.generated_full_name || '-'}</td>
                                                <td className="px-4 py-3" style={{ fontSize: '11px', color: '#8a7255' }}>
                                                    {u.saju_data?.lackingElement ? ELEMENT_KR[u.saju_data.lackingElement] || u.saju_data.lackingElement : '-'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap" style={{ fontSize: '11px' }}>
                                                    {u.share_code ? (
                                                        <a href={`/s/${u.share_code}`} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                                                            결과 보기 ↗
                                                        </a>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span style={{
                                                        fontSize: '10px', padding: '2px 8px', borderRadius: 4,
                                                        background: u.is_paid ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                                                        color: u.is_paid ? '#4ade80' : '#5a4e44',
                                                        border: u.is_paid ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.06)'
                                                    }}>
                                                        {u.is_paid ? '결제완료' : '미결제'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* ── TAB: COHORT ── */}
                {tab === 'cohort' && (
                    <motion.div key="cohort" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 style={{ fontSize: '22px', color: '#f5f0e8', fontFamily: "'Cormorant Garamond', serif" }}>코호트 분석</h2>
                                <p style={{ fontSize: '12px', color: '#5a4e44', marginTop: 2 }}>
                                    {ga4.loaded
                                        ? ga4.error ? `GA4 오류: ${ga4.error}` : 'GA4 실데이터 연동'
                                        : 'GA4 데이터 로딩 중…'}
                                </p>
                            </div>
                            <button onClick={fetchGA4} disabled={ga4Fetching}
                                className="px-4 py-2 text-xs rounded"
                                style={{ border: `1px solid ${BORDER}`, color: ga4Fetching ? '#5a4e44' : GOLD, background: 'transparent', cursor: ga4Fetching ? 'default' : 'pointer' }}>
                                {ga4Fetching ? 'GA4 로딩 중…' : 'GA4 새로고침 ↻'}
                            </button>
                        </div>

                        {/* GA4 Funnel — 실데이터 */}
                        <div className="p-6 rounded mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                            <div className="flex items-center gap-2 mb-5">
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em' }}>CONVERSION FUNNEL</p>
                                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: 3, background: ga4.loaded && !ga4.error ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', color: ga4.loaded && !ga4.error ? '#4ade80' : '#5a4e44', border: ga4.loaded && !ga4.error ? '1px solid rgba(74,222,128,0.2)' : `1px solid ${BORDER}` }}>
                                    {ga4.loaded && !ga4.error ? 'GA4 LIVE' : '로딩 중'}
                                </span>
                            </div>
                            {(() => {
                                const f = ga4.funnel;
                                const landing = ga4.landingViews || (f['page_view'] ?? 0);
                                const registry = f['begin_registration'] ?? 0;
                                const reveal = f['complete_registration'] ?? 0;
                                const paywall = f['view_paywall'] ?? 0;
                                const checkout = f['begin_checkout'] ?? 0;
                                const paid = f['purchase'] ?? 0;
                                const base = landing || 1;
                                const pct = (n: number) => Math.round((n / base) * 100);
                                return (
                                    <div className="flex items-start gap-2">
                                        {[
                                            { label: 'Landing', count: landing, pct: 100 },
                                            { label: 'begin_reg', count: registry, pct: pct(registry) },
                                            { label: 'complete_reg', count: reveal, pct: pct(reveal) },
                                            { label: 'view_paywall', count: paywall, pct: pct(paywall) },
                                            { label: 'checkout', count: checkout, pct: pct(checkout) },
                                            { label: 'purchase', count: paid, pct: pct(paid) },
                                        ].map((s, i, arr) => (
                                            <FunnelStep key={s.label} {...s} isLast={i === arr.length - 1} />
                                        ))}
                                    </div>
                                );
                            })()}
                            {!ga4.loaded && (
                                <p style={{ fontSize: '10px', color: '#3a3028', marginTop: 12 }}>* GA4 시크릿 설정 후 실데이터가 표시됩니다.</p>
                            )}
                        </div>

                        {/* 일별 활성 유저 — GA4 우선, fallback: Supabase */}
                        <div className="p-6 rounded mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                            <div className="flex items-center gap-2 mb-5">
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em' }}>일별 활성 유저 (최근 7일)</p>
                                <span style={{ fontSize: '10px', color: '#5a4e44' }}>
                                    {ga4.loaded && !ga4.error && ga4.daily.length > 0 ? '● GA4' : '● Supabase'}
                                </span>
                            </div>
                            {(() => {
                                const chartData = (ga4.loaded && !ga4.error && ga4.daily.length > 0)
                                    ? ga4.daily.map(d => ({ label: d.date, count: d.users }))
                                    : stats.last7;
                                const max = Math.max(...chartData.map(x => x.count), 1);
                                return (
                                    <div className="flex items-end gap-3" style={{ height: 100 }}>
                                        {chartData.map(d => {
                                            const h = Math.max((d.count / max) * 100, d.count > 0 ? 6 : 2);
                                            return (
                                                <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
                                                    <span style={{ fontSize: '10px', color: GOLD }}>{d.count > 0 ? d.count : ''}</span>
                                                    <div style={{ width: '100%', height: `${h}%`, background: d.count > 0 ? GOLD_DIM : 'rgba(255,255,255,0.04)', border: d.count > 0 ? `1px solid rgba(201,169,110,0.3)` : 'none', borderRadius: 3 }} />
                                                    <span style={{ fontSize: '9px', color: '#5a4e44', whiteSpace: 'nowrap' }}>{d.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* 코호트 리텐션 매트릭스 */}
                        <div className="p-6 rounded mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                            <div className="flex items-center gap-2 mb-5">
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em' }}>주간 코호트 리텐션</p>
                                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: 3, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>GA4</span>
                            </div>
                            {ga4.cohort.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Pretendard, sans-serif', fontSize: '11px' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'left', padding: '6px 12px', color: '#5a4e44', fontWeight: 400, whiteSpace: 'nowrap' }}>코호트</th>
                                                <th style={{ padding: '6px 10px', color: '#5a4e44', fontWeight: 400 }}>유저수</th>
                                                {Array.from({ length: 6 }, (_, i) => (
                                                    <th key={i} style={{ padding: '6px 10px', color: '#5a4e44', fontWeight: 400 }}>W{i}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ga4.cohort.map(({ cohortName, weeks }) => {
                                                const total = weeks.find(w => w.week === 0)?.total ?? 0;
                                                return (
                                                    <tr key={cohortName}>
                                                        <td style={{ padding: '6px 12px', color: '#bba689', whiteSpace: 'nowrap' }}>{cohortName}</td>
                                                        <td style={{ padding: '6px 10px', color: '#8a7255', textAlign: 'center' }}>{total.toLocaleString()}</td>
                                                        {Array.from({ length: 6 }, (_, i) => {
                                                            const w = weeks.find(x => x.week === i);
                                                            const pct = total > 0 && w ? Math.round((w.active / total) * 100) : null;
                                                            const alpha = pct !== null ? 0.06 + (pct / 100) * 0.45 : 0;
                                                            return (
                                                                <td key={i} style={{ padding: '6px 10px', textAlign: 'center', background: pct !== null ? `rgba(201,169,110,${alpha})` : 'transparent', color: pct !== null ? GOLD : '#3a3028', borderRadius: 3 }}>
                                                                    {pct !== null ? `${pct}%` : '—'}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ fontSize: '12px', color: '#3a3028' }}>GA4 데이터 로딩 중…</p>
                            )}
                        </div>

                        {/* 국가 + 디바이스 */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', marginBottom: 16 }}>국가별 유저 (TOP 8)</p>
                                <div className="flex flex-col gap-3">
                                    {ga4.country.length > 0
                                        ? ga4.country.map(c => (
                                            <MiniBar key={c.name} label={c.name} value={c.users} max={ga4.country[0]?.users || 1} />
                                        ))
                                        : <p style={{ color: '#5a4e44', fontSize: '12px' }}>GA4 데이터 없음</p>}
                                </div>
                            </div>

                            <div className="p-6 rounded" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', marginBottom: 16 }}>디바이스 분포</p>
                                <div className="flex gap-4">
                                    {ga4.device.length > 0 ? (() => {
                                        const total = ga4.device.reduce((s, d) => s + d.sessions, 0) || 1;
                                        return ga4.device.map(d => {
                                            const pct = Math.round(d.sessions / total * 100);
                                            return (
                                                <div key={d.name} className="flex-1 rounded p-4 text-center" style={{ background: GOLD_DIM, border: `1px solid rgba(201,169,110,0.2)` }}>
                                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: GOLD }}>{pct}%</p>
                                                    <p style={{ fontSize: '11px', color: '#bba689', marginTop: 4 }}>{d.name}</p>
                                                    <p style={{ fontSize: '10px', color: '#5a4e44' }}>{d.sessions.toLocaleString()} 세션</p>
                                                </div>
                                            );
                                        });
                                    })() : <p style={{ color: '#5a4e44', fontSize: '12px' }}>GA4 데이터 없음</p>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── TAB: TRAFFIC ── */}
                {tab === 'traffic' && (
                    <motion.div key="traffic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 style={{ fontSize: '22px', color: '#f5f0e8', fontFamily: "'Cormorant Garamond', serif" }}>유입채널 분석</h2>
                                <p style={{ fontSize: '12px', color: '#5a4e44', marginTop: 2 }}>
                                    {ga4.loaded && !ga4.error ? 'GA4 실데이터 · 최근 90일' : ga4.error ? `GA4 오류: ${ga4.error}` : 'GA4 로딩 중…'}
                                </p>
                            </div>
                            <button onClick={fetchGA4} disabled={ga4Fetching} className="px-4 py-2 text-xs rounded"
                                style={{ border: `1px solid ${BORDER}`, color: ga4Fetching ? '#5a4e44' : GOLD, background: 'transparent', cursor: ga4Fetching ? 'default' : 'pointer' }}>
                                {ga4Fetching ? '로딩 중…' : '새로고침 ↻'}
                            </button>
                        </div>

                        {/* 요약 stat cards */}
                        {(() => {
                            const totalSessions = ga4.dailyTraffic.reduce((s, d) => s + d.sessions, 0);
                            const totalUsers = ga4.dailyTraffic.reduce((s, d) => s + d.users, 0);
                            const totalNew = ga4.dailyTraffic.reduce((s, d) => s + d.newUsers, 0);
                            const topChannel = ga4.channel[0]?.name ?? '-';
                            const mobileDevice = ga4.device.find(d => d.name === 'mobile');
                            const totalDevSessions = ga4.device.reduce((s, d) => s + d.sessions, 0);
                            const mobilePct = totalDevSessions > 0 && mobileDevice
                                ? Math.round(mobileDevice.sessions / totalDevSessions * 100) : 0;
                            const newPct = totalUsers > 0 ? Math.round(totalNew / totalUsers * 100) : 0;
                            return (
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    <StatCard label="총 세션 (30일)" value={totalSessions.toLocaleString()} />
                                    <StatCard label="활성 유저 (30일)" value={totalUsers.toLocaleString()} />
                                    <StatCard label="신규 유저 비율" value={`${newPct}%`} sub={`재방문 ${100 - newPct}%`} />
                                    <StatCard label="TOP 채널" value={topChannel} sub={`모바일 ${mobilePct}%`} />
                                </div>
                            );
                        })()}

                        {/* 30일 세션 트렌드 */}
                        <div className="p-6 rounded mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                            <div className="flex items-center gap-2 mb-5">
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em' }}>일별 세션 트렌드 (최근 30일)</p>
                                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: 3, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>GA4</span>
                            </div>
                            {(() => {
                                const data = ga4.dailyTraffic;
                                if (data.length === 0) return <p style={{ fontSize: '12px', color: '#3a3028' }}>데이터 없음</p>;
                                const maxSessions = Math.max(...data.map(d => d.sessions), 1);
                                // 7일마다 레이블 표시
                                return (
                                    <div className="flex items-end gap-1" style={{ height: 120 }}>
                                        {data.map((d, i) => {
                                            const h = Math.max((d.sessions / maxSessions) * 100, d.sessions > 0 ? 4 : 2);
                                            const showLabel = i === 0 || i === data.length - 1 || i % 7 === 0;
                                            return (
                                                <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
                                                    <div title={`${d.date}: ${d.sessions}세션`} style={{ width: '100%', height: `${h}%`, background: d.sessions > 0 ? GOLD : 'rgba(255,255,255,0.04)', borderRadius: 2, opacity: 0.75, transition: 'height 0.4s ease' }} />
                                                    {showLabel && <span style={{ fontSize: '8px', color: '#5a4e44', whiteSpace: 'nowrap', transform: 'rotate(-30deg)', transformOrigin: 'top left', marginTop: 4 }}>{d.date}</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* 채널 + 신규/재방문 + 디바이스 */}
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            {/* 채널 그룹 */}
                            <div className="p-6 rounded" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', marginBottom: 16 }}>채널 그룹 (90일)</p>
                                <div className="flex flex-col gap-3">
                                    {ga4.channel.length === 0
                                        ? <p style={{ color: '#5a4e44', fontSize: '12px' }}>데이터 없음</p>
                                        : ga4.channel.map(c => (
                                            <MiniBar key={c.name} label={c.name} value={c.sessions} max={ga4.channel[0]?.sessions || 1} />
                                        ))}
                                </div>
                            </div>

                            {/* 신규 vs 재방문 */}
                            <div className="p-6 rounded" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', marginBottom: 16 }}>신규 vs 재방문 (90일)</p>
                                <div className="flex flex-col gap-4">
                                    {ga4.newVsReturning.length === 0
                                        ? <p style={{ color: '#5a4e44', fontSize: '12px' }}>데이터 없음</p>
                                        : (() => {
                                            const total = ga4.newVsReturning.reduce((s, r) => s + r.users, 0) || 1;
                                            return ga4.newVsReturning.map(r => {
                                                const pct = Math.round(r.users / total * 100);
                                                const label = r.type === 'new' ? '신규' : r.type === 'returning' ? '재방문' : r.type;
                                                const engPct = Math.round(r.engagementRate * 100);
                                                return (
                                                    <div key={r.type}>
                                                        <div className="flex justify-between mb-1">
                                                            <span style={{ fontSize: '11px', color: '#bba689' }}>{label}</span>
                                                            <span style={{ fontSize: '11px', color: GOLD }}>{pct}%</span>
                                                        </div>
                                                        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                                                            <div style={{ width: `${pct}%`, height: '100%', background: GOLD, borderRadius: 4 }} />
                                                        </div>
                                                        <p style={{ fontSize: '10px', color: '#5a4e44', marginTop: 3 }}>
                                                            {r.users.toLocaleString()}명 · 참여율 {engPct}%
                                                        </p>
                                                    </div>
                                                );
                                            });
                                        })()}
                                </div>
                            </div>

                            {/* 디바이스 */}
                            <div className="p-6 rounded" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', marginBottom: 16 }}>디바이스 (90일)</p>
                                <div className="flex flex-col gap-3">
                                    {ga4.device.length === 0
                                        ? <p style={{ color: '#5a4e44', fontSize: '12px' }}>데이터 없음</p>
                                        : (() => {
                                            const total = ga4.device.reduce((s, d) => s + d.sessions, 0) || 1;
                                            return ga4.device.map(d => {
                                                const pct = Math.round(d.sessions / total * 100);
                                                const icon = d.name === 'mobile' ? '📱' : d.name === 'tablet' ? '📟' : '🖥️';
                                                return (
                                                    <div key={d.name} className="flex items-center gap-3">
                                                        <span style={{ fontSize: '14px' }}>{icon}</span>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between mb-1">
                                                                <span style={{ fontSize: '11px', color: '#bba689' }}>{d.name}</span>
                                                                <span style={{ fontSize: '11px', color: GOLD }}>{pct}%</span>
                                                            </div>
                                                            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                                                                <div style={{ width: `${pct}%`, height: '100%', background: GOLD, borderRadius: 3 }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                </div>
                            </div>
                        </div>

                        {/* 국가 TOP 8 */}
                        <div className="p-6 rounded mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                            <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', marginBottom: 16 }}>국가별 활성 유저 (TOP 8 · 90일)</p>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                {ga4.country.length === 0
                                    ? <p style={{ color: '#5a4e44', fontSize: '12px' }}>데이터 없음</p>
                                    : ga4.country.map(c => (
                                        <MiniBar key={c.name} label={c.name} value={c.users} max={ga4.country[0]?.users || 1} />
                                    ))}
                            </div>
                        </div>

                        {/* 소스/매체 테이블 */}
                        <div className="rounded overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                            <div className="px-5 py-3" style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
                                <p style={{ fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em' }}>소스 / 매체 (TOP 15 · 90일)</p>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}` }}>
                                        {['소스 / 매체', '세션', '유저', '비중'].map(h => (
                                            <th key={h} className="px-4 py-3 font-normal"
                                                style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.08em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ga4.sourceMedium.length === 0
                                        ? <tr><td colSpan={4} className="p-8 text-center" style={{ color: '#5a4e44' }}>데이터 없음</td></tr>
                                        : (() => {
                                            const totalSm = ga4.sourceMedium.reduce((s, r) => s + r.sessions, 0) || 1;
                                            return ga4.sourceMedium.map((r, i) => (
                                                <tr key={r.name} style={{ borderBottom: `1px solid rgba(201,169,110,0.05)` }}
                                                    className="hover:bg-[rgba(201,169,110,0.03)] transition-colors">
                                                    <td className="px-4 py-3" style={{ color: i === 0 ? GOLD : '#e8dcca', fontSize: '12px' }}>{r.name}</td>
                                                    <td className="px-4 py-3" style={{ color: '#bba689' }}>{r.sessions.toLocaleString()}</td>
                                                    <td className="px-4 py-3" style={{ color: '#8a7255' }}>{r.users.toLocaleString()}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                                                                <div style={{ width: `${Math.round(r.sessions / totalSm * 100)}%`, height: '100%', background: GOLD, borderRadius: 2 }} />
                                                            </div>
                                                            <span style={{ fontSize: '10px', color: '#5a4e44', width: 32, textAlign: 'right' }}>
                                                                {Math.round(r.sessions / totalSm * 100)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ));
                                        })()
                                    }
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* ── TAB: PAYMENTS ── */}
                {tab === 'payments' && (
                    <motion.div key="payments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 style={{ fontSize: '22px', color: '#f5f0e8', fontFamily: "'Cormorant Garamond', serif" }}>결제 내역</h2>
                                <p style={{ fontSize: '12px', color: '#5a4e44', marginTop: 2 }}>누적 결제 및 수익 현황</p>
                            </div>
                        </div>

                        {/* Revenue stats */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <StatCard label="총 결제 건수" value={stats.paid} />
                            <StatCard label="총 수익 (USD)" value={`$${(stats.paid * 4.5).toFixed(2)}`} />
                            <StatCard label="총 수익 (KRW)" value={`₩${(stats.paid * 5900).toLocaleString()}`} />
                            <StatCard label="결제 전환율" value={users.length > 0 ? `${Math.round(stats.paid / users.length * 100)}%` : '0%'} sub={`${users.length}명 중 ${stats.paid}명`} />
                        </div>

                        {/* Payment table */}
                        <div className="rounded overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
                                        {['결제일', '이메일', '이름', '금액', '상태'].map(h => (
                                            <th key={h} className="px-4 py-3 font-normal" style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.08em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u => u.is_paid).length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-10 text-center" style={{ color: '#5a4e44' }}>
                                                <p>결제 내역이 없습니다.</p>
                                                <p style={{ fontSize: '11px', marginTop: 6, color: '#3a3028' }}>Stripe 연동 후 실 결제 데이터가 표시됩니다.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.filter(u => u.is_paid).map(u => (
                                            <tr key={u.id} style={{ borderBottom: 'rgba(201,169,110,0.05) solid 1px' }}
                                                className="hover:bg-[rgba(201,169,110,0.03)] transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#5a4e44', fontSize: '11px' }}>
                                                    {new Date(u.updated_at || u.created_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-4 py-3" style={{ color: '#e8dcca', fontSize: '12px' }}>{u.email || '-'}</td>
                                                <td className="px-4 py-3" style={{ color: '#bba689' }}>{u.generated_korean_name || u.generated_full_name || u.original_name || '-'}</td>
                                                <td className="px-4 py-3" style={{ color: GOLD }}>$4.50</td>
                                                <td className="px-4 py-3">
                                                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 4, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                                                        완료
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
