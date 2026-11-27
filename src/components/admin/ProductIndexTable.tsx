import React, { useState, useMemo } from 'react';
import { Product, CategorySlug } from '../../types';
import { Search, Edit, Trash2, RotateCcw, Plus, CheckCircle2, AlertOctagon, Sparkles, Layers } from 'lucide-react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

interface ProductIndexTableProps {
  products: Product[];
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
  onSoftDelete: (productId: string) => void;
  onRestore: (productId: string) => void;
}

export const ProductIndexTable: React.FC<ProductIndexTableProps> = ({
  products,
  onOpenAddModal,
  onOpenEditModal,
  onSoftDelete,
  onRestore
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [categoryFilter, setCategoryFilter] = useState<CategorySlug>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Status Filter
      const isItemDeleted = !!p.isDeleted;
      if (statusFilter === 'active' && isItemDeleted) return false;
      if (statusFilter === 'inactive' && !isItemDeleted) return false;

      // Category Filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchMat = p.attributes.material.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchMat) return false;
      }

      return true;
    });
  }, [products, statusFilter, categoryFilter, searchQuery]);

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3D9', padding: '1.75rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
      {/* Top Header & Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ color: '#AA820A', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Layers size={14} /> Product Management Master Index
          </span>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#121212' }}>
            Boutique Catalog Control
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#6E6E6E', marginTop: '0.2rem', display: 'block' }}>
            Showing {filteredProducts.length} of {products.length} registered products
          </span>
        </div>

        <button onClick={onOpenAddModal} className="btn-gold" style={{ padding: '0.75rem 1.35rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          <span>Register New Product</span>
        </button>
      </div>

      {/* Filter Toolbar Bar (Status, Category, Search) */}
      <div style={{ backgroundColor: '#FAF7F2', padding: '1.1rem', borderRadius: '8px', border: '1px solid #E8E3D9', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'active', label: 'Active Boutique Items' },
            { id: 'inactive', label: 'Archived / Deleted' },
            { id: 'all', label: 'All Catalog' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id as any)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: statusFilter === pill.id ? '1px solid #D4AF37' : '1px solid #E8E3D9',
                backgroundColor: statusFilter === pill.id ? '#D4AF37' : '#FFFFFF',
                color: statusFilter === pill.id ? '#121212' : '#6E6E6E',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Right Filters: Category & Search */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategorySlug)}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #D5CEC2', outline: 'none', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
          >
            <option value="all">All Categories</option>
            <option value="necklaces">Necklaces</option>
            <option value="rings">Rings</option>
            <option value="earrings">Earrings</option>
            <option value="bracelets">Bracelets</option>
            <option value="mens-accessories">Men's Accessories</option>
          </select>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '240px' }}>
            <input
              type="text"
              placeholder="Search SKU, Title, or Finish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.85rem 0.5rem 2.2rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #D5CEC2', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
            <Search size={14} color="#888" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
      </div>

      {/* Index Table with Internal Scroll & Sticky Header */}
      <div
        className="admin-scrollable-table"
        style={{
          maxHeight: '600px',
          overflowY: 'auto',
          overflowX: 'auto',
          borderRadius: '8px',
          border: '1px solid #121212',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          position: 'relative'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ backgroundColor: '#121212', color: '#D4AF37', textAlign: 'left', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem 1.25rem', width: '32%', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Product & Image</th>
              <th style={{ padding: '1rem 1rem', width: '12%', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>SKU Code</th>
              <th style={{ padding: '1rem 1rem', width: '14%', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Category</th>
              <th style={{ padding: '1rem 1rem', width: '14%', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Price (LKR)</th>
              <th style={{ padding: '1rem 1rem', width: '10%', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Stock</th>
              <th style={{ padding: '1rem 1rem', width: '10%', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem', width: '8%', textAlign: 'right', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#888888', backgroundColor: '#FAF7F2' }}>
                  No products found matching your current filter criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const isDeleted = !!p.isDeleted;
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid #E8E3D9',
                      backgroundColor: isDeleted ? '#FFF5F5' : '#FFFFFF',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* Product Image & Details */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #D4AF37', flexShrink: 0 }}
                          onError={(e) => {
                            const cat = p.category === 'mens-accessories' ? 'mens' : p.category.slice(0, -1);
                            (e.target as HTMLImageElement).src = `/assets/${cat}.jpg`;
                          }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 600, margin: '0 0 0.2rem 0', color: '#121212', lineHeight: 1.3 }}>
                            {p.name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#AA820A', fontWeight: 600 }}>
                            {p.attributes?.material}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU Code */}
                    <td style={{ padding: '1rem 1rem' }}>
                      <span style={{ backgroundColor: '#FAF7F2', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid #E8E3D9', fontWeight: 700, fontSize: '0.75rem', color: '#555555' }}>
                        {p.sku}
                      </span>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '1rem 1rem', color: '#121212', fontWeight: 500 }}>
                      {p.categoryName}
                    </td>

                    {/* Price LKR */}
                    <td style={{ padding: '1rem 1rem' }}>
                      <span style={{ fontWeight: 700, color: '#121212', fontSize: '0.9rem' }}>
                        LKR {(p.discountPriceLKR || (p.variants?.[0]?.priceLKR) || p.priceLKR).toLocaleString()}
                      </span>
                      {p.discountPriceLKR && (
                        <span style={{ display: 'block', fontSize: '0.72rem', textDecoration: 'line-through', color: '#999999' }}>
                          LKR {((p.variants?.[0]?.priceLKR) || p.priceLKR).toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Stock Quantity */}
                    <td style={{ padding: '1rem 1rem' }}>
                      <span style={{ fontWeight: 700, color: p.stockQuantity < 10 ? '#D32F2F' : '#121212' }}>
                        {p.stockQuantity} units
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '1rem 1rem' }}>
                      {isDeleted ? (
                        <span style={{ backgroundColor: '#FFEBEB', color: '#D32F2F', padding: '0.3rem 0.65rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                          <AlertOctagon size={12} /> Deleted
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#E8F5E9', color: '#2B7A4B', padding: '0.3rem 0.65rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                          <CheckCircle2 size={12} /> Active Boutique
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          onClick={() => onOpenEditModal(p)}
                          style={{ padding: '0.4rem 0.75rem', backgroundColor: '#FAF7F2', border: '1px solid #D4AF37', color: '#AA820A', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          title="Edit Product Details"
                        >
                          <Edit size={13} /> Edit
                        </button>

                        {isDeleted ? (
                          <button
                            onClick={() => onRestore(p.id)}
                            style={{ padding: '0.4rem 0.75rem', backgroundColor: '#E8F5E9', border: '1px solid #2B7A4B', color: '#2B7A4B', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            title="Restore Deleted Product"
                          >
                            <RotateCcw size={13} /> Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteCandidate(p)}
                            style={{ padding: '0.4rem 0.75rem', backgroundColor: '#FFEBEB', border: '1px solid #D32F2F', color: '#D32F2F', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            title="Delete Product"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Destructive Action Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteCandidate}
        title="Confirm Delete Product"
        message={deleteCandidate ? `Are you sure you want to delete "${deleteCandidate.name}" (SKU: ${deleteCandidate.sku})? This will archive the item and remove it from the public boutique store.` : ''}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteCandidate) {
            onSoftDelete(deleteCandidate.id);
            setDeleteCandidate(null);
          }
        }}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
};
