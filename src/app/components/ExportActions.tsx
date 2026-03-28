import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface ExportActionsProps {
    targetId: string;
    userName: string;
    userEmail: string;
    shareCode?: string | null;
}

export function ExportActions({ userName, shareCode }: ExportActionsProps) {
    const { t } = useTranslation();
    const [isCopying, setIsCopying] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const shareUrl = shareCode
        ? `${window.location.origin}/s/${shareCode}`
        : window.location.href;

    const handleCopyLink = async () => {
        setIsCopying(true);
        try {
            await navigator.clipboard.writeText(shareUrl);
        } catch {
            alert(t('export_copy_fail'));
        } finally {
            setTimeout(() => setIsCopying(false), 2000);
        }
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            if (navigator.share) {
                await navigator.share({
                    title: t('export_share_title', { name: userName }),
                    text: t('export_share_text'),
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert(t('export_copy_success'));
            }
        } catch (err: any) {
            if (err?.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 mt-8 p-4 rounded-lg export-actions-container"
            style={{ border: '1px solid rgba(201,169,110,0.15)', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', textAlign: 'center' }}>
                {t('export_share_section')}
            </p>

            <div className="flex gap-3 mt-2">
                <motion.button
                    onClick={handleCopyLink}
                    disabled={isCopying}
                    className="flex-1 flex flex-col items-center justify-center py-3 rounded"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.05))',
                        border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', cursor: isCopying ? 'default' : 'pointer'
                    }}
                    whileTap={!isCopying ? { scale: 0.97 } : {}}>
                    <span style={{ fontSize: '18px', marginBottom: 4 }}>
                        {isCopying ? '✅' : '🔗'}
                    </span>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px' }}>
                        {isCopying ? t('export_copy_done') : t('export_copy_link')}
                    </span>
                </motion.button>

                <motion.button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="flex-1 flex flex-col items-center justify-center py-3 rounded"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.05))',
                        border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', cursor: isSharing ? 'default' : 'pointer'
                    }}
                    whileTap={!isSharing ? { scale: 0.97 } : {}}>
                    <span style={{ fontSize: '18px', marginBottom: 4 }}>
                        {isSharing ? '⏳' : '↗️'}
                    </span>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px' }}>
                        {t('export_share_btn')}
                    </span>
                </motion.button>
            </div>
        </div>
    );
}
