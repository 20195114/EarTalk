import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import '../css/Default.css';

const Default = () => {
  return (
    <div className="ear-talk-container">
      <header className="ear-talk-header">
        <div className="logo">이어톡</div>
        <button className="login-button">로그인</button>
      </header>
      <main className="ear-talk-main">
        <textarea
          className="text-area"
          placeholder="여기에 텍스트를 입력하거나, 아래 버튼을 눌러 녹음을 시작하세요."
        ></textarea>
        <button className="convert-button">변환하기</button>
        <div className="record-button"></div>
      </main>
    </div>
  );
};

export default Default;
