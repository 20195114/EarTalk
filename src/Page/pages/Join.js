import React from "react";
import '../css/Join.css';

const Join = () => {
  return (
    <div className="join-container">
      <div className="logo">
        <img src="your-logo-url-here" alt="이어톡" className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <form className="join-form">
        <input type="email" placeholder="아이디 (email)" className="join-input" />
        <input type="password" placeholder="비밀번호" className="join-input" />
        <input type="password" placeholder="비밀번호 확인" className="join-input" />
        <input type="text" placeholder="생년월일(YYYYMMDD)" className="join-input" />
        <select className="join-input">
          <option value="" disabled selected>성별</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        <button type="submit" className="join-button">회원가입</button>
      </form>
    </div>
  );
};

export default Join;
