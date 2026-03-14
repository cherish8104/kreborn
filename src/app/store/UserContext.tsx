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

// localStorage 사용 — sessionStorage는 iOS Safari 리다이렉트 후 소실되는 문제 있음
function read(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInput, setUserInputState] = useState<UserInput | null>(() => {
    const s = read('kreborn_input');
    return s ? JSON.parse(s) : null;
  });

  const [identity, setIdentityState] = useState<KoreanIdentity | null>(() => {
    const s = read('kreborn_identity');
    return s ? JSON.parse(s) : null;
  });

  const [isPaid, setIsPaidState] = useState(false);

  const [shareCode, setShareCodeState] = useState<string | null>(() => read('kreborn_share_code'));

  const setUserInput = (input: UserInput) => {
    setUserInputState(input);
    write('kreborn_input', JSON.stringify(input));
  };

  const setIdentity = (id: KoreanIdentity) => {
    setIdentityState(id);
    write('kreborn_identity', JSON.stringify(id));
  };

  const setIsPaid = (paid: boolean) => setIsPaidState(paid);

  const setShareCode = (code: string) => {
    setShareCodeState(code);
    write('kreborn_share_code', code);
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
