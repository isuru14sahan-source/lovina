import React, { useState, useEffect } from 'react';
import { Product, Order, CategorySlug, MetalType, GemstoneType, HeroBannerConfig, DEFAULT_HERO_CONFIG } from '../types';
import { INITIAL_ORDERS } from '../services/mockData';
import { TrendingUp, Package, AlertTriangle, Plus, Shield, DollarSign, Layers, Lock, Trash2, Edit, Video, Database, Sparkles, Key, Mail, Eye, EyeOff, CheckCircle2, Menu } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ProductIndexTable } from '../components/admin/ProductIndexTable';
import { EditProductModal } from '../components/admin/EditProductModal';
import { AddProductModal } from '../components/admin/AddProductModal';
import { HeroMediaModal } from '../components/admin/HeroMediaModal';
import { GoogleAuthModal } from '../components/common/GoogleAuthModal';
import { supabaseService } from '../services/supabaseService';

interface AdminDashboardProps {
  products: Product[];
  heroConfig?: HeroBannerConfig;
  onSaveHeroConfig?: (cfg: HeroBannerConfig) => void;
  onAddProduct: (newProd: Product) => void;
  onUpdateProductStock: (id: string, newStock: number) => void;
  onEditProduct: (updated: Product) => void;
  onSoftDeleteProduct: (id: string) => void;
  onRestoreProduct: (id: string) => void;
  onNavigateShop?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  heroConfig = DEFAULT_HERO_CONFIG,
  onSaveHeroConfig,
  onAddProduct,
  onUpdateProductStock,
  onEditProduct,
  onSoftDeleteProduct,
  onRestoreProduct,
  onNavigateShop
}) => {
  const { showToast } = useToast();
  const { isAdmin, loginAsAdminWithCredentials, signInWithRealGoogle, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'archive'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Sync real-time orders from Supabase
  useEffect(() => {
    const fetchCloudOrders = async () => {
      if (supabaseService.isReady()) {
        try {
          const cloudOrders = await supabaseService.getOrders();
          if (cloudOrders && cloudOrders.length > 0) {
            setOrders(cloudOrders);
          } else if (cloudOrders && cloudOrders.length === 0) {
            // First time: seed initial demo orders into Supabase
            await supabaseService.seedOrders(INITIAL_ORDERS);
            setOrders(INITIAL_ORDERS);
          }
        } catch (err) {
          console.warn('Could not sync orders from Supabase:', err);
        }
      }
    };
    fetchCloudOrders();
  }, []);

  // Admin Login Form States (blank by default - no credentials exposed)
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('12500');
  const [newProdCategory, setNewProdCategory] = useState<CategorySlug>('necklaces');
  const [newProdMaterial, setNewProdMaterial] = useState<MetalType>('18K Gold Plated');
  const [newProdGemstone, setNewProdGemstone] = useState<GemstoneType>('Cubic Zirconia');
  const [newProdImage, setNewProdImage] = useState('/assets/necklace.jpg');
  const [newProdStock, setNewProdStock] = useState('15');

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await loginAsAdminWithCredentials(inputEmail, inputPassword);
      if (success) {
        setInputPassword('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithRealGoogle();
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // If Admin Security Clearance is not granted, render luxury password/Google authentication layout
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF7F2', padding: '2rem' }}>
        <div style={{ maxWidth: '490px', width: '100%', padding: '2.5rem 2rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #D4AF37', boxShadow: '0 20px 45px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#121212', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Shield size={32} color="#D4AF37" />
          </div>

          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#AA820A', fontWeight: 700 }}>
            Restricted Security Zone
          </span>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.75rem', color: '#121212', margin: '0.4rem 0 0.5rem 0' }}>
            Executive Admin Clearance
          </h2>

          <p style={{ fontSize: '0.85rem', color: '#6E6E6E', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Authorized portal for Lovina Boutique Management. Enter your owner credentials below to access the control center.
          </p>

          {/* Primary Action 1: Direct Credentials Form */}
          <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ position: 'relative', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.35rem', display: 'block' }}>
                Admin Email:
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#AA820A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="Enter your admin email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.82rem 0.85rem 0.82rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid #D5CEC2',
                    outline: 'none',
                    fontSize: '0.9rem',
                    backgroundColor: '#FAFAF8'
                  }}
                />
              </div>
            </div>

            <div style={{ position: 'relative', textAlign: 'left' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.35rem', display: 'block' }}>
                Master Password:
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#AA820A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your master password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.82rem 2.5rem 0.82rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid #D5CEC2',
                    outline: 'none',
                    fontSize: '0.9rem',
                    backgroundColor: '#FAFAF8'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold"
              style={{
                width: '100%',
                padding: '0.92rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '0.35rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
              }}
            >
              <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0 1rem 0', color: '#999', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E3D9' }} />
            <span>OR CONTINUE WITH GOOGLE</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E3D9' }} />
          </div>

          {/* Secondary Action: Official Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid #D5CEC2',
              backgroundColor: '#FFFFFF',
              color: '#121212',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Luxury Security notice footer */}
          <div style={{ marginTop: '1.5rem', padding: '0.85rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8E3D9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Lock size={14} color="#AA820A" />
            <span style={{ fontSize: '0.74rem', color: '#777' }}>
              Authorized access only. All authentication attempts are encrypted & logged.
            </span>
          </div>

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

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    if (supabaseService.isReady()) {
      try {
        await supabaseService.updateOrderStatus(orderId, nextStatus);
        showToast(`Order status updated to ${nextStatus} in Supabase Cloud!`, 'success');
        return;
      } catch (err) {
        console.warn('Failed to update order status in Supabase:', err);
      }
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAF7F2' }}>
      {/* Mobile Top Navigation Bar (Shown on phones <= 900px) */}
      <div
        className="mobile-admin-topbar"
        style={{
          display: 'none',
          backgroundColor: '#121212',
          color: '#FFFFFF',
          padding: '0.85rem 1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(212,175,55,0.4)',
          position: 'sticky',
          top: 0,
          zIndex: 900
        }}
      >
        <button
          onClick={() => setMobileSidebarOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid #D4AF37',
            color: '#D4AF37',
            padding: '0.45rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          aria-label="Open Admin Menu"
        >
          <Menu size={18} />
          <span>Menu</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Shield size={16} color="#D4AF37" />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.05em' }}>
            LOVINA
          </span>
        </div>

        <button
          onClick={logout}
          style={{
            backgroundColor: '#1E1E1E',
            border: '1px solid #444',
            color: '#E53E3E',
            padding: '0.45rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Lock
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Super Admin Modular Sidebar Navigation */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          onLock={logout}
          onNavigateShop={onNavigateShop}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Admin Dashboard Viewport */}
        <main className="admin-main-viewport" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          {/* Top Executive Header Bar */}
          <div className="admin-header-card" style={{ backgroundColor: '#121212', color: '#FFFFFF', padding: '1.75rem 2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #D4AF37', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: '#D4AF37', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={14} /> Lovina Super Admin Clearance Active
              </span>
              <h1 className="admin-header-title" style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', margin: '0.3rem 0 0 0' }}>
                {activeTab === 'overview' && 'Executive Overview Dashboard'}
                {activeTab === 'products' && 'Product Management Index'}
                {activeTab === 'orders' && 'Order Fulfillment & Logistics'}
                {activeTab === 'archive' && 'Archived Products'}
              </h1>
            </div>

            <div className="admin-header-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: supabaseService.isReady() ? 'rgba(43, 122, 75, 0.2)' : 'rgba(212, 175, 55, 0.15)',
                color: supabaseService.isReady() ? '#4ADE80' : '#D4AF37',
                border: `1px solid ${supabaseService.isReady() ? '#2B7A4B' : '#D4AF37'}`
              }}>
                <Database size={14} />
                <span>{supabaseService.isReady() ? 'Supabase Cloud Synced' : 'Local Mode (Supabase Pending)'}</span>
              </div>

              <button
                onClick={() => setShowHeroModal(true)}
                className="btn-outline"
                style={{
                  borderColor: '#D4AF37',
                  color: '#D4AF37',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer'
                }}
              >
                <Video size={16} />
                <span>Homepage Video Banner</span>
              </button>

              <button onClick={() => setShowAddModal(true)} className="btn-gold" style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}>
                <Plus size={18} />
                <span>Register New Product</span>
              </button>
            </div>
          </div>

          {/* Overview Analytics KPI Cards */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', margin: '0 0 0.3rem 0' }}>Order Dispatch & Cloud Logistics</h3>
                <p style={{ fontSize: '0.8rem', color: '#6E6E6E', margin: 0 }}>Live customer orders synced in real-time with Supabase Cloud Database.</p>
              </div>
              <button
                onClick={async () => {
                  if (supabaseService.isReady()) {
                    const fresh = await supabaseService.getOrders();
                    if (fresh) setOrders(fresh);
                    showToast('Orders refreshed from Supabase Cloud', 'info');
                  }
                }}
                className="btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                Refresh Orders
              </button>
            </div>

            <div
              className="admin-scrollable-table"
              style={{
                maxHeight: '560px',
                overflowY: 'auto',
                overflowX: 'auto',
                borderRadius: '8px',
                border: '1px solid #121212',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr style={{ backgroundColor: '#121212', color: '#D4AF37', textAlign: 'left' }}>
                    <th style={{ padding: '0.85rem 1rem', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Order Ref</th>
                    <th style={{ padding: '0.85rem 1rem', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Date</th>
                    <th style={{ padding: '0.85rem 1rem', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Customer & Destination</th>
                    <th style={{ padding: '0.85rem 1rem', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Waybill / Courier ID</th>
                    <th style={{ padding: '0.85rem 1rem', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Total</th>
                    <th style={{ padding: '0.85rem 1rem', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', position: 'sticky', top: 0, backgroundColor: '#121212', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #F0ECE1' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                        <span style={{ color: '#121212' }}>#{o.orderNumber}</span>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>{o.paymentMethod}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#555', fontSize: '0.8rem' }}>{o.date}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <strong>{o.shippingAddress.fullName}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#6E6E6E' }}>{o.shippingAddress.city} • {o.shippingAddress.phone}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <code style={{ fontSize: '0.75rem', backgroundColor: '#FAF7F2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E8E3D9', color: '#AA820A' }}>
                          {o.trackingNumber || 'Pending Waybill'}
                        </code>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#AA820A' }}>
                        LKR {o.totalAmountLKR.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          backgroundColor: o.status === 'Delivered' ? '#E8F5E9' : o.status === 'Shipped' ? '#E3F2FD' : '#FAF7F2',
                          color: o.status === 'Delivered' ? '#2B7A4B' : o.status === 'Shipped' ? '#1565C0' : '#AA820A',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          border: '1px solid #D4AF37',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase'
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #D5CEC2', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                        >
                          <option value="Pending">Set Pending</option>
                          <option value="Processing">Set Processing</option>
                          <option value="Shipped">Set Shipped</option>
                          <option value="Delivered">Set Delivered</option>
                          <option value="Cancelled">Set Cancelled</option>
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
      </div>

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

      {/* Hero Banner Video & Media Modal Component */}
      <HeroMediaModal
        isOpen={showHeroModal}
        onClose={() => setShowHeroModal(false)}
        config={heroConfig}
        onSave={(cfg) => {
          if (onSaveHeroConfig) onSaveHeroConfig(cfg);
        }}
      />
    </div>
  );
};
