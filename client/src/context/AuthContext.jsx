import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axois';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
        withCredentials: true
      });
      setIsAuthenticated(true);
      setUserType(response.data.type);
    } catch (error) {
      setIsAuthenticated(false);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userId, password) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login', 
        { userId, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      setUserType(response.data.type);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout', 
        {}, 
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUserType(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    isAuthenticated,
    userType,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};