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
}

interface AppState {
  userInput: UserInput | null;
  identity: KoreanIdentity | null;
  isPaid: boolean;
  setUserInput: (input: UserInput) => void;
  setIdentity: (identity: KoreanIdentity) => void;
  setIsPaid: (paid: boolean) => void;
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

  const setUserInput = (input: UserInput) => {
    setUserInputState(input);
    try { sessionStorage.setItem('kreborn_input', JSON.stringify(input)); } catch {}
  };

  const setIdentity = (id: KoreanIdentity) => {
    setIdentityState(id);
    try { sessionStorage.setItem('kreborn_identity', JSON.stringify(id)); } catch {}
  };

  const setIsPaid = (paid: boolean) => setIsPaidState(paid);

  return (
    <UserContext.Provider value={{ userInput, identity, isPaid, setUserInput, setIdentity, setIsPaid }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): AppState {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}
