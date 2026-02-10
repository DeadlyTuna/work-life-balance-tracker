import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('localUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (email && password) {
      // Use email as consistent ID
      const userId = btoa(email); // Base64 encode email for consistent ID
      const localUser = { id: userId, email };
      setUser(localUser);
      localStorage.setItem('localUser', JSON.stringify(localUser));
      return { data: { user: localUser }, error: null };
    }

    throw new Error('Invalid email or password');
  };

  const signup = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (email && password) {
      const userId = btoa(email);
      const localUser = { id: userId, email };
      setUser(localUser);
      localStorage.setItem('localUser', JSON.stringify(localUser));
      return { data: { user: localUser, session: { user: localUser } }, error: null };
    }
    throw new Error('Failed to create account');
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('localUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

