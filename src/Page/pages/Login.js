import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';  // 경로를 '../../App'으로 수정
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
        localStorage.setItem('access_token', data.access_token);
        setIsAuthenticated(true);
        navigate('/'); // 로그인 후 메인 페이지로 이동
      } else {
        setError('로그인 실패: 잘못된 이메일 또는 비밀번호입니다.');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleSignupClick = () => {
    navigate('/join');
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src="your-logo-url-here" alt="이어톡" className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
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
          <span className="password-icon">🔒</span>
        </div>
        <button type="submit" className="login-button">로그인</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="login-options">
        <a href="/reset-password" className="forgot-password">비밀번호 찾기</a> | <a href="#" className="signup" onClick={handleSignupClick}>회원가입</a>
      </div>
      <div className="social-login">
        <button className="social-button google">Continue with Google</button>
        <button className="social-button naver">Log in with Naver</button>
        <button className="social-button kakao">Login with Kakao</button>
      </div>
    </div>
  );
};

export default Login;
