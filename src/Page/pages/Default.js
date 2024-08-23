// import React, { useContext, useState, useEffect } from 'react';
// import { FiMic, FiMicOff } from 'react-icons/fi';
// import { AiOutlineSound, AiFillSound } from 'react-icons/ai';
// import { MdOutlineContentCopy } from "react-icons/md";
// import Header from '../components/Header';
// import { AuthContext } from '../../App';
// import axios from 'axios';
// import '../css/Default.css';

// const Default = () => {
//   const { isAuthenticated, authToken } = useContext(AuthContext); // 인증 상태와 토큰 정보 가져오기
//   const [inputText, setInputText] = useState(''); // 입력된 텍스트 상태 관리
//   const [audioFile, setAudioFile] = useState(null); // 오디오 파일 상태 관리
//   const [isRecording, setIsRecording] = useState(false); // 녹음 상태 관리
//   const [processedAudio, setProcessedAudio] = useState(null); // 처리된 오디오 상태 관리
//   const [showAlert, setShowAlert] = useState(''); // 화면에 표시할 알림 메시지 상태 관리
//   const [finalText, setFinalText] = useState(''); // 최종 변환된 텍스트 상태 관리
//   const [isProcessing, setIsProcessing] = useState(false); // 텍스트 변환 중인지 여부 관리
//   const [isPlaying, setIsPlaying] = useState(false); // TTS 오디오 재생 상태 관리
//   const [showFinishButton, setShowFinishButton] = useState(false); // "녹음 완료" 버튼 표시 여부 관리

//   useEffect(() => {
//     // 녹음 중일 때 "듣고 있습니다..." 메시지를 표시
//     if (isRecording) {
//       setShowAlert('듣고 있습니다...');
//     } else {
//       setShowAlert('');
//     }
//   }, [isRecording]);

//   const handleTextChange = (e) => {
//     // 로그인하지 않은 경우 경고 메시지 표시
//     if (!isAuthenticated) {
//       setShowAlert('로그인 후에 이용이 가능합니다.');
//       setTimeout(() => {
//         setShowAlert('');
//       }, 3000);
//       return;
//     }
//     setInputText(e.target.value);
//   };

//   const handleRecord = () => {
//     // 녹음 시작/중지 토글
//     setIsRecording(!isRecording);
//     if (!isRecording) {
//       setFinalText(''); // 이전 결과 초기화
//     }
//   };

//   const handleFinishRecording = async () => {
//     // 녹음 완료 후 처리
//     setIsRecording(false);
//     setShowFinishButton(true); // 녹음 완료 버튼 표시
//     setTimeout(() => setShowFinishButton(false), 3000); // 3초 후 버튼 숨김
//     await handleTextConversion(); // 텍스트 변환 로직 추가
//   };

//   const handleTextConversion = async () => {
//     // 텍스트 변환 처리 로직
//     if (!inputText) return;

//     setIsProcessing(true);
//     setShowAlert('처리 중입니다. 잠시만 기다려 주세요.');
//     try {
//       const formData = new FormData();
//       if (inputText && isAuthenticated) {
//         formData.append('input_text', inputText);
//       }

//       const response = await axios.post('/text-to-speech', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           ...(authToken && { Authorization: `Bearer ${authToken}` }), // 로그인된 경우 토큰 포함
//         },
//       });

//       setProcessedAudio(response.data.processed_filepath); // 처리된 오디오 파일 경로 설정
//       setShowAlert('인식 결과가 텍스트 창에 표시됩니다.');
//       setTimeout(() => {
//         setFinalText(inputText); // 입력된 텍스트를 최종 텍스트로 설정
//         setShowAlert('');
//       }, 2000);
//     } catch (error) {
//       console.error('Error during conversion', error);
//       setShowAlert('다시 한 번 말씀해 주세요.');
//       setTimeout(() => {
//         setShowAlert('');
//       }, 3000);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleReset = () => {
//     // 초기화 처리
//     setInputText('');
//     setProcessedAudio(null);
//     setFinalText('');
//   };

//   const handlePlayTTS = () => {
//     // TTS 오디오 재생 처리
//     if (!finalText) return;
//     const ttsAudio = new Audio(processedAudio); // TTS를 백엔드에서 생성하는 것으로 가정
//     setIsPlaying(true);
//     ttsAudio.play();
//     ttsAudio.onended = () => setIsPlaying(false); // 재생 완료 시 상태 초기화
//   };

//   const handleCopyText = () => {
//     // 텍스트 복사 처리
//     if (finalText) {
//       navigator.clipboard.writeText(finalText);
//       alert('텍스트가 복사되었습니다.');
//     }
//   };

