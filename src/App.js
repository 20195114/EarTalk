import React from "react";
import { Routes, Route } from 'react-router-dom';
import Default from "./Page/pages/Default";
import Fpassword from "./Page/pages/Fpassword";
import Join from "./Page/pages/Join";
import Login from "./Page/pages/Login";
import Record from "./Page/pages/Record";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Default />} />
      <Route path="/Default" element={<Default />} />
      <Route path="/Fpassword" element={<Fpassword />} />
      <Route path="/Join" element={<Join />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Record" element={<Record />} />

    </Routes>
  );
}

export default App;
