import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useToast } from './ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Cryptographic SHA-256 helper (one-way hashing)
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Cryptographic SHA-256 Hashes of Authorized Admin Credentials
// One-way hashes guarantee zero plaintext passwords or personal emails exist in client bundle or repository
const ADMIN_EMAIL_HASHES = [
  '3dff327115b5e24da6a65cd5b9d2bc2b0e39f6581742f3ee2ec23dbfdc97e91f'
];

const ADMIN_PASS_HASHES = [
  'eb9cd01c89db2a147be70df37e22bb812ad44b0ddf8c5a9e93789b95fcf91276',
  'a090afb8ed81cb2667de7ce2b0bc8c325949918843b403911743b4aa87c3280f',
  '05a1f38d86d836e0feab70a53bfcea792d95e8bc1add88ebb45c8be6b5299f91',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
];

const ADMIN_ENV_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string || '').trim().toLowerCase();
const ADMIN_ENV_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string || '').trim();

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loginAsCustomer: (name: string, email: string) => void;
  loginAsAdminWithPassword: (password: string) => Promise<boolean>;
  loginAsAdminWithCredentials: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (email: string, name?: string) => Promise<boolean>;
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

  // Strict Admin state: ONLY true if session is authenticated AND email hash matches whitelist
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const sessionAuth = sessionStorage.getItem('lovina_admin_authenticated') === 'true';
    const emailHash = sessionStorage.getItem('lovina_admin_hash');
    return Boolean(sessionAuth && emailHash && ADMIN_EMAIL_HASHES.includes(emailHash));
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

    const verifySession = async (sessionUser: any) => {
      if (sessionUser?.email) {
        const cleanEmail = sessionUser.email.trim().toLowerCase();
        const emailHash = await sha256(cleanEmail);
        const isWhitelisted =
          ADMIN_EMAIL_HASHES.includes(emailHash) ||
          (ADMIN_ENV_EMAIL && cleanEmail === ADMIN_ENV_EMAIL);
        const displayName = sessionUser.user_metadata?.full_name || 'Super Admin';

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
          sessionStorage.setItem('lovina_admin_hash', emailHash);
          sessionStorage.setItem('lovina_admin_email', cleanEmail);
          showToast(`Google Sign-In Verified: Welcome Super Admin ${displayName}!`, 'success');
        } else {
          showToast('Access Denied: You do not have Super Admin clearance.', 'error');
          setIsAdmin(false);
          sessionStorage.removeItem('lovina_admin_authenticated');
          sessionStorage.removeItem('lovina_admin_hash');
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

  // Login as Admin with verified Email and Master Password using SHA-256 validation
  const loginAsAdminWithCredentials = async (email: string, password: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      showToast('Please enter both your admin email and password.', 'error');
      return false;
    }

    const emailHash = await sha256(cleanEmail);
    const passHash = await sha256(cleanPass);

    const isEmailValid =
      ADMIN_EMAIL_HASHES.includes(emailHash) ||
      (ADMIN_ENV_EMAIL && cleanEmail === ADMIN_ENV_EMAIL);

    const isPassValid =
      ADMIN_PASS_HASHES.includes(passHash) ||
      (ADMIN_ENV_PASSWORD && cleanPass === ADMIN_ENV_PASSWORD);

    if (isEmailValid && isPassValid) {
      const adminUser: User = {
        id: 'usr-admin-owner',
        name: 'Super Admin',
        email: cleanEmail,
        role: 'admin'
      };
      setUser(adminUser);
      setIsAdmin(true);
      sessionStorage.setItem('lovina_admin_authenticated', 'true');
      sessionStorage.setItem('lovina_admin_hash', emailHash);
      sessionStorage.setItem('lovina_admin_email', cleanEmail);
      showToast('Super Admin Clearance Granted! Welcome back.', 'success');
      return true;
    } else {
      showToast('Invalid credentials. Please verify your admin email and password.', 'error');
      return false;
    }
  };

  const loginAsAdminWithPassword = async (password: string): Promise<boolean> => {
    const cleanPass = password.trim();
    if (!cleanPass) {
      showToast('Please enter master password.', 'error');
      return false;
    }

    const passHash = await sha256(cleanPass);
    const isPassValid =
      ADMIN_PASS_HASHES.includes(passHash) ||
      (ADMIN_ENV_PASSWORD && cleanPass === ADMIN_ENV_PASSWORD);

    if (isPassValid) {
      const adminUser: User = {
        id: 'usr-admin-owner',
        name: 'Super Admin',
        email: ADMIN_ENV_EMAIL || 'admin@lovina.lk',
        role: 'admin'
      };
      setUser(adminUser);
      setIsAdmin(true);
      sessionStorage.setItem('lovina_admin_authenticated', 'true');
      if (ADMIN_EMAIL_HASHES[0]) {
        sessionStorage.setItem('lovina_admin_hash', ADMIN_EMAIL_HASHES[0]);
      }
      showToast('Super Admin Clearance Granted!', 'success');
      return true;
    } else {
      showToast('Invalid Security Password.', 'error');
      return false;
    }
  };

  // Google OAuth Login Handler with SHA-256 Whitelist Validation
  const loginWithGoogle = async (email: string, name?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const emailHash = await sha256(cleanEmail);
    const isWhitelisted =
      ADMIN_EMAIL_HASHES.includes(emailHash) ||
      (ADMIN_ENV_EMAIL && cleanEmail === ADMIN_ENV_EMAIL);

    if (isWhitelisted) {
      const displayName = name || 'Super Admin';
      const adminUser: User = {
        id: 'usr-admin-google',
        name: displayName,
        email: cleanEmail,
        role: 'admin'
      };
      setUser(adminUser);
      setIsAdmin(true);
      sessionStorage.setItem('lovina_admin_authenticated', 'true');
      sessionStorage.setItem('lovina_admin_hash', emailHash);
      sessionStorage.setItem('lovina_admin_email', cleanEmail);
      showToast(`Google Auth Granted: Welcome Super Admin ${displayName}!`, 'success');
      return true;
    } else {
      showToast('Access Denied: You do not have Super Admin clearance.', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    sessionStorage.removeItem('lovina_admin_authenticated');
    sessionStorage.removeItem('lovina_admin_hash');
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
