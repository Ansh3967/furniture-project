import api from "../api/axiosInstance";

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
  address?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
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
      console.log("🔐 User login request:", data);
      const response = await api.post("/user/auth/login", data);
      console.log("✅ User login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ User login error:", error);
      throw error;
    }
  },

  userRegister: async (
    data: UserRegisterData
  ): Promise<{ message: string }> => {
    try {
      console.log("📝 User register request:", data);
      const response = await api.post("/user/auth/register", data);
      console.log("✅ User register response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ User register error:", error);
      throw error;
    }
  },

  getUserProfile: async (): Promise<User> => {
    const response = await api.get("/user/auth/profile");
    return response.data;
  },

  updateUserProfile: async (data: Partial<UserRegisterData>): Promise<User> => {
    const response = await api.put("/user/auth/profile", data);
    return response.data.user;
  },

  // Admin authentication - these will be handled by adminService
  adminLogin: async (data: AdminLoginData): Promise<AdminAuthResponse> => {
    // This method is kept for backward compatibility but should use adminService
    const { adminService } = await import("./adminService");
    return adminService.adminLogin(data);
  },

  adminRegister: async (
    data: AdminRegisterData
  ): Promise<{ message: string }> => {
    // This method is kept for backward compatibility but should use adminService
    const { adminService } = await import("./adminService");
    return adminService.adminRegister(data);
  },

  getAdminProfile: async (): Promise<Admin> => {
    // This method is kept for backward compatibility but should use adminService
    const { adminService } = await import("./adminService");
    return adminService.getAdminProfile();
  },

  updateAdminProfile: async (
    data: Partial<AdminRegisterData>
  ): Promise<Admin> => {
    // This method is kept for backward compatibility but should use adminService
    const { adminService } = await import("./adminService");
    return adminService.updateAdminProfile(data);
  },
};
