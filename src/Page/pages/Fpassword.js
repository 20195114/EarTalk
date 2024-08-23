import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../URL/EarTalkLOGO.png';
import '../css/Fpassword.css';

const Fpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = (e) => {
    e.preventDefault();

    // 비밀번호 재설정 API 호출 (예시)
    fetch('/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setMessage("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
          setError(""); // 에러 메시지 초기화
        } else {
          setError("이메일 전송에 실패했습니다. 이메일 주소를 확인하세요.");
          setMessage(""); // 성공 메시지 초기화
        }
      })
      .catch(error => {
        setError("오류가 발생했습니다. 다시 시도해주세요.");
        setMessage(""); // 성공 메시지 초기화
      });
  };

  return (
    <div className="fpassword-container">
      <div className="logo-container">
        <img src={logo} alt="이어톡 로고" className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
    
      <form className="fpassword-form" onSubmit={handlePasswordReset}>
        <input
          type="email"
          placeholder="이메일"
          className="fpassword-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="fpassword-button">비밀번호 재설정 링크 보내기</button>
      </form>
      {message && <p className="fpassword-message success">{message}</p>}
      {error && <p className="fpassword-message error">{error}</p>}
      <div className="fpassword-options">
        <a href="/login" className="login-link">로그인으로 돌아가기</a>
      </div>
    </div>
  );
};

export default Fpassword;
