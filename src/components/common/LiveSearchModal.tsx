import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const LiveSearchModal: React.FC<LiveSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.categoryName.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchMat = p.attributes.material.toLowerCase().includes(q);
      const matchGem = p.attributes.gemstone.toLowerCase().includes(q);
      return matchName || matchCategory || matchDesc || matchMat || matchGem;
    }).slice(0, 6);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '5vh'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '1px solid #D4AF37',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          margin: '0 1rem'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Search Input Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E8E3D9', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#FAF7F2' }}>
          <Search size={22} color="#AA820A" />
          <input
            type="text"
            autoFocus
            placeholder="Search 18K gold necklaces, solitaire rings, pearls..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '1.05rem',
              fontFamily: "'Inter', sans-serif",
              color: '#121212'
            }}
          />
          <button
            onClick={onClose}
            style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: '#E8E3D9', color: '#121212', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Content Results Area */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {query.trim() === '' ? (
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#AA820A', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                Popular Searches
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['18K Gold Necklace', 'Freshwater Pearl', 'Solitaire Ring', 'Tennis Bracelet', 'Men\'s Onyx'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #E8E3D9',
                      fontSize: '0.8rem',
                      color: '#121212',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Sparkles size={12} color="#D4AF37" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', fontWeight: 600 }}>
                Matching Products ({searchResults.length})
              </span>
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #E8E3D9',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                    onError={(e) => {
                      const cat = product.category === 'mens-accessories' ? 'mens' : product.category.slice(0, -1);
                      (e.target as HTMLImageElement).src = `/assets/${cat}.jpg`;
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', color: '#AA820A', textTransform: 'uppercase', fontWeight: 700 }}>
                      {product.categoryName}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0.1rem 0 0.2rem 0', color: '#121212' }}>
                      {product.name}
                    </h4>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121212' }}>
                      LKR {(product.discountPriceLKR || product.priceLKR).toLocaleString()}
                    </span>
                  </div>
                  <ArrowRight size={18} color="#D4AF37" />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>No luxury items found matching "<strong>{query}</strong>"</p>
              <span style={{ fontSize: '0.8rem', color: '#AA820A', display: 'block', marginTop: '0.5rem' }}>Try searching by category, gemstone, or metal finish.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
