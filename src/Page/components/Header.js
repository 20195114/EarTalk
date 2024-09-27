import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import logo from '../URL/EarTalkLOGO.png';
import { FaUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5"; // 메뉴 아이콘 추가
import axios from 'axios';
import '../css/Header.css';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, authToken, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    sessionStorage.removeItem('access_token'); // 토큰 삭제
    setShowLogoutConfirm(false);
    setShowUserMenu(false);
    navigate('/'); // 홈 페이지로 이동
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post('/login/access-token', new URLSearchParams({
        username,
        password,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      setAuthToken(response.data.access_token);
      sessionStorage.setItem('access_token', response.data.access_token); // 토큰 저장
      setIsAuthenticated(true);
      navigate('/'); // 로그인 후 홈으로 이동
    } catch (error) {
      console.error('Login failed', error);
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handlePasswordReset = () => {
    setShowUserMenu(false);
    navigate('/ResetPassword'); // 비밀번호 재설정 페이지로 이동
  };

  const handleRecordListClick = () => {
    setShowUserMenu(false);
    navigate('/Record'); // 녹음 목록 페이지로 이동
  };

  // 사용자 정보를 클릭하면 User 페이지로 리디렉션
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
    {!isAuthenticated? (
      <button className="login-button" onClick={handleLoginLogout}>
        <FaUserCircle className="user-icon" />
        로그인
      </button>
    ) : (
      <button className="menu-button" onClick={handleLoginLogout}>
        <IoMenu className="menu-icon" /> {/* IoMenu 아이콘 추가 */}
      </button>
    )}

    {isAuthenticated && showUserMenu && (
      <div className="user-menu">
        <button className="user-menu-item" onClick={handleUserInfoClick}>사용자 정보</button>
        <button className="user-menu-item" onClick={handlePasswordReset}>비밀번호 재설정</button>
        <button className="user-menu-item" onClick={handleRecordListClick}>녹음 목록</button>
        <button className="user-menu-item" onClick={confirmLogout}>로그아웃</button> {/* 로그아웃 버튼 추가 */}
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


