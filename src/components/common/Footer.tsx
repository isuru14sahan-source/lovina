import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { CategorySlug } from '../../types';

interface FooterProps {
  onSelectCategory: (category: CategorySlug) => void;
  onNavigate: (page: 'home' | 'shop' | 'checkout' | 'account' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigate }) => {
  return (
    <footer style={{ backgroundColor: '#121212', color: '#F5EFEB', borderTop: '3px solid #D4AF37', marginTop: '4rem' }}>
      {/* Brand Value Pillars */}
      <div style={{ backgroundColor: '#1E1E1E', padding: '2.5rem 1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={32} color="#D4AF37" />
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#FFFFFF', margin: 0 }}>18K Gold Plated Luxury</h4>
            <p style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>Micro vacuum gold plating designed for anti-tarnish longevity</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Truck size={32} color="#D4AF37" />
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#FFFFFF', margin: 0 }}>Express Shipping</h4>
            <p style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>Islandwide 2-3 day courier delivery with tracking</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={32} color="#D4AF37" />
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#FFFFFF', margin: 0 }}>1-Year Quality Guarantee</h4>
            <p style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>Full warranty on manufacturing defects & metal plating</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <RotateCcw size={32} color="#D4AF37" />
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#FFFFFF', margin: 0 }}>Hassle-Free Exchanges</h4>
            <p style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>7-day exchange policy for size and variant modifications</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
        {/* Brand Column */}
        <div>
          <h2 className="gold-gradient-text" style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>LOVINA</h2>
          <p style={{ fontSize: '0.85rem', color: '#B0B0B0', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Lovina is Sri Lanka’s premier destination for high-end imitation jewellery, 18K gold-plated pieces, freshwater pearls, and luxury fashion accessories.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
              <Instagram size={18} />
            </a>
            <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
              <Facebook size={18} />
            </a>
            <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: '#D4AF37', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collections</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0 }}>
            <li><button onClick={() => { onSelectCategory('necklaces'); onNavigate('shop'); }} style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>18K Gold Necklaces</button></li>
            <li><button onClick={() => { onSelectCategory('rings'); onNavigate('shop'); }} style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>Solitaire & Pearl Rings</button></li>
            <li><button onClick={() => { onSelectCategory('earrings'); onNavigate('shop'); }} style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>Chandelier Earrings</button></li>
            <li><button onClick={() => { onSelectCategory('bracelets'); onNavigate('shop'); }} style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>Tennis Bracelets</button></li>
            <li><button onClick={() => { onSelectCategory('mens-accessories'); onNavigate('shop'); }} style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>Men's Onyx & Steel</button></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: '#D4AF37', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Care</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0 }}>
            <li><button onClick={() => onNavigate('account')} style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>Track Order Status</button></li>
            <li><a href="#" style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>Jewellery Care Guide</a></li>
            <li><a href="#" style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>Ring Sizing Chart</a></li>
            <li><a href="#" style={{ color: '#C0C0C0', fontSize: '0.85rem' }}>Returns & Exchanges</a></li>
            <li><button onClick={() => onNavigate('admin')} style={{ color: '#D4AF37', fontSize: '0.85rem', fontWeight: 600 }}>Staff Admin Login</button></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: '#D4AF37', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Boutique Concierge</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem', color: '#C0C0C0' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <MapPin size={16} color="#D4AF37" />
              <span>Flagship Store: 100 Galle Road, Colombo 03</span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Phone size={16} color="#D4AF37" />
              <span>+94 11 234 5678 / +94 77 123 4567</span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Mail size={16} color="#D4AF37" />
              <span>concierge@lovina.lk</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: '1px solid #222222', padding: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#888888' }}>
        <p>© 2026 Lovina E-Commerce Platform. All Rights Reserved. Crafted with Enterprise Excellence.</p>
      </div>
    </footer>
  );
};
