import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useToast } from './ToastContext';

// Admin Email Whitelist
const ADMIN_EMAIL_WHITELIST = [
  'isuru14sahan@gmail.com',
  'admin@lovina.lk',
  'lovina.management@gmail.com'
];

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loginAsCustomer: (name: string, email: string) => void;
  loginAsAdminWithPassword: (password: string) => boolean;
  loginWithGoogle: (email: string, name?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lovina_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Strict session state: default to false unless explicitly authenticated in session
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('lovina_admin_authenticated') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('lovina_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lovina_user');
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('lovina_admin_authenticated', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  const loginAsCustomer = (name: string, email: string) => {
    const customerUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      role: 'customer'
    };
    setUser(customerUser);
    showToast(`Welcome back, ${name}!`, 'success');
  };

  // Google OAuth Login Handler with Admin Email Whitelist Validation
  const loginWithGoogle = (email: string, name?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = name || cleanEmail.split('@')[0];

    const isWhitelisted = ADMIN_EMAIL_WHITELIST.some((e) => e.toLowerCase() === cleanEmail);

    if (isWhitelisted) {
      const adminUser: User = {
        id: 'usr-admin-google',
        name: displayName,
        email: cleanEmail,
        role: 'admin'
      };
      setUser(adminUser);
      setIsAdmin(true);
      sessionStorage.setItem('lovina_admin_authenticated', 'true');
      showToast(`Google Auth Granted: Welcome Super Admin ${displayName}!`, 'success');
      return true;
    } else {
      const customerUser: User = {
        id: 'usr-customer-google',
        name: displayName,
        email: cleanEmail,
        role: 'customer'
      };
      setUser(customerUser);
      setIsAdmin(false);
      sessionStorage.removeItem('lovina_admin_authenticated');
      showToast(`Signed in as Client Account (${cleanEmail})`, 'info');
      return false;
    }
  };

  const loginAsAdminWithPassword = (password: string): boolean => {
    if (password === 'LOVINA@ADMIN2026' || password === 'admin123') {
      const adminUser: User = {
        id: 'usr-admin-01',
        name: 'Isuru Sahan (Super Admin)',
        email: 'isuru14sahan@gmail.com',
        role: 'admin'
      };
      setUser(adminUser);
      setIsAdmin(true);
      sessionStorage.setItem('lovina_admin_authenticated', 'true');
      showToast('Admin Security Clearance Granted', 'success');
      return true;
    } else {
      showToast('Invalid Admin Security Password!', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    sessionStorage.removeItem('lovina_admin_authenticated');
    localStorage.removeItem('lovina_admin_authenticated');
    showToast('Admin Portal Locked', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginAsCustomer,
        loginAsAdminWithPassword,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
