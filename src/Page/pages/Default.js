import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';  // 경로를 '../../App'으로 수정
import '../css/Default.css';

const Default = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleUserClick = () => {
    navigate('/user');
  };

  const handleRecordClick = () => {
    navigate('/record');
  };

  return (
    <div className="ear-talk-container">
      <header className="ear-talk-header">
        <div className="logo">이어톡</div>
        {isAuthenticated ? (
          <div className="user-menu">
            <button className="user-icon" onClick={toggleMenu}>
              <img src="/images/user-icon.png" alt="사용자 아이콘" /> {/* 실제 이미지 경로로 교체 */}
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <div onClick={handleUserClick}>비밀번호 재설정</div>
                <div onClick={handleRecordClick}>녹음 목록</div>
                <div onClick={handleLogoutClick}>로그아웃</div>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={handleLoginClick}>로그인</button>
        )}
      </header>
      <main className="ear-talk-main">
        <textarea
          className="text-area"
          placeholder="여기에 텍스트를 입력하거나, 아래 버튼을 눌러 녹음을 시작하세요."
        ></textarea>
        <button className="convert-button">변환하기</button>
        <div className="record-button"></div>
      </main>
    </div>
  );
};

export default Default;
