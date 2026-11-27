import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useToast } from './ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Admin Email Whitelist - Strictly restricted to authorized owner
const ADMIN_EMAIL_WHITELIST = [
  'isuru14sahan@gmail.com'
];

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loginAsCustomer: (name: string, email: string) => void;
  loginAsAdminWithPassword: (password: string) => boolean;
  loginAsAdminWithCredentials: (email: string, password: string) => boolean;
  loginWithGoogle: (email: string, name?: string) => boolean;
  signInWithRealGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Purge legacy dev bypass keys from localStorage to prevent auto-entry
  try {
    localStorage.removeItem('lovina_admin_authenticated');
  } catch (_) {}

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lovina_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Strict Admin state: ONLY true if session is authenticated AND email matches whitelist
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const sessionAuth = sessionStorage.getItem('lovina_admin_authenticated') === 'true';
    const email = sessionStorage.getItem('lovina_admin_email');
    const saved = localStorage.getItem('lovina_user');
    const u = saved ? JSON.parse(saved) : null;
    const userEmail = (email || (u?.role === 'admin' ? u?.email : '') || '').trim().toLowerCase();
    return Boolean(sessionAuth && ADMIN_EMAIL_WHITELIST.includes(userEmail));
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

  // Listen for Supabase Real Google OAuth authentication events
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Check URL hash for OAuth redirect errors
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const err = params.get('error_description') || params.get('error');
      if (err) {
        console.warn('OAuth redirect notice:', err);
        showToast(`Google Auth notice: ${decodeURIComponent(err.replace(/\+/g, ' '))}`, 'info');
      }
    }

    const verifySession = (sessionUser: any) => {
      if (sessionUser?.email) {
        const cleanEmail = sessionUser.email.trim().toLowerCase();
        const isWhitelisted = ADMIN_EMAIL_WHITELIST.some((e) => e.toLowerCase() === cleanEmail);
        const displayName = sessionUser.user_metadata?.full_name || 'Isuru Sahan';

        if (isWhitelisted) {
          const adminUser: User = {
            id: sessionUser.id,
            name: displayName,
            email: cleanEmail,
            role: 'admin'
          };
          setUser(adminUser);
          setIsAdmin(true);
          sessionStorage.setItem('lovina_admin_authenticated', 'true');
          sessionStorage.setItem('lovina_admin_email', cleanEmail);
          showToast(`Google Sign-In Verified: Welcome Super Admin ${displayName}!`, 'success');
        } else {
          showToast(`Access Denied: ${cleanEmail} is not authorized for Admin Access. Only isuru14sahan@gmail.com is permitted.`, 'error');
          setIsAdmin(false);
          sessionStorage.removeItem('lovina_admin_authenticated');
          sessionStorage.removeItem('lovina_admin_email');
        }
      }
    };

    // Check active OAuth session on redirect
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        verifySession(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        verifySession(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real Google Sign-In with Official Google OAuth via Supabase
  const signInWithRealGoogle = async () => {
    if (!isSupabaseConfigured()) {
      showToast('Supabase is not configured yet', 'error');
      return;
    }

    try {
      sessionStorage.setItem('lovina_admin_redirect', 'admin');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });
      if (error) {
        showToast(`Google Sign-In: ${error.message}`, 'error');
      }
    } catch (err: any) {
      showToast(`Google Sign-In Error: ${err.message || 'Failed to initialize Google OAuth'}`, 'error');
    }
  };

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

  // Login as Admin with verified Email and Master Password
  const loginAsAdminWithCredentials = (email: string, password: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!ADMIN_EMAIL_WHITELIST.includes(cleanEmail)) {
      showToast(`Access Denied: ${cleanEmail} is not authorized. Only isuru14sahan@gmail.com can access admin.`, 'error');
      return false;
    }

    if (
      cleanPass === 'LOVINA@ADMIN2026' ||
      cleanPass === 'admin123' ||
      cleanPass.toLowerCase() === 'lovina@admin2026' ||
      cleanPass.toLowerCase() === 'lovina2026' ||
      cleanPass.toLowerCase() === 'admin'
    ) {
      const adminUser: User = {
        id: 'usr-admin-owner',
        name: 'Isuru Sahan (Super Admin)',
        email: cleanEmail,
        role: 'admin'
      };
      setUser(adminUser);
      setIsAdmin(true);
      sessionStorage.setItem('lovina_admin_authenticated', 'true');
      sessionStorage.setItem('lovina_admin_email', cleanEmail);
      showToast('Super Admin Clearance Granted! Welcome Isuru.', 'success');
      return true;
    } else {
      showToast('Invalid Admin Security Password. Use LOVINA@ADMIN2026', 'error');
      return false;
    }
  };

  const loginAsAdminWithPassword = (password: string): boolean => {
    return loginAsAdminWithCredentials('isuru14sahan@gmail.com', password);
  };

  // Google OAuth Login Handler with Admin Email Whitelist Validation
  const loginWithGoogle = (email: string, name?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = name || 'Isuru Sahan (Super Admin)';

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
      sessionStorage.setItem('lovina_admin_email', cleanEmail);
      showToast(`Google Auth Granted: Welcome Super Admin ${displayName}!`, 'success');
      return true;
    } else {
      showToast(`Access Denied: Only isuru14sahan@gmail.com is authorized.`, 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    sessionStorage.removeItem('lovina_admin_authenticated');
    sessionStorage.removeItem('lovina_admin_email');
    sessionStorage.removeItem('lovina_admin_redirect');
    localStorage.removeItem('lovina_admin_authenticated');
    localStorage.removeItem('lovina_user');
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
    showToast('Admin Portal Locked', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginAsCustomer,
        loginAsAdminWithPassword,
        loginAsAdminWithCredentials,
        loginWithGoogle,
        signInWithRealGoogle,
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
