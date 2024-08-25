import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import logo from '../URL/EarTalkLOGO.png';
import { FaUserCircle } from "react-icons/fa";
import axios from 'axios';
import '../css/Header.css';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, authToken, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLoginLogout = () => {
    if (!isAuthenticated) {
      navigate('/Login'); // 로그인 페이지로 이동
    } else {
      setShowUserMenu(!showUserMenu); // 드롭다운 메뉴 표시/숨김 토글
    }
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    sessionStorage.removeItem('authToken'); // 토큰 삭제
    setShowLogoutConfirm(false);
    setShowUserMenu(false);
    navigate('/'); // 홈 페이지로 이동
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handlePasswordReset = () => {
    setShowUserMenu(false);
    navigate('/ResetPassword'); // 비밀번호 재설정 페이지로 이동
  };

  const handleRecordListClick = () => {
    setShowUserMenu(false);
    navigate('/Record'); // 녹음 목록 페이지로 이동
  };

  const handleUserInfoClick = () => {
    setShowUserMenu(false);
    navigate('/User'); // User 페이지로 이동
  };

  return (
    <header className="ear-talk-header">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="이어톡 로고" className="logo" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <div className="user-menu-container">
        <button className="login-button" onClick={handleLoginLogout}>
          <FaUserCircle className="user-icon" />
          {isAuthenticated ? '로그아웃' : '로그인'}
        </button>

        {isAuthenticated && showUserMenu && (
          <div className="user-menu">
            <button className="user-menu-item" onClick={handleUserInfoClick}>사용자 정보</button>
            <button className="user-menu-item" onClick={handlePasswordReset}>비밀번호 재설정</button>
            <button className="user-menu-item" onClick={handleRecordListClick}>녹음 목록</button>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <div className="logout-confirm-modal">
          <div className="logout-confirm-content">
            <p>정말 로그아웃 하시겠습니까?</p>
            <button className="confirm-button" onClick={confirmLogout}>확인</button>
            <button className="cancel-button" onClick={() => setShowLogoutConfirm(false)}>취소</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;