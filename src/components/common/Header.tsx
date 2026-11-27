import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, User as UserIcon, Menu, X, Sparkles, Compass } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { CategorySlug } from '../../types';

interface HeaderProps {
  activeCategory: CategorySlug;
  onSelectCategory: (category: CategorySlug) => void;
  onNavigate: (page: 'home' | 'shop' | 'checkout' | 'account' | 'admin' | 'tracking') => void;
  currentPage: string;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onNavigate,
  currentPage,
  onOpenSearch,
  onOpenWishlist
}) => {
  const { cart, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, loginAsCustomer } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navCategories: { slug: CategorySlug; label: string }[] = [
    { slug: 'all', label: 'All Jewelry' },
    { slug: 'necklaces', label: 'Necklaces' },
    { slug: 'rings', label: 'Rings' },
    { slug: 'earrings', label: 'Earrings' },
    { slug: 'bracelets', label: 'Bracelets' },
    { slug: 'mens-accessories', label: "Men's" }
  ];

  return (
    <>
      {/* Modern Futuristic Single-Line Transparent Glass Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isScrolled
            ? 'rgba(10, 10, 10, 0.90)'
            : currentPage === 'home'
            ? 'rgba(10, 10, 10, 0.38)'
            : 'rgba(12, 12, 12, 0.94)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: isScrolled || currentPage !== 'home'
            ? '1px solid rgba(212, 175, 55, 0.28)'
            : '1px solid rgba(255, 255, 255, 0.12)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.5)' : 'none'
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Left Section: Menu Toggle, Home & Collection Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                background: 'rgba(212, 175, 55, 0.10)',
                backdropFilter: 'blur(8px)',
                padding: '0.42rem 0.9rem',
                borderRadius: '24px',
                cursor: 'pointer',
                color: '#FFFFFF',
                transition: 'all 0.2s ease'
              }}
              aria-label="Open Navigation Menu"
              title="Open Categories & Boutique Menu"
            >
              <Menu size={18} color="#D4AF37" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#FFFFFF' }}>
                Menu
              </span>
            </button>

            <nav className="desktop-only-nav" style={{ display: 'flex', gap: '1.4rem', alignItems: 'center' }}>
              <button
                onClick={() => onNavigate('home')}
                style={{
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: currentPage === 'home' ? 700 : 500,
                  color: currentPage === 'home' ? '#D4AF37' : '#FFFFFF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.3rem 0',
                  borderBottom: currentPage === 'home' ? '2px solid #D4AF37' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Home
              </button>

              <button
                onClick={() => {
                  onSelectCategory('all');
                  onNavigate('shop');
                }}
                style={{
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: currentPage === 'shop' ? 700 : 500,
                  color: currentPage === 'shop' ? '#D4AF37' : '#FFFFFF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.3rem 0',
                  borderBottom: currentPage === 'shop' ? '2px solid #D4AF37' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Collection
              </button>

              <button
                onClick={() => onNavigate('tracking')}
                style={{
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: currentPage === 'tracking' ? 700 : 500,
                  color: currentPage === 'tracking' ? '#D4AF37' : '#FFFFFF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.3rem 0',
                  borderBottom: currentPage === 'tracking' ? '2px solid #D4AF37' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                Track Order
              </button>
            </nav>
          </div>

          {/* Center Section: Luxury Brand Logo */}
          <div
            style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => onNavigate('home')}
            title="Lovina Luxury Jewellery"
          >
            <h1
              className="gold-gradient-text header-logo-title"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '2rem',
                letterSpacing: '0.22em',
                fontWeight: 700,
                margin: 0,
                textTransform: 'uppercase',
                textShadow: '0 2px 14px rgba(0,0,0,0.6)'
              }}
            >
              LOVINA
            </h1>
            <span
              style={{
                fontSize: '0.62rem',
                textTransform: 'uppercase',
                letterSpacing: '0.38em',
                color: '#D4AF37',
                display: 'block',
                marginTop: '-3px',
                fontWeight: 600,
                textShadow: '0 1px 8px rgba(0,0,0,0.8)'
              }}
            >
              Luxury Jewellery
            </span>
          </div>

          {/* Right Section: Search, Dashboard/Login, User Profile, Wishlist, Cart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', flex: 1 }}>
            {/* Live Search Trigger */}
            <button
              onClick={onOpenSearch}
              style={{
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Search Jewelry"
            >
              <Search size={18} />
            </button>

            {/* Dashboard / Admin Button (Futuristic Gold Pill) */}
            <button
              onClick={() => onNavigate('admin')}
              className="header-dashboard-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.42rem 0.95rem',
                fontSize: '0.78rem',
                borderRadius: '24px',
                backgroundColor: 'rgba(212, 175, 55, 0.16)',
                color: '#D4AF37',
                fontWeight: 700,
                border: '1px solid rgba(212, 175, 55, 0.55)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.04em',
                transition: 'all 0.2s ease'
              }}
              title="Super Admin Dashboard"
            >
              <UserIcon size={14} color="#D4AF37" />
              <span className="header-dashboard-label">Dashboard</span>
            </button>

            {/* User Account / Profile */}
            <button
              onClick={() => {
                if (!user) {
                  loginAsCustomer('Kasun Perera', 'kasun@lovina.lk');
                }
                onNavigate('account');
              }}
              style={{
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={user ? `Account (${user.name})` : 'Customer Account'}
            >
              <UserIcon size={18} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              style={{
                position: 'relative',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="View Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-4px',
                    backgroundColor: '#D4AF37',
                    color: '#121212',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              style={{
                position: 'relative',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid rgba(212, 175, 55, 0.55)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Shopping Cart Drawer"
            >
              <ShoppingBag size={18} color="#D4AF37" />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#D4AF37',
                    color: '#121212',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #121212',
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.6)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Full Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '320px',
              maxWidth: '85vw',
              height: '100%',
              backgroundColor: '#121212',
              color: '#FFFFFF',
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              overflowY: 'auto',
              borderRight: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '10px 0 35px rgba(0, 0, 0, 0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in"
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', paddingBottom: '1.25rem' }}>
              <div>
                <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1.4rem', color: '#D4AF37', letterSpacing: '0.15em' }}>
                  LOVINA
                </span>
                <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#888' }}>
                  Luxury Catalogue
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '0.3rem' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <button
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: currentPage === 'home' ? '#D4AF37' : '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Home Page
              </button>
              <button
                onClick={() => { onSelectCategory('all'); onNavigate('shop'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: currentPage === 'shop' && activeCategory === 'all' ? '#D4AF37' : '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                All Products Catalog
              </button>
              <button
                onClick={() => { onNavigate('tracking'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: currentPage === 'tracking' ? '#D4AF37' : '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Track Order Status
              </button>
            </div>

            {/* Category Directory */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#D4AF37', letterSpacing: '0.15em', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                Jewellery Categories
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navCategories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      onSelectCategory(c.slug);
                      onNavigate('shop');
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: activeCategory === c.slug && currentPage === 'shop' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                      color: activeCategory === c.slug && currentPage === 'shop' ? '#D4AF37' : '#E0E0E0',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{c.label}</span>
                    <span style={{ color: '#D4AF37', fontSize: '0.75rem' }}>→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Admin Access */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => { onNavigate('account'); setMobileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#B0B0B0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <UserIcon size={16} />
                <span>Customer Account</span>
              </button>
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <Sparkles size={16} color="#D4AF37" />
                <span>{isAdmin ? 'Admin Dashboard' : 'Login / Admin Portal'}</span>
              </button>

              {/* Promo Callout */}
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
                  10% Special Discount
                </span>
                <span style={{ fontSize: '0.75rem', color: '#FFFFFF', display: 'block', marginTop: '2px' }}>
                  Use Coupon: <strong style={{ color: '#D4AF37' }}>LOVINA10</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
