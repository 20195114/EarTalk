import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../URL/EarTalkLOGO.png';
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
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length <= 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      const formattedData = {
        email: formData.email,
        password: formData.password,
        verify_password: formData.confirmPassword,
        birth: `${formData.birthdate.slice(0, 4)}-${formData.birthdate.slice(4, 6)}-${formData.birthdate.slice(6, 8)}T00:00:00.000Z`,
        sex: formData.gender === "male",
      };

      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
      } else if (response.status === 400) {
        setError("해당 이메일을 사용하는 사용자가 이미 존재합니다.");
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
      <div className="logo-container">
        <img src={logo} alt="이어톡 로고" onClick={handleLogoClick} className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <form className="join-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="아이디 (email)"
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
