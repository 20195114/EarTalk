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


import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App'; // AuthContext를 통해 로그인 상태 관리
import logo from '../URL/EarTalkLOGO.png';
import { FaUserCircle } from "react-icons/fa";
import axios from 'axios';
import '../css/Header.css';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, authToken, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 사용자가 로그인되어 있다고 가정하고 사용자 정보 임의로 설정
  const [username, setUsername] = useState('eartalk@example.com');
  const [birthDate, setBirthDate] = useState('2000-03-01');
  const [gender, setGender] = useState('여자');

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      setShowLogoutConfirm(true); // 로그아웃 확인 창 표시
    } else {
      navigate('/login'); // 로그인 페이지로 이동
    }
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);  // 토큰 삭제
    setShowLogoutConfirm(false);
    navigate('/'); // 홈 페이지로 이동
  };

  const toggleUserMenu = () => {
    if (isAuthenticated) {
      setShowUserInfo(true); // 사용자 정보 창 표시
    } else {
      navigate('/login');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handlePasswordReset = () => {
    navigate('/reset-password'); // 비밀번호 재설정 페이지로 이동
  };

  return (
    <header className="ear-talk-header">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="이어톡 로고" className="logo" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <button className="login-button" onClick={handleLoginLogout}>
        <FaUserCircle className="user-icon" onClick={toggleUserMenu} />
        {isAuthenticated ? '로그아웃' : '로그인'}
      </button>

      {showUserInfo && (
        <div className="user-info-modal">
          <div className="user-info-content">
            <button className="close-button" onClick={() => setShowUserInfo(false)}>X</button>
            <p>아이디: {username}</p>
            <p>생년월일: {birthDate}</p>
            <p>성별: {gender}</p>
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
