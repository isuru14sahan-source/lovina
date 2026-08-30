import React from 'react';
import { Product, CategorySlug } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Award, Heart, ShoppingBag, Star, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';

interface HomePageProps {
  products: Product[];
  onSelectCategory: (category: CategorySlug) => void;
  onNavigate: (page: 'home' | 'shop' | 'checkout' | 'account' | 'admin') => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectCategory,
  onNavigate,
  onQuickView,
  onSelectProduct
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Hero Banner Section */}
      <section
        className="hero-banner-box"
        style={{
          position: 'relative',
          minHeight: '520px',
          backgroundImage: 'linear-gradient(90deg, rgba(18,18,18,0.85) 0%, rgba(18,18,18,0.4) 100%), url("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '12px',
          margin: '1.5rem 1.5rem 0',
          padding: '4rem 3rem',
          color: '#FFFFFF'
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37', border: '1px solid #D4AF37', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem' }}>
            <Sparkles size={14} /> 2026 Royal Heritage Collection
          </span>

          <h1 className="hero-banner-title" style={{ fontFamily: "'Cinzel', serif", fontSize: '3rem', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Timeless Luxury, Crafted for Perfection.
          </h1>

          <p style={{ fontSize: '1rem', color: '#E0E0E0', lineHeight: 1.6, marginBottom: '2rem' }}>
            Explore high-end 18K gold-plated jewellery, genuine freshwater pearls, and brilliant Austrian crystal creations designed to elevate everyday style into royalty.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                onSelectCategory('all');
                onNavigate('shop');
              }}
              className="btn-gold"
            >
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => {
                onSelectCategory('necklaces');
                onNavigate('shop');
              }}
              className="btn-outline"
              style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
            >
              18K Necklaces
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
            Curated Categories
          </span>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#121212', margin: '0.4rem 0' }}>
            Shop By Signature Style
          </h2>
          <div style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: '18K Necklaces',
              slug: 'necklaces' as CategorySlug,
              img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
              subtitle: 'Micro Vacuum Plated'
            },
            {
              title: 'Solitaire & Pearl Rings',
              slug: 'rings' as CategorySlug,
              img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
              subtitle: '925 Sterling Silver'
            },
            {
              title: 'Chandelier Earrings',
              slug: 'earrings' as CategorySlug,
              img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
              subtitle: 'Austrian Crystals'
            },
            {
              title: 'Tennis Bracelets',
              slug: 'bracelets' as CategorySlug,
              img: 'https://images.unsplash.com/photo-1611591475777-233ca732222e?auto=format&fit=crop&w=600&q=80',
              subtitle: 'Double Safety Clasp'
            }
          ].map((cat) => (
            <div
              key={cat.slug}
              onClick={() => {
                onSelectCategory(cat.slug);
                onNavigate('shop');
              }}
              style={{
                position: 'relative',
                height: '320px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(0,0,0,0.06)'
              }}
              className="category-card"
            >
              <img
                src={cat.img}
                alt={cat.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(18,18,18,0.85) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                  color: '#FFFFFF'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {cat.subtitle}
                </span>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', margin: '0.2rem 0 0.5rem 0' }}>
                  {cat.title}
                </h3>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#FFFFFF' }}>
                  Discover Category <ArrowRight size={14} color="#D4AF37" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
              Curated Selection
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#121212', margin: '0.2rem 0 0 0' }}>
              Featured Luxury Pieces
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectCategory('all');
              onNavigate('shop');
            }}
            className="btn-outline"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Brand Craftsmanship Banner */}
      <section style={{ backgroundColor: '#121212', color: '#FFFFFF', padding: '5rem 1.5rem', borderTop: '1px solid #D4AF37', borderBottom: '1px solid #D4AF37' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#D4AF37', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
              Uncompromising Quality
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.5rem', margin: '0.5rem 0 1.25rem 0', lineHeight: 1.2 }}>
              Master Artistry & Anti-Tarnish Technology
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#CCCCCC', lineHeight: 1.7, marginBottom: '2rem' }}>
              Every Lovina piece undergoes advanced micro-vacuum gold plating over surgical steel or 925 sterling silver, ensuring brilliant luster that withstands daily wear, moisture, and time.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid #282828', paddingTop: '1.5rem' }}>
              <div>
                <h4 style={{ color: '#D4AF37', fontSize: '1.5rem', fontFamily: "'Cinzel', serif", margin: 0 }}>5x Micro-Plated</h4>
                <p style={{ fontSize: '0.8rem', color: '#888888', margin: '0.2rem 0 0 0' }}>Real 18K Yellow & Rose Gold</p>
              </div>
              <div>
                <h4 style={{ color: '#D4AF37', fontSize: '1.5rem', fontFamily: "'Cinzel', serif", margin: 0 }}>AAAAA Grade</h4>
                <p style={{ fontSize: '0.8rem', color: '#888888', margin: '0.2rem 0 0 0' }}>Hand-Cut Cubic Zirconia</p>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
              alt="Craftsmanship"
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Showcase */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
            Customer Favorites
          </span>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#121212', margin: '0.4rem 0' }}>
            Best Selling Jewellery
          </h2>
          <div style={{ width: '60px', height: '2px', backgroundColor: '#D4AF37', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
