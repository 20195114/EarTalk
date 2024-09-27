import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Default from './Page/pages/Default';
import Login from './Page/pages/Login';
import Join from './Page/pages/Join';
import Record from './Page/pages/Record';
import User from './Page/pages/User';
import Fpassword from './Page/pages/Fpassword';
import ResetPassword from './Page/pages/ResetPassword';
import Agreement from './Page/pages/Agreement';

export const AuthContext = React.createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  // 새로고침 시 세션 스토리지에서 토큰 복원
  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authToken, setAuthToken }}>
        <Routes>
          <Route path="/" element={<Default />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/record" element={<Record />} />
          <Route path="/user" element={<User />} />
          <Route path="/fpassword" element={<Fpassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/agreement" element={<Agreement />} />  {/* 소문자로 변경 */}
        </Routes>
    </AuthContext.Provider>
  );
}

export default App;
