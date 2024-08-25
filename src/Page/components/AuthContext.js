import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      sessionStorage.setItem('authToken', authToken);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }, [authToken]);

  const logout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    sessionStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, setAuthToken, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
