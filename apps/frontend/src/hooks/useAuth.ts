import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Custom hook for authentication state and actions
export const useAuthentication = () => {
  const { user, token, isAuthenticated, isLoading, login, register, logout, refreshToken } = useAuth();
  const navigate = useNavigate();

  // Check if token is expired and refresh if needed
  const checkAuthStatus = async () => {
    if (token) {
      // In a real implementation, you'd decode the JWT to check expiration
      // For now, we'll assume the token is valid if it exists
      return true;
    }
    return false;
  };

  // Logout with navigation
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Login with redirect
  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      throw error;
    }
  };

  // Register with redirect
  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await register({ name, email, password });
      navigate('/dashboard'); // Redirect to dashboard after registration
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken,
    checkAuthStatus
  };
};