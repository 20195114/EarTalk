import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import logo from '../URL/EarTalkLOGO.png';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // 이전 오류 메시지 초기화

    try {
      const response = await fetch('/login/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: email,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('access_token', data.access_token); // sessionStorage에 저장
        setAuthToken(data.access_token);
        setIsAuthenticated(true);
        navigate('/'); // 로그인 후 메인 페이지로 이동
      } else {
        setError('로그인 실패: 잘못된 이메일 또는 비밀번호입니다.');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate('/Agreement');
  };

  const handlePasswordReset = () => {
    navigate('/fpassword'); // 비밀번호 찾기 페이지로 이동
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="이어톡 로고" onClick={handleLogoClick} className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="아이디 (email)"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type="password"
            placeholder="비밀번호"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-submit-button">로그인</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="login-options">
        <a href="#" className="forgot-password" onClick={handlePasswordReset}>비밀번호 찾기</a> | <a href="#" className="signup" onClick={handleSignupClick}>회원가입</a>
      </div>
    </div>
  );
};

export default Login;

