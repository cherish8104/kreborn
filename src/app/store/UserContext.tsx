import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { KoreanIdentity } from '../utils/sajuEngine';

export interface UserInput {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: 'male' | 'female';
  nationality: string;
  email: string;
  isLunar: boolean;
}

interface AppState {
  userInput: UserInput | null;
  identity: KoreanIdentity | null;
  isPaid: boolean;
  shareCode: string | null;
  setUserInput: (input: UserInput) => void;
  setIdentity: (identity: KoreanIdentity) => void;
  setIsPaid: (paid: boolean) => void;
  setShareCode: (code: string) => void;
}

const UserContext = createContext<AppState | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInput, setUserInputState] = useState<UserInput | null>(() => {
    try {
      const s = sessionStorage.getItem('kreborn_input');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const [identity, setIdentityState] = useState<KoreanIdentity | null>(() => {
    try {
      const s = sessionStorage.getItem('kreborn_identity');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const [isPaid, setIsPaidState] = useState(false);

  const [shareCode, setShareCodeState] = useState<string | null>(() => {
    try { return sessionStorage.getItem('kreborn_share_code'); } catch { return null; }
  });

  const setUserInput = (input: UserInput) => {
    setUserInputState(input);
    try { sessionStorage.setItem('kreborn_input', JSON.stringify(input)); } catch { }
  };

  const setIdentity = (id: KoreanIdentity) => {
    setIdentityState(id);
    try { sessionStorage.setItem('kreborn_identity', JSON.stringify(id)); } catch { }
  };

  const setIsPaid = (paid: boolean) => setIsPaidState(paid);

  const setShareCode = (code: string) => {
    setShareCodeState(code);
    try { sessionStorage.setItem('kreborn_share_code', code); } catch { }
  };

  return (
    <UserContext.Provider value={{ userInput, identity, isPaid, shareCode, setUserInput, setIdentity, setIsPaid, setShareCode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): AppState {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}
