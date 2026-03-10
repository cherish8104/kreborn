import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'motion/react';

interface ExportActionsProps {
    targetId: string;
    userName: string;
    userEmail: string;
}

export function ExportActions({ targetId, userName, userEmail }: ExportActionsProps) {
    const [isCopying, setIsCopying] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);
    const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleCopyLink = async () => {
        setIsCopying(true);
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
        } catch (error) {
            console.error("Failed to copy link:", error);
            alert('Failed to copy link. Please try again.');
        } finally {
            setTimeout(() => setIsCopying(false), 2000);
        }
    };

    const handleEmailSend = async () => {
        if (!userEmail) {
            alert("No email address provided during registration.");
            return;
        }

        setIsEmailing(true);
        setEmailStatus('idle');

        try {
            const env = (import.meta as any).env;
            const serviceId = env.VITE_EMAILJS_SERVICE_ID || 'default_service';
            const templateId = env.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
            const publicKey = env.VITE_EMAILJS_PUBLIC_KEY || 'default_key';

            // Send the exact URL back to the user
            const currentUrl = window.location.href;

            const templateParams = {
                to_name: userName,
                to_email: userEmail,
                message: `Your K-REBORN Full Script is ready. You can view your personal identity report anytime by clicking the link below:\n\n${currentUrl}`,
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            setEmailStatus('success');
        } catch (error) {
            console.error("Email sending failed:", error);
            setEmailStatus('error');
        } finally {
            setIsEmailing(false);
            setTimeout(() => setEmailStatus('idle'), 3000);
        }
    };

    return (
        <div className="flex flex-col gap-3 mt-8 p-4 rounded-lg export-actions-container" style={{ border: '1px solid rgba(201,169,110,0.15)', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', textAlign: 'center' }}>
                SHARE YOUR IDENTITY
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
                        {isCopying ? 'Link Copied!' : 'Copy Link'}
                    </span>
                </motion.button>

                <motion.button
                    onClick={handleEmailSend}
                    disabled={isEmailing}
                    className="flex-1 flex flex-col items-center justify-center py-3 rounded"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.05))',
                        border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', cursor: isEmailing ? 'wait' : 'pointer'
                    }}
                    whileTap={!isEmailing ? { scale: 0.97 } : {}}>
                    <span style={{ fontSize: '18px', marginBottom: 4 }}>
                        {emailStatus === 'success' ? '✅' : emailStatus === 'error' ? '❌' : '✉️'}
                    </span>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px' }}>
                        {isEmailing ? 'Sending...' : emailStatus === 'success' ? 'Sent!' : emailStatus === 'error' ? 'Failed' : 'Send to Email'}
                    </span>
                </motion.button>
            </div>
        </div>
    );
}
