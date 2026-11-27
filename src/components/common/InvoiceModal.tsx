import React from 'react';
import { X, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { Order } from '../../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3500,
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
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
          border: '1px solid #D4AF37'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Actions bar */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E3D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#AA820A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Official Sales Invoice Receipt
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '0.4rem 0.85rem',
                backgroundColor: '#121212',
                color: '#D4AF37',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <X size={20} color="#121212" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Sheet */}
        <div style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }} id="printable-invoice">
          {/* Header Branding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #D4AF37', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', margin: 0, color: '#121212', letterSpacing: '0.1em' }}>
                LOVINA
              </h1>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#AA820A' }}>
                Luxury Imitation Jewellery & Accessories
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', margin: 0, color: '#AA820A' }}>INVOICE</h3>
              <span style={{ fontSize: '0.85rem', color: '#121212', fontWeight: 700 }}>#{order.orderNumber}</span>
              <span style={{ fontSize: '0.75rem', color: '#888', display: 'block' }}>Date: {order.date}</span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.3rem' }}>Billed & Shipped To:</h4>
              <p style={{ margin: '0 0 0.2rem 0', fontWeight: 700, color: '#121212' }}>{order.shippingAddress.fullName}</p>
              <p style={{ margin: '0 0 0.2rem 0', color: '#555' }}>Phone: {order.shippingAddress.phone}</p>
              <p style={{ margin: 0, color: '#555' }}>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.3rem' }}>Payment & Courier Info:</h4>
              <p style={{ margin: '0 0 0.2rem 0', color: '#121212' }}><strong>Method:</strong> {order.paymentMethod === 'card' ? 'Online Bank Transfer' : 'Cash on Delivery (COD)'}</p>
              <p style={{ margin: 0, color: '#121212' }}><strong>Tracking ID:</strong> {order.trackingNumber || 'Pending'}</p>
            </div>
          </div>

          {/* Table Items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E3D9', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.8rem', color: '#AA820A' }}>Item Description</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F0ECE1' }}>
                  <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, color: '#121212' }}>{item.productName}</td>
                  <td style={{ padding: '0.6rem 0.8rem', textAlign: 'center', color: '#555' }}>{item.quantity}</td>
                  <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', color: '#555' }}>LKR {item.unitPrice.toLocaleString()}</td>
                  <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', fontWeight: 700, color: '#121212' }}>
                    LKR {(item.unitPrice * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #E8E3D9', paddingTop: '1rem' }}>
            <div style={{ width: '240px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>Subtotal:</span>
                <span>LKR {order.totalAmountLKR.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>Express Courier:</span>
                <span style={{ color: '#2B7A4B', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#AA820A', borderTop: '1px solid #E8E3D9', paddingTop: '0.5rem', marginTop: '0.3rem' }}>
                <span>Total Paid:</span>
                <span>LKR {order.totalAmountLKR.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
