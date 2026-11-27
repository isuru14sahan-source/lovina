import React, { useState, useMemo } from 'react';
import { Product, CategorySlug, FilterState } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilter } from '../components/product/ProductFilter';

interface ShopPageProps {
  products: Product[];
  activeCategory: CategorySlug;
  onSelectCategory: (category: CategorySlug) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onSelectProduct
}) => {
  const [filterState, setFilterState] = useState<FilterState>({
    category: activeCategory,
    minPrice: 0,
    maxPrice: 30000,
    metalTypes: [],
    gemstones: [],
    inStockOnly: false,
    searchQuery: '',
    sortBy: 'featured'
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category prop with state
  React.useEffect(() => {
    setFilterState((prev) => ({ ...prev, category: activeCategory }));
  }, [activeCategory]);

  const updateFilters = (updated: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updated }));
  };

  const resetFilters = () => {
    setFilterState({
      category: 'all',
      minPrice: 0,
      maxPrice: 30000,
      metalTypes: [],
      gemstones: [],
      inStockOnly: false,
      searchQuery: '',
      sortBy: 'featured'
    });
    onSelectCategory('all');
  };

  // Filter & Sort Engine
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category
        if (filterState.category !== 'all' && product.category !== filterState.category) {
          return false;
        }

        // Price
        const price = product.discountPriceLKR || (product.variants?.[0]?.priceLKR) || product.priceLKR;
        if (price > filterState.maxPrice) return false;

        // Metals
        if (
          filterState.metalTypes.length > 0 &&
          !filterState.metalTypes.includes(product.attributes.material)
        ) {
          return false;
        }

        // Gemstones
        if (
          filterState.gemstones.length > 0 &&
          !filterState.gemstones.includes(product.attributes.gemstone)
        ) {
          return false;
        }

        // In stock
        if (filterState.inStockOnly && product.stockQuantity <= 0) {
          return false;
        }

        // Search query
        if (filterState.searchQuery.trim() !== '') {
          const q = filterState.searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPriceLKR || (a.variants?.[0]?.priceLKR) || a.priceLKR;
        const priceB = b.discountPriceLKR || (b.variants?.[0]?.priceLKR) || b.priceLKR;

        if (filterState.sortBy === 'price-low') return priceA - priceB;
        if (filterState.sortBy === 'price-high') return priceB - priceA;
        if (filterState.sortBy === 'rating') return b.rating - a.rating;
        if (filterState.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0; // featured default
      });
  }, [products, filterState]);

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem', width: '100%' }}>
      {/* Page Header Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#AA820A', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
          Exclusive Boutique
        </span>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.5rem', color: '#121212', margin: '0.4rem 0' }}>
          {activeCategory === 'all'
            ? 'All Fine Jewellery & Accessories'
            : activeCategory.toUpperCase().replace('-', ' ')}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6E6E6E', maxWidth: '500px', margin: '0 auto' }}>
          Handcrafted luxury designs plated in 18K yellow gold, rhodium silver, and sparkling gemstones.
        </p>
      </div>

      {/* Main Layout Grid (Filter Sidebar + Product Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="shop-page-grid">
        {/* Desktop Sidebar Filter */}
        <aside className="desktop-filter">
          <ProductFilter
            filters={filterState}
            onChangeFilter={updateFilters}
            onReset={resetFilters}
            totalResults={filteredProducts.length}
          />
        </aside>

        {/* Product Grid Area */}
        <main>
          <ProductGrid
            products={filteredProducts}
            onQuickView={onQuickView}
            onSelectProduct={onSelectProduct}
            sortBy={filterState.sortBy}
            onSortChange={(sort) => updateFilters({ sortBy: sort })}
            onToggleMobileFilter={() => setMobileFilterOpen(true)}
          />
        </main>
      </div>

      {/* Mobile Filter Modal Overlay */}
      {mobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'flex-end' }} onClick={() => setMobileFilterOpen(false)}>
          <div style={{ width: '100%', maxWidth: '340px', height: '100%', backgroundColor: '#FFFFFF', padding: '1.5rem', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', margin: 0, color: '#AA820A' }}>Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#121212', color: '#FFF', borderRadius: '4px', fontSize: '0.8rem' }}>Close</button>
            </div>
            <ProductFilter
              filters={filterState}
              onChangeFilter={updateFilters}
              onReset={resetFilters}
              totalResults={filteredProducts.length}
            />
          </div>
        </div>
      )}
    </div>
  );
};
