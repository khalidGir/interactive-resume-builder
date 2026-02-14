// Utility functions for authentication

// Store access token
export const setAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

// Get access token
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Remove access token
export const removeAccessToken = (): void => {
  localStorage.removeItem('accessToken');
};

// Decode JWT token to get user info
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Get user ID from token
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = decodeToken(token);
    return decoded?.sub || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};