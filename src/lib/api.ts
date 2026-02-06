import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

interface ApiClient {
  setToken(token: string): void;
  get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T>;
}

class ApiClientImpl implements ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and token refresh
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.error('Unauthorized request:', originalRequest.url);
        }

        return Promise.reject(error);
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(endpoint, config);
    return response.data;
  }
}

// Export a singleton instance
export const api = new ApiClientImpl(import.meta.env.VITE_API_BASE_URL || '');
export default api;
