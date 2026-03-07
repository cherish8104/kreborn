import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import emailjs from '@emailjs/browser';
import { motion } from 'motion/react';

interface ExportActionsProps {
    targetId: string;
    userName: string;
    userEmail: string;
}

export function ExportActions({ targetId, userName, userEmail }: ExportActionsProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);
    const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const element = document.getElementById(targetId);
            if (!element) throw new Error("Target element not found");

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0a0a0a',
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`K-REBORN_${userName.replace(/\s+/g, '_')}_Identity.pdf`);
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
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

            // Example params matching a hypothetical template
            const templateParams = {
                to_name: userName,
                to_email: userEmail,
                message: 'Your K-REBORN Full Script is ready. See attachment or visit your dashboard.',
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
        <div className="flex flex-col gap-3 mt-8 p-4 rounded-lg" style={{ border: '1px solid rgba(201,169,110,0.15)', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#8a7255', letterSpacing: '0.1em', textAlign: 'center' }}>
                SAVE YOUR IDENTITY
            </p>

            <div className="flex gap-3 mt-2">
                <motion.button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex-1 flex flex-col items-center justify-center py-3 rounded"
                    style={{
                        background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.05))',
                        border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', cursor: isExporting ? 'wait' : 'pointer'
                    }}
                    whileTap={!isExporting ? { scale: 0.97 } : {}}>
                    <span style={{ fontSize: '18px', marginBottom: 4 }}>📄</span>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px' }}>
                        {isExporting ? 'Generating...' : 'Download PDF'}
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
