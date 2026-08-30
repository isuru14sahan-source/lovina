import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { X, Star, ShieldCheck, Truck, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const isLiked = isInWishlist(product.id);
  const currentPrice = product.discountPriceLKR || product.priceLKR;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9995,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, backgroundColor: '#FFFFFF', borderRadius: '50%', padding: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Gallery Column */}
        <div style={{ backgroundColor: '#FAF7F2', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <img
            src={selectedImage}
            alt={product.name}
            onError={(e) => {
              const cat = product.category === 'mens-accessories' ? 'mens' : product.category.slice(0, -1);
              (e.target as HTMLImageElement).src = `/assets/${cat}.jpg`;
            }}
            style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E8E3D9' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                onClick={() => setSelectedImage(img)}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: selectedImage === img ? '2px solid #D4AF37' : '1px solid #E8E3D9'
                }}
              />
            ))}
          </div>
        </div>

        {/* Info & Buying Column */}
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              {product.categoryName} • SKU: {product.sku}
            </span>

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', color: '#121212', margin: '0.5rem 0 0.75rem 0' }}>
              {product.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{product.rating}</span>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>({product.reviewCount} customer reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#AA820A' }}>
                LKR {currentPrice.toLocaleString()}
              </span>
              {product.discountPriceLKR && (
                <span style={{ fontSize: '1rem', color: '#888', textDecoration: 'line-through' }}>
                  LKR {product.priceLKR.toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Variant Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#121212', display: 'block', marginBottom: '0.5rem' }}>
                Select Metal / Color: <span style={{ color: '#AA820A' }}>{selectedVariant.color}</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: selectedVariant.id === variant.id ? '2px solid #D4AF37' : '1px solid #E8E3D9',
                      backgroundColor: selectedVariant.id === variant.id ? '#FAF7F2' : '#FFFFFF',
                      color: '#121212',
                      cursor: 'pointer'
                    }}
                  >
                    {variant.color} {variant.size ? `(${variant.size})` : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => {
                  addToCart(product, selectedVariant, quantity);
                  onClose();
                }}
                className="btn-gold"
                style={{ flex: 1, padding: '0.9rem' }}
              >
                <ShoppingBag size={18} />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: '48px',
                  borderRadius: '4px',
                  border: '1px solid #E8E3D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <Heart size={20} fill={isLiked ? '#D32F2F' : 'none'} color={isLiked ? '#D32F2F' : '#121212'} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E8E3D9', paddingTop: '1rem', fontSize: '0.75rem', color: '#6E6E6E' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} color="#2B7A4B" /> 1-Year Metal Plating Guarantee
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Truck size={14} color="#AA820A" /> 2-3 Day Islandwide Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
