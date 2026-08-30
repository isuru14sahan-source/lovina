import React from 'react';
import { FilterState, CategorySlug, MetalType, GemstoneType } from '../../types';
import { Filter, RotateCcw } from 'lucide-react';

interface ProductFilterProps {
  filters: FilterState;
  onChangeFilter: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onChangeFilter,
  onReset,
  totalResults
}) => {
  const metalOptions: MetalType[] = ['18K Gold Plated', '925 Sterling Silver', 'Rose Gold Plated', 'Stainless Steel'];
  const gemstoneOptions: GemstoneType[] = ['Cubic Zirconia', 'Freshwater Pearl', 'Austrian Crystal', 'None'];

  const toggleMetal = (metal: MetalType) => {
    const exists = filters.metalTypes.includes(metal);
    const updated = exists
      ? filters.metalTypes.filter((m) => m !== metal)
      : [...filters.metalTypes, metal];
    onChangeFilter({ metalTypes: updated });
  };

  const toggleGemstone = (gem: GemstoneType) => {
    const exists = filters.gemstones.includes(gem);
    const updated = exists
      ? filters.gemstones.filter((g) => g !== gem)
      : [...filters.gemstones, gem];
    onChangeFilter({ gemstones: updated });
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E8E3D9', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8E3D9', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#AA820A" />
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', margin: 0 }}>Filter Collection</h4>
        </div>
        <button
          onClick={onReset}
          style={{ fontSize: '0.75rem', color: '#AA820A', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
        >
          <RotateCcw size={12} />
          Reset All
        </button>
      </div>

      {/* Metal Material Filter */}
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#121212', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          Metal & Finish
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {metalOptions.map((metal) => (
            <label key={metal} style={{ fontSize: '0.85rem', color: '#444', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.metalTypes.includes(metal)}
                onChange={() => toggleMetal(metal)}
                style={{ accentColor: '#D4AF37' }}
              />
              <span>{metal}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gemstone / Accent Filter */}
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#121212', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          Gemstone Accent
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {gemstoneOptions.map((gem) => (
            <label key={gem} style={{ fontSize: '0.85rem', color: '#444', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.gemstones.includes(gem)}
                onChange={() => toggleGemstone(gem)}
                style={{ accentColor: '#D4AF37' }}
              />
              <span>{gem}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#121212', marginBottom: '0.5rem' }}>
          <span>Max Price</span>
          <span style={{ color: '#AA820A' }}>LKR {filters.maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={5000}
          max={30000}
          step={1000}
          value={filters.maxPrice}
          onChange={(e) => onChangeFilter({ maxPrice: Number(e.target.value) })}
          style={{ width: '100%', accentColor: '#D4AF37' }}
        />
      </div>

      {/* Availability Filter */}
      <div style={{ borderTop: '1px solid #E8E3D9', paddingTop: '1rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#121212', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChangeFilter({ inStockOnly: e.target.checked })}
            style={{ accentColor: '#D4AF37' }}
          />
          <span>In Stock Items Only</span>
        </label>
      </div>
    </div>
  );
};
