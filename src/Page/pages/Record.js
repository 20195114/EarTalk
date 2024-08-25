import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../URL/EarTalkLOGO.png';
import '../css/Record.css';
import { AuthContext } from '../../App';

const Record = () => {
  const { isAuthenticated, setIsAuthenticated, setAuthToken } = useContext(AuthContext); // 로그인 상태 가져오기
  const [wavFiles, setWavFiles] = useState([]); // 서버에서 받아올 WAV 파일 목록
  const [visibleFiles, setVisibleFiles] = useState([]); // 화면에 표시할 WAV 파일 목록
  const [showMore, setShowMore] = useState(true); // 더보기 버튼 표시 여부
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetch("/users/me/audios", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      })
        .then((response) => {
          if (response.status === 403) {
            // 토큰이 유효하지 않으면 로그아웃 처리 및 로그인 페이지로 리다이렉트
            setIsAuthenticated(false);
            setAuthToken(null);
            sessionStorage.removeItem("access_token");
            navigate("/login");
            throw new Error('토큰이 유효하지 않음');
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.data) {
            const files = data.data.map(file => ({
              name: file.original_filepath,
              text: file.text || "텍스트가 없습니다.",
              // date: new Date(file.created_at).toLocaleDateString(), // 날짜 형식 변환 (created_at이 없으면 삭제)
              url: file.processed_filepath
            }));
            setWavFiles(files); // 서버에서 받은 파일 정보를 상태로 저장
            setVisibleFiles(files.slice(0, 8)); // 처음 8개만 표시
            setShowMore(files.length > 8); // 파일이 8개 이상일 때만 더보기 버튼 표시
          } else {
            console.error("Failed to load audio files");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setShowMore(false);
        })
        .finally(() => {
          setLoading(false); // 로딩 상태를 해제
        });
    }
  }, [isAuthenticated, navigate, setIsAuthenticated, setAuthToken]);

  const handleShowMore = () => {
    const nextFiles = wavFiles.slice(visibleFiles.length, visibleFiles.length + 8);
    setVisibleFiles(prevFiles => [...prevFiles, ...nextFiles]);

    if (visibleFiles.length + nextFiles.length >= wavFiles.length) {
      setShowMore(false); // 더 이상 표시할 파일이 없으면 버튼 숨김
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
        {loading ? (
          <p>로딩 중...</p> // 로딩 중일 때 표시
        ) : (
          <>
            {visibleFiles.length > 0 ? (
              visibleFiles.map((file, index) => (
                <div key={index} className="wav-item">
                  <p><strong>파일명:</strong> {file.name}</p>
                  <p><strong>생성된 텍스트:</strong> {file.text}</p>
                  {/* <p><strong>생성 날짜:</strong> {file.date}</p> */} {/* created_at이 없으면 주석 처리 */}
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
          </>
        )}
      </main>
    </div>
  );
};

export default Record;
