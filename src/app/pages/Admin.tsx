import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';

const ADMIN_EMAIL = 'dydwls022@admin.com'; // Internal mapping for the ID
const EXPECTED_ID = 'dydwls022';

export function Admin() {
    const [session, setSession] = useState<any>(null);
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [users, setUsers] = useState<any[]>([]);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchUsers();
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchUsers();
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        if (id !== EXPECTED_ID) {
            setErrorMsg('Invalid Admin ID.');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password,
        });

        if (error) {
            setErrorMsg('Login failed: ' + error.message);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUsers([]);
    };

    const fetchUsers = async () => {
        setFetching(true);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
            setErrorMsg('데이터 조회 권한이 없습니다. (Supabase RLS 정책을 확인하세요)');
        } else {
            setUsers(data || []);
        }
        setFetching(false);
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <motion.div
                    className="max-w-sm w-full p-8 rounded-lg"
                    style={{ border: '1px solid rgba(201,169,110,0.2)', background: 'linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.9))' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="text-center mb-8">
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: '#c9a96e' }}>Admin Portal</h1>
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#8a7255', marginTop: 4 }}>K-REBORN 관리자 로그인</p>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#bba689', display: 'block', marginBottom: 4 }}>ID</label>
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="w-full p-3 bg-black text-[#e8dcca] outline-none"
                                style={{ border: '1px solid rgba(201,169,110,0.3)' }}
                                placeholder="어드민 아이디 입력"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#bba689', display: 'block', marginBottom: 4 }}>PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-black text-[#e8dcca] outline-none"
                                style={{ border: '1px solid rgba(201,169,110,0.3)' }}
                                placeholder="비밀번호 입력"
                                required
                            />
                        </div>

                        {errorMsg && (
                            <p style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center' }}>{errorMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4"
                            style={{ background: '#c9a96e', color: '#0a0a0a', fontWeight: 'bold', fontFamily: 'Pretendard, sans-serif' }}
                        >
                            {loading ? '인증 중...' : 'LOGIN'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-12 text-[#e8dcca] font-['Pretendard']">
            <div className="max-w-[1200px] mx-auto">
                <header className="flex items-center justify-between mb-8 pb-4" style={{ borderBottom: '1px solid rgba(201,169,110,0.2)' }}>
                    <div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#c9a96e' }}>Admin Dashboard</h1>
                        <p className="text-xs text-[#8a7255] mt-1">K-REBORN 생성 유저 목록 조회 - {session.user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-xs border transition-colors hover:bg-[rgba(201,169,110,0.1)]"
                        style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e' }}
                    >
                        LOGOUT
                    </button>
                </header>

                {errorMsg && (
                    <div className="p-4 mb-6" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                        <p className="font-bold mb-1">데이터베이스 권한 오류</p>
                        <p className="text-sm">어드민 계정에 전체 데이터를 조회할 권한이 없습니다. Supabase SQL Editor에서 다음을 실행해 주세요:</p>
                        <code className="block mt-2 p-2 bg-black text-xs">CREATE POLICY "Admin can view all data" ON public.users FOR SELECT USING (auth.email() = 'dydwls022@admin.com');</code>
                    </div>
                )}

                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-lg text-[#bba689]">유저 생성 기록 ({users.length})</h2>
                    <button onClick={fetchUsers} disabled={fetching} className="text-xs underline text-[#8a7255]">
                        {fetching ? '새로고침 중...' : '새로고침 ↻'}
                    </button>
                </div>

                <div className="overflow-x-auto" style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
                    <table className="w-full text-left bg-[rgba(201,169,110,0.02)] text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e' }}>
                                <th className="p-4 font-normal w-1/4">생성일</th>
                                <th className="p-4 font-normal">고객 이메일</th>
                                <th className="p-4 font-normal">사주/오행</th>
                                <th className="p-4 font-normal">본명</th>
                                <th className="p-4 font-normal">생성된 영문명</th>
                                <th className="p-4 font-normal">생성된 한국명</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#8a7255]">데이터가 없습니다.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(201,169,110,0.05)' }} className="hover:bg-[rgba(201,169,110,0.05)]">
                                        <td className="p-4 whitespace-nowrap text-xs text-[#8a7255]">
                                            {new Date(user.created_at).toLocaleString('ko-KR')}
                                        </td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4 text-xs">
                                            {user.saju_data?.dayMasterTitle || '-'} / 부족: {user.saju_data?.lackingElement || '-'}
                                        </td>
                                        <td className="p-4">{user.original_name}</td>
                                        <td className="p-4">{user.generated_romanized_name}</td>
                                        <td className="p-4 font-bold text-[#c9a96e]">{user.generated_full_name}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
