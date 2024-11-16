import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TermsOfService from '../components/TermsOfService';
import PrivacyPolicyConsent from '../components/PrivacyPolicyConsent';
import '../css/Agreement.css';

const Agreement = () => {
  const [allChecked, setAllChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const navigate = useNavigate();

  const handleAllCheck = (e) => {
    const isChecked = e.target.checked;
    setAllChecked(isChecked);
    setTermsChecked(isChecked);
    setPrivacyChecked(isChecked);
  };

  const handleSubmit = () => {
    if (termsChecked && privacyChecked) {
      alert('모든 약관에 동의하셨습니다.');
      navigate('/join');
    } else {
      alert('모든 필수 약관에 동의해 주세요.');
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="agreement-container">
      <h2>서비스 이용약관</h2>
      <div className="agreement-check-all">
        <input
          type="checkbox"
          id="checkAll"
          checked={allChecked}
          onChange={handleAllCheck}
        />
        <label htmlFor="checkAll">
          이어톡 이용약관 및 개인정보 수집 및 이용에 모두 동의합니다.
        </label>
      </div>
      <hr className="separator" />
      <TermsOfService
        isChecked={termsChecked}
        onChange={(checked) => setTermsChecked(checked)}
      />
      <PrivacyPolicyConsent
        isChecked={privacyChecked}
        onChange={(checked) => setPrivacyChecked(checked)}
      />
      <p className="agreement-info">
        이용약관 및 개인정보 수집·이용에 동의하신 후 본인확인 절차가 진행됩니다. <br />
        고객님께서는 개인정보보호법에 따라 개인정보 수집·이용 동의를 거부하실 수 있으며, 거부 시에는 이어톡 회원제 서비스 이용이 어렵습니다.
      </p>
      <div className="agreement-buttons">
        <button onClick={handleSubmit} className="agree-button">
          동의
        </button>
        <button onClick={handleCancel} className="cancel-button">
          취소
        </button>
      </div>
    </div>
  );
};

export default Agreement;
