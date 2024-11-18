import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../URL/EarTalkLOGO.png";
import "../css/Record.css";
import { AuthContext } from "../../App";

const Record = () => {
  const { isAuthenticated, authToken } = useContext(AuthContext); // authToken 가져오기
  const [wavFiles, setWavFiles] = useState([]); // 모든 파일
  const [visibleFiles, setVisibleFiles] = useState([]); // 표시할 파일
  const [showMore, setShowMore] = useState(true); // 더보기 버튼 표시 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지
  const navigate = useNavigate();
  const currentAudioRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://eartalk.site:17004";

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("사용자가 인증되지 않았습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }

    const fetchAudioFiles = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      const token = authToken || localStorage.getItem("authToken");
      console.log("API 요청에 사용될 토큰:", token);

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me/audios`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        console.log("서버 응답 상태 코드:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.error("토큰이 유효하지 않음. 로그인 페이지로 이동합니다.");
            navigate("/login");
          }
          throw new Error(`서버 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        console.log("서버에서 받은 데이터:", data);

        if (data && data.data) {
          const files = await Promise.all(
            data.data.map(async (file) => {
              // identifier로 추가 API 호출
              const fileDetails = await fetchFileDetails(file.identifier, token);
              return {
                name: fileDetails?.name || file.original_filepath.split('/').pop(),
                text: fileDetails?.text || file.text || "텍스트가 없습니다.",
                date: fileDetails?.date || new Date(file.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                url: fileDetails?.url || `${API_BASE_URL}${file.processed_filepath}`,
              };
            })
          );
          setWavFiles(files);
          setVisibleFiles(files.slice(0, 8));
          if (files.length <= 8) setShowMore(false);
        } else {
          setErrorMessage("오디오 파일을 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
        setErrorMessage("오디오 파일을 불러오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioFiles();
  }, [isAuthenticated, authToken, navigate, API_BASE_URL]);

  const fetchFileDetails = async (identifier, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/file/${identifier}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json", // JSON 대신 바이너리 데이터 요청
        },
      });
  
      if (!response.ok) {
        console.error(`파일 세부정보를 불러오는 중 오류 발생: ${response.status}`);
        return null;
      }
  
      // 바이너리 데이터 처리 (URL 생성)
      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
  
      return {
        name: `${identifier}.wav`, // 파일명은 identifier 기반으로 생성
        text: "텍스트가 없습니다.", // 추가 정보는 없으므로 기본값 설정
        date: new Date().toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        url: fileUrl, // 생성한 Blob URL
      };
    } catch (error) {
      console.error("파일 세부정보 요청 중 오류:", error);
      return null;
    }
  };  

  const handleShowMore = () => {
    const nextFiles = wavFiles.slice(visibleFiles.length, visibleFiles.length + 8);
    setVisibleFiles((prevFiles) => [...prevFiles, ...nextFiles]);

    if (visibleFiles.length + nextFiles.length >= wavFiles.length) {
      setShowMore(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAudioPlay = (audioElement) => {
    if (currentAudioRef.current && currentAudioRef.current !== audioElement) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    currentAudioRef.current = audioElement;

    audioElement
      .play()
      .then(() => {
        console.log("오디오 재생 시작");
      })
      .catch((error) => {
        console.error("오디오 재생 오류:", error);
        setErrorMessage("오디오를 재생할 수 없습니다. 파일 경로를 확인하세요.");
      });
  };

  return (
    <div className="record-container">
      <aside className="R-logo-container">
        <img src={logo} alt="이어톡 로고" onClick={handleLogoClick} className="R-logo-image" />
        <h1 className="R-logo-text">이어톡</h1>
      </aside>
      <main className="wav-list">
        {isLoading ? (
          <p className="loading-message">로딩 중입니다...</p>
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : visibleFiles.length > 0 ? (
          visibleFiles.map((file, index) => (
            <div key={index} className="wav-item">
              <p>
                <strong>파일명:</strong>{" "}
                <span style={{ wordWrap: "break-word", display: "block" }}>{file.name}</span>
              </p>
              <p>
                <strong>생성 날짜:</strong> {file.date}
              </p>
              <audio
                controls
                src={file.url}
                onPlay={(e) => handleAudioPlay(e.target)}
              >
                Your browser does not support the audio element.
              </audio>
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
