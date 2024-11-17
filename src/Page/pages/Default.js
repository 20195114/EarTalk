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
  const { isAuthenticated, authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://eartalk.site:17004";

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioIdentifier, setAudioIdentifier] = useState(null);
  const [showAlert, setShowAlert] = useState('');
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [finalText, setFinalText] = useState(''); // 추가
  const [recentAudioFilename, setRecentAudioFilename] = useState(null); // 추가
  const [isPlayButtonVisible, setIsPlayButtonVisible] = useState(false); // 추가
  const [processedAudio, setProcessedAudio] = useState(null); // 추가
  const [isPlaying, setIsPlaying] = useState(false); // 추가
  const [recentAudioUrl, setRecentAudioUrl] = useState(null); // 'recentAudio'를 'recentAudioUrl'로 대체
  const buffersRef = useRef([]);


  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);

  const createWavFile = (float32Array, sampleRate = 44100) => {
    const buffer = new ArrayBuffer(44 + float32Array.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + float32Array.length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, float32Array.length * 2, true);

    const pcmData = new Int16Array(buffer, 44);
    for (let i = 0; i < float32Array.length; i++) {
      pcmData[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  useEffect(() => {
    console.log("재생할 오디오 URL:", recentAudioUrl);
  }, [recentAudioUrl]);

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
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 44100,
            channelCount: 1,
            echoCancellation: false,
            noiseSuppression: false,
          },
        });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        streamRef.current = stream;
  
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
  
        buffersRef.current = []; // 초기화
        processor.onaudioprocess = (e) => {
          const buffer = e.inputBuffer.getChannelData(0);
          buffersRef.current = buffersRef.current.concat(Array.from(buffer));
          console.log("현재 버퍼 길이:", buffersRef.current.length);
        };
  
        source.connect(processor);
        processor.connect(audioContextRef.current.destination);
        processorRef.current = processor;
  
        setIsRecording(true);
      } catch (error) {
        console.error('마이크 접근 오류:', error);
        setShowAlert('마이크 접근 권한이 필요합니다.');
      }
    } else {
      try {
        // Processor 해제
        if (processorRef.current) {
          processorRef.current.disconnect();
          processorRef.current = null;
        }
  
        // Stream 해제
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
  
        // AudioContext 종료
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          await audioContextRef.current.close();
          audioContextRef.current = null;
        }
  
        if (buffersRef.current.length === 0) {
          setShowAlert('녹음 데이터가 없습니다.');
          return;
        }
  
        const wavBlob = createWavFile(new Float32Array(buffersRef.current));
        console.log("생성된 Blob 크기:", wavBlob.size);
        setAudioBlob(wavBlob);
        sendAudioToServer(); // 녹음이 완료되면 자동 업로드

  
        // 상태 초기화
        buffersRef.current = [];
        setIsRecording(false);
      } catch (error) {
        console.error('녹음 중단 오류:', error);
        setShowAlert('녹음 중단 중 오류가 발생했습니다.');
      }
    }
  };
  
  const sendAudioToServer = async () => {
    if (!audioBlob) {
        setShowAlert("녹음된 파일이 없습니다.");
        return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    // FormData 내용 디버깅
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]); // key, value 출력
    }

    try {
        setIsProcessing(true);
        const response = await axios.post(`${API_BASE_URL}/api/audio`, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data", // 필수 헤더 설정
            },
        });

        if (response.status === 200) {
            const identifier = response.data.identifier;
            setAudioIdentifier(identifier);
            setShowAlert("녹음이 업로드되었습니다.");
            setIsAudioPlayerVisible(true);
            fetchAudioInfo(identifier);
        }
    } catch (error) {
        console.error("오디오 업로드 중 오류 발생:", error);
        setShowAlert("오디오 업로드 중 문제가 발생했습니다.");
    } finally {
        setIsProcessing(false);
    }
};

  const fetchAudioInfo = async (identifier) => {
    try {
        // identifier를 통해 서버에서 직접 파일 정보를 가져옴
        const response = await axios.get(`${API_BASE_URL}/api/audio/${identifier}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
            console.log("API 응답 데이터:", response.data);

            // identifier를 기반으로 파일 서빙 URL 생성
            setRecentAudioUrl(`${API_BASE_URL}/api/file/${identifier}`);
            setRecentAudioFilename(response.data.original_filepath); // 필요 시 파일명 사용
        } else {
            console.error("서버 응답 실패:", response);
            setShowAlert("오디오 정보를 가져오는데 실패했습니다.");
        }
    } catch (error) {
        console.error("오디오 정보를 가져오는 중 오류 발생:", error);
        setShowAlert("오디오 정보를 가져오는 중 오류가 발생했습니다.");
    }
};


  const handlePlayTTS = (audioUrl) => {
    if (!audioUrl) {
      setShowAlert('재생할 파일이 없습니다.');
      return;
    }
    const audio = new Audio(audioUrl);
    audio.play().catch(() => setShowAlert('오디오 재생 중 문제가 발생했습니다.'));
  };

  const togglePrivacyPolicy = () => {
    setIsPrivacyPolicyOpen(!isPrivacyPolicyOpen);
  };

  const handleCopyText = async () => {
    if (inputText) {
      try {
        await navigator.clipboard.writeText(inputText);
        setShowAlert('텍스트가 복사되었습니다.');
      } catch (error) {
        setShowAlert('텍스트 복사에 실패했습니다.');
      }
    }
  };
  const playAudio = () => {
    if (!recentAudioUrl) {
      setShowAlert('재생할 파일이 없습니다.');
      return;
    }
  
    const audio = new Audio(recentAudioUrl);
    audio.play()
      .then(() => {
        setShowAlert('오디오 재생 중입니다.');
      })
      .catch((error) => {
        console.error('오디오 재생 중 오류 발생:', error);
        setShowAlert('오디오 재생 중 문제가 발생했습니다.');
      });
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
  onClick={() => sendAudioToServer(audioBlob)}
  disabled={!isAuthenticated || isProcessing} // audioBlob 조건 제거
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
    <div className="audio-player-modal">
        <h3>{recentAudioFilename ? `파일명: ${recentAudioFilename}` : "녹음이 완료되었습니다."}</h3>
        <audio controls>
            <source src={recentAudioUrl} type="audio/wav" />
            브라우저가 오디오 태그를 지원하지 않습니다.
        </audio>
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
