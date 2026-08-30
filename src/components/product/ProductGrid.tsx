import React from 'react';
import { Product, FilterState } from '../../types';
import { ProductCard } from './ProductCard';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  sortBy: FilterState['sortBy'];
  onSortChange: (sortBy: FilterState['sortBy']) => void;
  onToggleMobileFilter?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onQuickView,
  onSelectProduct,
  sortBy,
  onSortChange,
  onToggleMobileFilter
}) => {
  return (
    <div>
      {/* Top Grid Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #E8E3D9', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onToggleMobileFilter && (
            <button
              onClick={onToggleMobileFilter}
              className="btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
          )}
          <span style={{ fontSize: '0.85rem', color: '#6E6E6E', fontWeight: 500 }}>
            Showing <strong>{products.length}</strong> Exclusive Pieces
          </span>
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#121212', fontWeight: 600, textTransform: 'uppercase' }}>
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as FilterState['sortBy'])}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.8rem',
              borderRadius: '4px',
              border: '1px solid #D5CEC2',
              backgroundColor: '#FAF7F2',
              color: '#121212',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="featured">Featured Collection</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      {/* Grid Container */}
      {products.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E8E3D9', padding: '4rem 2rem', textAlign: 'center' }}>
          <Sparkles size={40} color="#D4AF37" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Jewellery Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#6E6E6E', maxWidth: '400px', margin: '0 auto' }}>
            Try adjusting your filter criteria or price parameters to explore our luxury catalog.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
