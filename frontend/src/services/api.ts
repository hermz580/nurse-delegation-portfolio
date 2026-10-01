import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Token keys
const TOKEN_KEY = 'nurse-delegation-network_token';
const REFRESH_TOKEN_KEY = 'nurse-delegation-network_refresh_token';

class ApiService {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 (Unauthorized) updates
        if (error.response?.status === 401 && !originalRequest._retry) {
          // If we're already refreshing, wait for it to complete
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh endpoint
            // Note: We use axios directly here to avoid infinite loops
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

            // Update stored tokens
            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

            // Notify subscribers
            this.onRefreshed(accessToken);

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed - log out
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('nurse-delegation-network_user');
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();

// Auth API types
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

// Auth API
export const authApi = {
  login: (data: any) => apiService.post<LoginResponse>('/auth/login', data),
  register: (data: any) => apiService.post<LoginResponse>('/auth/register', data),
  logout: () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      // Try to notify backend, but don't block
      apiService.post('/auth/logout', { refreshToken }).catch(console.error);
    }
    // Always clear local state
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('nurse-delegation-network_user');
  },
  forgotPassword: (email: string) => apiService.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => apiService.post('/auth/reset-password', data),
};

// User API
export const userApi = {
  getCurrentUser: () => apiService.get('/auth/me'),
  updateProfile: (data: any) => apiService.put('/users/me', data),
  changePassword: (data: any) => apiService.put('/users/me/password', data),
};

// Providers API
export const providerApi = {
  getAll: (params?: any) => apiService.get('/providers', { params }),
  getById: (id: string) => apiService.get(`/providers/${id}`),
  getByCounty: (county: string) => apiService.get(`/providers/county/${county}`),
};

// News API
export const newsApi = {
  getAll: () => apiService.get('/news'),
};
