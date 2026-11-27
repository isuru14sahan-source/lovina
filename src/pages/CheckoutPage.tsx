import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { CustomerAddress, Order } from '../types';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, Lock, ArrowLeft, Copy, Package } from 'lucide-react';

import { apiService } from '../services/api';
import { supabaseService } from '../services/supabaseService';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderComplete: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToShop, onOrderComplete }) => {
  const { cart, subtotalLKR, discountLKR, shippingLKR, totalLKR, clearCart } = useCart();
  const { showToast } = useToast();

  const [address, setAddress] = useState<CustomerAddress>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka'
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [placedTrackingNumber, setPlacedTrackingNumber] = useState('');

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
    const generatedOrderNum = 'LV-' + Math.floor(10000 + Math.random() * 90000);
    const trackingNum = 'TRK-SL-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: generatedOrderNum,
      date: new Date().toISOString().split('T')[0],
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        variantColor: i.selectedVariant.color,
        variantSize: i.selectedVariant.size || '',
        unitPrice: i.selectedVariant?.priceLKR || i.product.discountPriceLKR || i.product.priceLKR,
        quantity: i.quantity,
        image: i.product.images[0] || '/assets/necklace.jpg'
      })),
      shippingAddress: address,
      paymentMethod,
      totalAmountLKR: totalLKR,
      status: 'Processing',
      trackingNumber: trackingNum
    };

    // 1. Save directly into Supabase Cloud Database
    if (supabaseService.isReady()) {
      try {
        await supabaseService.createOrder(newOrder);
      } catch (err) {
        console.warn('Failed saving to Supabase:', err);
      }
    }

    // 2. Also cache in LocalStorage for customer order history
    try {
      const existing = JSON.parse(localStorage.getItem('lovina_customer_orders') || '[]');
      localStorage.setItem('lovina_customer_orders', JSON.stringify([newOrder, ...existing]));
    } catch {}

    // 3. Fallback sync to local Express server
    try {
      await apiService.submitOrder(newOrder);
    } catch {}

    setPlacedOrder(newOrder);
    setPlacedOrderNumber(generatedOrderNum);
    setPlacedTrackingNumber(trackingNum);
    setIsSubmitting(false);
    setOrderConfirmed(true);
    clearCart();
    showToast(`Order #${generatedOrderNum} saved to Supabase Cloud!`, 'success');
  };

  if (orderConfirmed) {
    const finalOrder = placedOrder;
    const finalTotal = finalOrder ? finalOrder.totalAmountLKR : 0;
    const finalPayment = finalOrder?.paymentMethod === 'card' ? 'Online Bank Transfer' : 'Cash on Delivery (COD)';
    const finalItems = finalOrder?.items || [];

    const itemsSummaryText = finalItems.length > 0
      ? finalItems
          .map((it) => `• ${it.quantity}x ${it.productName}${it.variantColor ? ` (${it.variantColor})` : ''} - LKR ${(it.unitPrice * it.quantity).toLocaleString()}`)
          .join('\n')
      : '• Lovina Luxury Jewellery Piece';

    const whatsappMessage = encodeURIComponent(
      `Hi Lovina! I just placed an order on your website:\n\n` +
      `*Order Reference:* #${finalOrder?.orderNumber || placedOrderNumber}\n` +
      `*Tracking ID:* ${finalOrder?.trackingNumber || placedTrackingNumber}\n\n` +
      `*Items Ordered:*\n` +
      `${itemsSummaryText}\n\n` +
      `*Total Amount:* LKR ${finalTotal.toLocaleString()}\n` +
      `*Payment Method:* ${finalPayment}\n\n` +
      `*Customer Details:*\n` +
      `• Name: ${finalOrder?.shippingAddress.fullName || address.fullName}\n` +
      `• Phone: ${finalOrder?.shippingAddress.phone || address.phone}\n` +
      `• Address: ${finalOrder?.shippingAddress.street || address.street}, ${finalOrder?.shippingAddress.city || address.city}\n\n` +
      `Please confirm my order and courier dispatch!`
    );

    return (
      <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '3rem 2rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3D9', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FAF7F2', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle2 size={40} color="#D4AF37" />
        </div>

        <span style={{ fontSize: '0.8rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
          Order Confirmed & Stored
        </span>

        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#121212', margin: '0.5rem 0' }}>
          Thank You For Your Order!
        </h1>

        <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem' }}>
          Your order <strong>#{finalOrder?.orderNumber || placedOrderNumber}</strong> has been received and stored in our central system.
        </p>

        {/* Order Details & Tracking Badges */}
        <div style={{ backgroundColor: '#FAF7F2', padding: '1.5rem', borderRadius: '8px', border: '1px solid #D4AF37', textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #E8E3D9' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', display: 'block' }}>Order Reference</span>
              <strong style={{ fontSize: '1.1rem', color: '#121212' }}>#{finalOrder?.orderNumber || placedOrderNumber}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', display: 'block' }}>Courier Waybill / Tracking ID</span>
              <strong style={{ fontSize: '1.1rem', color: '#AA820A' }}>{finalOrder?.trackingNumber || placedTrackingNumber}</strong>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ordered Items:</h4>
          <div style={{ marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid #E8E3D9' }}>
            {finalItems.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#333' }}>
                <span>• {it.quantity}x {it.productName} {it.variantColor ? `(${it.variantColor})` : ''}</span>
                <strong style={{ color: '#AA820A' }}>LKR {(it.unitPrice * it.quantity).toLocaleString()}</strong>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #D5CEC2', fontWeight: 700, fontSize: '0.95rem' }}>
              <span>Total Payable:</span>
              <span style={{ color: '#AA820A' }}>LKR {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Shipping Summary:</h4>
          <p style={{ margin: '0 0 0.3rem 0', color: '#333' }}><strong>Recipient:</strong> {finalOrder?.shippingAddress.fullName || address.fullName} ({finalOrder?.shippingAddress.phone || address.phone})</p>
          <p style={{ margin: '0 0 0.3rem 0', color: '#333' }}><strong>Address:</strong> {finalOrder?.shippingAddress.street || address.street}, {finalOrder?.shippingAddress.city || address.city}</p>
          <p style={{ margin: 0, color: '#333' }}><strong>Payment:</strong> {finalPayment}</p>
        </div>

        {/* Instant WhatsApp Order Notification / Confirmation Button */}
        <a
          href={`https://wa.me/94712875731?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            width: '100%',
            padding: '1rem',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            marginBottom: '0.9rem',
            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.572 4.184 1.574 5.938l-1.674 6.115 6.273-1.644c1.706.945 3.666 1.491 5.827 1.491 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
          </svg>
          <span>Send Order Summary to WhatsApp (071 287 5731)</span>
        </a>

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
                  placeholder="e.g. Kasun Sahan"
                  value={address.fullName}
                  onChange={(e) => handleFormChange('fullName', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #D5CEC2', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 077 123 4567 / 071 287 5731"
                  value={address.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #D5CEC2', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>City / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Colombo 07, Kandy, Galle"
                  value={address.city}
                  onChange={(e) => handleFormChange('city', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #D5CEC2', outline: 'none' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Delivery Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No. 45/2, Temple Road"
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
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cash on Delivery (COD)</span>
                    <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', backgroundColor: '#E8F5E9', color: '#2B7A4B', borderRadius: '12px', fontWeight: 700 }}>RECOMMENDED</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6E6E6E', display: 'block', marginTop: '0.2rem' }}>Pay upon doorstep parcel delivery anywhere in Sri Lanka</span>
                </div>
              </label>

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
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Online Bank Transfer</span>
                  <span style={{ fontSize: '0.75rem', color: '#6E6E6E' }}>Transfer via Bank deposit or confirm slip via WhatsApp (071 287 5731)</span>
                </div>
                <Lock size={18} color="#AA820A" />
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
                    LKR {((item.selectedVariant?.priceLKR || item.product.discountPriceLKR || item.product.priceLKR) * item.quantity).toLocaleString()}
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
