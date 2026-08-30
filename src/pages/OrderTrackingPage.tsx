import React, { useState } from 'react';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';
import { INITIAL_ORDERS } from '../services/mockData';

interface OrderTrackingPageProps {
  onBackToShop: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onBackToShop }) => {
  const [searchCode, setSearchCode] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<any | null>(INITIAL_ORDERS[0]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = searchCode.trim().toLowerCase();
    const found = INITIAL_ORDERS.find(
      (o) => o.orderNumber.toLowerCase() === q || (o.trackingNumber && o.trackingNumber.toLowerCase() === q)
    );
    setMatchedOrder(found || null);
  };

  const getStepActive = (status: string, stepIndex: number) => {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(status);
    return currentIndex >= stepIndex;
  };

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1.5rem', width: '100%' }}>
      <button
        onClick={onBackToShop}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#AA820A', marginBottom: '2rem', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} />
        <span>Return to Boutique</span>
      </button>

      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
          Live Express Dispatch
        </span>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.5rem', color: '#121212', margin: '0.4rem 0' }}>
          Track Your Lovina Parcel
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6E6E6E', maxWidth: '500px', margin: '0 auto' }}>
          Enter your Order Number (e.g. <strong>LV-90821</strong>) or Courier Waybill ID (e.g. <strong>TRK-SL-892100</strong>).
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} style={{ maxWidth: '540px', margin: '0 auto 3rem', display: 'flex', gap: '0.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            required
            placeholder="e.g. LV-90821 or TRK-SL-892100"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '6px',
              border: '1px solid #D5CEC2',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
        </div>
        <button type="submit" className="btn-gold" style={{ padding: '0.85rem 1.5rem' }}>
          <Search size={18} />
          <span>Track</span>
        </button>
      </form>

      {/* Results View */}
      {matchedOrder ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3D9', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          {/* Order Top Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E8E3D9', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#AA820A', fontWeight: 700 }}>
                Verified Order #{matchedOrder.orderNumber}
              </span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', margin: '0.2rem 0 0 0' }}>
                Recipient: {matchedOrder.shippingAddress.fullName}
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: '#6E6E6E', display: 'block' }}>Courier Tracking ID:</span>
              <strong style={{ fontSize: '0.95rem', color: '#121212' }}>{matchedOrder.trackingNumber || 'Dispatch Pending'}</strong>
            </div>
          </div>

          {/* Timeline Progress Bar */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', color: '#121212' }}>
              Dispatch Status Timeline
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', position: 'relative' }}>
              {[
                { label: 'Order Received', icon: Clock },
                { label: 'Velvet Packaging', icon: Package },
                { label: 'In Transit Courier', icon: Truck },
                { label: 'Delivered', icon: CheckCircle2 }
              ].map((step, idx) => {
                const isActive = getStepActive(matchedOrder.status, idx);
                const IconComp = step.icon;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? '#D4AF37' : '#FAF7F2',
                        color: isActive ? '#121212' : '#A0A0A0',
                        border: isActive ? '2px solid #D4AF37' : '1px solid #E8E3D9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}
                    >
                      <IconComp size={20} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#121212' : '#888' }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address & Items */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', backgroundColor: '#FAF7F2', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E8E3D9' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, color: '#AA820A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} /> Shipping Destination
              </h4>
              <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', color: '#121212', fontWeight: 600 }}>{matchedOrder.shippingAddress.fullName}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>
                {matchedOrder.shippingAddress.street}, {matchedOrder.shippingAddress.city}, {matchedOrder.shippingAddress.postalCode}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, color: '#AA820A', marginBottom: '0.5rem' }}>
                Order Items ({matchedOrder.items.length})
              </h4>
              {matchedOrder.items.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#121212', marginBottom: '0.3rem' }}>
                  <span>{item.productName} (x{item.quantity})</span>
                  <strong>LKR {item.unitPrice.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : searched ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3D9' }}>
          <Package size={48} color="#D5CEC2" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: "'Cinzel', serif", color: '#121212', marginBottom: '0.5rem' }}>No Parcel Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#6E6E6E' }}>We couldn't locate an order matching "<strong>{searchCode}</strong>". Try checking order number <strong>LV-90821</strong> or <strong>LV-90823</strong>.</p>
        </div>
      ) : null}
    </div>
  );
};
