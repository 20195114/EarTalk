import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../URL/EarTalkLOGO.png';
import '../css/Join.css';

const Join = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    birthyear: "", // 기본 값 빈 문자열로 설정
    gender: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://eartalk.site:17004';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // 에러 메시지 초기화
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

    if (formData.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (!formData.birthyear) {
      setError("출생년도를 선택해주세요.");
      return;
    }

    try {
      const formattedData = {
        email: formData.email,
        password: formData.password,
        verify_password: formData.confirmPassword,
        birthyear: formData.birthyear, // 출생년도 전송
        sex: formData.gender === "male",
      };

      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        if (response.status === 400) {
          setError("해당 이메일을 사용하는 사용자가 이미 존재합니다.");
        } else if (response.status === 422) {
          setError("입력값이 올바르지 않습니다.");
        } else {
          setError(`회원가입 실패: ${errorData.detail || '알 수 없는 오류가 발생했습니다.'}`);
        }
      }
    } catch (error) {
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  

  // 1900년부터 2024년까지의 년도 생성
  const renderYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const years = [];

    for (let i = currentYear; i >= startYear; i--) {
      years.push(i);
    }

    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  return (
    <div className="join-container">
      <div className="logo-container">
        <img src={logo} alt="이어톡 로고" onClick={handleLogoClick} className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      <form className="join-form" onSubmit={handleSubmit}>
      <h2 className="Join-text">회원가입</h2>
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
        <select
          name="birthyear"
          className="join-input"
          value={formData.birthyear}
          onChange={handleChange}
          required
        >
          <option value="" disabled>출생년도</option> {/* 기본 선택 옵션 */}
          {renderYearOptions()}
        </select>
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
