import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User as UserIcon, Shield, Menu, X, Sparkles } from 'lucide-react';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E3D9' }}>
      {/* Top Announcement Bar */}
      <div style={{ backgroundColor: '#121212', color: '#D4AF37', padding: '0.4rem 1rem', textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
        <Sparkles size={14} color="#D4AF37" />
        <span>Complimentary Express Delivery on Orders Above LKR 15,000 | Use Code <strong>LOVINA10</strong> for 10% Off</span>
      </div>

      {/* Main Header Container */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Mobile Menu Toggle & Desktop Nav items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
            aria-label="Toggle menu"
          >
            <Menu size={24} color="#121212" />
          </button>

          <nav className="desktop-only-nav" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: currentPage === 'home' ? 700 : 500,
                color: currentPage === 'home' ? '#AA820A' : '#121212'
              }}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('tracking')}
              style={{
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: currentPage === 'tracking' ? 700 : 500,
                color: currentPage === 'tracking' ? '#AA820A' : '#121212'
              }}
            >
              Track Order
            </button>
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
          <h1 className="gold-gradient-text header-logo-title" style={{ fontFamily: "'Cinzel', serif", fontSize: '2.1rem', letterSpacing: '0.15em', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
            LOVINA
          </h1>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.35em', color: '#AA820A', display: 'block', marginTop: '-4px' }}>
            Luxury Jewellery
          </span>
        </div>

        {/* Right: Actions (Search, Admin Shield, User Account, Wishlist, Cart) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Live Search Trigger */}
          <button
            onClick={onOpenSearch}
            style={{ color: '#121212', display: 'flex', alignItems: 'center' }}
            title="Search Jewelry"
          >
            <Search size={22} />
          </button>

          {/* Admin Clearance Portal Button (Desktop only in header, moved to drawer on mobile) */}
          {/* Login / Dashboard Button */}
          <button
            onClick={() => onNavigate('admin')}
            className="desktop-only-admin-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.8rem',
              fontSize: '0.78rem',
              borderRadius: '20px',
              backgroundColor: '#FAF7F2',
              color: '#AA820A',
              fontWeight: 600,
              border: '1px solid #D4AF37',
              cursor: 'pointer'
            }}
            title={isAdmin ? 'Executive Dashboard' : 'Login'}
          >
            <UserIcon size={14} />
            <span>{isAdmin ? 'Dashboard' : 'Login'}</span>
          </button>

          {/* User Profile */}
          <button
            onClick={() => {
              if (!user) {
                loginAsCustomer('Kasun Perera', 'kasun@lovina.lk');
              }
              onNavigate('account');
            }}
            style={{ color: '#121212', display: 'flex', alignItems: 'center' }}
            title={user ? `Logged in as ${user.name}` : 'Login / Account'}
          >
            <UserIcon size={22} />
          </button>

          {/* Wishlist Icon (Triggers Wishlist Drawer) */}
          <button
            onClick={onOpenWishlist}
            style={{ position: 'relative', color: '#121212', display: 'flex', alignItems: 'center' }}
            title="View Saved Wishlist"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', backgroundColor: '#AA820A', color: '#FFF', fontSize: '0.65rem', fontWeight: 700, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={toggleCart}
            style={{ position: 'relative', color: '#121212', display: 'flex', alignItems: 'center' }}
            title="Shopping Cart Drawer"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', backgroundColor: '#121212', color: '#D4AF37', fontSize: '0.65rem', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4AF37' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div style={{ backgroundColor: '#FAF7F2', borderTop: '1px solid #E8E3D9', padding: '0.6rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', padding: '0 1rem' }}>
          {navCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                onSelectCategory(cat.slug);
                onNavigate('shop');
              }}
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: activeCategory === cat.slug && currentPage === 'shop' ? 700 : 500,
                color: activeCategory === cat.slug && currentPage === 'shop' ? '#AA820A' : '#6E6E6E',
                borderBottom: activeCategory === cat.slug && currentPage === 'shop' ? '2px solid #D4AF37' : '2px solid transparent',
                paddingBottom: '0.2rem',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setMobileMenuOpen(false)}>
          <div
            style={{ width: '300px', height: '100%', backgroundColor: '#FFFFFF', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8E3D9', paddingBottom: '1rem' }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1.2rem', color: '#AA820A' }}>LOVINA</span>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <button
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase' }}
              >
                Home Page
              </button>
              <button
                onClick={() => { onNavigate('shop'); onSelectCategory('all'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase' }}
              >
                All Products
              </button>

              <div style={{ margin: '1rem 0', borderTop: '1px solid #E8E3D9', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#AA820A', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Categories</span>
                {navCategories.filter(c => c.slug !== 'all').map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => { onSelectCategory(c.slug); onNavigate('shop'); setMobileMenuOpen(false); }}
                    style={{ display: 'block', padding: '0.4rem 0', fontSize: '0.9rem', color: '#121212' }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { onNavigate('account'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', fontSize: '0.9rem', color: '#6E6E6E' }}
              >
                Customer Account
              </button>
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', fontSize: '0.9rem', color: '#AA820A', fontWeight: 600 }}
              >
                {isAdmin ? 'Admin Dashboard' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
