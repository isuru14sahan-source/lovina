export type CategorySlug = 'all' | 'necklaces' | 'rings' | 'earrings' | 'bracelets' | 'mens-accessories' | 'collections';

export type MetalType = '18K Gold Plated' | '925 Sterling Silver' | 'Rose Gold Plated' | 'Stainless Steel' | 'Brass';
export type GemstoneType = 'Cubic Zirconia' | 'Freshwater Pearl' | 'Austrian Crystal' | 'Opal' | 'None';

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  size?: string;
  priceLKR?: number;
  stock: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: CategorySlug;
  categoryName: string;
  priceLKR: number;
  discountPriceLKR?: number;
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  attributes: {
    material: MetalType;
    gemstone: GemstoneType;
    plating: string;
    warranty: string;
  };
  images: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  variants: ProductVariant[];
  stockQuantity: number;
  isDeleted?: boolean;
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantColor: string;
  variantSize?: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  shippingAddress: CustomerAddress;
  paymentMethod: 'card' | 'cod';
  totalAmountLKR: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses?: CustomerAddress[];
}

export interface FilterState {
  category: CategorySlug;
  minPrice: number;
  maxPrice: number;
  metalTypes: MetalType[];
  gemstones: GemstoneType[];
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface HeroBannerConfig {
  mediaType: 'video' | 'image';
  videoUrl: string;
  videoUrls?: string[];
  imageUrl: string;
  badgeText: string;
  title: string;
  subtitle: string;
  button1Text: string;
  button1Category: CategorySlug;
  button2Text: string;
  button2Category: CategorySlug;
}

export const DEFAULT_HERO_CONFIG: HeroBannerConfig = {
  mediaType: 'video',
  videoUrl: 'https://aohibqmnckdcdwpcabkz.supabase.co/storage/v1/object/public/product-images/videos/hero-video-1795762311624-eqw0w.mp4',
  videoUrls: [
    'https://aohibqmnckdcdwpcabkz.supabase.co/storage/v1/object/public/product-images/videos/hero-video-1795762311624-eqw0w.mp4',
    'https://aohibqmnckdcdwpcabkz.supabase.co/storage/v1/object/public/product-images/videos/hero-video-1795762313606-ruw3k.mp4',
    'https://aohibqmnckdcdwpcabkz.supabase.co/storage/v1/object/public/product-images/videos/hero-video-1795760818619.mp4',
    '/assets/videos/hero-jewelry.mp4'
  ],
  imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
  badgeText: '2026 ROYAL HERITAGE COLLECTION',
  title: 'Timeless Luxury, Crafted for Perfection.',
  subtitle: 'Explore high-end 18K gold-plated jewellery, genuine freshwater pearls, and brilliant Austrian crystal creations designed to elevate everyday style into royalty.',
  button1Text: 'Explore Collection',
  button1Category: 'all',
  button2Text: '18K Necklaces',
  button2Category: 'necklaces'
};
