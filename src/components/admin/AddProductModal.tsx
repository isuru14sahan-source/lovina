import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, PlusCircle, Upload, Check } from 'lucide-react';
import { Product, CategorySlug, MetalType, GemstoneType, ProductVariant } from '../../types';
import { useToast } from '../../context/ToastContext';
import { googleDriveService } from '../../services/googleDrive';
import { supabaseService } from '../../services/supabaseService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Product) => void;
}

// Helper to convert Google Drive share links into direct image URLs
const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([^\/]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return url;
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic Info
  const [name, setName] = useState('');
  const [sku, setSku] = useState('LOV-' + Math.floor(1000 + Math.random() * 9000));
  const [category, setCategory] = useState<CategorySlug>('necklaces');
  const [priceLKR, setPriceLKR] = useState('14500');
  const [discountPriceLKR, setDiscountPriceLKR] = useState('');
  const [stockQuantity, setStockQuantity] = useState('15');
  const [description, setDescription] = useState('Handcrafted luxury imitation jewelry with 18K micro gold vacuum plating designed for anti-tarnish durability.');
  const [detailsText, setDetailsText] = useState('18K Gold Plated finish, Anti-tarnish protective coating, Velvet jewelry box included');

  // Specs & Attributes
  const [material, setMaterial] = useState<MetalType>('18K Gold Plated');
  const [gemstone, setGemstone] = useState<GemstoneType>('Cubic Zirconia');
  const [plating, setPlating] = useState('18K Micro Gold Vacuum Plating');
  const [warranty, setWarranty] = useState('1 Year Anti-Tarnish Warranty');

  // Badges & Flags
  const [isFeatured, setIsFeatured] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Multiple Image URLs (Hero + Gallery)
  const [mainHeroImage, setMainHeroImage] = useState('/assets/necklace.jpg');
  const [galleryImage1, setGalleryImage1] = useState('');
  const [galleryImage2, setGalleryImage2] = useState('');
  const [galleryImage3, setGalleryImage3] = useState('');

  // Product Variations Engine
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: 'var-1',
      color: '18K Yellow Gold',
      colorHex: '#D4AF37',
      size: '18 inch',
      priceLKR: 14500,
      stock: 10,
      inStock: true
    },
    {
      id: 'var-2',
      color: '925 Silver Finish',
      colorHex: '#C0C0C0',
      size: '18 inch',
      priceLKR: 14500,
      stock: 5,
      inStock: true
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  // Handle direct file upload to Supabase Storage (with fallback to local preview)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'main' | 'g1' | 'g2' | 'g3') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      let uploadedUrl: string | null = null;
      if (supabaseService.isReady()) {
        try {
          uploadedUrl = await supabaseService.uploadImage(file);
        } catch (storageErr) {
          console.warn('Supabase storage upload failed, falling back to local FileReader:', storageErr);
        }
      }

      if (uploadedUrl) {
        if (targetField === 'main') setMainHeroImage(uploadedUrl);
        if (targetField === 'g1') setGalleryImage1(uploadedUrl);
        if (targetField === 'g2') setGalleryImage2(uploadedUrl);
        if (targetField === 'g3') setGalleryImage3(uploadedUrl);
        showToast(`Photo uploaded to Supabase Storage successfully!`, 'success');
      } else {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const base64 = uploadEvent.target?.result as string;
          if (targetField === 'main') setMainHeroImage(base64);
          if (targetField === 'g1') setGalleryImage1(base64);
          if (targetField === 'g2') setGalleryImage2(base64);
          if (targetField === 'g3') setGalleryImage3(base64);
          showToast('Image loaded successfully from device!', 'success');
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      showToast(`Upload failed: ${err.message || 'Please check Supabase settings'}`, 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddVariant = () => {
    const newVar: ProductVariant = {
      id: 'var-' + Date.now(),
      color: 'Rose Gold',
      colorHex: '#E5C1CD',
      size: '20 inch',
      priceLKR: Number(priceLKR) || 14500,
      stock: 5,
      inStock: true
    };
    setVariants((prev) => [...prev, newVar]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      showToast('Product must have at least 1 variation', 'error');
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleVariantChange = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const updated = { ...v, [field]: value };
          if (field === 'stock') {
            updated.inStock = Number(value) > 0;
          }
          return updated;
        }
        return v;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product title is required', 'error');
      return;
    }

    const cleanMain = convertGoogleDriveUrl(mainHeroImage.trim());
    const cleanG1 = convertGoogleDriveUrl(galleryImage1.trim());
    const cleanG2 = convertGoogleDriveUrl(galleryImage2.trim());
    const cleanG3 = convertGoogleDriveUrl(galleryImage3.trim());

    const imagesList = [cleanMain, cleanG1, cleanG2, cleanG3].filter(
      (img) => img && img.trim() !== ''
    );

    if (imagesList.length === 0) {
      imagesList.push('/assets/necklace.jpg');
    }

    const detailsArray = detailsText.split(',').map((d) => d.trim()).filter((d) => d !== '');

    const newProduct: Product = {
      id: 'lov-' + Date.now(),
      name: name.trim(),
      slug: name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      sku: sku.trim() || 'LOV-NEW-' + Math.floor(100 + Math.random() * 900),
      category,
      categoryName: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
      priceLKR: Number(priceLKR),
      discountPriceLKR: discountPriceLKR ? Number(discountPriceLKR) : undefined,
      rating: 5.0,
      reviewCount: 1,
      description,
      details: detailsArray.length > 0 ? detailsArray : ['18K Micro Gold Plating', 'Anti-tarnish guarantee'],
      attributes: {
        material,
        gemstone,
        plating,
        warranty
      },
      images: imagesList,
      isFeatured,
      isNewArrival,
      isBestSeller,
      variants,
      stockQuantity: Number(stockQuantity),
      isDeleted: false
    };

    onAddProduct(newProduct);
    showToast(`Successfully registered "${name}" with uploaded photos & variations!`, 'success');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '840px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '1px solid #D4AF37'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E8E3D9', paddingBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#AA820A', fontWeight: 700, letterSpacing: '0.1em' }}>
              Product Management Module
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#121212' }}>
              Register New Luxury Product
            </h2>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={22} color="#121212" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Basic Product Information */}
          <div style={{ backgroundColor: '#FAF7F2', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E8E3D9' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#AA820A', margin: '0 0 1rem 0' }}>
              1. General Information & Pricing
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Product Name / Title *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aurelia 18K Gold Plated Pendant Necklace" style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>SKU Code *</label>
                <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as CategorySlug)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }}>
                  <option value="necklaces">Necklaces</option>
                  <option value="rings">Rings</option>
                  <option value="earrings">Earrings</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="mens-accessories">Men's Accessories</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Standard Price (LKR) *</label>
                <input type="number" required value={priceLKR} onChange={(e) => setPriceLKR(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Discount Price (LKR)</label>
                <input type="number" value={discountPriceLKR} onChange={(e) => setDiscountPriceLKR(e.target.value)} placeholder="Optional" style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Total Stock *</label>
                <input type="number" required value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }} />
              </div>
            </div>
          </div>

          {/* Section 2: Specifications & Attributes */}
          <div style={{ backgroundColor: '#FAF7F2', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E8E3D9' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#AA820A', margin: '0 0 1rem 0' }}>
              2. Material Specs & Badges
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Metal Finish</label>
                <select value={material} onChange={(e) => setMaterial(e.target.value as MetalType)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }}>
                  <option value="18K Gold Plated">18K Gold Plated</option>
                  <option value="925 Sterling Silver">925 Sterling Silver</option>
                  <option value="Rose Gold Plated">Rose Gold Plated</option>
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="Brass">Brass</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Gemstone Accent</label>
                <select value={gemstone} onChange={(e) => setGemstone(e.target.value as GemstoneType)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }}>
                  <option value="Cubic Zirconia">Cubic Zirconia</option>
                  <option value="Freshwater Pearl">Freshwater Pearl</option>
                  <option value="Austrian Crystal">Austrian Crystal</option>
                  <option value="Opal">Opal</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Plating Technology</label>
                <input type="text" value={plating} onChange={(e) => setPlating(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Warranty</label>
                <input type="text" value={warranty} onChange={(e) => setWarranty(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                <span>Featured Showcase Item</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />
                <span>New Arrival Badge</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
                <span>Bestseller Tag</span>
              </label>
            </div>
          </div>

          {/* Section 3: Multiple Images Support (Hero + Gallery & Direct Device Upload) */}
          <div style={{ backgroundColor: '#FAF7F2', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E8E3D9' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#AA820A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ImageIcon size={16} /> 3. Multiple Images (Direct Device File Upload & Live Previews)
            </h3>

            {/* Main Hero Image Picker */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid #D5CEC2', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#121212', display: 'block', marginBottom: '0.4rem' }}>
                Primary Hero / Main Showcase Image *
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Thumbnail Preview */}
                <div style={{ width: '64px', height: '64px', borderRadius: '8px', border: '1px solid #D4AF37', overflow: 'hidden', flexShrink: 0, backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mainHeroImage ? (
                    <img src={convertGoogleDriveUrl(mainHeroImage)} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  ) : (
                    <ImageIcon size={24} color="#AA820A" />
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    value={mainHeroImage}
                    onChange={(e) => setMainHeroImage(e.target.value)}
                    placeholder="Paste URL or Google Drive link, or click upload button below"
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #D5CEC2', fontSize: '0.8rem' }}
                  />

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', backgroundColor: '#121212', color: '#D4AF37', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', width: 'fit-content' }}>
                    <Upload size={14} />
                    <span>Upload File from Device</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'main')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>

            {/* Gallery Image Thumbnails 2, 3, 4 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {/* Gallery Image 2 */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E8E3D9' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Gallery Image 2</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" value={galleryImage1} onChange={(e) => setGalleryImage1(e.target.value)} placeholder="URL or Drive link" style={{ width: '100%', padding: '0.45rem', fontSize: '0.75rem', border: '1px solid #D5CEC2', borderRadius: '4px' }} />
                  <label style={{ padding: '0.45rem', backgroundColor: '#FAF7F2', border: '1px solid #D4AF37', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Upload File">
                    <Upload size={14} color="#AA820A" />
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'g1')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Gallery Image 3 */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E8E3D9' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Gallery Image 3</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" value={galleryImage2} onChange={(e) => setGalleryImage2(e.target.value)} placeholder="URL or Drive link" style={{ width: '100%', padding: '0.45rem', fontSize: '0.75rem', border: '1px solid #D5CEC2', borderRadius: '4px' }} />
                  <label style={{ padding: '0.45rem', backgroundColor: '#FAF7F2', border: '1px solid #D4AF37', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Upload File">
                    <Upload size={14} color="#AA820A" />
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'g2')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Gallery Image 4 */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E8E3D9' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Gallery Image 4</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" value={galleryImage3} onChange={(e) => setGalleryImage3(e.target.value)} placeholder="URL or Drive link" style={{ width: '100%', padding: '0.45rem', fontSize: '0.75rem', border: '1px solid #D5CEC2', borderRadius: '4px' }} />
                  <label style={{ padding: '0.45rem', backgroundColor: '#FAF7F2', border: '1px solid #D4AF37', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Upload File">
                    <Upload size={14} color="#AA820A" />
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'g3')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Product Variations Management Engine */}
          <div style={{ backgroundColor: '#FAF7F2', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E8E3D9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#AA820A', margin: 0 }}>
                4. Manage Variations (Colors, Sizes & Custom Prices)
              </h3>
              <button
                type="button"
                onClick={handleAddVariant}
                style={{ padding: '0.4rem 0.85rem', backgroundColor: '#D4AF37', color: '#121212', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <PlusCircle size={14} /> Add Variation
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {variants.map((v, idx) => (
                <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 40px', gap: '0.6rem', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E8E3D9' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>Variant Name</label>
                    <input type="text" value={v.color} onChange={(e) => handleVariantChange(v.id, 'color', e.target.value)} placeholder="e.g. 18K Gold" style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', border: '1px solid #D5CEC2', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>Color Hex</label>
                    <input type="text" value={v.colorHex} onChange={(e) => handleVariantChange(v.id, 'colorHex', e.target.value)} placeholder="#D4AF37" style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', border: '1px solid #D5CEC2', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>Size Option</label>
                    <input type="text" value={v.size || ''} onChange={(e) => handleVariantChange(v.id, 'size', e.target.value)} placeholder="18 inch / US 7" style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', border: '1px solid #D5CEC2', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>Price LKR</label>
                    <input type="number" value={v.priceLKR || ''} onChange={(e) => handleVariantChange(v.id, 'priceLKR', Number(e.target.value))} placeholder={priceLKR} style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', border: '1px solid #D5CEC2', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#888', display: 'block' }}>Stock</label>
                    <input type="number" value={v.stock} onChange={(e) => handleVariantChange(v.id, 'stock', Number(e.target.value))} style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', border: '1px solid #D5CEC2', borderRadius: '4px' }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.id)}
                    style={{ border: 'none', background: 'none', color: '#D32F2F', cursor: 'pointer', paddingTop: '1rem' }}
                    title="Remove Variation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Details */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Product Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2', fontFamily: 'inherit' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Product Details & Highlights (Comma-separated)</label>
            <input type="text" value={detailsText} onChange={(e) => setDetailsText(e.target.value)} placeholder="18K Gold Finish, Anti-tarnish coating, Velvet box included" style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2' }} />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-gold" style={{ flex: 2, padding: '0.85rem' }}>
              <Sparkles size={16} />
              <span>Register Product & Variations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
