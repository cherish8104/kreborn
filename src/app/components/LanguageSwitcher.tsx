import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const LANGUAGES = [
    { code: 'ko', label: 'KR', name: '한국어' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ja', label: 'JP', name: '日本語' },
    { code: 'zh', label: 'CN', name: '中文' },
    { code: 'th', label: 'TH', name: 'ภาษาไทย' },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    return (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 outline-none transition-all"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(201,169,110,0.3)',
                        borderRadius: '4px',
                        fontFamily: 'Pretendard, sans-serif',
                        fontSize: '11px',
                        color: '#c9a96e',
                        letterSpacing: '0.05em'
                    }}
                >
                    <span>🌐</span>
                    <span>{currentLang.label}</span>
                </button>
            </DropdownMenu.Trigger>

            <AnimatePresence>
                {open && (
                    <DropdownMenu.Portal forceMount>
                        <DropdownMenu.Content
                            asChild
                            align="end"
                            sideOffset={8}
                            className="z-50"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    background: 'rgba(10,10,10,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(201,169,110,0.2)',
                                    borderRadius: '6px',
                                    padding: '4px',
                                    minWidth: '120px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                }}
                            >
                                {LANGUAGES.map((lang) => (
                                    <DropdownMenu.Item
                                        key={lang.code}
                                        className="outline-none"
                                        onSelect={() => i18n.changeLanguage(lang.code)}
                                    >
                                        <div
                                            className="cursor-pointer flex items-center justify-between px-3 py-2 transition-all"
                                            style={{
                                                fontFamily: 'Pretendard, sans-serif',
                                                fontSize: '11px',
                                                color: i18n.language === lang.code ? '#c9a96e' : '#a39585',
                                                background: i18n.language === lang.code ? 'rgba(201,169,110,0.08)' : 'transparent',
                                                borderRadius: '4px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,169,110,0.05)'}
                                            onMouseLeave={(e) => {
                                                if (i18n.language !== lang.code) e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <span>{lang.name}</span>
                                            {i18n.language === lang.code && <span style={{ fontSize: '9px' }}>✓</span>}
                                        </div>
                                    </DropdownMenu.Item>
                                ))}
                            </motion.div>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                )}
            </AnimatePresence>
        </DropdownMenu.Root>
    );
}
