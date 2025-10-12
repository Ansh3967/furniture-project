import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/", // Your backend API base URL
  withCredentials: true, // set to true if using cookies/auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add user auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle user auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear user tokens and redirect if this is a user API call
      if (error.config?.url?.startsWith("/user/")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
