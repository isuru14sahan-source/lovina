import React, { useState } from 'react';
import { Star, X, CheckCircle2, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useToast } from '../../context/ToastContext';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddReview: (productId: string, newReview: { name: string; rating: number; comment: string; date: string }) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddReview
}) => {
  const { showToast } = useToast();
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) {
      showToast('Please provide your name and review details', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    onAddReview(product.id, {
      name: reviewerName.trim(),
      rating,
      comment: comment.trim(),
      date: today
    });

    showToast('Thank you! Your verified review has been published.', 'success');
    setReviewerName('');
    setComment('');
    setRating(5);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3500,
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
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
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '1px solid #D4AF37'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E3D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#AA820A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Verified Buyer Review
            </span>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', margin: '0.1rem 0 0 0', color: '#121212' }}>
              Review: {product.name}
            </h3>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={20} color="#121212" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Star Rating Picker */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#121212', display: 'block', marginBottom: '0.5rem' }}>
              Overall Rating *
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Star
                    size={28}
                    fill={(hoverRating || rating) >= star ? '#D4AF37' : 'none'}
                    color={(hoverRating || rating) >= star ? '#D4AF37' : '#D5CEC2'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem', color: '#121212' }}>
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dilhani Wickramasinghe"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #D5CEC2', outline: 'none' }}
            />
          </div>

          {/* Comment Input */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem', color: '#121212' }}>
              Detailed Experience & Feedback *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the 18K gold luster, packaging, delivery speed, or craftsmanship..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #D5CEC2', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#2B7A4B' }}>
            <CheckCircle2 size={14} color="#2B7A4B" />
            <span>Verified Lovina Client Review</span>
          </div>

          <button type="submit" className="btn-gold" style={{ padding: '0.9rem', width: '100%', marginTop: '0.5rem' }}>
            <Sparkles size={16} />
            <span>Publish Review</span>
          </button>
        </form>
      </div>
    </div>
  );
};
