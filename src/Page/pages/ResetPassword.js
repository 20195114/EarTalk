import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import "../css/ResetPassword.css";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyNewPassword, setVerifyNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

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
        const data = await response.json();
        setMessage(data.message);
        setError(""); // 에러 메시지 초기화
      } else if (response.status === 400) {
        setError("현재 비밀번호가 다르거나 새 비밀번호 확인이 일치하지 않습니다.");
      } else if (response.status === 403) {
        setError("토큰이 유효하지 않습니다. 다시 로그인 해주세요.");
        navigate("/login"); // 토큰이 유효하지 않은 경우 로그인 페이지로 이동
      } else if (response.status === 422) {
        setError("새 비밀번호는 8자 이상이어야 합니다.");
      } else {
        setError("비밀번호 재설정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setError("비밀번호 재설정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="reset-password-container">
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
