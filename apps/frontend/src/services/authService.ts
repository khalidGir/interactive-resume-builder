import apiClient from './api';
import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserProfileUpdate,
  SignUpData
} from '../types';

// Mock user data for demonstration
const MOCK_USERS: Record<string, AuthUser> = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    bio: 'This is a demo user for testing purposes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// Mock authentication service with fallback to mock data
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Try the real API first
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // If API fails, use mock data
      console.log('Using mock login for demo purposes');

      if (MOCK_USERS[credentials.email]) {
        const user = MOCK_USERS[credentials.email];
        return {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          user: user
        };
      } else {
        // Allow any email/password combination for demo
        const newUser: AuthUser = {
          id: String(Date.now()),
          email: credentials.email,
          name: credentials.email.split('@')[0],
          bio: 'New demo user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        MOCK_USERS[credentials.email] = newUser;

        return {
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          user: newUser
        };
      }
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Try the real API first
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      // If API fails, use mock data
      console.log('Using mock registration for demo purposes');

      // Create a mock user
      const newUser: AuthUser = {
        id: String(Object.keys(MOCK_USERS).length + 1),
        email: userData.email,
        name: userData.name,
        bio: 'New demo user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      MOCK_USERS[userData.email] = newUser;

      return {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: newUser
      };
    }
  },

  async signup(userData: SignUpData): Promise<AuthResponse> {
    // For compatibility with older implementations
    const registerData: RegisterData = {
      name: userData.email.split('@')[0], // Use email prefix as name if not provided
      email: userData.email,
      password: userData.password
    };

    try {
      // Try the real API first
      const response = await apiClient.post<AuthResponse>('/auth/register', registerData);
      return response.data;
    } catch (error) {
      // If API fails, use mock data
      console.log('Using mock registration for demo purposes');

      // Create a mock user
      const newUser: AuthUser = {
        id: String(Object.keys(MOCK_USERS).length + 1),
        email: registerData.email,
        name: registerData.name,
        bio: 'New demo user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      MOCK_USERS[registerData.email] = newUser;

      return {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: newUser
      };
    }
  },

  async refreshToken(refreshTokenData: { refreshToken: string }): Promise<{ accessToken: string }> {
    try {
      // Try the real API first
      const response = await apiClient.post('/auth/refresh', refreshTokenData);
      return response.data;
    } catch (error) {
      // For mock, just return a new token
      console.log('Using mock token refresh for demo purposes');
      return {
        accessToken: 'mock-access-token-' + Date.now()
      };
    }
  },

  async updateProfile(profileData: UserProfileUpdate, token: string) {
    try {
      // Try the real API first
      const response = await apiClient.put('/auth/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      // If API fails, update mock user
      console.log('Using mock profile update for demo purposes');

      // Find user by email in mock data
      for (const email in MOCK_USERS) {
        if (MOCK_USERS[email].email === profileData.email) {
          MOCK_USERS[email] = {
            ...MOCK_USERS[email],
            name: profileData.name,
            bio: profileData.bio
          };
          return MOCK_USERS[email];
        }
      }

      throw new Error('User not found');
    }
  },

  async logout(): Promise<void> {
    // Remove token from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<AuthUser> {
    try {
      // Try the real API first
      const response = await apiClient.get<AuthUser>('/auth/me');
      return response.data;
    } catch (error) {
      // If API fails, return mock user if available
      const userEmail = localStorage.getItem('demoUserEmail');
      if (userEmail && MOCK_USERS[userEmail]) {
        return MOCK_USERS[userEmail];
      }
      throw new Error('No user session found');
    }
  },

  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }
};