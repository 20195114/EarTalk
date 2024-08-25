import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!authToken);

  useEffect(() => {
    if (authToken) {
      setIsAuthenticated(true);
      sessionStorage.setItem('authToken', authToken);
    } else {
      setIsAuthenticated(false);
      sessionStorage.removeItem('authToken');
    }
  }, [authToken]);

  const logout = () => {
    setAuthToken(null); // isAuthenticated는 useEffect에서 자동으로 false로 설정됩니다.
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, setAuthToken, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
