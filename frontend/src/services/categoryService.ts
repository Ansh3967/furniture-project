import api from '../api/axiosInstance';

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

export interface CreateCategoryData {
  name: string;
}

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/admin/category/list');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get(`/admin/category/${id}`);
    return response.data;
  },

  // Create new category (admin only)
  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post('/admin/category/add', data);
    return response.data;
  },

  // Update category (admin only)
  updateCategory: async (id: string, data: Partial<CreateCategoryData>): Promise<Category> => {
    const response = await api.post('/admin/category/edit', { id, ...data });
    return response.data;
  },

  // Delete category (admin only)
  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await api.post('/admin/category/remove', { id });
    return response.data;
  },
};
