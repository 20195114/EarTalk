import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import '../css/User.css';
import { AuthContext } from '../../App';  
import logo from '../URL/EarTalkLOGO.png';

const User = () => {
  const { isAuthenticated, authToken } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 알림창 표시 여부
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
    } else {
      // 유저 정보를 가져오는 API 호출
      fetch('/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })
        .then(response => {
          if (response.status === 403) {
            navigate("/login"); // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
            throw new Error("토큰이 유효하지 않음");
          }
          return response.json();
        })
        .then(data => {
          setUserInfo(data); // 사용자 정보 설정
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          setMessage("사용자 정보를 불러오는 데 실패했습니다.");
        });
    }
  }, [isAuthenticated, authToken, navigate]);
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const handlePasswordReset = () => {
    navigate("/ResetPassword"); // 비밀번호 재설정 페이지로 이동
  };

  const handleDeleteAccount = () => {
    // 탈퇴 API 호출
    fetch('/users/me', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then(response => {
        if (response.status === 200) {
          alert("성공적으로 탈퇴가 완료되었습니다.");
          navigate("/"); // 탈퇴 성공 시 메인 페이지로 이동
        } else if (response.status === 403) {
          setMessage("토큰이 유효하지 않습니다. 다시 로그인해주세요.");
          navigate("/login"); // 토큰 유효하지 않으면 로그인 페이지로 이동
        } else {
          throw new Error("탈퇴 요청 실패");
        }
      })
      .catch(error => {
        console.error("Error deleting account:", error);
        setMessage("탈퇴 중 문제가 발생했습니다.");
      });
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(true); // 탈퇴 알림창 표시
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false); // 탈퇴 알림창 숨김
  };

  if (!userInfo) {
    return <div>로딩 중...</div>; // 사용자 정보 로딩 중
  }

  return (
    <div className="User">
      <div className="logo-container">
        <img src={logo} alt="이어톡 로고" onClick={handleLogoClick} className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <div className="user-page-container">
        <h2>사용자 정보</h2>
        {message && <p className="user-message">{message}</p>}
        <p className="user-info"><strong>아이디 (이메일):</strong> {userInfo.email}</p>
        <p className="user-info"><strong>출생년도:</strong> {userInfo.birthyear}</p>
        <p className="user-info"><strong>성별:</strong> {userInfo.sex === null ? "비공개" : userInfo.sex ? "남성" : "여성"}</p>
        <button className="user-button reset-password-button" onClick={handlePasswordReset}>비밀번호 변경</button>
        <button className="user-button delete-account-button" onClick={handleConfirmDelete}>회원 탈퇴</button>
      </div>

      {/* 탈퇴 확인 알림창 */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-box">
            <p>정말 탈퇴하시겠습니까?</p>
            <div className="delete-confirm-buttons">
              <button className="confirm-button" onClick={handleDeleteAccount}>예</button>
              <button className="cancel-button" onClick={handleCancelDelete}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;

