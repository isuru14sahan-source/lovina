import { Order } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Check backend health
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Submit Checkout Order to Database
  async submitOrder(orderPayload: any): Promise<{ success: boolean; order?: Order }> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false };
    } catch (err) {
      console.warn('API unavailable, falling back to local order simulation');
      return { success: false };
    }
  },

  // Track Parcel Order
  async trackOrder(orderOrTrackingId: string): Promise<{ success: boolean; order?: Order }> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(orderOrTrackingId)}`);
      if (res.ok) {
        return await res.json();
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    }
  },

  // Submit Product Review
  async submitReview(productId: string, review: any): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, review })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
