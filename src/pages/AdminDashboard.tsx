import React, { useState } from 'react';
import { Product, Order, CategorySlug, MetalType, GemstoneType } from '../types';
import { INITIAL_ORDERS } from '../services/mockData';
import { TrendingUp, Package, AlertTriangle, Plus, Shield, DollarSign, Layers, Lock, Trash2, Edit } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ProductIndexTable } from '../components/admin/ProductIndexTable';
import { EditProductModal } from '../components/admin/EditProductModal';
import { AddProductModal } from '../components/admin/AddProductModal';
import { GoogleAuthModal } from '../components/common/GoogleAuthModal';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (newProd: Product) => void;
  onUpdateProductStock: (id: string, newStock: number) => void;
  onEditProduct: (updated: Product) => void;
  onSoftDeleteProduct: (id: string) => void;
  onRestoreProduct: (id: string) => void;
  onNavigateShop?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProductStock,
  onEditProduct,
  onSoftDeleteProduct,
  onRestoreProduct,
  onNavigateShop
}) => {
  const { showToast } = useToast();
  const { isAdmin, loginAsAdminWithPassword, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'archive'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Security Password Login Input State
  const [inputPassword, setInputPassword] = useState('');

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('12500');
  const [newProdCategory, setNewProdCategory] = useState<CategorySlug>('necklaces');
  const [newProdMaterial, setNewProdMaterial] = useState<MetalType>('18K Gold Plated');
  const [newProdGemstone, setNewProdGemstone] = useState<GemstoneType>('Cubic Zirconia');
  const [newProdImage, setNewProdImage] = useState('/assets/necklace.jpg');
  const [newProdStock, setNewProdStock] = useState('15');

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdminWithPassword(inputPassword);
    if (success) {
      setInputPassword('');
    }
  };

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // If Admin Security Clearance is not granted, render password authentication layout
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF7F2', padding: '2rem' }}>
        <div style={{ maxWidth: '460px', width: '100%', padding: '2.5rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #D4AF37', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#121212', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Shield size={32} color="#D4AF37" />
          </div>

          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#AA820A', fontWeight: 700 }}>
            Restricted Security Zone
          </span>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#121212', margin: '0.4rem 0 0.75rem 0' }}>
            Executive Clearance Required
          </h2>

          <p style={{ fontSize: '0.85rem', color: '#6E6E6E', marginBottom: '1.5rem' }}>
            Sign in with your designated Admin Google Account (<strong>isuru14sahan@gmail.com</strong>) or enter the executive password.
          </p>

          {/* 1-Click Google OAuth Sign-In Action */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '8px',
              border: '1px solid #D5CEC2',
              backgroundColor: '#FFFFFF',
              color: '#121212',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              marginBottom: '1.25rem'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google Admin</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0', color: '#999', fontSize: '0.75rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E3D9' }} />
            <span>OR VIA PASSWORD</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E3D9' }} />
          </div>

          <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              required
              placeholder="Enter Admin Password (e.g. LOVINA@ADMIN2026)"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              style={{ width: '100%', padding: '0.85rem', borderRadius: '6px', border: '1px solid #D5CEC2', outline: 'none', fontSize: '0.9rem', textAlign: 'center' }}
            />

            <button type="submit" className="btn-gold" style={{ padding: '0.85rem' }}>
              <span>Authenticate Admin Portal</span>
            </button>
          </form>

          <GoogleAuthModal
            isOpen={showGoogleModal}
            onClose={() => setShowGoogleModal(false)}
          />
        </div>
      </div>
    );
  }

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmountLKR, 0) + 48500;
  const totalOrdersCount = orders.length + 14;
  const activeProducts = products.filter((p) => !p.isDeleted);
  const archivedProducts = products.filter((p) => p.isDeleted);
  const lowStockProducts = activeProducts.filter((p) => p.stockQuantity < 10);

  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    showToast(`Order status updated to ${nextStatus}`, 'success');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) {
      showToast('Product name is required', 'error');
      return;
    }

    const created: Product = {
      id: 'lov-' + Date.now(),
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/ /g, '-'),
      sku: 'LOV-NEW-' + Math.floor(100 + Math.random() * 900),
      category: newProdCategory,
      categoryName: newProdCategory.charAt(0).toUpperCase() + newProdCategory.slice(1).replace('-', ' '),
      priceLKR: Number(newProdPrice),
      rating: 5.0,
      reviewCount: 1,
      description: 'Handcrafted premium fashion piece created with precision gold micro-vacuum technology.',
      details: ['Material: ' + newProdMaterial, 'Anti-tarnish guarantee'],
      attributes: {
        material: newProdMaterial,
        gemstone: newProdGemstone,
        plating: '18K Micro Gold Plating',
        warranty: '1 Year Warranty'
      },
      images: [newProdImage],
      isFeatured: true,
      variants: [
        { id: 'v-new-1', color: 'Default Finish', colorHex: '#D4AF37', stock: Number(newProdStock), inStock: true }
      ],
      stockQuantity: Number(newProdStock),
      isDeleted: false
    };

    onAddProduct(created);
    setShowAddModal(false);
    setNewProdName('');
    showToast(`Registered new product "${created.name}"`, 'success');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF7F2' }}>
      {/* Super Admin Modular Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onLock={logout}
        onNavigateShop={onNavigateShop}
      />

      {/* Main Admin Dashboard Viewport */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {/* Top Executive Header Bar */}
        <div style={{ backgroundColor: '#121212', color: '#FFFFFF', padding: '1.75rem 2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#D4AF37', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={14} /> Lovina Super Admin Clearance Active
            </span>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', margin: '0.3rem 0 0 0' }}>
              {activeTab === 'overview' && 'Executive Overview Dashboard'}
              {activeTab === 'products' && 'Product Management Index'}
              {activeTab === 'orders' && 'Order Fulfillment & Logistics'}
              {activeTab === 'archive' && 'Archived Products'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => setShowAddModal(true)} className="btn-gold" style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}>
              <Plus size={18} />
              <span>Register New Product</span>
            </button>
          </div>
        </div>

        {/* Overview Analytics KPI Cards */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E8E3D9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6E6E6E', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</span>
                  <DollarSign size={20} color="#AA820A" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#121212', margin: 0 }}>
                  LKR {totalRevenue.toLocaleString()}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#2B7A4B', fontWeight: 600 }}>+18.4% vs last month</span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E8E3D9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6E6E6E', fontWeight: 600, textTransform: 'uppercase' }}>Orders Processed</span>
                  <Package size={20} color="#AA820A" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#121212', margin: 0 }}>
                  {totalOrdersCount}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#2B7A4B', fontWeight: 600 }}>100% Express Fulfillment</span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E8E3D9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6E6E6E', fontWeight: 600, textTransform: 'uppercase' }}>Active Boutique Items</span>
                  <Layers size={20} color="#AA820A" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#121212', margin: 0 }}>
                  {activeProducts.length} Items
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#AA820A', fontWeight: 600 }}>{archivedProducts.length} Archived</span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E8E3D9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6E6E6E', fontWeight: 600, textTransform: 'uppercase' }}>Low Stock Alert</span>
                  <AlertTriangle size={20} color="#D32F2F" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#D32F2F', margin: 0 }}>
                  {lowStockProducts.length} Items
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#D32F2F', fontWeight: 600 }}>Re-stock recommended</span>
              </div>
            </div>

            {/* Render Main Product Index Table on Overview */}
            <ProductIndexTable
              products={products}
              onOpenAddModal={() => setShowAddModal(true)}
              onOpenEditModal={(p) => setEditProduct(p)}
              onSoftDelete={onSoftDeleteProduct}
              onRestore={onRestoreProduct}
            />
          </div>
        )}

        {/* Product Management Index Tab */}
        {activeTab === 'products' && (
          <ProductIndexTable
            products={products}
            onOpenAddModal={() => setShowAddModal(true)}
            onOpenEditModal={(p) => setEditProduct(p)}
            onSoftDelete={onSoftDeleteProduct}
            onRestore={onRestoreProduct}
          />
        )}

        {/* Soft-Deleted Archive Tab */}
        {activeTab === 'archive' && (
          <ProductIndexTable
            products={archivedProducts}
            onOpenAddModal={() => setShowAddModal(true)}
            onOpenEditModal={(p) => setEditProduct(p)}
            onSoftDelete={onSoftDeleteProduct}
            onRestore={onRestoreProduct}
          />
        )}

        {/* Order Fulfillment Tab */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E3D9', padding: '2rem' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', marginBottom: '1.5rem' }}>Order Dispatch Control</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#121212', color: '#D4AF37', textAlign: 'left' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Total Amount</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Payment</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Update Dispatch Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #F0ECE1' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>#{o.orderNumber}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{o.shippingAddress.fullName}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#AA820A' }}>LKR {o.totalAmountLKR.toLocaleString()}</td>
                      <td style={{ padding: '0.85rem 1rem', textTransform: 'uppercase' }}>{o.paymentMethod}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ backgroundColor: '#FAF7F2', padding: '4px 12px', borderRadius: '12px', border: '1px solid #D4AF37', fontWeight: 700 }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #D5CEC2' }}
                        >
                          <option value="Pending">Set Pending</option>
                          <option value="Processing">Set Processing</option>
                          <option value="Shipped">Set Shipped</option>
                          <option value="Delivered">Set Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Product Edit Modal Component */}
      <EditProductModal
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        product={editProduct}
        onSave={onEditProduct}
      />

      {/* Product Registration Modal Component */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProduct={onAddProduct}
      />
    </div>
  );
};
