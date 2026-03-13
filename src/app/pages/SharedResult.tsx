import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import { getUserByShareCode } from '../../lib/contentApi';

export function SharedResult() {
    const { code } = useParams<{ code: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!code) { setNotFound(true); setLoading(false); return; }
        getUserByShareCode(code).then(result => {
            if (!result) setNotFound(true);
            else setData(result);
            setLoading(false);
        });
    }, [code]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
                <motion.div className="w-9 h-9 rounded-full"
                    style={{ border: '2px solid rgba(201,169,110,0.3)', borderTopColor: '#c9a96e' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }} />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#0a0a0a' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: '#c9a96e' }}>K·REBORN</p>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '14px', color: '#5a4e44' }}>
                    결과를 찾을 수 없습니다
                </p>
                <a href="/" style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#c9a96e',
                    textDecoration: 'none', letterSpacing: '0.1em'
                }}>
                    나의 정체성 알아보기 →
                </a>
            </div>
        );
    }

    const identity = data.identity_data;
    const originalName = data.original_name;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
            {/* Top nav */}
            <div className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(201,169,110,0.07)' }}>
                <span style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '19px',
                    fontWeight: 300, color: '#c9a96e', letterSpacing: '0.15em'
                }}>K·REBORN</span>
                <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#5a4e44', letterSpacing: '0.18em' }}>
                    SHARED IDENTITY
                </span>
            </div>

            <div className="max-w-lg mx-auto px-6 py-10">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    {/* Name reveal */}
                    <div className="text-center mb-10">
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#5a4e44', letterSpacing: '0.2em', marginBottom: 8 }}>
                            {originalName}의 평행우주 정체성
                        </p>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif", fontSize: '52px',
                            fontWeight: 300, color: '#f5f0e8', letterSpacing: '0.08em', lineHeight: 1.1
                        }}>
                            {identity?.fullName || data.generated_full_name}
                        </h1>
                        {identity?.fullNameRomanized && (
                            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '13px', color: '#c9a96e', marginTop: 6, letterSpacing: '0.12em' }}>
                                {identity.fullNameRomanized}
                            </p>
                        )}
                        {identity?.nameMeaning && (
                            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#8a7255', marginTop: 10, lineHeight: 1.7 }}>
                                {identity.nameMeaning.split('\n')[0]}
                            </p>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#5a4e44', marginBottom: 16, lineHeight: 1.6 }}>
                            나의 한국 이름은 무엇일까?
                        </p>
                        <a href="/" style={{
                            display: 'inline-block',
                            padding: '14px 32px',
                            fontFamily: 'Pretendard, sans-serif',
                            fontSize: '12px', letterSpacing: '0.12em',
                            color: '#0a0a0a', fontWeight: 500,
                            background: 'linear-gradient(135deg, #c9a96e, #a07840)',
                            border: 'none', borderRadius: '30px',
                            textDecoration: 'none',
                            boxShadow: '0 4px 20px rgba(201,169,110,0.2)'
                        }}>
                            나의 정체성 알아보기 🇰🇷
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
