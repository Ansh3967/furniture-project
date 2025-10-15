import api from "../api/axiosInstance";
import adminApi from "../api/adminAxiosInstance";

export interface Category {
  _id: string;
  name: string;
  isActive?: boolean;
  itemCount?: number;
  createdAt: string;
}

export interface CategoryCreateData {
  name: string;
}

export const categoryService = {
  // User-facing category methods
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/user/category");
    return response.data.categories;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await api.get(`/user/category/${id}`);
    return response.data;
  },

  // Admin category management methods
  adminGetAllCategories: async (): Promise<{
    categories: Category[];
    total: number;
  }> => {
    const response = await adminApi.get("/admin/categories");
    return response.data;
  },

  adminGetCategory: async (id: string): Promise<Category> => {
    const response = await adminApi.get(`/admin/categories/${id}`);
    return response.data;
  },

  adminCreateCategory: async (
    data: CategoryCreateData
  ): Promise<{ message: string; category: Category }> => {
    const response = await adminApi.post("/admin/categories", data);
    return response.data;
  },

  adminUpdateCategory: async (
    id: string,
    data: CategoryCreateData
  ): Promise<{ message: string; category: Category }> => {
    const response = await adminApi.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  adminDeleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await adminApi.delete(`/admin/categories/${id}`);
    return response.data;
  },
};
