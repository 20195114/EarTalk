import React, { useState, useContext } from "react";
import { AuthContext } from '../../App';  // 경로를 '../../App'으로 수정
// import '../css/User.css';

const User = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { isAuthenticated } = useContext(AuthContext);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch('/users/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          verify_new_password: confirmPassword,
        }),
      });

      if (response.ok) {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
      } else {
        setMessage("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      setMessage("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  if (!isAuthenticated) {
    return <p>비밀번호 재설정을 위해 로그인해 주세요.</p>;
  }

  return (
    <div className="user-container">
      <h2>비밀번호 재설정</h2>
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="change-password-button">비밀번호 변경</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default User;
