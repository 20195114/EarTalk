import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Default from './Page/pages/Default';
import Login from './Page/pages/Login';
import Join from './Page/pages/Join';
import Record from './Page/pages/Record';
import User from './Page/pages/User';
import Fpassword from './Page/pages/Fpassword';

export const AuthContext = React.createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Routes>
          <Route path="/" element={<Default />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/record" element={<Record />} />
          <Route path="/user" element={<User />} />
          <Route path="/Fpassword" element={<Fpassword />} />
        </Routes>
    </AuthContext.Provider>
  );
}

export default App;
