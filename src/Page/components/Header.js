// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../App';
// import logo from '../URL/EarTalkLOGO.png';
// import { FaUserCircle } from "react-icons/fa";
// import axios from 'axios';
// import '../css/Header.css';

// const Header = () => {
//   const { isAuthenticated, setIsAuthenticated, authToken, setAuthToken } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showUserInfo, setShowUserInfo] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLoginLogout = () => {
//     if (isAuthenticated) {
//       setShowLogoutConfirm(true);
//     } else {
//       navigate('/login');
//     }
//   };

//   const confirmLogout = () => {
//     setIsAuthenticated(false);
//     setAuthToken(null);  // 토큰 삭제
//     setShowLogoutConfirm(false);
//     navigate('/');
//   };

//   const toggleUserMenu = () => {
//     if (isAuthenticated) {
//       setShowUserInfo(true);
//     } else {
//       navigate('/login');
//     }
//   };

//   const handleLogoClick = () => {
//     navigate('/');
//   };

//   const handleLoginSubmit = async () => {
//     try {
//       const response = await axios.post('/login/access-token', null, {
//         params: {
//           username,
//           password
//         },
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       });
//       setAuthToken(response.data.access_token);
//       setIsAuthenticated(true);
//       navigate('/'); // 로그인 후 홈으로 이동
//     } catch (error) {
//       console.error('Login failed', error);
//       alert('이메일 또는 비밀번호가 올바르지 않습니다.');
//     }
//   };

//   const handlePasswordReset = () => {
//     navigate('/reset-password'); // 비밀번호 재설정 페이지로 이동
//   };

//   return (
//     <header className="ear-talk-header">
//       <div className="logo-container" onClick={handleLogoClick}>
//         <img src={logo} alt="이어톡 로고" className="logo" />
//         <h1 className="logo-text">이어톡</h1>
//       </div>
//       <button className="login-button" onClick={handleLoginLogout}>
//         <FaUserCircle className="user-icon" onClick={toggleUserMenu} />
//         {isAuthenticated ? '로그아웃' : '로그인'}
//       </button>

//       {showUserInfo && (
//         <div className="user-info-modal">
//           <div className="user-info-content">
//             <button className="close-button" onClick={() => setShowUserInfo(false)}>X</button>
//             <p>아이디: eartalk@example.com</p>
//             <p>생년월일: 20000301</p>
//             <p>성별: 여자</p>
//             <button className="reset-password-button" onClick={handlePasswordReset}>비밀번호 재설정</button>
//           </div>
//         </div>
//       )}

//       {showLogoutConfirm && (
//         <div className="logout-confirm-modal">
//           <div className="logout-confirm-content">
//             <p>정말 로그아웃 하시겠습니까?</p>
//             <button className="confirm-button" onClick={confirmLogout}>확인</button>
//             <button className="cancel-button" onClick={() => setShowLogoutConfirm(false)}>취소</button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import logo from '../URL/EarTalkLOGO.png';
import { FaUserCircle } from "react-icons/fa";
import '../css/Header.css';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, authToken, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 임의의 로그인 상태 가정
  useEffect(() => {
    const fakeToken = 'fake-access-token'; // 임의의 토큰
    const fakeUser = {
      username: 'eartalk@example.com',
      birthDate: '2000-03-01',
      gender: '여자'
    };

    setAuthToken(fakeToken);
    setIsAuthenticated(true);

    // 클릭 핸들러 등록
    document.addEventListener('click', handleClickOutside);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 핸들러 제거
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setAuthToken, setIsAuthenticated]);

  const handleLoginLogout = () => {
    setShowUserMenu(!showUserMenu); // 드롭다운 메뉴 표시/숨김 토글
  };

  const handleClickOutside = (event) => {
    // 드롭다운 메뉴 외부를 클릭하면 닫히도록 설정
    if (!event.target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);  // 토큰 삭제
    setShowLogoutConfirm(false);
    setShowUserMenu(false);
    navigate('/'); // 홈 페이지로 이동
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handlePasswordReset = () => {
    setShowUserInfo(false);
    setShowUserMenu(false);
    navigate('/reset-password'); // 비밀번호 재설정 페이지로 이동
  };

  const handleUserInfoClick = () => {
    setShowUserInfo(true);
    setShowUserMenu(false);
  };

  const handleRecordListClick = () => {
    setShowUserMenu(false);
    navigate('/Record'); // 녹음 목록 페이지로 이동
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

        {showUserMenu && (
          <div className="user-menu">
            <button className="user-menu-item" onClick={handleUserInfoClick}>사용자 정보</button>
            <button className="user-menu-item" onClick={handlePasswordReset}>비밀번호 재설정</button>
            <button className="user-menu-item" onClick={handleRecordListClick}>녹음 목록</button>
          </div>
        )}
      </div>

      {showUserInfo && (
        <div className="user-info-modal">
          <div className="user-info-content">
            <button className="close-button" onClick={() => setShowUserInfo(false)}>X</button>
            <p>아이디: eartalk@example.com</p>
            <p>생년월일: 2000-03-01</p>
            <p>성별: 여자</p>
            <button className="reset-password-button" onClick={handlePasswordReset}>비밀번호 재설정</button>
          </div>
        </div>
      )}

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
