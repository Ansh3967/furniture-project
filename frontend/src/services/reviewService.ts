import api from '../api/axiosInstance';

export interface Review {
  _id: string;
  itemId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  itemId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  // Get reviews for an item
  getItemReviews: async (itemId: string): Promise<Review[]> => {
    const response = await api.get(`/user/review/item/${itemId}`);
    return response.data;
  },

  // Create new review
  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await api.post('/user/review/add', data);
    return response.data;
  },

  // Update review
  updateReview: async (id: string, data: Partial<CreateReviewData>): Promise<Review> => {
    const response = await api.post('/user/review/edit', { id, ...data });
    return response.data;
  },

  // Delete review
  deleteReview: async (id: string): Promise<{ message: string }> => {
    const response = await api.post('/user/review/remove', { id });
    return response.data;
  },

  // Get user's reviews
  getUserReviews: async (): Promise<Review[]> => {
    const response = await api.get('/user/review/user');
    return response.data;
  },
};
