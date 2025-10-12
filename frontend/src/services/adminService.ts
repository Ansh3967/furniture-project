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
    try {
      console.log("🔐 Admin login request:", data);
      const response = await adminApi.post("/admin/auth/login", data);
      console.log("✅ Admin login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Admin login error:", error);
      throw error;
    }
  },

  adminRegister: async (
    data: AdminRegisterData
  ): Promise<{ message: string }> => {
    try {
      console.log("📝 Admin register request:", data);
      const response = await adminApi.post("/admin/auth/register", data);
      console.log("✅ Admin register response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Admin register error:", error);
      throw error;
    }
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
    const response = await adminApi.get("/items", { params });
    return response.data;
  },

  getItem: async (id: string): Promise<Item> => {
    const response = await adminApi.get(`/items/${id}`);
    return response.data;
  },

  createItem: async (data: ItemCreateData) => {
    const response = await adminApi.post("/items", data);
    return response.data;
  },

  updateItem: async (id: string, data: Partial<ItemCreateData>) => {
    const response = await adminApi.put(`/items/${id}`, data);
    return response.data;
  },

  deleteItem: async (id: string) => {
    const response = await adminApi.delete(`/items/${id}`);
    return response.data;
  },

  toggleItemFeatured: async (id: string) => {
    const response = await adminApi.patch(`/items/${id}/featured`);
    return response.data;
  },

  getItemStats: async () => {
    const response = await adminApi.get("/items/stats");
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
    const response = await adminApi.get("/orders", { params });
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await adminApi.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string, notes?: string) => {
    const response = await adminApi.patch(`/orders/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: string) => {
    const response = await adminApi.patch(`/orders/${id}/payment`, {
      paymentStatus,
    });
    return response.data;
  },

  addTrackingNumber: async (id: string, trackingNumber: string) => {
    const response = await adminApi.patch(`/orders/${id}/tracking`, {
      trackingNumber,
    });
    return response.data;
  },

  getOrderStats: async () => {
    const response = await adminApi.get("/orders/stats/overview");
    return response.data;
  },

  getOrdersByStatus: async (
    status: string,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await adminApi.get(`/orders/status/${status}`, { params });
    return response.data;
  },
};
