import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { AiOutlineSound, AiFillSound } from 'react-icons/ai';
import { MdOutlineContentCopy } from "react-icons/md";
import Header from '../components/Header';
import { AuthContext } from '../../App';
import axios from 'axios';
import '../css/Default.css';
import PrivacyPolicy from '../components/PrivacyPolicy';

const Default = () => {
  const { isAuthenticated, authToken } = useContext(AuthContext); // 로그인 여부 확인
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://eartalk.site:17004";

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
  const [recentAudio, setRecentAudio] = useState(null); // 회원의 최신 음성 파일 경로
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false); // 재생 폼 표시 여부

  const createWavFile = (float32Array, sampleRate = 44100) => {
    const buffer = new ArrayBuffer(44 + float32Array.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    // WAV 헤더 작성
    writeString(0, "RIFF");
    view.setUint32(4, 36 + float32Array.length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    writeString(36, "data");
    view.setUint32(40, float32Array.length * 2, true);

    // PCM 데이터 변환
    const pcmData = new Int16Array(buffer, 44);
    for (let i = 0; i < float32Array.length; i++) {
      pcmData[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
    }

    return new Blob([view], { type: "audio/wav" });
  };



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
          setAudioData((prev) => [...prev, ...buffer]);
        };
  
        source.connect(processor);
        processor.connect(audioContextRef.current.destination);
  
        processorRef.current = processor;
        setIsRecording(true);
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          setShowAlert('마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
        } else {
          console.error('Error starting recording', error);
          setShowAlert('녹음을 시작할 수 없습니다.');
        }
      }
    } else {
      stopRecording();
    }
  };  

  const stopRecording = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      streamRef.current.getTracks().forEach((track) => track.stop());
      audioContextRef.current.close();
    }
  
    if (audioData.length > 0) {
      const wavBlob = createWavFile(new Float32Array(audioData));
      console.log("생성된 Blob 확인:", wavBlob);
      setAudioData([]); // 데이터 초기화
      setIsRecording(false);
      setShowAlert('녹음이 완료되었습니다.');
      if (isAuthenticated) {
        sendAudioToServer(wavBlob); // 회원일 경우 백엔드로 전송
      }
    } else {
      setShowAlert('녹음 데이터가 없습니다. 다시 시도해주세요.');
    }
  };  
  
  const fetchRecentAudio = async () => {
    const token = authToken || localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰 가져오기
    console.log("fetchRecentAudio 요청에 사용 중인 토큰:", token);
  
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me/audios`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
  
      console.log("fetchRecentAudio 응답 상태:", response.status);
  
      if (response.status === 200) {
        const audioList = response.data.data;
        if (audioList.length > 0) {
          const latestAudio = audioList[audioList.length - 1].processed_filepath;
          setRecentAudio(latestAudio);
          setIsAudioPlayerVisible(true); // 재생 폼 표시
          playAudioOnce(latestAudio); // 최신 파일 자동 재생
        }
      }
    } catch (error) {
      console.error("fetchRecentAudio 중 오류 발생:", error);
      setShowAlert("최근 음성 파일을 가져올 수 없습니다.");
    }
  };  
  

  const playAudioOnce = (audioUrl) => {
    if (!audioUrl) {
      setShowAlert('재생할 파일이 없습니다.');
      return;
    }
  
    const fullAudioUrl = `${API_BASE_URL}${audioUrl}`;
    console.log("재생할 오디오 URL:", fullAudioUrl);
  
    const audio = new Audio(fullAudioUrl);
    audio.play().catch((error) => {
      console.error('Audio playback error:', error);
      setShowAlert('오디오 재생 중 문제가 발생했습니다.');
    });
  
    audio.onended = () => {
      setShowAlert('재생이 완료되었습니다.');
    };
  };  

  const getAudioByIdentifier = async (identifier) => {
    const token = authToken || sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/audio/${identifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        const { processed_filepath } = response.data;
        setProcessedAudio(processed_filepath);
        setIsConverted(true);
        setShowAlert("오디오를 성공적으로 가져왔습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      setShowAlert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const sendAudioToServer = async (audioBlob) => {
    if (isProcessing) return; // 처리 중 중복 요청 방지
  
    if (!inputText && !audioBlob) {
      setShowAlert("텍스트 또는 음성을 입력해야 합니다.");
      return;
    }
  
    const token = authToken || sessionStorage.getItem("authToken");
    if (!token) {
      setShowAlert("인증 토큰이 없습니다. 로그인 후 시도해주세요.");
      navigate("/login");
      return;
    }
  
    const formData = new FormData();
    if (isAuthenticated && inputText) {
      formData.append("input_text", inputText); // 선택적 텍스트
    }
    if (audioBlob) {
      formData.append("audio", audioBlob, "voice_sample.wav"); // 필수 오디오 파일
    }
  
    console.log("FormData 확인:", formData);
  
    try {
      setIsProcessing(true);
      setShowAlert("오디오 파일을 처리 중입니다...");
  
      const response = await axios.post(`${API_BASE_URL}/api/audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // 인증 토큰 포함
        },
      });
  
      if (response.status === 200) {
        const { processed_filepath } = response.data;
        setProcessedAudio(processed_filepath); // 처리된 파일 경로 저장
        setShowAlert("오디오 처리가 완료되었습니다.");
        console.log("처리된 오디오 경로:", processed_filepath);
      }
    } catch (error) {
      console.error("오류 발생:", error);
      setShowAlert("오디오 처리 중 문제가 발생했습니다.");
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

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('privacy-policy-modal-overlay')) {
      setIsPrivacyPolicyOpen(false);
    }
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
            <div
              className={`record-button ${isRecording ? 'recording' : ''}`}
              onClick={handleRecord}
              disabled={isProcessing}
            >
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

{isAudioPlayerVisible && (
          <div className="audio-player">
            <p>음성이 자동으로 재생됩니다.</p>
            <audio controls src={recentAudio}></audio>
            <button className="close-button" onClick={() => setIsAudioPlayerVisible(false)}>
              닫기
            </button>
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
          <PrivacyPolicy onClose={togglePrivacyPolicy} />
        )}
      </main>
    </div>
  );
};

export default Default;
