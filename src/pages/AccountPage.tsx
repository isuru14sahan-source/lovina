import React from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ORDERS } from '../services/mockData';
import { Package, User as UserIcon, MapPin, Heart, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface AccountPageProps {
  onNavigateShop: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigateShop }) => {
  const { user, loginAsCustomer } = useAuth();
  const { wishlist } = useWishlist();

  if (!user) {
    return (
      <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '3rem 2rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3D9', textAlign: 'center' }}>
        <UserIcon size={48} color="#D4AF37" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', marginBottom: '0.5rem' }}>Customer Login</h2>
        <p style={{ fontSize: '0.85rem', color: '#6E6E6E', marginBottom: '2rem' }}>Sign in to track active orders and manage your saved wishlist.</p>

        <button
          onClick={() => loginAsCustomer('Kasun Perera', 'kasun@lovina.lk')}
          className="btn-gold"
          style={{ width: '100%', padding: '0.9rem' }}
        >
          Demo Customer Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem', width: '100%' }}>
      {/* Profile Header */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '12px', border: '1px solid #E8E3D9', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FAF7F2', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#AA820A' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#121212', margin: 0 }}>
              Welcome, {user.name}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6E6E6E', margin: '0.2rem 0 0 0' }}>{user.email} • Premier VIP Customer</p>
          </div>
        </div>

        <button onClick={onNavigateShop} className="btn-outline" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
          Explore New Arrivals
        </button>
      </div>

      {/* Orders List & Tracking */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '12px', border: '1px solid #E8E3D9', marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={22} color="#AA820A" /> Recent Purchases & Parcel Status
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {INITIAL_ORDERS.map((order) => (
            <div key={order.id} style={{ border: '1px solid #E8E3D9', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#FAF7F2', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E8E3D9' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Order Number</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>#{order.orderNumber}</h4>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Placed Date</span>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{order.date}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Total Amount</span>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#AA820A', margin: 0 }}>LKR {order.totalAmountLKR.toLocaleString()}</p>
                </div>
                <span style={{ backgroundColor: order.status === 'Delivered' ? '#E8F5E9' : '#FFF8E1', color: order.status === 'Delivered' ? '#2B7A4B' : '#B78103', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
                  {order.status}
                </span>
              </div>

              <div style={{ padding: '1.25rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={item.image} alt={item.productName} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{item.productName}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#888' }}>Variant: {item.variantColor} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
