import adminApi from "../api/adminAxiosInstance";

// Admin interfaces
export interface Admin {
  _id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  token: string;
  admin: Admin;
}

// Item interfaces
export interface Item {
  _id: string;
  name: string;
  description: string;
  category: string;
  availability: "available" | "out_of_stock" | "discontinued";
  saleType: "sale" | "rent" | "both";
  price?: number;
  rentPrice?: number;
  depositPrice: number;
  images: string[];
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

export interface ItemCreateData {
  name: string;
  description: string;
  category: string;
  availability?: "available" | "out_of_stock" | "discontinued";
  saleType: "sale" | "rent" | "both";
  price?: number;
  rentPrice?: number;
  depositPrice?: number;
  images?: string[];
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
  features?: string[];
  warranty?: string;
  condition?: "new" | "like_new" | "good" | "fair";
  tags?: string[];
  isFeatured?: boolean;
}

// User interfaces
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order interfaces
export interface Order {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    item: {
      _id: string;
      name: string;
      price?: number;
      rentPrice?: number;
      images: string[];
    };
    quantity: number;
    price: number;
    isRental: boolean;
    rentalDuration?: number;
    rentalStartDate?: string;
    rentalEndDate?: string;
  }>;
  orderType: "purchase" | "rental" | "mixed";
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled"
    | "returned";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod:
    | "credit_card"
    | "debit_card"
    | "paypal"
    | "bank_transfer"
    | "cash_on_delivery";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  trackingNumber?: string;
  deliveryDate?: string;
  returnDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const adminService = {
  // Admin authentication
  adminLogin: async (data: AdminLoginData): Promise<AdminAuthResponse> => {
    const response = await adminApi.post("/admin/auth/login", data);
    return response.data;
  },

  adminRegister: async (
    data: AdminRegisterData
  ): Promise<{ message: string }> => {
    const response = await adminApi.post("/admin/auth/register", data);
    return response.data;
  },

  getAdminProfile: async (): Promise<Admin> => {
    const response = await adminApi.get("/admin/auth/profile");
    return response.data;
  },

  updateAdminProfile: async (
    data: Partial<AdminRegisterData>
  ): Promise<Admin> => {
    const response = await adminApi.put("/admin/auth/profile", data);
    return response.data;
  },

  // Item management
  getItems: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    availability?: string;
    saleType?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await adminApi.get("/admin/items", { params });
    return response.data;
  },

  getItem: async (id: string): Promise<Item> => {
    const response = await adminApi.get(`/admin/items/${id}`);
    return response.data;
  },

  createItem: async (data: ItemCreateData | FormData) => {
    const response = await adminApi.post("/admin/items", data, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {}
    });
    return response.data;
  },

  updateItem: async (id: string, data: Partial<ItemCreateData> | FormData) => {
    const response = await adminApi.put(`/admin/items/${id}`, data, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {}
    });
    return response.data;
  },

  deleteItem: async (id: string) => {
    const response = await adminApi.delete(`/admin/items/${id}`);
    return response.data;
  },

  toggleItemFeatured: async (id: string) => {
    const response = await adminApi.patch(`/admin/items/${id}/featured`);
    return response.data;
  },

  getItemStats: async () => {
    const response = await adminApi.get("/admin/items/stats");
    return response.data;
  },

  // Order management
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    orderType?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => {
    const response = await adminApi.get("/admin/orders", { params });
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await adminApi.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string, notes?: string) => {
    const response = await adminApi.patch(`/admin/orders/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: string) => {
    const response = await adminApi.patch(`/admin/orders/${id}/payment`, {
      paymentStatus,
    });
    return response.data;
  },

  addTrackingNumber: async (id: string, trackingNumber: string) => {
    const response = await adminApi.patch(`/admin/orders/${id}/tracking`, {
      trackingNumber,
    });
    return response.data;
  },

  getOrderStats: async () => {
    const response = await adminApi.get("/admin/orders/stats/overview");
    return response.data;
  },

  getOrdersByStatus: async (
    status: string,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await adminApi.get(`/admin/orders/status/${status}`, { params });
    return response.data;
  },

  // User management
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await adminApi.get("/admin/users", { params });
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await adminApi.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await adminApi.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await adminApi.delete(`/admin/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await adminApi.patch(`/admin/users/${id}/status`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await adminApi.get("/admin/users/stats");
    return response.data;
  },
};
