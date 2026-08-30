import React, { useState } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeType, setActiveType] = useState<'ring' | 'necklace'>('ring');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '620px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '1px solid #D4AF37'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E8E3D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ruler size={20} color="#AA820A" />
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', margin: 0, color: '#121212' }}>
              Lovina Fine Jewelry Size Guide
            </h3>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} color="#121212" />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Switcher Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #E8E3D9', paddingBottom: '0.75rem' }}>
            <button
              onClick={() => setActiveType('ring')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: activeType === 'ring' ? '1px solid #D4AF37' : '1px solid #E8E3D9',
                backgroundColor: activeType === 'ring' ? '#D4AF37' : '#FAF7F2',
                color: activeType === 'ring' ? '#121212' : '#6E6E6E',
                cursor: 'pointer'
              }}
            >
              Ring Sizes (US vs MM)
            </button>

            <button
              onClick={() => setActiveType('necklace')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: activeType === 'necklace' ? '1px solid #D4AF37' : '1px solid #E8E3D9',
                backgroundColor: activeType === 'necklace' ? '#D4AF37' : '#FAF7F2',
                color: activeType === 'necklace' ? '#121212' : '#6E6E6E',
                cursor: 'pointer'
              }}
            >
              Necklace & Chain Lengths
            </button>
          </div>

          {activeType === 'ring' ? (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                Measure the inner diameter of an existing ring or wrap a thin strip of paper around your finger joint.
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E3D9' }}>
                    <th style={{ padding: '0.6rem 0.8rem', color: '#AA820A' }}>US Size</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Inner Diameter (mm)</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Finger Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { us: 'US Size 6', dia: '16.5 mm', circ: '51.8 mm' },
                    { us: 'US Size 7', dia: '17.3 mm', circ: '54.4 mm' },
                    { us: 'US Size 8', dia: '18.2 mm', circ: '57.0 mm' },
                    { us: 'US Size 9', dia: '18.9 mm', circ: '59.5 mm' },
                    { us: 'US Size 10', dia: '19.8 mm', circ: '62.1 mm' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F0ECE1' }}>
                      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 700, color: '#121212' }}>{row.us}</td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#555' }}>{row.dia}</td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#555' }}>{row.circ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                Standard chain hang positions on collarbones and chest:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '3px solid #D4AF37' }}>
                  <strong>14-16 inches (Collar / Choker):</strong> Sits tightly around the base of the neck.
                </div>
                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '3px solid #D4AF37' }}>
                  <strong>18 inches (Princess Length):</strong> Sits gracefully at the collarbone. (Most Popular)
                </div>
                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '3px solid #D4AF37' }}>
                  <strong>20-22 inches (Matinee / Men's Chain):</strong> Falls 2 inches below the collarbone, ideal for pendants and men's Cuban chains.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
