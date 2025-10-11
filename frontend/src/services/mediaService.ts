import api from '../api/axiosInstance';

export interface Media {
  _id: string;
  type: string;
  url: string;
  fileSize: number;
  userType: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaData {
  type: string;
  url: string;
  fileSize: number;
  userType: string;
  createdBy: string;
}

export const mediaService = {
  // Upload media
  uploadMedia: async (data: CreateMediaData): Promise<Media> => {
    const response = await api.post('/admin/media/upload', data);
    return response.data;
  },

  // Get media by ID
  getMediaById: async (id: string): Promise<Media> => {
    const response = await api.get(`/admin/media/${id}`);
    return response.data;
  },

  // Get all media
  getAllMedia: async (): Promise<Media[]> => {
    const response = await api.get('/admin/media/list');
    return response.data;
  },

  // Delete media
  deleteMedia: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/media/${id}`);
    return response.data;
  },
};
