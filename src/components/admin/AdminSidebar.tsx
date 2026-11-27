import React from 'react';
import { LayoutDashboard, Layers, Package, Trash2, Lock, Shield, Sparkles, X } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'overview' | 'products' | 'orders' | 'archive';
  onSelectTab: (tab: 'overview' | 'products' | 'orders' | 'archive') => void;
  onLock: () => void;
  onNavigateShop?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLock,
  onNavigateShop,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Product Management Index', icon: Layers },
    { id: 'orders', label: 'Order Fulfillment', icon: Package },
    { id: 'archive', label: 'Product Archive', icon: Trash2 }
  ] as const;

  const handleTabClick = (tab: 'overview' | 'products' | 'orders' | 'archive') => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <aside
      className="admin-sidebar-aside"
      style={{
        width: '270px',
        maxWidth: '85vw',
        backgroundColor: '#121212',
        color: '#FFFFFF',
        height: '100%',
        minHeight: '100vh',
        padding: '2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid #282828',
        boxShadow: isMobileOpen ? '0 0 35px rgba(0,0,0,0.8)' : 'none'
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ paddingBottom: '1.25rem', marginBottom: '1.75rem', borderBottom: '1px solid rgba(212,175,55,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Shield size={20} color="#D4AF37" />
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em' }}>
                LOVINA
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#888888', display: 'block' }}>
              Super Admin Control
            </span>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '6px',
                padding: '6px',
                cursor: 'pointer',
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close Admin Navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.9rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
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
            onClick={() => {
              onNavigateShop();
              if (onCloseMobile) onCloseMobile();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.8rem',
              borderRadius: '6px',
              backgroundColor: '#1E1E1E',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={14} />
            <span>Exit to Boutique Store</span>
          </button>
        )}

        <button
          onClick={() => {
            onLock();
            if (onCloseMobile) onCloseMobile();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.8rem',
            borderRadius: '6px',
            backgroundColor: '#1E1E1E',
            color: '#D32F2F',
            border: '1px solid #333333',
            fontSize: '0.82rem',
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

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile <= 900px via CSS) */}
      <div className="desktop-admin-sidebar">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay (visible when isMobileOpen is true) */}
      {isMobileOpen && (
        <div
          className="mobile-admin-drawer-overlay animate-fade-in"
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex'
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ height: '100%' }}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
