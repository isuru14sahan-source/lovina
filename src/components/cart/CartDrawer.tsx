import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotalLKR,
    discountLKR,
    shippingLKR,
    totalLKR,
    couponCode,
    discountPercentage,
    applyCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon) {
      applyCoupon(inputCoupon);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={closeCart}
    >
      <div
        className="animate-slide-right"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E8E3D9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAF7F2'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', margin: 0, color: '#121212' }}>
              Your Shopping Bag
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#AA820A', fontWeight: 600 }}>
              ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </span>
          </div>
          <button onClick={closeCart} style={{ color: '#121212', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #D4AF37' }}>
                <Tag size={28} color="#D4AF37" />
              </div>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your Bag is Empty</h4>
              <p style={{ fontSize: '0.85rem', color: '#6E6E6E', marginBottom: '1.5rem' }}>Discover our latest 18K gold-plated jewellery collections.</p>
              <button onClick={closeCart} className="btn-gold" style={{ width: '100%' }}>
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = item.product.discountPriceLKR || item.product.priceLKR;
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant.id}`}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid #F0ECE1'
                  }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E8E3D9' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#121212', margin: '0 0 0.25rem 0' }}>
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant.id)}
                        style={{ color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.5rem 0' }}>
                      Variant: {item.selectedVariant.color} {item.selectedVariant.size ? `(${item.selectedVariant.size})` : ''}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8E3D9', borderRadius: '4px' }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVariant.id, -1)}
                          style={{ padding: '0.2rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedVariant.id, 1)}
                          style={{ padding: '0.2rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#AA820A' }}>
                        LKR {(unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Checkout Summary */}
        {cart.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E8E3D9', backgroundColor: '#FAF7F2' }}>
            {/* Coupon Input Form */}
            <form onSubmit={handleCouponSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Promo Code (e.g. LOVINA10)"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.8rem',
                  border: '1px solid #D5CEC2',
                  borderRadius: '4px',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
              <button type="submit" className="btn-outline" style={{ padding: '0.6rem 1rem', fontSize: '0.75rem' }}>
                Apply
              </button>
            </form>

            {couponCode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#2B7A4B', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span>Coupon ({couponCode} - {discountPercentage}% Off):</span>
                <span>- LKR {discountLKR.toLocaleString()}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6E6E6E', marginBottom: '0.4rem' }}>
              <span>Subtotal:</span>
              <span>LKR {subtotalLKR.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6E6E6E', marginBottom: '0.75rem' }}>
              <span>Shipping Fee:</span>
              <span>{shippingLKR === 0 ? <strong style={{ color: '#2B7A4B' }}>FREE Express</strong> : `LKR ${shippingLKR}`}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, color: '#121212', borderTop: '1px solid #E8E3D9', paddingTop: '0.75rem', marginBottom: '1.25rem' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#AA820A' }}>LKR {totalLKR.toLocaleString()}</span>
            </div>

            <button
              onClick={() => {
                closeCart();
                onCheckout();
              }}
              className="btn-gold"
              style={{ width: '100%', padding: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#888' }}>
              <ShieldCheck size={14} color="#2B7A4B" />
              <span>Encrypted & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
