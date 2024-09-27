import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { AiOutlineSound, AiFillSound } from 'react-icons/ai';
import { MdOutlineContentCopy } from "react-icons/md";
import Header from '../components/Header';
import { AuthContext } from '../../App';
import axios from 'axios';
import '../css/Default.css';

const Default = () => {
  const { isAuthenticated, authToken } = useContext(AuthContext); // 로그인 여부 확인
  const navigate = useNavigate();

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [processedAudio, setProcessedAudio] = useState(null);
  const [showAlert, setShowAlert] = useState('');
  const [finalText, setFinalText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState([]);
  const [isConverted, setIsConverted] = useState(false); // 변환 여부 확인
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

  useEffect(() => {
    if (isRecording) {
      setShowAlert('녹음 버튼을 한 번 더 누르면 녹음이 완료됩니다.');
    } else {
      setShowAlert('');
    }
  }, [isRecording]);

  const handleTextChange = (e) => {
    if (!isAuthenticated) {
      setShowAlert('로그인 후에 텍스트 입력이 가능합니다.');
      setTimeout(() => setShowAlert(''), 3000);
      return;
    }
    setInputText(e.target.value);
  };

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        streamRef.current = stream;

        const source = audioContextRef.current.createMediaStreamSource(stream);
        const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          const buffer = e.inputBuffer.getChannelData(0);
          setAudioData(prev => [...prev, ...buffer]);
        };

        source.connect(processor);
        processor.connect(audioContextRef.current.destination);

        processorRef.current = processor;
        setIsRecording(true); 
      } catch (error) {
        console.error('Error starting recording', error);
        setShowAlert('녹음을 시작할 수 없습니다.');
      }
    } else {
      stopRecording();
    }
  };

  const stopRecording = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      streamRef.current.getTracks().forEach(track => track.stop());
      audioContextRef.current.close();
    }

    setIsRecording(false);
    setShowAlert('녹음이 완료되었습니다.');
    setIsConverted(false); // 변환 상태 초기화
  };

  const sendAudioToServer = async () => {
    if (!inputText && audioData.length === 0) {
      setShowAlert('텍스트 또는 음성을 입력해야 합니다.');
      return;
    }

    const audioBlob = new Blob([new Float32Array(audioData)], { type: 'audio/wav' });
    const formData = new FormData();
    if (isAuthenticated && inputText) {
      formData.append('input_text', inputText); // 로그인 시 텍스트와 함께 전송 가능
    }
    if (audioData.length > 0) {
      formData.append('audio', audioBlob, 'voice_sample.wav');
    }

    try {
      setIsProcessing(true); // 로딩 상태
      setShowAlert('처리 중입니다...');
      const response = await axios.post('/audio', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          ...(authToken && { Authorization: `Bearer ${authToken}` }) // 인증 토큰 추가
        },
      });

      const { text, processed_filepath } = response.data;
      setFinalText(text || inputText); // 텍스트 유지
      setProcessedAudio(processed_filepath);
      setIsConverted(true); // 변환 완료 상태
      setShowAlert('처리가 완료되었습니다.');
      handlePlayTTS(processed_filepath); // 자동 재생
    } catch (error) {
      console.error('Error during audio processing', error);
      setShowAlert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayTTS = (audioUrl) => {
    if (!isConverted) {
      setShowAlert('먼저 변환하기 버튼을 눌러주세요.');
      return;
    }
    const ttsAudio = new Audio(audioUrl);
    setIsPlaying(true);
    ttsAudio.play();
    ttsAudio.onended = () => setIsPlaying(false);
  };

  const handleCopyText = async () => {
    if (finalText) {
      try {
        await navigator.clipboard.writeText(finalText);
        alert('텍스트가 복사되었습니다.');
      } catch (error) {
        alert('텍스트 복사에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const togglePrivacyPolicy = () => {
    setIsPrivacyPolicyOpen(!isPrivacyPolicyOpen);
  };

  return (
    <div className="ear-talk-container">
      <Header />
      <main className="ear-talk-main">
        {finalText ? (
          <div className="result-container">
            <p className="result-text">{finalText}</p>
            <button className="reset-button" onClick={() => setFinalText('')}>
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
              disabled={!isAuthenticated || isProcessing} // 로그인하지 않으면 텍스트 입력 비활성화
            ></textarea>
            {!isAuthenticated && (
              <p className="login-required">텍스트 입력은 로그인한 사용자만 이용 가능합니다.</p>
            )}
            <button 
              className={`convert-button ${isAuthenticated ? 'logged-in' : ''}`} 
              onClick={sendAudioToServer} 
              disabled={!isAuthenticated || isProcessing} // 로그인하지 않으면 변환 버튼 비활성화
            >
              변환하기
            </button>
            <div className={`record-button ${isRecording ? 'recording' : ''}`} onClick={handleRecord} disabled={isProcessing}>
              {isRecording ? <FiMicOff /> : <FiMic />}
            </div>
            {showAlert && <div className="recording-alert">{showAlert}</div>}
          </>
        )}

        {isRecording && (
          <div className="recording-modal">
            <div className="modal-content">
              <button className="close-button" onClick={handleRecord}>X</button>
              <p>마이크 버튼을 한 번 더 누르면 녹음이 완료됩니다.</p>
              <button className="stop-button" onClick={handleRecord}>녹음 중단하기</button>
            </div>
          </div>
        )}

        {processedAudio && (
          <div className="playback-modal">
            <div className="modal-content">
              <p>음성이 자동으로 재생됩니다.</p>
              <audio controls src={processedAudio} autoPlay />
            </div>
          </div>
        )}

        <div className={`icon-container ${isAuthenticated ? 'logged-in' : ''}`}>
          <button className="icon-button" onClick={handleCopyText}>
            <MdOutlineContentCopy />
          </button>
          <button className="icon-button" onClick={() => handlePlayTTS(processedAudio)}>
            {isPlaying ? <AiFillSound /> : <AiOutlineSound />}
          </button>
        </div>

        <div className="privacy-policy-link" onClick={togglePrivacyPolicy}>
  이어톡 개인정보 처리방침
</div>
{isPrivacyPolicyOpen && (
  <div className={`privacy-policy-modal ${isPrivacyPolicyOpen ? 'open' : ''}`}>
    <div className="privacy-policy-content">
      <div className="privacy-policy-header">
        <h2>개인정보 처리방침</h2>
        <button className="close-button" onClick={togglePrivacyPolicy}>X</button>
      </div>
      <div className="privacy-policy-body">
        <p>여기에 개인정보 처리방침 내용을 작성하세요.</p>
      </div>
    </div>
  </div>
)}
</main>
</div>
);
};

export default Default;




// import React, { useState, useEffect, useRef } from 'react';
// import { FiMic, FiMicOff } from 'react-icons/fi';
// import { MdOutlineContentCopy } from "react-icons/md";
// import { AiOutlineSound, AiFillSound } from 'react-icons/ai';
// import Header from '../components/Header';
// import axios from 'axios';
// import '../css/Default.css';

// const Default = () => {
//   const [inputText, setInputText] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [processedAudio, setProcessedAudio] = useState(null);
//   const [showAlert, setShowAlert] = useState('');
//   const [finalText, setFinalText] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audioData, setAudioData] = useState([]);
//   const [isConverted, setIsConverted] = useState(false); // 변환 여부 확인
//   const audioContextRef = useRef(null);
//   const processorRef = useRef(null);
//   const streamRef = useRef(null);
//   const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);


//   useEffect(() => {
//     if (isRecording) {
//       setShowAlert('녹음 버튼을 한 번 더 누르면 녹음이 완료됩니다.');
//     } else {
//       setShowAlert('');
//     }
//   }, [isRecording]);

//   const handleTextChange = (e) => {
//     setInputText(e.target.value);
//   };

//   const handleRecord = async () => {
//     if (!isRecording) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//         streamRef.current = stream;

//         const source = audioContextRef.current.createMediaStreamSource(stream);
//         const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

//         processor.onaudioprocess = (e) => {
//           const buffer = e.inputBuffer.getChannelData(0);
//           setAudioData(prev => [...prev, ...buffer]);
//         };

//         source.connect(processor);
//         processor.connect(audioContextRef.current.destination);

//         processorRef.current = processor;
//         setIsRecording(true); 
//       } catch (error) {
//         console.error('Error starting recording', error);
//         setShowAlert('녹음을 시작할 수 없습니다.');
//       }
//     } else {
//       stopRecording();
//     }
//   };

//   const stopRecording = () => {
//     if (processorRef.current) {
//       processorRef.current.disconnect();
//       streamRef.current.getTracks().forEach(track => track.stop());
//       audioContextRef.current.close();
//     }

//     setIsRecording(false);
//     setShowAlert('녹음이 완료되었습니다.');
//     setIsConverted(false); // 변환 상태 초기화
//   };

//   const sendAudioToServer = async () => {
//     if (!inputText && audioData.length === 0) {
//       setShowAlert('텍스트 또는 음성을 입력해야 합니다.');
//       return;
//     }

//     const audioBlob = new Blob([new Float32Array(audioData)], { type: 'audio/wav' });
//     const formData = new FormData();
//     formData.append('audio', audioBlob, 'voice_sample.wav');
//     if (inputText) {
//       formData.append('input_text', inputText);
//     }

//     try {
//       setIsProcessing(true); // 로딩 상태
//       setShowAlert('처리 중입니다...');
//       const response = await axios.post('/audio', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const { text, processed_filepath } = response.data;
//       setFinalText(text || inputText); // 텍스트 유지
//       setProcessedAudio(processed_filepath);
//       setIsConverted(true); // 변환 완료 상태
//       setShowAlert('처리가 완료되었습니다.');
//     } catch (error) {
//       console.error('Error during audio processing', error);
//       setShowAlert('오류가 발생했습니다. 다시 시도해주세요.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handlePlayTTS = (audioUrl) => {
//     if (!isConverted) {
//       setShowAlert('먼저 변환하기 버튼을 눌러주세요.');
//       return;
//     }
//     const ttsAudio = new Audio(audioUrl);
//     setIsPlaying(true);
//     ttsAudio.play();
//     ttsAudio.onended = () => setIsPlaying(false);
//   };

//   const handleCopyText = async () => {
//     if (finalText) {
//       try {
//         await navigator.clipboard.writeText(finalText);
//         alert('텍스트가 복사되었습니다.');
//       } catch (error) {
//         alert('텍스트 복사에 실패했습니다. 다시 시도해주세요.');
//       }
//     }
//   };

//   const togglePrivacyPolicy = () => {
//     setIsPrivacyPolicyOpen(!isPrivacyPolicyOpen);
//   };

//   return (
//     <div className="ear-talk-container">
//       <Header />
//       <main className="ear-talk-main">
//         {isProcessing ? (
//           <div className="loading-screen">
//             <p>처리 중입니다... 잠시만 기다려 주세요.</p>
//           </div>
//         ) : (
//           <>
//             <textarea
//               className="text-area"
//               placeholder="여기에 텍스트를 입력하거나, 아래 버튼을 눌러 녹음을 시작하세요."
//               value={inputText}
//               onChange={handleTextChange}
//               disabled={isProcessing}
//             ></textarea>
//             <button className={`convert-button`} onClick={sendAudioToServer} disabled={isProcessing}>
//               변환하기
//             </button>
//             <div className={`record-button ${isRecording ? 'recording' : ''}`} onClick={handleRecord} disabled={isProcessing}>
//               {isRecording ? <FiMicOff /> : <FiMic />}
//             </div>
//             {showAlert && <div className="recording-alert">{showAlert}</div>}
//           </>
//         )}

//         {isRecording && (
//           <div className="recording-modal">
//             <div className="modal-content">
//               <button className="close-button" onClick={handleRecord}>X</button>
//               <p>마이크 버튼을 한 번 더 누르면 녹음이 완료됩니다.</p>
//               <button className="stop-button" onClick={handleRecord}>녹음 중단하기</button>
//             </div>
//           </div>
//         )}

//         <div className="icon-container">
//           <button className="icon-button" onClick={handleCopyText}>
//             <MdOutlineContentCopy />
//           </button>
//           <button className="icon-button" onClick={() => handlePlayTTS(processedAudio)}>
//             {isPlaying ? <AiFillSound /> : <AiOutlineSound />}
//           </button>
//         </div>

//         {processedAudio && (
//           <div className="playback-modal">
//             <div className="modal-content">
//               <p>변환이 완료되었습니다. 사운드 아이콘을 클릭하면 음성이 재생됩니다.</p>
//             </div>
//           </div>
          
//         )}
//         <div className="privacy-policy-link" onClick={togglePrivacyPolicy}>
//   이어톡 개인정보 처리방침
// </div>
// {isPrivacyPolicyOpen && (
//   <div className={`privacy-policy-modal ${isPrivacyPolicyOpen ? 'open' : ''}`}>
//     <div className="privacy-policy-content">
//       <div className="privacy-policy-header">
//         <h2>개인정보 처리방침</h2>
//         <button className="close-button" onClick={togglePrivacyPolicy}>X</button>
//       </div>
//       <div className="privacy-policy-body">
//         <p>① 법령 부합성 •개인정보처리자는 법 제30조 제1항 각 호 및 영 제31조 제1항 각 호의 사항 중 해당되는 내용을 모두 작성하여야 하며, 작성된 내용은 개인정보 보호 법령에 부합하여야 함 ② 투명성 및 정확성 •개인정보처리자는 정보주체의 알 권리 보장을 위해 자신의 개인정보 처리 현황을 정확하게 반영하여 개인정보 처리방침을 작성하고, 이를 투명하게 공개하여야 함 •개인정보처리자는 개인정보 처리방침에 공개한 내용이 실제 개인정보 처리 현황과 일치할 수 있도록 하는 등의 정확성과 투명성, 최신성을 유지할 수 있도록 수립 및 관리하여야 함 ③ 명확성 및 가독성 •개인정보처리자는 법 제30조 제1항 각 호 및 영 제31조 제1항 각 호의 사항을 정보주체가 쉽게 알 수 있도록 구분하여 작성해야 하며, 가급적 각각 별도의 항목으로 명시적으로 구분하여 작성할 것을 권고함 •개인정보처리자는 개인정보 처리방침에 개인정보 처리 현황을 구체적으로 작성하여야 하며, 모호하고 불명확한 표현을 사용하는 것은 지양됨 •개인정보 처리방침은 알기 쉬운 용어로 구체적이고 명확하게 표현되어야 하며(표준지침 제18조 제1항), 정보주체가 쉽게 이해할 수 있도록 가급적 평어체를 사용하고, 전문용어(법률용어 등)는 쉬운 표현으로 부연 설명을 제공하는 것을 권장함 •특히 개인정보 보호법의 적용을 받는 해외사업자의 경우 국내이용자가 이해할 수 있도록 쉽고 명확한 한글로 정보를 제공하여야 함 ④ 접근성 •개인정보 처리방침은 정보주체 누구나 쉽게 확인할 수 있는 방법으로 공개되어야 함 •개인정보 처리방침 상 정보주체 권리행사 방법은 개인정보를 수집하는 방법과 동일한 수준이거나 보다 쉬운 절차로 설계하고 구체적이고 상세하게 안내하여야 함</p>
//       </div>
//     </div>
//   </div>
// )}
//       </main>
//     </div>
//   );
// };

// export default Default;
