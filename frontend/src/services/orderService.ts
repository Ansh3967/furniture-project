import api from '@/api/axiosInstance';

export interface OrderItem {
  furnitureId: string;
  name: string;
  quantity: number;
  price: number;
  type: 'sell' | 'rent';
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  type: 'purchase' | 'rental';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  total: number;
  type: 'purchase' | 'rental';
  shippingAddress: string;
  paymentMethod: string;
}

class OrderService {
  // User order methods
  async createOrder(orderData: CreateOrderData): Promise<{ order: Order; message: string }> {
    const response = await api.post('/user/orders', orderData);
    return response.data;
  }

  async getUserOrders(): Promise<{ orders: Order[] }> {
    const response = await api.get('/user/orders');
    return response.data;
  }

  async getOrderById(orderId: string): Promise<{ order: Order }> {
    const response = await api.get(`/user/orders/${orderId}`);
    return response.data;
  }

  async cancelOrder(orderId: string): Promise<{ message: string }> {
    const response = await api.patch(`/user/orders/${orderId}/cancel`);
    return response.data;
  }

  // Admin order methods
  async getAllOrders(): Promise<{ orders: Order[] }> {
    const response = await api.get('/admin/orders');
    return response.data;
  }

  async getOrderByIdAdmin(orderId: string): Promise<{ order: Order }> {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<{ message: string }> {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<{ message: string }> {
    const response = await api.patch(`/admin/orders/${orderId}/payment`, { paymentStatus });
    return response.data;
  }
}

export const orderService = new OrderService();
