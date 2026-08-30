import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '380px',
        width: '100%'
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-right"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderRadius: '8px',
            backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            borderLeft:
              toast.type === 'success'
                ? '4px solid #D4AF37'
                : toast.type === 'error'
                ? '4px solid #D32F2F'
                : '4px solid #2196F3'
          }}
        >
          {toast.type === 'success' && <CheckCircle2 size={20} color="#D4AF37" />}
          {toast.type === 'info' && <Info size={20} color="#2196F3" />}
          {toast.type === 'error' && <AlertCircle size={20} color="#D32F2F" />}
          <span style={{ fontSize: '0.875rem', flex: 1, fontWeight: 400 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: '#AAAAAA', display: 'flex', alignItems: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
