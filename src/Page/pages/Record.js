import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../URL/EarTalkLOGO.png';
import '../css/Record.css';
import { AuthContext } from '../../App';

const Record = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [wavFiles, setWavFiles] = useState([]);
  const [visibleFiles, setVisibleFiles] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetch("/users/me/audios", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      })
        .then((response) => {
          if (response.status === 403) {
            navigate('/Login');
            throw new Error('토큰이 유효하지 않음');
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.data) {
            const files = data.data.map(file => ({
              name: file.original_filepath,
              text: file.text || "텍스트가 없습니다.",
              date: new Date(file.created_at).toLocaleDateString(),
              url: file.processed_filepath
            }));
            setWavFiles(files);
            setVisibleFiles(files.slice(0, 8));
          } else {
            console.error("Failed to load audio files");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [isAuthenticated, navigate]);

  const handleShowMore = () => {
    const nextFiles = wavFiles.slice(visibleFiles.length, visibleFiles.length + 8);
    setVisibleFiles(prevFiles => [...prevFiles, ...nextFiles]);

    if (visibleFiles.length + nextFiles.length >= wavFiles.length) {
      setShowMore(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="record-container">
      <aside className="R-logo-container">
        <img src={logo} alt="이어톡 로고" onClick={handleLogoClick} className="R-logo-image" />
        <h1 className="R-logo-text">이어톡</h1>
      </aside>
      <main className="wav-list">
        {visibleFiles.length > 0 ? (
          visibleFiles.map((file, index) => (
            <div key={index} className="wav-item">
              <p><strong>파일명:</strong> {file.name}</p>
              <p><strong>생성된 텍스트:</strong> {file.text}</p>
              <p><strong>생성 날짜:</strong> {file.date}</p>
              <audio controls src={file.url}>Your browser does not support the audio element.</audio>
            </div>
          ))
        ) : (
          <p className="no-files">녹음된 파일이 없습니다.</p>
        )}
        {showMore && visibleFiles.length < wavFiles.length && (
          <button className="show-more-button" onClick={handleShowMore}>
            더보기
          </button>
        )}
      </main>
    </div>
  );
};

export default Record;
