import api from "../api/axiosInstance";

// Item interfaces
export interface Item {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
    description?: string;
  };
  availability: "available" | "out_of_stock" | "discontinued";
  saleType: "sale" | "rent" | "both";
  price?: number;
  rentPrice?: number;
  depositPrice: number;
  images: Array<{
    _id: string;
    url: string;
    altText?: string;
  }>;
  specifications?: {
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      unit?: string;
    };
    weight?: {
      value?: number;
      unit?: string;
    };
    material?: string;
    color?: string;
    brand?: string;
  };
  features: string[];
  warranty?: string;
  condition: "new" | "like_new" | "good" | "fair";
  tags: string[];
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFilters {
  page?: number;
  limit?: number;
  category?: string;
  availability?: string;
  saleType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  isFeatured?: boolean;
}

export interface ItemResponse {
  items: Item[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const itemService = {
  // Get all items with filtering and pagination
  getItems: async (filters?: ItemFilters): Promise<ItemResponse> => {
    try {
      const response = await api.get("/user/items", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  },

  // Get single item by ID
  getItem: async (id: string): Promise<Item> => {
    try {
      const response = await api.get(`/user/items/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching item:", error);
      throw error;
    }
  },

  // Get featured items
  getFeaturedItems: async (limit: number = 8): Promise<Item[]> => {
    try {
      const response = await api.get("/user/items", {
        params: { isFeatured: true, limit },
      });
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching featured items:", error);
      throw error;
    }
  },

  // Get items by category
  getItemsByCategory: async (
    categoryId: string,
    filters?: ItemFilters
  ): Promise<ItemResponse> => {
    try {
      const response = await api.get("/user/items", {
        params: { category: categoryId, ...filters },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching items by category:", error);
      throw error;
    }
  },

  // Search items
  searchItems: async (
    query: string,
    filters?: ItemFilters
  ): Promise<ItemResponse> => {
    try {
      const response = await api.get("/user/items", {
        params: { search: query, ...filters },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching items:", error);
      throw error;
    }
  },

  // Get related items (same category, excluding current item)
  getRelatedItems: async (
    itemId: string,
    categoryId: string,
    limit: number = 4
  ): Promise<Item[]> => {
    try {
      const response = await api.get("/user/items", {
        params: {
          category: categoryId,
          limit,
          exclude: itemId,
        },
      });
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching related items:", error);
      throw error;
    }
  },
};
