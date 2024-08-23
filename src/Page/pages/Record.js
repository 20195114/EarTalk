import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../URL/EarTalkLOGO.png';
import '../css/Record.css';
import { AuthContext } from '../../App'; // AuthContext를 실제 위치에서 가져옵니다.

const Record = () => {
  const { isAuthenticated } = useContext(AuthContext); // 로그인 상태 가져오기
  const [wavFiles, setWavFiles] = useState([]); // 서버에서 받아올 WAV 파일 목록
  const [visibleFiles, setVisibleFiles] = useState([]); // 화면에 표시할 WAV 파일 목록
  const [showMore, setShowMore] = useState(true); // 더보기 버튼 표시 여부
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
            const files = data.data.map(file => ({
              name: file.original_filepath,
              text: file.transcription_text || "텍스트가 없습니다.",
              date: new Date(file.created_at).toLocaleDateString(), // 날짜 형식 변환
              url: file.file_url
            }));
            setWavFiles(files); // 서버에서 받은 파일 정보를 상태로 저장
            setVisibleFiles(files.slice(0, 8)); // 처음 8개만 표시
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
        {showMore && (
          <button className="show-more-button" onClick={handleShowMore}>
            더보기
          </button>
        )}
      </main>
    </div>
  );
};

export default Record;


// import React, { useState } from "react";
// import logo from '../URL/EarTalkLOGO.png';
// import '../css/Record.css';

// const Record = () => {
//   // 초기 WAV 파일 목록과 각 파일에 대한 정보를 가정
//   const initialWavFiles = [
//     {
//       name: "녹음파일1.wav",
//       text: "텍스트 내용 1",
//       date: "2024-08-01",
//       url: "path/to/wav1.wav"
//     },
//     {
//       name: "녹음파일2.wav",
//       text: "텍스트 내용 2",
//       date: "2024-08-02",
//       url: "path/to/wav2.wav"
//     },
//     // ... 나머지 파일 정보 추가
//   ];

//   const [visibleFiles, setVisibleFiles] = useState(initialWavFiles.slice(0, 8)); // 처음 8개만 표시
//   const [showMore, setShowMore] = useState(true); // 더보기 버튼 표시 여부

//   const handleShowMore = () => {
//     const nextFiles = initialWavFiles.slice(visibleFiles.length, visibleFiles.length + 8);
//     setVisibleFiles(prevFiles => [...prevFiles, ...nextFiles]);

//     if (visibleFiles.length + nextFiles.length >= initialWavFiles.length) {
//       setShowMore(false); // 더 이상 표시할 파일이 없으면 버튼 숨김
//     }
//   };

//   return (
//     <div className="record-container">
//       <aside className="R-logo-container">
//         <img src={logo} alt="이어톡 로고" className="R-logo-image" />
//         <h1 className="R-logo-text">이어톡</h1>
//       </aside>
//       <main className="wav-list">
//         {visibleFiles.map((file, index) => (
//           <div key={index} className="wav-item">
//             <p><strong>파일명:</strong> {file.name}</p>
//             <p><strong>생성된 텍스트:</strong> {file.text}</p>
//             <p><strong>생성 날짜:</strong> {file.date}</p>
//             <audio controls src={file.url}>Your browser does not support the audio element.</audio>
//           </div>
//         ))}
//         {showMore && (
//           <button className="show-more-button" onClick={handleShowMore}>
//             더보기
//           </button>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Record;
