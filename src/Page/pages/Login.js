import React from "react";
import '../css/Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="logo">
        <img src="your-logo-url-here" alt="이어톡" className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <form className="login-form">
        <input type="email" placeholder="아이디 (email)" className="login-input" />
        <div className="password-container">
          <input type="password" placeholder="비밀번호" className="login-input" />
          <span className="password-icon">🔒</span> {/* You can use an icon here */}
        </div>
        <button type="submit" className="login-button">로그인</button>
      </form>
      <div className="login-options">
        <a href="#" className="forgot-password">비밀번호 찾기</a> | <a href="#" className="signup">회원가입</a>
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
