import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        backgroundColor: 'rgba(18, 18, 18, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-right"
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E8E3D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} color="#D32F2F" fill="#D32F2F" />
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', margin: 0, color: '#121212' }}>
              Saved Wishlist ({wishlist.length})
            </h3>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} color="#121212" />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#888' }}>
              <Heart size={48} color="#D5CEC2" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontFamily: "'Cinzel', serif", color: '#121212', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h4>
              <p style={{ fontSize: '0.85rem' }}>Tap the heart icon on any jewelry piece to save your favorite designs.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {wishlist.map(({ product }) => {
                const price = product.discountPriceLKR || (product.variants?.[0]?.priceLKR) || product.priceLKR;
                return (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '8px',
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #E8E3D9'
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      onError={(e) => {
                        const cat = product.category === 'mens-accessories' ? 'mens' : product.category.slice(0, -1);
                        (e.target as HTMLImageElement).src = `/assets/${cat}.jpg`;
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.2rem 0', color: '#121212', cursor: 'pointer' }}
                        >
                          {product.name}
                        </h4>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#AA820A' }}>
                          LKR {price.toLocaleString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          onClick={() => {
                            addToCart(product, product.variants[0], 1);
                            toggleWishlist(product);
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#121212',
                            color: '#D4AF37',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <ShoppingBag size={12} />
                          <span>Move to Bag</span>
                        </button>

                        <button
                          onClick={() => toggleWishlist(product)}
                          style={{ padding: '0.35rem', color: '#D32F2F', border: 'none', background: 'none', cursor: 'pointer' }}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
