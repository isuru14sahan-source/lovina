import React from 'react';
import { Product } from '../../types';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const variantPrice = product.variants && product.variants.length > 0 && product.variants[0].priceLKR
    ? product.variants[0].priceLKR
    : undefined;
  const basePrice = variantPrice || product.priceLKR;
  const currentPrice = product.discountPriceLKR || basePrice;
  const hasDiscount = product.discountPriceLKR && product.discountPriceLKR < basePrice;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #E8E3D9',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      className="product-card-container"
    >
      {/* Product Image Container */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', backgroundColor: '#FAF7F2', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onSelectProduct(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          onError={(e) => {
            const cat = product.category === 'mens-accessories' ? 'mens' : product.category.slice(0, -1);
            (e.target as HTMLImageElement).src = `/assets/${cat}.jpg`;
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="product-image"
        />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {product.isBestSeller && (
            <span style={{ backgroundColor: '#121212', color: '#D4AF37', fontSize: '0.65rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Best Seller
            </span>
          )}
          {hasDiscount && (
            <span style={{ backgroundColor: '#D32F2F', color: '#FFF', fontSize: '0.65rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            zIndex: 2,
            cursor: 'pointer'
          }}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isLiked ? '#D32F2F' : 'none'} color={isLiked ? '#D32F2F' : '#121212'} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#121212',
            color: '#D4AF37',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid #D4AF37',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <Eye size={14} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {product.categoryName}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 600, color: '#121212' }}>
              <Star size={14} fill="#D4AF37" color="#D4AF37" />
              <span>{product.rating}</span>
              <span style={{ color: '#888', fontWeight: 400 }}>({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#121212',
              marginBottom: '0.6rem',
              cursor: 'pointer',
              lineHeight: 1.4,
              minHeight: '2.8rem'
            }}
          >
            {product.name}
          </h3>

          <p style={{ fontSize: '0.75rem', color: '#6E6E6E', marginBottom: '0.8rem' }}>
            {product.attributes.material} • {product.attributes.gemstone}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#AA820A' }}>
              LKR {currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '0.85rem', color: '#999', textDecoration: 'line-through' }}>
                LKR {basePrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="btn-primary"
            style={{ width: '100%', padding: '0.7rem', fontSize: '0.8rem' }}
          >
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
