import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('@Kredix:token'));
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Try to load user data if we have a token
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          // Setting the header globally for the API instance is done inside the requests, 
          // or we can attach it here if api was an axios instance. 
          // For fetch, we'll configure api.js to read from localStorage.
          
          // Suppose the backend has a way to get the profile or we just rely on local state.
          // Since the UserController doesn't have a /me endpoint explicitly in the snippet except by ID,
          // let's try to fetch user extract just to validate the token.
          // In a real scenario we'd decode JWT or call a /me endpoint.
          // For now, let's just assume token is valid if it's there, until a request fails.
          
          const storedUser = localStorage.getItem('@Kredix:user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error('Failed to load user', error);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/user/login', { email, password });
      
      const { token: newToken, user: userData } = response;
      
      // Save to localStorage
      localStorage.setItem('@Kredix:token', newToken);
      localStorage.setItem('@Kredix:user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      
      toast.success('Welcome back!', { description: `Logged in as ${userData?.name || email}.` });
      return true;
    } catch (error) {
      toast.error('Login Failed', { description: 'Please check your credentials and try again.' });
      return false;
    }
  }, [toast]);

  const register = useCallback(async (userData) => {
    try {
      await api.post('/user', userData);
      toast.success('Account created!', { description: 'You can now log in with your credentials.' });
      return true;
    } catch (error) {
      toast.error('Registration Failed', { description: 'An error occurred while creating your account.' });
      return false;
    }
  }, [toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('@Kredix:token');
    localStorage.removeItem('@Kredix:user');
    setToken(null);
    setUser(null);
    toast.info('Logged out', { description: 'You have been successfully logged out.' });
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
