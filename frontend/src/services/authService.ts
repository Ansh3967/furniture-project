import api from '../api/axiosInstance';

// User interfaces
export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAuthResponse {
  token: string;
  user: User;
}

// Admin interfaces
export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface Admin {
  _id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuthResponse {
  token: string;
  admin: Admin;
}

export const authService = {
  // User authentication
  userLogin: async (data: UserLoginData): Promise<UserAuthResponse> => {
    try {
      console.log('🔐 User login request:', data);
      const response = await api.post('/user/auth/login', data);
      console.log('✅ User login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ User login error:', error);
      throw error;
    }
  },

  userRegister: async (data: UserRegisterData): Promise<{ message: string }> => {
    try {
      console.log('📝 User register request:', data);
      const response = await api.post('/user/auth/register', data);
      console.log('✅ User register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ User register error:', error);
      throw error;
    }
  },

  getUserProfile: async (): Promise<User> => {
    const response = await api.get('/user/auth/profile');
    return response.data;
  },

  updateUserProfile: async (data: Partial<UserRegisterData>): Promise<User> => {
    const response = await api.put('/user/auth/profile', data);
    return response.data;
  },

  // Admin authentication
  adminLogin: async (data: AdminLoginData): Promise<AdminAuthResponse> => {
    try {
      console.log('🔐 Admin login request:', data);
      const response = await api.post('/admin/auth/login', data);
      console.log('✅ Admin login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error;
    }
  },

  adminRegister: async (data: AdminRegisterData): Promise<{ message: string }> => {
    try {
      console.log('📝 Admin register request:', data);
      const response = await api.post('/admin/auth/register', data);
      console.log('✅ Admin register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Admin register error:', error);
      throw error;
    }
  },

  getAdminProfile: async (): Promise<Admin> => {
    const response = await api.get('/admin/auth/profile');
    return response.data;
  },

  updateAdminProfile: async (data: Partial<AdminRegisterData>): Promise<Admin> => {
    const response = await api.put('/admin/auth/profile', data);
    return response.data;
  },
};
