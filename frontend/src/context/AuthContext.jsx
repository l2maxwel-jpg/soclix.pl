import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('soclix_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - in real app this would call API
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      avatar: null,
      plan: 'pro',
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('soclix_user', JSON.stringify(mockUser));
    return { success: true };
  };

  const register = (name, email, password) => {
    // Mock registration
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      name: name,
      avatar: null,
      plan: 'starter',
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('soclix_user', JSON.stringify(mockUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('soclix_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('soclix_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
