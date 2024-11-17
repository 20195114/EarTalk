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
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 

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
      streamRef.current.getTracks().forEach((track) => track.stop());
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setShowAlert('녹음이 완료되었습니다.');
    if (isAuthenticated) {
      fetchRecentAudio(); // 회원일 경우 최신 음성 파일 가져오기
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
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      setShowAlert('재생이 완료되었습니다.');
    };
  };

  const getAudioByIdentifier = async (identifier) => {
    const token = authToken || sessionStorage.getItem("authToken");
    console.log("getAudioByIdentifier 요청에 사용 중인 토큰:", token);
  
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 페이지로 이동합니다.");
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
  
      console.log("getAudioByIdentifier 응답 상태:", response.status);
  
      if (response.status === 200) {
        const { processed_filepath } = response.data;
        setProcessedAudio(processed_filepath);
        setShowAlert("오디오를 성공적으로 가져왔습니다.");
      } else {
        setShowAlert("오디오를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("getAudioByIdentifier 중 오류 발생:", error);
      setShowAlert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  

  const sendAudioToServer = async () => {
    if (!inputText && audioData.length === 0) {
      setShowAlert("텍스트 또는 음성을 입력해야 합니다.");
      return;
    }
  
    const token = authToken || sessionStorage.getItem("authToken");
    console.log("sendAudioToServer 요청에 사용 중인 토큰:", token);
  
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }
  
    const audioBlob = new Blob([new Float32Array(audioData)], { type: "audio/wav" });
    const formData = new FormData();
    if (isAuthenticated && inputText) {
      formData.append("input_text", inputText); // 로그인 시 텍스트와 함께 전송 가능
    }
    if (audioData.length > 0) {
      formData.append("audio", audioBlob, "voice_sample.wav");
    }
  
    try {
      setIsProcessing(true);
      setShowAlert("처리 중입니다...");
      const response = await axios.post(`${API_BASE_URL}/api/audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("sendAudioToServer 응답 상태:", response.status);
  
      if (response.status === 200) {
        const { identifier } = response.data;
        setShowAlert("변환이 완료되었습니다. 오디오를 가져옵니다...");
        await getAudioByIdentifier(identifier); // GET 요청으로 오디오 가져오기
      }
    } catch (error) {
      console.error("sendAudioToServer 중 오류 발생:", error);
      setShowAlert("오류가 발생했습니다. 다시 시도해주세요.");
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

