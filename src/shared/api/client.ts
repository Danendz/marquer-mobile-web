import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toastController } from '@ionic/vue';
import { refreshTokenApi } from '@/features/auth/api/auth.api';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MARQUER_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

const authClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

interface InterceptorCallbacks {
  getToken: () => string | null;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
}

function setupInterceptors({ getToken, setToken, logout }: InterceptorCallbacks): void {
  // Inject Bearer token on API requests
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Inject Bearer token on auth requests (for /me, /refresh, /logout)
  authClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle 401 on apiClient — refresh token and retry
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await refreshTokenApi();
          const newToken = response.data.token;
          await setToken(newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  // Default error toast for both clients
  const showErrorToast = async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    // Don't toast on 401 (handled by refresh)
    if (error.response?.status === 401) {
      return Promise.reject(error);
    }

    let message: string;
    if (error.code === 'ECONNABORTED') {
      message = 'Timeout. Try again.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      message = 'No internet connection.';
    } else {
      message = error.response.data?.message || 'Something went wrong';
    }

    const toast = await toastController.create({
      message,
      color: 'danger',
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
    return Promise.reject(error);
  };

  apiClient.interceptors.response.use((r) => r, showErrorToast);
  authClient.interceptors.response.use((r) => r, showErrorToast);
}

export { apiClient, authClient, setupInterceptors };