//   return (
//     <div className="ear-talk-container">
//       <Header />
//       <main className="ear-talk-main">
//         {finalText ? (
//           <div className="result-container">
//             <p className="result-text">{finalText}</p>
//             <button className="reset-button" onClick={handleReset}>
//               다시 녹음하기
//             </button>
//           </div>
//         ) : (
//           <>
//             <textarea
//               className="text-area"
//               placeholder="여기에 텍스트를 입력하거나, 아래 버튼을 눌러 녹음을 시작하세요."
//               value={inputText}
//               onChange={handleTextChange}
//               disabled={!isAuthenticated || isProcessing}
//             ></textarea>
//             {!isAuthenticated && (
//               <p className="login-required">텍스트 입력은 로그인한 사용자만 이용 가능합니다.</p>
//             )}
//             <button className="convert-button" onClick={handleTextConversion} disabled={!isAuthenticated || isProcessing}>
//               변환하기
//             </button>
//             <div
//               className={`record-button ${isRecording ? 'recording' : ''}`}
//               onClick={handleRecord}
//               disabled={isProcessing}
//             >
//               {isRecording ? <FiMicOff /> : <FiMic />}
//             </div>
//             {isRecording && (
//               <button className="finish-recording-button" onClick={handleFinishRecording}>
//                 녹음 완료
//               </button>
//             )}
//             {showAlert && (
//               <div className="recording-alert">
//                 {showAlert}
//               </div>
//             )}
//           </>
//         )}
//         {processedAudio && (
//           <audio controls src={processedAudio}></audio>
//         )}
//         <div className="icon-container">
//         <button className="icon-button" onClick={handleCopyText}>
//           <MdOutlineContentCopy />
//           </button>
//           <button className="icon-button" onClick={handlePlayTTS}>
//             {isPlaying ? <AiFillSound /> : <AiOutlineSound />}
//           </button>
//         </div>
//       </main>
//       {/* 녹음 완료 버튼 및 녹음 중 메시지를 화면 중앙에 표시 */}
//       {showFinishButton && (
//         <div className="finish-recording-alert">
//           녹음 완료
//         </div>
//       )}
//     </div>
//   );
// };

// export default Default;

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { AiOutlineSound, AiFillSound } from 'react-icons/ai';
import { MdOutlineContentCopy } from "react-icons/md";
import Header from '../components/Header';
import '../css/Default.css';

const Default = () => {
  // 임의로 로그인된 상태로 가정
  const isAuthenticated = true; // 실제 구현에서는 AuthContext에서 가져오지만, 여기서는 로그인된 상태를 가정

  const navigate = useNavigate();
  
  const [inputText, setInputText] = useState(''); 
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [processedAudio, setProcessedAudio] = useState(null);
  const [showAlert, setShowAlert] = useState(''); 
  const [finalText, setFinalText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [showFinishButton, setShowFinishButton] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // 로그인이 되어 있지 않으면 로그인 페이지로 리디렉션
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isRecording) {
      setShowAlert('듣고 있습니다...');
    } else {
      setShowAlert('');
    }
  }, [isRecording]);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setFinalText(''); // 이전 결과 초기화
    }
  };

  const handleFinishRecording = async () => {
    setIsRecording(false);
    setShowFinishButton(true); 
    setTimeout(() => setShowFinishButton(false), 3000); 
    await handleTextConversion(); 
  };

  const handleTextConversion = async () => {
    if (!inputText) return;

    setIsProcessing(true);
    setShowAlert('처리 중입니다. 잠시만 기다려 주세요.');
    try {
      const response = await fetch('/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer fakeAccessToken`, // 임의의 토큰 사용
        },
        body: JSON.stringify({ input_text: inputText }),
      });

      const data = await response.json();
      setProcessedAudio(data.processed_filepath);
      setShowAlert('인식 결과가 텍스트 창에 표시됩니다.');
      setTimeout(() => {
        setFinalText(inputText); // 입력된 텍스트를 최종 텍스트로 설정
        setShowAlert('');
      }, 2000);
    } catch (error) {
      console.error('Error during conversion', error);
      setShowAlert('다시 한 번 말씀해 주세요.');
      setTimeout(() => {
        setShowAlert('');
      }, 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setProcessedAudio(null);
    setFinalText('');
  };

  const handlePlayTTS = () => {
    if (!finalText) return;
    const ttsAudio = new Audio(processedAudio); // TTS를 백엔드에서 생성하는 것으로 가정
    setIsPlaying(true);
    ttsAudio.play();
    ttsAudio.onended = () => setIsPlaying(false);
  };

  const handleCopyText = () => {
    if (finalText) {
      navigator.clipboard.writeText(finalText);
      alert('텍스트가 복사되었습니다.');
    }
  };

  return (
    <div className="ear-talk-container">
      <Header />
      <main className="ear-talk-main">
        {finalText ? (
          <div className="result-container">
            <p className="result-text">{finalText}</p>
            <button className="reset-button" onClick={handleReset}>
              다시 녹음하기
            </button>
          </div>
        ) : (
          <>
            <textarea
              className="text-area"
              placeholder="여기에 텍스트를 입력하거나, 아래 버튼을 눌러 녹음을 시작하세요."
              value={inputText}
              onChange={handleTextChange}
              disabled={isProcessing}
            ></textarea>
            <button className="convert-button" onClick={handleTextConversion} disabled={isProcessing}>
              변환하기
            </button>
            <div
              className={`record-button ${isRecording ? 'recording' : ''}`}
              onClick={handleRecord}
              disabled={isProcessing}
            >
              {isRecording ? <FiMicOff /> : <FiMic />}
            </div>
            {isRecording && (
              <button className="finish-recording-button" onClick={handleFinishRecording}>
                녹음 완료
              </button>
            )}
            {showAlert && (
              <div className="recording-alert">
                {showAlert}
              </div>
            )}
          </>
        )}
        {processedAudio && (
          <audio controls src={processedAudio}></audio>
        )}
        <div className="icon-container">
        <button className="icon-button" onClick={handleCopyText}>
          <MdOutlineContentCopy />
          </button>
          <button className="icon-button" onClick={handlePlayTTS}>
            {isPlaying ? <AiFillSound /> : <AiOutlineSound />}
          </button>
        </div>
      </main>
      {showFinishButton && (
        <div className="finish-recording-alert">
          녹음 완료
        </div>
      )}
    </div>
  );
};

export default Default;
