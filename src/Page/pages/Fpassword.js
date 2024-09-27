import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../URL/EarTalkLOGO.png';
import '../css/Fpassword.css';

const Fpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/reset-password/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setError(""); // 에러 메시지 초기화
      } else if (response.status === 400) {
        setError("해당 이메일을 사용하는 사용자가 없습니다.");
        setMessage(""); // 성공 메시지 초기화
      } else {
        setError("비밀번호 재설정 요청 중 오류가 발생했습니다.");
        setMessage(""); // 성공 메시지 초기화
      }
    } catch (error) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
      setMessage(""); // 성공 메시지 초기화
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="fpassword-container">
      <div className="logo-container">
        <img src={logo} alt="이어톡 로고" onClick={handleLogoClick} className="logo-image" />
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
        <button type="submit" className="fpassword-button"> 임시 비밀번호 발급받기</button>
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
