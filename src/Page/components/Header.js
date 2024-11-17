import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import logo from '../URL/EarTalkLOGO.png';
import { FaUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import axios from 'axios';
import '../css/Header.css';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, authToken, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userMenuRef = useRef(null); // 드롭박스를 감지할 ref

  const handleLoginLogout = () => {
    if (!isAuthenticated) {
      navigate('/Login');
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
    setShowUserMenu(false);
  };

  const handleConfirmLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('authToken'); // 로컬 스토리지에서 토큰 삭제
    setShowLogoutConfirm(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLoginSubmit = async () => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    try {
      const response = await axios.post(`${BASE_URL}/login/access-token`, new URLSearchParams({
        username,
        password,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      setAuthToken(response.data.access_token);
      localStorage.setItem('authToken', response.data.access_token); // 로컬 스토리지에 토큰 저장
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handlePasswordReset = () => {
    setShowUserMenu(false);
    navigate('/ResetPassword');
  };

  const handleRecordListClick = () => {
    setShowUserMenu(false);
    navigate('/Record');
  };

  const handleUserInfoClick = () => {
    setShowUserMenu(false);
    navigate('/User');
  };

  // 드롭박스 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="ear-talk-header">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="이어톡 로고" className="logo" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <div className="user-menu-container" ref={userMenuRef}>
        {!isAuthenticated ? (
          <button className="login-button" onClick={handleLoginLogout}>
            <FaUserCircle className="user-icon" />
            로그인
          </button>
        ) : (
          <button className="menu-button" onClick={handleLoginLogout}>
            <IoMenu className="menu-icon" />
          </button>
        )}

        {isAuthenticated && showUserMenu && (
          <div className="user-menu">
            <button className="user-menu-item" onClick={handleUserInfoClick}>사용자 정보</button>
            <button className="user-menu-item" onClick={handlePasswordReset}>비밀번호 재설정</button>
            <button className="user-menu-item" onClick={handleRecordListClick}>녹음 목록</button>
            <button className="user-menu-item" onClick={confirmLogout}>로그아웃</button>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <div className="logout-confirm-modal">
          <div className="logout-confirm-content">
            <p>정말 로그아웃 하시겠습니까?</p>
            <div className="logout-buttons">
              <button className="confirm-button" onClick={handleConfirmLogout}>예</button>
              <button className="cancel-button" onClick={handleCancelLogout}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;