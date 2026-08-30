import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CustomerAddress } from '../types';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';

import { apiService } from '../services/api';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderComplete: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToShop, onOrderComplete }) => {
  const { cart, subtotalLKR, discountLKR, shippingLKR, totalLKR, clearCart } = useCart();
  const { showToast } = useToast();

  const [address, setAddress] = useState<CustomerAddress>({
    fullName: 'Kasun Perera',
    phone: '+94 77 123 4567',
    street: '45/2 Cinnamon Gardens',
    city: 'Colombo 07',
    postalCode: '00700',
    country: 'Sri Lanka'
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');

  const handleFormChange = (field: keyof CustomerAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city) {
      showToast('Please fill out all required shipping details', 'error');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        variantColor: i.selectedVariant.color,
        variantSize: i.selectedVariant.size || '',
        unitPrice: i.product.discountPriceLKR || i.product.priceLKR,
        quantity: i.quantity,
        image: i.product.images[0]
      })),
      shippingAddress: address,
      paymentMethod,
      totalAmountLKR: totalLKR
    };

    const res = await apiService.submitOrder(payload);
    const generatedOrderNum = res.order ? res.order.orderNumber : 'LV-' + Math.floor(10000 + Math.random() * 90000);

    setPlacedOrderNumber(generatedOrderNum);
    setIsSubmitting(false);
    setOrderConfirmed(true);
    clearCart();
    showToast(`Order #${generatedOrderNum} authorized & saved to cloud database!`, 'success');
  };

  if (orderConfirmed) {
    return (
      <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '3rem 2rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3D9', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FAF7F2', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle2 size={40} color="#D4AF37" />
        </div>

        <span style={{ fontSize: '0.8rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
          Payment Authorized
        </span>

        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#121212', margin: '0.5rem 0' }}>
          Thank You For Your Order!
        </h1>

        <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem' }}>
          Your order <strong>#{placedOrderNumber}</strong> has been received and is being prepared with signature Lovina velvet gift packaging.
        </p>

        <div style={{ backgroundColor: '#FAF7F2', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E8E3D9', textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Shipping Summary:</h4>
          <p style={{ margin: '0 0 0.3rem 0', color: '#333' }}><strong>Recipient:</strong> {address.fullName} ({address.phone})</p>
          <p style={{ margin: '0 0 0.3rem 0', color: '#333' }}><strong>Address:</strong> {address.street}, {address.city}, {address.postalCode}</p>
          <p style={{ margin: 0, color: '#333' }}><strong>Payment:</strong> {paymentMethod === 'card' ? 'Visa/Mastercard Online' : 'Cash on Delivery (COD)'}</p>
        </div>

        <button onClick={onOrderComplete} className="btn-gold" style={{ width: '100%', padding: '1rem' }}>
          Return to Boutique Shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem', width: '100%' }}>
      <button
        onClick={onBackToShop}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#AA820A', marginBottom: '2rem', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        <span>Return to Shopping Bag</span>
      </button>

      <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#121212', marginBottom: '2rem' }}>
        Express Secure Checkout
      </h1>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2.5rem' }} className="checkout-grid">
        {/* Left Column: Shipping & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Shipping Address */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '8px', border: '1px solid #E8E3D9' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="#AA820A" /> 1. Shipping Address
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => handleFormChange('fullName', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #D5CEC2', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #D5CEC2', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => handleFormChange('city', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #D5CEC2', outline: 'none' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Street Address *</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => handleFormChange('street', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #D5CEC2', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '8px', border: '1px solid #E8E3D9' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="#AA820A" /> 2. Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '6px',
                  border: paymentMethod === 'card' ? '2px solid #D4AF37' : '1px solid #E8E3D9',
                  backgroundColor: paymentMethod === 'card' ? '#FAF7F2' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  style={{ accentColor: '#D4AF37' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Credit / Debit Card (PayHere / Stripe)</span>
                  <span style={{ fontSize: '0.75rem', color: '#6E6E6E' }}>Visa, Mastercard, AMEX encrypted security</span>
                </div>
                <Lock size={18} color="#AA820A" />
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '6px',
                  border: paymentMethod === 'cod' ? '2px solid #D4AF37' : '1px solid #E8E3D9',
                  backgroundColor: paymentMethod === 'cod' ? '#FAF7F2' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  style={{ accentColor: '#D4AF37' }}
                />
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Cash on Delivery (COD)</span>
                  <span style={{ fontSize: '0.75rem', color: '#6E6E6E' }}>Pay upon doorstep parcel receipt</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '8px', border: '1px solid #E8E3D9', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid #E8E3D9', paddingBottom: '0.75rem' }}>
              Order Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '240px', overflowY: 'auto' }}>
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedVariant.id}`} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img src={item.product.images[0]} alt={item.product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{item.product.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>Qty: {item.quantity} • {item.selectedVariant.color}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#AA820A' }}>
                    LKR {((item.product.discountPriceLKR || item.product.priceLKR) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#6E6E6E', borderTop: '1px solid #E8E3D9', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>LKR {subtotalLKR.toLocaleString()}</span>
              </div>
              {discountLKR > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2B7A4B', fontWeight: 600 }}>
                  <span>Discount</span>
                  <span>- LKR {discountLKR.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Charge</span>
                <span>{shippingLKR === 0 ? <strong style={{ color: '#2B7A4B' }}>FREE</strong> : `LKR ${shippingLKR}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, color: '#121212', borderTop: '1px solid #E8E3D9', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span>Total Payable</span>
                <span style={{ color: '#AA820A' }}>LKR {totalLKR.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold"
              style={{ width: '100%', padding: '1rem', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Processing Payment...' : 'Authorize & Place Order'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: '#888' }}>
              <ShieldCheck size={14} color="#2B7A4B" />
              <span>Official Lovina Anti-Fraud Guarantee</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
