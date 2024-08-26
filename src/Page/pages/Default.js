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
  const { isAuthenticated, authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [processedAudio, setProcessedAudio] = useState(null);
  const [showAlert, setShowAlert] = useState('');
  const [finalText, setFinalText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      setShowAlert('듣고 있습니다...');
    } else {
      setShowAlert('');
    }
  }, [isRecording]);

  const handleTextChange = (e) => {
    if (!isAuthenticated) {
      setShowAlert('로그인 후에 텍스트 입력이 가능합니다.');
      setTimeout(() => {
        setShowAlert('');
      }, 3000);
      return;
    }
    setInputText(e.target.value);
  };

  const handleRecord = async () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          setAudioChunks((prev) => [...prev, event.data]);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setAudioChunks([]);
          const formData = new FormData();

          formData.append('audio', audioBlob, 'voice_sample.wav');
          if (inputText && isAuthenticated) {
            formData.append('input_text', inputText);
          }

          if (!inputText && audioChunks.length === 0) {
            setShowAlert('텍스트 또는 음성을 입력해야 합니다.');
            setTimeout(() => setShowAlert(''), 3000);
            return;
          }

          setIsProcessing(true);
          try {
            const response = await axios.post('/audio', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                ...(authToken && { Authorization: `Bearer ${authToken}` }),
              },
            });

            setProcessedAudio(response.data.processed_filepath);
            setFinalText(response.data.text || inputText);
            setShowAlert('변환이 완료되었습니다.');
            setTimeout(() => {
              setShowAlert('');
              handlePlayTTS(); // 자동 재생
            }, 2000);
          } catch (error) {
            console.error('Error during audio processing', error);
            setShowAlert('오류가 발생했습니다. 다시 시도해주세요.');
            setTimeout(() => {
              setShowAlert('');
            }, 3000);
          } finally {
            setIsProcessing(false);
          }
        };

        recorder.start();
      } catch (error) {
        console.error('Error starting recording', error);
        setShowAlert('녹음을 시작할 수 없습니다.');
      }
    } else {
      if (audioRef.current) {
        audioRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  const handleTextConversion = async () => {
    if (!inputText) {
      setShowAlert('텍스트를 입력해야 합니다.');
      setTimeout(() => setShowAlert(''), 3000);
      return;
    }

    setIsProcessing(true);
    setShowAlert('처리 중입니다. 잠시만 기다려 주세요.');
    try {
      const formData = new FormData();
      formData.append('input_text', inputText);

      const response = await axios.post('/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      setProcessedAudio(response.data.processed_filepath);
      setFinalText(inputText);
      setShowAlert('인식 결과가 텍스트 창에 표시됩니다.');
      setTimeout(() => {
        setShowAlert('');
        handlePlayTTS(); // 자동 재생
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
    if (!processedAudio) return;
    const ttsAudio = new Audio(processedAudio);
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
              placeholder="여기에 텍스트를 입력하거나, 아래 버튼을 눌러 녹음을 시작하세요. 사용자의 음성 녹음 전적이 없다면 음성이 사용자 목소리로 제공되기 어렵습니다.  "
              value={inputText}
              onChange={handleTextChange}
              disabled={!isAuthenticated || isProcessing}
            ></textarea>
            {!isAuthenticated && (
              <p className="login-required">텍스트 입력은 로그인한 사용자만 이용 가능합니다.</p>
            )}
            <button 
              className={`convert-button ${isAuthenticated ? 'logged-in' : ''}`} 
              onClick={handleTextConversion} 
              disabled={!isAuthenticated || isProcessing}
            >
              변환하기
            </button>
            <div
              className={`record-button ${isRecording ? 'recording' : ''} ${isAuthenticated ? 'logged-in' : ''}`}
              onClick={handleRecord}
              disabled={isProcessing}
            >
              {isRecording ? <FiMicOff /> : <FiMic />}
            </div>
            {showAlert && (
              <div className="recording-alert">
                {showAlert}
              </div>
            )}
          </>
        )}
        {processedAudio && (
          <audio controls src={processedAudio} ref={audioRef} autoPlay></audio>
        )}
        <div className={`icon-container ${isAuthenticated ? 'logged-in' : ''}`}>
          <button className="icon-button" onClick={handleCopyText}>
            <MdOutlineContentCopy />
          </button>
          <button className="icon-button" onClick={handlePlayTTS}>
            {isPlaying ? <AiFillSound /> : <AiOutlineSound />}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Default;
