import React from 'react';
import { LayoutDashboard, Layers, Package, Trash2, Lock, Shield, Sparkles } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'overview' | 'products' | 'orders' | 'archive';
  onSelectTab: (tab: 'overview' | 'products' | 'orders' | 'archive') => void;
  onLock: () => void;
  onNavigateShop?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLock,
  onNavigateShop
}) => {
  const menuItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Product Management Index', icon: Layers },
    { id: 'orders', label: 'Order Fulfillment', icon: Package },
    { id: 'archive', label: 'Product Archive', icon: Trash2 }
  ] as const;

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#121212',
        color: '#FFFFFF',
        minHeight: '100vh',
        padding: '2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid #282828'
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ paddingBottom: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Shield size={20} color="#D4AF37" />
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em' }}>
              LOVINA
            </span>
          </div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888888', display: 'block' }}>
            Super Admin Control Center
          </span>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  color: isActive ? '#D4AF37' : '#B0B0B0',
                  border: isActive ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconComp size={18} color={isActive ? '#D4AF37' : '#888888'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem', borderTop: '1px solid #282828' }}>
        {onNavigateShop && (
          <button
            onClick={onNavigateShop}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '6px',
              backgroundColor: '#1E1E1E',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={14} />
            <span>Exit to Boutique Store</span>
          </button>
        )}

        <button
          onClick={onLock}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '6px',
            backgroundColor: '#1E1E1E',
            color: '#D32F2F',
            border: '1px solid #333333',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Lock size={16} />
          <span>Lock Admin Clearance</span>
        </button>
      </div>
    </aside>
  );
};
