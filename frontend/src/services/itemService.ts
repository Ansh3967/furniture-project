import api from '../api/axiosInstance';

export interface Item {
  _id: string;
  name: string;
  description?: string;
  categoryId: string;
  furnitureStatus: 'in stock' | 'out of stock';
  saleType: 'sale' | 'rent' | 'both';
  buyPrice?: number;
  rentPrice?: number;
  depositPrice?: number;
  warranty?: string;
  mediaId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemData {
  name: string;
  description?: string;
  categoryId: string;
  furnitureStatus: 'in stock' | 'out of stock';
  saleType: 'sale' | 'rent' | 'both';
  buyPrice?: number;
  rentPrice?: number;
  depositPrice?: number;
  warranty?: string;
  mediaId?: string;
}

export interface ItemWithReviews {
  item: Item | null;
  reviews: any[];
}

export const itemService = {
  // Get all items
  getAllItems: async (): Promise<Item[]> => {
    const response = await api.get('/user/item/list');
    return response.data;
  },

  // Get item by ID with reviews
  getItemById: async (id: string): Promise<ItemWithReviews> => {
    const response = await api.post('/user/item/get', { id });
    return response.data;
  },

  // Create new item (admin only)
  createItem: async (data: CreateItemData): Promise<Item> => {
    const response = await api.post('/admin/item/add', data);
    return response.data;
  },

  // Update item (admin only)
  updateItem: async (id: string, data: Partial<CreateItemData>): Promise<Item> => {
    const response = await api.post('/admin/item/edit', { id, ...data });
    return response.data;
  },

  // Delete item (admin only)
  deleteItem: async (id: string): Promise<{ message: string }> => {
    const response = await api.post('/admin/item/remove', { id });
    return response.data;
  },
};
