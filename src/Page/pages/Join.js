import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/Join.css';

const Join = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
      } else {
        const errorData = await response.json();
        setError(`회원가입 실패: ${errorData.detail}`);
      }
    } catch (error) {
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="join-container">
      <div className="logo">
        <img src="your-logo-url-here" alt="이어톡" className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <form className="join-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          className="join-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          className="join-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          className="join-input"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="birthdate"
          placeholder="생년월일(YYYYMMDD)"
          className="join-input"
          value={formData.birthdate}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          className="join-input"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="" disabled>성별</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        <button type="submit" className="join-button">회원가입</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Join;
