import React, { useState, useEffect } from 'react';
import { CategorySlug, Product, HeroBannerConfig, DEFAULT_HERO_CONFIG } from './types';
import { INITIAL_PRODUCTS } from './services/mockData';
import { supabaseService } from './services/supabaseService';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { QuickViewModal } from './components/product/QuickViewModal';
import { LiveSearchModal } from './components/common/LiveSearchModal';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrderTrackingPage } from './pages/OrderTrackingPage';

export const AppContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lovina_products_v5');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('lovina_products_v5', JSON.stringify(products));
  }, [products]);

  // Load products from Supabase if configured & auto-sync missing catalog items
  useEffect(() => {
    const syncSupabase = async () => {
      if (supabaseService.isReady()) {
        try {
          const remoteProducts = await supabaseService.getProducts();
          if (remoteProducts && remoteProducts.length > 0) {
            // Auto-detect any new items in INITIAL_PRODUCTS and seed them to Supabase
            const remoteIds = new Set(remoteProducts.map((p) => p.id));
            const missing = INITIAL_PRODUCTS.filter((p) => !remoteIds.has(p.id));
            if (missing.length > 0) {
              await supabaseService.seedProducts(missing);
              setProducts([...remoteProducts, ...missing]);
            } else {
              setProducts(remoteProducts);
            }
          } else if (remoteProducts && remoteProducts.length === 0) {
            // First time connection: automatically seed catalog to Supabase
            await supabaseService.seedProducts(INITIAL_PRODUCTS);
            setProducts(INITIAL_PRODUCTS);
          }
        } catch (err) {
          console.warn('Supabase sync skipped, using local cache:', err);
        }
      }
    };
    syncSupabase();
  }, []);

  const [heroConfig, setHeroConfig] = useState<HeroBannerConfig>(() => {
    const saved = localStorage.getItem('lovina_hero_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.videoUrl === 'https://vjs.zencdn.net/v/oceans.mp4' ||
          !parsed.videoUrls ||
          (parsed.videoUrls.length === 1 && parsed.videoUrls[0] === '/assets/videos/hero-jewelry.mp4')
        ) {
          localStorage.setItem('lovina_hero_config', JSON.stringify(DEFAULT_HERO_CONFIG));
          return DEFAULT_HERO_CONFIG;
        }
        return parsed;
      } catch {}
    }
    return DEFAULT_HERO_CONFIG;
  });

  const handleSaveHeroConfig = (newCfg: HeroBannerConfig) => {
    setHeroConfig(newCfg);
    localStorage.setItem('lovina_hero_config', JSON.stringify(newCfg));
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'product-detail' | 'checkout' | 'account' | 'admin' | 'tracking'>(() => {
    if (sessionStorage.getItem('lovina_admin_redirect') === 'admin' || window.location.hash.includes('access_token')) {
      sessionStorage.removeItem('lovina_admin_redirect');
      return 'admin';
    }
    return 'home';
  });
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleSelectCategory = (category: CategorySlug) => {
    setActiveCategory(category);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    if (supabaseService.isReady()) {
      supabaseService.createProduct(newProd);
    }
  };

  const handleEditProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    if (supabaseService.isReady()) {
      supabaseService.updateProduct(updated);
    }
  };

  const handleSoftDeleteProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isDeleted: true } : p))
    );
    if (supabaseService.isReady()) {
      supabaseService.softDeleteProduct(id);
    }
  };

  const handleRestoreProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isDeleted: false } : p))
    );
    if (supabaseService.isReady()) {
      supabaseService.restoreProduct(id);
    }
  };

  const handleAddReview = (productId: string, newReview: { name: string; rating: number; comment: string; date: string }) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedCount = p.reviewCount + 1;
          const updatedRating = Number(((p.rating * p.reviewCount + newReview.rating) / updatedCount).toFixed(1));
          return { ...p, reviewCount: updatedCount, rating: updatedRating };
        }
        return p;
      })
    );
  };

  const activeProducts = products.filter((p) => !p.isDeleted);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Customer-Facing Boutique Header (Hidden on Admin Portal) */}
      {currentPage !== 'admin' && (
        <Header
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentPage={currentPage}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
        />
      )}

      <div style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            products={activeProducts}
            heroConfig={heroConfig}
            onSelectCategory={(cat) => {
              handleSelectCategory(cat);
              setCurrentPage('shop');
            }}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            products={activeProducts}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={activeProducts}
            onBack={() => setCurrentPage('shop')}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={handleSelectProduct}
            onAddReview={handleAddReview}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onBackToShop={() => setCurrentPage('shop')}
            onOrderComplete={() => {
              setCurrentPage('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage onNavigateShop={() => setCurrentPage('shop')} />
        )}

        {currentPage === 'tracking' && (
          <OrderTrackingPage onBackToShop={() => setCurrentPage('shop')} />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            products={products}
            heroConfig={heroConfig}
            onSaveHeroConfig={handleSaveHeroConfig}
            onAddProduct={handleAddProduct}
            onUpdateProductStock={(id, stock) => {
              setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stockQuantity: stock } : p));
            }}
            onEditProduct={handleEditProduct}
            onSoftDeleteProduct={handleSoftDeleteProduct}
            onRestoreProduct={handleRestoreProduct}
            onNavigateShop={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>

      {/* Customer-Facing Boutique Footer (Hidden on Admin Portal) */}
      {currentPage !== 'admin' && (
        <Footer
          onSelectCategory={(cat) => {
            handleSelectCategory(cat);
            setCurrentPage('shop');
          }}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Cart Drawer Overlay */}
      <CartDrawer onCheckout={() => setCurrentPage('checkout')} />

      {/* Wishlist Drawer Overlay */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Live Search Modal Overlay */}
      <LiveSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={activeProducts}
        onSelectProduct={handleSelectProduct}
      />

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Floating WhatsApp Concierge Widget */}
      {currentPage !== 'admin' && <FloatingWhatsApp />}

      {/* Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};
