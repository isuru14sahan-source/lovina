import React, { useState } from 'react';
import { Product, CategorySlug, HeroBannerConfig, DEFAULT_HERO_CONFIG } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Award, Heart, ShoppingBag, Star, RefreshCw, ChevronLeft, ChevronRight, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';

interface HomePageProps {
  products: Product[];
  heroConfig?: HeroBannerConfig;
  onSelectCategory: (category: CategorySlug) => void;
  onNavigate: (page: 'home' | 'shop' | 'checkout' | 'account' | 'admin') => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  heroConfig = DEFAULT_HERO_CONFIG,
  onSelectCategory,
  onNavigate,
  onQuickView,
  onSelectProduct
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const hero = heroConfig || DEFAULT_HERO_CONFIG;

  const videoPlaylist = (hero.videoUrls && hero.videoUrls.length > 0)
    ? hero.videoUrls
    : (hero.videoUrl ? [hero.videoUrl] : ['/assets/videos/hero-jewelry.mp4']);

  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const activeVideoUrl = videoPlaylist[currentVideoIdx] || videoPlaylist[0];
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Force DOM property muted and trigger playback reliably across all browsers
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented by browser, retrying muted:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [activeVideoUrl, isMuted]);

  // Auto transition when current video ends
  const handleVideoEnded = () => {
    if (videoPlaylist.length > 1) {
      setCurrentVideoIdx((prev) => (prev + 1) % videoPlaylist.length);
    }
  };

  const handlePrevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVideoIdx((prev) => (prev - 1 + videoPlaylist.length) % videoPlaylist.length);
  };

  const handleNextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVideoIdx((prev) => (prev + 1) % videoPlaylist.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Full-Page Cinematic Hero Showcase (Edge-to-edge 100vh viewport) */}
      <section
        className="hero-banner-box"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 0,
          margin: 0,
          padding: '7rem 3.5rem 4rem',
          color: '#FFFFFF',
          backgroundColor: '#0A0A0A'
        }}
      >
        {/* Background Ambient Video Layer */}
        {hero.mediaType === 'video' && activeVideoUrl ? (
          <video
            ref={videoRef}
            key={activeVideoUrl}
            src={activeVideoUrl}
            autoPlay
            loop={videoPlaylist.length === 1}
            muted={isMuted}
            playsInline
            onEnded={handleVideoEnded}
            onError={(e) => {
              console.warn('Video failed to stream, trying next in playlist:', activeVideoUrl, e);
              if (videoPlaylist.length > 1) {
                setCurrentVideoIdx((prev) => (prev + 1) % videoPlaylist.length);
              }
            }}
            poster={hero.imageUrl}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("${hero.imageUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          />
        )}

        {/* Luxury Gold-Black Ambient Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(18,18,18,0.92) 0%, rgba(18,18,18,0.65) 55%, rgba(18,18,18,0.35) 100%)',
            zIndex: 1
          }}
        />

        {/* Foreground Content Container */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <span style={{ backgroundColor: 'rgba(212, 175, 55, 0.25)', color: '#D4AF37', border: '1px solid #D4AF37', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem', backdropFilter: 'blur(4px)' }}>
            <Sparkles size={14} /> {hero.badgeText}
          </span>

          <h1 className="hero-banner-title" style={{ fontFamily: "'Cinzel', serif", fontSize: '3.2rem', fontWeight: 700, lineHeight: 1.15, marginBottom: '1.25rem', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            {hero.title}
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#E0E0E0', lineHeight: 1.65, marginBottom: '2.25rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {hero.subtitle}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                onSelectCategory(hero.button1Category || 'all');
                onNavigate('shop');
              }}
              className="btn-gold"
              style={{ padding: '0.9rem 1.8rem', fontSize: '0.9rem', boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)' }}
            >
              <span>{hero.button1Text || 'Explore Collection'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => {
                onSelectCategory(hero.button2Category || 'necklaces');
                onNavigate('shop');
              }}
              className="btn-outline"
              style={{ borderColor: '#FFFFFF', color: '#FFFFFF', padding: '0.9rem 1.8rem', fontSize: '0.9rem', backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              {hero.button2Text || '18K Necklaces'}
            </button>
          </div>
        </div>

        {/* Multi-Video Luxury Playlist Carousel Controls */}
        {hero.mediaType === 'video' && videoPlaylist.length > 1 && (
          <div
            className="hero-video-controls"
            style={{
              position: 'absolute',
              bottom: '1.75rem',
              right: '2.5rem',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'rgba(18, 18, 18, 0.78)',
              backdropFilter: 'blur(12px)',
              padding: '0.45rem 1.15rem',
              borderRadius: '30px',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
            }}
          >
            <button
              onClick={handlePrevVideo}
              title="Previous Showcase Video"
              style={{
                background: 'none',
                border: 'none',
                color: '#D4AF37',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '3px',
                borderRadius: '50%',
                transition: 'transform 0.2s'
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {videoPlaylist.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentVideoIdx(idx);
                  }}
                  title={`Switch to Showcase Video ${idx + 1}`}
                  style={{
                    width: currentVideoIdx === idx ? '22px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: currentVideoIdx === idx ? '#D4AF37' : 'rgba(255, 255, 255, 0.35)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                />
              ))}
            </div>

            <span style={{ fontSize: '0.75rem', color: '#FAF7F2', fontWeight: 600, letterSpacing: '0.05em' }}>
              0{currentVideoIdx + 1} / 0{videoPlaylist.length}
            </span>

            <button
              onClick={handleNextVideo}
              title="Next Showcase Video"
              style={{
                background: 'none',
                border: 'none',
                color: '#D4AF37',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '3px',
                borderRadius: '50%',
                transition: 'transform 0.2s'
              }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Audio Mute / Unmute Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              title={isMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
              style={{
                background: 'none',
                border: 'none',
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                paddingLeft: '0.65rem',
                color: '#FAF7F2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isMuted ? <VolumeX size={15} color="#aaa" /> : <Volume2 size={15} color="#D4AF37" />}
            </button>
          </div>
        )}

        {/* Futuristic Floating Scroll Indicator */}
        <div
          onClick={() => {
            window.scrollTo({ top: window.innerHeight - 70, behavior: 'smooth' });
          }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.2s ease'
          }}
          className="scroll-hint-bounce"
          title="Scroll to Explore Collection"
        >
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: '#D4AF37', fontWeight: 600 }}>
            Explore
          </span>
          <ChevronDown size={18} color="#D4AF37" />
        </div>
      </section>

      {/* Category Quick Navigation Ribbon (Directly below full-page video) */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#0F0F0F',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '1rem 1.5rem',
          position: 'sticky',
          top: '72px',
          zIndex: 90,
          backdropFilter: 'blur(12px)',
          background: 'rgba(15, 15, 15, 0.94)'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '2px',
            scrollbarWidth: 'none'
          }}
        >
          {[
            { slug: 'all' as CategorySlug, label: 'All Jewelry' },
            { slug: 'necklaces' as CategorySlug, label: '18K Necklaces' },
            { slug: 'rings' as CategorySlug, label: 'Royal Rings' },
            { slug: 'earrings' as CategorySlug, label: 'Earrings' },
            { slug: 'bracelets' as CategorySlug, label: 'Tennis Bracelets' },
            { slug: 'mens-accessories' as CategorySlug, label: "Men's Luxury" }
          ].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                onSelectCategory(cat.slug);
                onNavigate('shop');
              }}
              style={{
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                color: '#FAF7F2',
                padding: '0.45rem 1.15rem',
                borderRadius: '20px',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.22)';
                e.currentTarget.style.color = '#D4AF37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)';
                e.currentTarget.style.color = '#FAF7F2';
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

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
              img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
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
