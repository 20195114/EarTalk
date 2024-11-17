import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken); // 로컬 스토리지에 토큰 저장
    } else {
      localStorage.removeItem('authToken'); // 토큰이 없으면 로컬 스토리지에서 삭제
    }
  }, [authToken]);

  const logout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('authToken'); // 로그아웃 시 로컬 스토리지에서 토큰 삭제
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, setAuthToken, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;