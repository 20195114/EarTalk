import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Record.css';

// 예시로 만든 로그인 상태를 관리하는 Context (실제 앱에서는 별도 AuthContext 파일로 관리)
const AuthContext = React.createContext({
  isAuthenticated: false, // 초기 로그인 상태
});

const Record = () => {
  const { isAuthenticated } = useContext(AuthContext); // 로그인 상태 가져오기
  const [wavFiles, setWavFiles] = useState([]); // 서버에서 받아올 WAV 파일 목록
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // 로그인이 안 되어 있으면 로그인 페이지로 리디렉션
      navigate("/login");
    } else {
      // 로그인이 되어 있으면 서버에서 사용자 WAV 파일 목록을 가져옴
      fetch("/users/me/audios", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data) {
            setWavFiles(data.data.map(file => file.original_filepath)); // 서버에서 받은 파일 경로를 저장
          } else {
            console.error("Failed to load audio files");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="record-container">
      <aside className="logo-container">
        <img src="your-logo-url-here" alt="이어톡 로고" className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </aside>
      <main className="wav-list">
        {wavFiles.length > 0 ? (
          wavFiles.map((file, index) => (
            <div key={index} className="wav-item">
              {file}
            </div>
          ))
        ) : (
          <p className="no-files">녹음된 파일이 없습니다.</p>
        )}
      </main>
    </div>
  );
};

export default Record;
