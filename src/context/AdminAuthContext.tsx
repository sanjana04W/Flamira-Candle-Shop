'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface AdminUserSession {
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUserSession | null;
  isLoading: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'flamira_admin_auth_v1';

// Strict Single Administrator Credential
const VALID_EMAIL = 'candlesflamira@gmail.com';
const VALID_PASSWORD = 'flamira2026';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email?.toLowerCase() === VALID_EMAIL) {
          setAdminUser(parsed);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('Session read error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, pass: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail === VALID_EMAIL && cleanPass === VALID_PASSWORD) {
      const sessionData: AdminUserSession = {
        name: 'Flamira Owner',
        email: VALID_EMAIL,
        role: 'Super Admin',
      };
      setAdminUser(sessionData);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.error(e);
      }
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid email or password. Only authorized owner credentials accepted.',
    };
  };

  const logout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!adminUser,
        adminUser,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return ctx;
};
