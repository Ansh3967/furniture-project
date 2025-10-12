import api from "../api/axiosInstance";
import adminApi from "../api/adminAxiosInstance";

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

export interface CreateCategoryData {
  name: string;
}

export const categoryService = {
  // User category service (public access)
  getAllCategories: async (): Promise<{
    categories: Category[];
    total: number;
  }> => {
    const response = await api.get("/user/category");
    return response.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get(`/user/category/${id}`);
    return response.data;
  },

  // Admin category service (protected access)
  adminGetAllCategories: async (): Promise<{
    categories: Category[];
    total: number;
  }> => {
    const response = await adminApi.get("/admin/categories");
    return response.data;
  },

  adminGetCategoryById: async (id: string): Promise<Category> => {
    const response = await adminApi.get(`/admin/categories/${id}`);
    return response.data;
  },

  adminCreateCategory: async (
    data: CreateCategoryData
  ): Promise<{ message: string; category: Category }> => {
    const response = await adminApi.post("/admin/categories", data);
    return response.data;
  },

  adminUpdateCategory: async (
    id: string,
    data: Partial<CreateCategoryData>
  ): Promise<{ message: string; category: Category }> => {
    const response = await adminApi.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  adminDeleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await adminApi.delete(`/admin/categories/${id}`);
    return response.data;
  },
};
