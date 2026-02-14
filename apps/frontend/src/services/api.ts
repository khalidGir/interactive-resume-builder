import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError, logError } from '../utils/errorHandler';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    logError(error);
    return Promise.reject(handleApiError(error));
  }
);

// Response interceptor to handle responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const apiError = handleApiError(error);
    logError(apiError);

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;