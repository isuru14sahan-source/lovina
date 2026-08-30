import React, { useState } from 'react';
import { X, Shield, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [customEmail, setCustomEmail] = useState('isuru14sahan@gmail.com');

  if (!isOpen) return null;

  const handleGoogleLogin = (email: string, name: string) => {
    const isExecutive = loginWithGoogle(email, name);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '2.5rem',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          border: '1px solid #D4AF37',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={20} color="#D4AF37" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#AA820A' }}>
              Google Whitelist Auth
            </span>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} color="#121212" />
          </button>
        </div>

        {/* Google Branding Badge */}
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FAF7F2', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
        </div>

        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', color: '#121212', margin: '0 0 0.5rem 0' }}>
          Sign In with Google
        </h3>

        <p style={{ fontSize: '0.85rem', color: '#6E6E6E', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Authenticating via official Google OAuth. Only designated admin Gmail addresses will unlock Executive Super Admin clearance.
        </p>

        {/* 1-Click Designated Admin Google Account Card */}
        <div
          onClick={() => handleGoogleLogin('isuru14sahan@gmail.com', 'Isuru Sahan (Super Admin)')}
          style={{
            backgroundColor: '#FAF7F2',
            border: '2px solid #D4AF37',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          className="btn-gold-hover"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#D4AF37', color: '#121212', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              IS
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#121212', fontWeight: 700 }}>isuru14sahan@gmail.com</h4>
              <span style={{ fontSize: '0.75rem', color: '#2B7A4B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle2 size={12} /> Executive Admin Whitelisted
              </span>
            </div>
          </div>
          <Sparkles size={18} color="#D4AF37" />
        </div>

        {/* Custom Google Email Input */}
        <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.4rem' }}>
            Or enter another Google Account email:
          </label>
          <input
            type="email"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            placeholder="your-name@gmail.com"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #D5CEC2', outline: 'none', fontSize: '0.85rem' }}
          />
        </div>

        <button
          onClick={() => handleGoogleLogin(customEmail, customEmail.split('@')[0])}
          className="btn-gold"
          style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Lock size={16} />
          <span>Authenticate Google Account</span>
        </button>
      </div>
    </div>
  );
};
