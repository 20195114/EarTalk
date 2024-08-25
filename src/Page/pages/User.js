import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import '../css/User.css';
import { AuthContext } from '../../App';  

const User = () => {
  const { isAuthenticated, authToken } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");
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

  const handlePasswordReset = () => {
    navigate("/ResetPassword"); // 비밀번호 재설정 페이지로 이동
  };

  if (!userInfo) {
    return <div>로딩 중...</div>; // 사용자 정보 로딩 중
  }

  return (
    <div className="user-page-container">
      <h2>사용자 정보</h2>
      {message && <p className="user-message">{message}</p>}
      <p className="user-info"><strong>아이디 (이메일):</strong> {userInfo.email}</p>
      <p className="user-info"><strong>출생년도:</strong> {userInfo.birthyear}</p>
      <p className="user-info"><strong>성별:</strong> {userInfo.sex ? "남성" : "여성"}</p>
      <button className="user-button reset-password-button" onClick={handlePasswordReset}>비밀번호 변경</button>
    </div>
  );
};

export default User;
