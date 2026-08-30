import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';

import { WriteReviewModal } from '../components/product/WriteReviewModal';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddReview: (productId: string, newReview: { name: string; rating: number; comment: string; date: string }) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onQuickView,
  onSelectProduct,
  onAddReview
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [reviewsList, setReviewsList] = useState([
    { name: 'Dilhani Wickramasinghe', date: '2026-07-20', rating: 5, comment: 'Absolutely stunning! The 18K gold luster looks authentic and doesn’t tarnish at all.' },
    { name: 'Rohan de Silva', date: '2026-07-18', rating: 5, comment: 'Purchased for my wife’s anniversary. Lovina velvet box packaging adds real luxury.' }
  ]);

  const handleAddNewReview = (productId: string, newRev: { name: string; rating: number; comment: string; date: string }) => {
    setReviewsList((prev) => [newRev, ...prev]);
    onAddReview(productId, newRev);
  };

  const isLiked = isInWishlist(product.id);
  const currentPrice = product.discountPriceLKR || product.priceLKR;
  const relatedProducts = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem', width: '100%' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#AA820A', marginBottom: '2rem', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Collection</span>
      </button>

      {/* Main Grid: Gallery Left + Details Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8E3D9', marginBottom: '1rem', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={selectedImage}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumb ${index}`}
                onClick={() => setSelectedImage(img)}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: selectedImage === img ? '2px solid #D4AF37' : '1px solid #E8E3D9'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Specifications & Purchasing Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
              {product.categoryName} • SKU: {product.sku}
            </span>

            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#121212', margin: '0.5rem 0 1rem 0', lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>({product.reviewCount} verified customer reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#FAF7F2', padding: '1rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid #D4AF37' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: '#AA820A' }}>
                LKR {currentPrice.toLocaleString()}
              </span>
              {product.discountPriceLKR && (
                <span style={{ fontSize: '1.1rem', color: '#888', textDecoration: 'line-through' }}>
                  LKR {product.priceLKR.toLocaleString()}
                </span>
              )}
            </div>

            {/* Variant Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#121212', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                Metal Finish: <span style={{ color: '#AA820A' }}>{selectedVariant.color}</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    style={{
                      padding: '0.66rem 1.25rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
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

            {/* Quantity */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#121212', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Quantity:
              </label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #D5CEC2', borderRadius: '6px', backgroundColor: '#FFFFFF' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '0.6rem 1rem', fontSize: '1rem', border: 'none', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ padding: '0 1.25rem', fontSize: '1rem', fontWeight: 700 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ padding: '0.6rem 1rem', fontSize: '1rem', border: 'none', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={() => addToCart(product, selectedVariant, quantity)}
                className="btn-gold"
                style={{ flex: 1, padding: '1.1rem', fontSize: '0.95rem' }}
              >
                <ShoppingBag size={20} />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: '56px',
                  borderRadius: '6px',
                  border: '1px solid #E8E3D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <Heart size={22} fill={isLiked ? '#D32F2F' : 'none'} color={isLiked ? '#D32F2F' : '#121212'} />
              </button>
            </div>

            {/* Service Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid #E8E3D9', paddingTop: '1.5rem', textAlign: 'center' }}>
              <div>
                <ShieldCheck size={20} color="#2B7A4B" style={{ margin: '0 auto 0.3rem' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>1-Year Guarantee</span>
              </div>
              <div>
                <Truck size={20} color="#AA820A" style={{ margin: '0 auto 0.3rem' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>Islandwide Courier</span>
              </div>
              <div>
                <RotateCcw size={20} color="#121212" style={{ margin: '0 auto 0.3rem' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3D9', overflow: 'hidden', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #E8E3D9', backgroundColor: '#FAF7F2' }}>
          {(['description', 'specifications', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 1.25rem',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: activeTab === tab ? '#AA820A' : '#6E6E6E',
                borderBottom: activeTab === tab ? '3px solid #D4AF37' : '3px solid transparent',
                backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '2.5rem' }}>
          {activeTab === 'description' && (
            <div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', marginBottom: '1rem' }}>Craftsmanship & Story</h3>
              <p style={{ fontSize: '0.95rem', color: '#444444', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {product.description}
              </p>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Key Features</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {product.details.map((detail, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                    <CheckCircle2 size={16} color="#D4AF37" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', marginBottom: '1.5rem' }}>Technical Attributes</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F0ECE1' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#121212', width: '200px' }}>Base Material</td>
                    <td style={{ color: '#555' }}>{product.attributes.material}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F0ECE1' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#121212' }}>Gemstone / Accent</td>
                    <td style={{ color: '#555' }}>{product.attributes.gemstone}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F0ECE1' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#121212' }}>Plating Technology</td>
                    <td style={{ color: '#555' }}>{product.attributes.plating}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700, color: '#121212' }}>Warranty Coverage</td>
                    <td style={{ color: '#AA820A', fontWeight: 600 }}>{product.attributes.warranty}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', margin: 0 }}>Verified Customer Reviews ({reviewsList.length})</h3>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="btn-gold"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
                >
                  Write a Verified Review
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviewsList.map((rev, idx) => (
                  <div key={idx} style={{ padding: '1rem 1.25rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8E3D9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#888' }}>{rev.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#D4AF37" color="#D4AF37" />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#555', margin: 0 }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={product}
        onAddReview={handleAddNewReview}
      />

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#121212' }}>You May Also Adore</h2>
            <div style={{ width: '40px', height: '2px', backgroundColor: '#D4AF37', margin: '0.4rem auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
