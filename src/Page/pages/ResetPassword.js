import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App"; // AuthContext에서 토큰을 가져옴
import logo from "../URL/EarTalkLOGO.png"; // 로고 파일 경로
import "../css/ResetPassword.css";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyNewPassword, setVerifyNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { authToken } = useContext(AuthContext); // AuthContext로부터 토큰을 가져옴
  const navigate = useNavigate();

  // 로그인 여부 확인
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== verifyNewPassword) {
      setError("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      const response = await fetch("/users/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          verify_new_password: verifyNewPassword,
        }),
      });

      if (response.ok) {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
        setError("");
      } else if (response.status === 400) {
        setError("현재 비밀번호가 다르거나 새 비밀번호 확인이 일치하지 않습니다.");
      } else if (response.status === 403) {
        setError("토큰이 유효하지 않습니다. 다시 로그인 해주세요.");
        navigate("/login");
      } else if (response.status === 422) {
        setError("새 비밀번호는 8자 이상이어야 합니다.");
      } else {
        setError("비밀번호 재설정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setError("비밀번호 재설정 중 오류가 발생했습니다.");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="reset-password-container">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="이어톡 로고" className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </div>
      
      <h1 className="reset-password-title">비밀번호 재설정</h1>
      
      <form className="reset-password-form" onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="현재 비밀번호"
          className="reset-password-input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="새 비밀번호"
          className="reset-password-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          className="reset-password-input"
          value={verifyNewPassword}
          onChange={(e) => setVerifyNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="reset-password-button">
          비밀번호 변경
        </button>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
