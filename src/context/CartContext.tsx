import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, delta: number) => void;
  clearCart: () => void;
  couponCode: string;
  discountPercentage: number;
  applyCoupon: (code: string) => boolean;
  subtotalLKR: number;
  discountLKR: number;
  shippingLKR: number;
  totalLKR: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lovina_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('lovina_cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const selectedVariant = variant || product.variants[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.id === selectedVariant.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedVariant, quantity }];
      }
    });

    showToast(`Added "${product.name}" to cart!`, 'success');
    openCart();
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant.id === variantId)
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedVariant.id === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercentage(0);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'LOVINA10') {
      setCouponCode(cleanCode);
      setDiscountPercentage(10);
      showToast('10% Luxury Coupon Applied!', 'success');
      return true;
    } else if (cleanCode === 'GOLDVIP') {
      setCouponCode(cleanCode);
      setDiscountPercentage(15);
      showToast('15% VIP Gold Discount Applied!', 'success');
      return true;
    } else {
      showToast('Invalid promotional code', 'error');
      return false;
    }
  };

  const subtotalLKR = cart.reduce((sum, item) => {
    const price = item.product.discountPriceLKR || item.product.priceLKR;
    return sum + price * item.quantity;
  }, 0);

  const discountLKR = Math.round((subtotalLKR * discountPercentage) / 100);
  const shippingLKR = subtotalLKR > 15000 || subtotalLKR === 0 ? 0 : 500;
  const totalLKR = Math.max(0, subtotalLKR - discountLKR + shippingLKR);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        discountPercentage,
        applyCoupon,
        subtotalLKR,
        discountLKR,
        shippingLKR,
        totalLKR
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
