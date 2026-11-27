import React, { useState } from 'react';
import { X, Video, Image as ImageIcon, Upload, Sparkles, Check, Play, RefreshCw, Trash2, ArrowUp, ArrowDown, Cloud, Film, Plus } from 'lucide-react';
import { HeroBannerConfig, DEFAULT_HERO_CONFIG, CategorySlug } from '../../types';
import { useToast } from '../../context/ToastContext';
import { supabaseService } from '../../services/supabaseService';

interface HeroMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HeroBannerConfig;
  onSave: (newConfig: HeroBannerConfig) => void;
}

export const HeroMediaModal: React.FC<HeroMediaModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const { showToast } = useToast();

  const [mediaType, setMediaType] = useState<'video' | 'image'>(config.mediaType);
  const [videoUrls, setVideoUrls] = useState<string[]>(() => {
    if (config.videoUrls && config.videoUrls.length > 0) {
      return config.videoUrls;
    }
    return config.videoUrl ? [config.videoUrl] : ['/assets/videos/hero-jewelry.mp4'];
  });
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [customVideoUrlInput, setCustomVideoUrlInput] = useState('');

  const [imageUrl, setImageUrl] = useState(config.imageUrl);
  const [badgeText, setBadgeText] = useState(config.badgeText);
  const [title, setTitle] = useState(config.title);
  const [subtitle, setSubtitle] = useState(config.subtitle);
  const [button1Text, setButton1Text] = useState(config.button1Text);
  const [button1Category, setButton1Category] = useState<CategorySlug>(config.button1Category);
  const [button2Text, setButton2Text] = useState(config.button2Text);
  const [button2Category, setButton2Category] = useState<CategorySlug>(config.button2Category);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');

  if (!isOpen) return null;

  const currentPreviewUrl = videoUrls[activePreviewIndex] || videoUrls[0] || '';

  // Handle Multi-Video upload from device to Supabase Storage
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const invalid = files.some((f) => !f.type.startsWith('video/'));
    if (invalid) {
      showToast('Please select valid video files (MP4, WEBM, MOV, etc.)', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgressText(`Uploading ${files.length} video(s) to Supabase Storage (product-images/videos)...`);

    try {
      if (supabaseService.isReady()) {
        const uploadedUrls = await supabaseService.uploadMultipleHeroVideos(
          files,
          (completed, total, currentName) => {
            setUploadProgressText(`Uploading (${completed}/${total}): ${currentName} to Supabase Cloud...`);
          }
        );
        if (uploadedUrls.length > 0) {
          setVideoUrls((prev) => {
            const onlyHasPlaceholder = prev.length === 1 && prev[0].includes('hero-jewelry.mp4');
            return onlyHasPlaceholder ? uploadedUrls : [...uploadedUrls, ...prev];
          });
          setMediaType('video');
          setActivePreviewIndex(0); // Immediately preview the user's uploaded video!
          showToast(`Successfully uploaded ${uploadedUrls.length} video(s) to Supabase Cloud Storage!`, 'success');
        }
      } else {
        // Fallback local memory object URLs
        const localBlobs = files.map((f) => URL.createObjectURL(f));
        setVideoUrls((prev) => [...prev, ...localBlobs]);
        setMediaType('video');
        showToast(`${files.length} video(s) loaded from device!`, 'info');
      }
    } catch (err: any) {
      showToast(`Upload failed: ${err.message || 'Please check Supabase settings'}`, 'error');
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      e.target.value = '';
    }
  };

  // Add custom URL to playlist
  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVideoUrlInput.trim()) return;
    setVideoUrls((prev) => [...prev, customVideoUrlInput.trim()]);
    setCustomVideoUrlInput('');
    setMediaType('video');
    showToast('Video URL added to playlist!', 'success');
  };

  // Remove video from playlist
  const handleRemoveVideo = (index: number) => {
    if (videoUrls.length <= 1) {
      showToast('Playlist must have at least 1 video.', 'info');
      return;
    }
    const updated = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(updated);
    if (activePreviewIndex >= updated.length) {
      setActivePreviewIndex(Math.max(0, updated.length - 1));
    }
    showToast('Video removed from playlist', 'info');
  };

  // Reorder video in playlist
  const handleMoveVideo = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= videoUrls.length) return;
    const copy = [...videoUrls];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setVideoUrls(copy);
    setActivePreviewIndex(targetIdx);
  };

  // Handle Poster / Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgressText('Uploading poster image to Supabase...');

    try {
      if (supabaseService.isReady()) {
        const publicUrl = await supabaseService.uploadImage(file);
        if (publicUrl) {
          setImageUrl(publicUrl);
          showToast('Poster image uploaded successfully!', 'success');
        }
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) setImageUrl(ev.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      showToast('Failed to upload poster image', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVideoList = videoUrls.length > 0 ? videoUrls : ['/assets/videos/hero-jewelry.mp4'];
    const updated: HeroBannerConfig = {
      mediaType,
      videoUrl: finalVideoList[0],
      videoUrls: finalVideoList,
      imageUrl: imageUrl.trim(),
      badgeText: badgeText.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      button1Text: button1Text.trim(),
      button1Category,
      button2Text: button2Text.trim(),
      button2Category
    };

    onSave(updated);
    showToast(`Hero banner saved with ${finalVideoList.length} video(s) in playlist!`, 'success');
    onClose();
  };

  const handleResetDefaults = () => {
    setMediaType(DEFAULT_HERO_CONFIG.mediaType);
    setVideoUrls(DEFAULT_HERO_CONFIG.videoUrls || ['/assets/videos/hero-jewelry.mp4']);
    setActivePreviewIndex(0);
    setImageUrl(DEFAULT_HERO_CONFIG.imageUrl);
    setBadgeText(DEFAULT_HERO_CONFIG.badgeText);
    setTitle(DEFAULT_HERO_CONFIG.title);
    setSubtitle(DEFAULT_HERO_CONFIG.subtitle);
    setButton1Text(DEFAULT_HERO_CONFIG.button1Text);
    setButton1Category(DEFAULT_HERO_CONFIG.button1Category);
    setButton2Text(DEFAULT_HERO_CONFIG.button2Text);
    setButton2Category(DEFAULT_HERO_CONFIG.button2Category);
    showToast('Reset to default luxury video showcase', 'info');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(18, 18, 18, 0.85)',
        backdropFilter: 'blur(8px)',
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
          borderRadius: '16px',
          padding: '2.25rem',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          border: '1px solid #D4AF37'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E8E3D9', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#AA820A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Video size={16} /> Showcase Media Studio
            </span>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', color: '#121212', margin: '0.2rem 0 0 0' }}>
              Homepage Multi-Video Showcase Manager
            </h2>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={22} color="#121212" />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Media Mode Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121212', display: 'block', marginBottom: '0.6rem' }}>
              Hero Showcase Display Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: mediaType === 'video' ? '2px solid #D4AF37' : '1px solid #D5CEC2',
                  backgroundColor: mediaType === 'video' ? '#FAF7F2' : '#FFFFFF',
                  color: mediaType === 'video' ? '#AA820A' : '#666',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Video size={20} />
                <span>🎬 Multi-Video Loop Playlist ({videoUrls.length} Videos)</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('image')}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: mediaType === 'image' ? '2px solid #D4AF37' : '1px solid #D5CEC2',
                  backgroundColor: mediaType === 'image' ? '#FAF7F2' : '#FFFFFF',
                  color: mediaType === 'image' ? '#AA820A' : '#666',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ImageIcon size={20} />
                <span>🖼️ High-Res Static Image</span>
              </button>
            </div>
          </div>

          {/* Video Configuration & Multi-Upload (Visible when Video is selected) */}
          {mediaType === 'video' && (
            <div style={{ backgroundColor: '#FAF7F2', padding: '1.5rem', borderRadius: '12px', border: '1px solid #D4AF37' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#121212', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Film size={18} color="#AA820A" /> Multi-Video Playlist ({videoUrls.length} Active Videos)
                </h4>

                <span style={{ fontSize: '0.72rem', backgroundColor: '#EFE8DA', color: '#886208', padding: '3px 10px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Cloud size={13} /> Cloud Auto-Sync: Supabase Storage
                </span>
              </div>

              {/* Cloud Storage Location Note */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E8E3D9', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Cloud size={20} color="#059669" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Supabase Cloud Storage Active:</strong> When you upload videos, they are stored directly in your Supabase bucket <code>product-images/videos/</code> with a permanent high-speed global CDN link.
                </span>
              </div>

              {/* Active Video Player Preview */}
              <div style={{ width: '100%', height: '220px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative', marginBottom: '1.25rem', border: '1px solid #222' }}>
                {currentPreviewUrl ? (
                  <video
                    key={currentPreviewUrl}
                    src={currentPreviewUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa', fontSize: '0.85rem' }}>
                    No video in playlist
                  </div>
                )}

                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#D4AF37', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                  ▶ Previewing Video {activePreviewIndex + 1} of {videoUrls.length}
                </div>
              </div>

              {/* Multi-Upload Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.4rem',
                    backgroundColor: '#121212',
                    color: '#D4AF37',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid #D4AF37',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <Upload size={17} />
                  <span>Upload Multiple Videos (Select 1 to 5+ Videos)</span>
                  <input
                    type="file"
                    multiple
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleVideoUpload}
                    style={{ display: 'none' }}
                    disabled={isUploading}
                  />
                </label>

                {isUploading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#AA820A', fontSize: '0.82rem', fontWeight: 600 }}>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>{uploadProgressText}</span>
                  </div>
                )}
              </div>

              {/* Playlist Cards List */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#121212', display: 'block', marginBottom: '0.6rem' }}>
                  Video Playlist Queue ({videoUrls.length} Videos will play in order on the Homepage Hero):
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                  {videoUrls.map((url, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: activePreviewIndex === idx ? '#FAF0D7' : '#FFFFFF',
                        border: activePreviewIndex === idx ? '2px solid #D4AF37' : '1px solid #E8E3D9',
                        borderRadius: '8px',
                        gap: '0.75rem'
                      }}
                    >
                      {/* Left: Video Label & Preview Trigger */}
                      <div
                        onClick={() => setActivePreviewIndex(idx)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1, minWidth: 0 }}
                      >
                        <div style={{ width: '42px', height: '32px', backgroundColor: '#121212', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Play size={14} color="#D4AF37" />
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#121212' }}>
                              Video {idx + 1}
                            </span>
                            {idx === 0 && (
                              <span style={{ fontSize: '0.65rem', backgroundColor: '#AA820A', color: '#FFF', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                                Primary / Cover
                              </span>
                            )}
                            {url.includes('supabase.co') && (
                              <span style={{ fontSize: '0.65rem', backgroundColor: '#E6F4EA', color: '#137333', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>
                                ☁️ Supabase Cloud
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#888', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {url}
                          </span>
                        </div>
                      </div>

                      {/* Right: Controls (Move up, move down, delete) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleMoveVideo(idx, 'up')}
                          disabled={idx === 0}
                          style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1, padding: '4px' }}
                          title="Move Video Up"
                        >
                          <ArrowUp size={15} color="#444" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveVideo(idx, 'down')}
                          disabled={idx === videoUrls.length - 1}
                          style={{ border: 'none', background: 'none', cursor: idx === videoUrls.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === videoUrls.length - 1 ? 0.3 : 1, padding: '4px' }}
                          title="Move Video Down"
                        >
                          <ArrowDown size={15} color="#444" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(idx)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#DC2626' }}
                          title="Remove Video from Playlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add video by direct URL */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="url"
                  value={customVideoUrlInput}
                  onChange={(e) => setCustomVideoUrlInput(e.target.value)}
                  placeholder="Or paste external video MP4 URL to append..."
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #D5CEC2', fontSize: '0.8rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #AA820A', backgroundColor: '#FAF7F2', color: '#AA820A', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Plus size={14} />
                  <span>Add URL</span>
                </button>
              </div>
            </div>
          )}

          {/* Fallback Image / Static Photo Settings */}
          <div style={{ backgroundColor: '#FAF7F2', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E8E3D9' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 0.8rem 0', color: '#121212', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={16} color="#AA820A" /> Fallback Poster Image (Mobile & Slow Networks)
            </h4>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #D5CEC2', backgroundColor: '#000', flexShrink: 0 }}>
                {imageUrl && <img src={imageUrl} alt="Poster preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Poster Image URL"
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #D5CEC2', fontSize: '0.82rem' }}
                />
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', backgroundColor: '#FFFFFF', color: '#121212', border: '1px solid #D5CEC2', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', width: 'fit-content' }}>
                  <Upload size={14} />
                  <span>Choose Image File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>

          {/* Banner Titles & Texts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#444', display: 'block', marginBottom: '0.3rem' }}>
                Gold Badge Text (Top tag)
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="2026 ROYAL HERITAGE COLLECTION"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#444', display: 'block', marginBottom: '0.3rem' }}>
                Main Luxury Headline Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Timeless Luxury, Crafted for Perfection."
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2', fontSize: '0.95rem', fontWeight: 600 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#444', display: 'block', marginBottom: '0.3rem' }}>
                Subtitle Description
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                placeholder="Explore high-end 18K gold-plated jewellery..."
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #D5CEC2', fontSize: '0.85rem', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #E8E3D9' }}>
            <button
              type="button"
              onClick={handleResetDefaults}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#888',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <RefreshCw size={14} />
              <span>Reset to Defaults</span>
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '6px',
                  border: '1px solid #D5CEC2',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-gold"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.85rem' }}
              >
                <span>Save & Publish All ({videoUrls.length} Videos) to Website</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
