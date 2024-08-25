import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
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
      alert("You have agreed to all the terms.");
      navigate('/join'); 
    } else {
      alert("Please agree to all required terms.");
    }
  };

  const handleCancel = () => {
    navigate('/login'); 
  };

  return (
    <div className="agreement-container">
      <h2>약관동의</h2>
      <div className="agreement-check-all">
        <input
          type="checkbox"
          id="checkAll"
          checked={allChecked}
          onChange={handleAllCheck}
        />
        <label htmlFor="checkAll">이어톡 이용약관 및 개인정보 수집 및 이용에 모두 동의합니다.</label>
      </div>
      <hr className="separator" />
      <div className="agreement-section">
        <input
          type="checkbox"
          id="terms"
          checked={termsChecked}
          onChange={(e) => setTermsChecked(e.target.checked)}
        />
        <label htmlFor="terms">이용약관 동의 (필수)</label>
        <div className="terms-content">
          <p>제1조(목적) 이 약관은 이어톡(이하 "회사"라 합니다)가 이용자(이하 "회원"이라 합니다)에게 제공하는 서비스 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        </div>
      </div>
      <div className="agreement-section">
        <input
          type="checkbox"
          id="privacy"
          checked={privacyChecked}
          onChange={(e) => setPrivacyChecked(e.target.checked)}
        />
        <label htmlFor="privacy">개인정보 수집 및 이용 동의 (필수)</label>
        <div className="terms-content">
          <p>수집하는 개인 정보 항목 및 수집방법 회사는 이용자가 회원제 서비스를 이용하기 위해 회원으로 가입하실 때 서비스를 위한 필수적인 정보를 온라인상에서 수집하고 있습니다.</p>
        </div>
      </div>
      <p className="agreement-info">
        이용약관 및 개인정보 수집·이용에 동의하신 후 본인확인 절차가 진행됩니다. <br />
        고객님께서는 개인정보보호법에 따라 개인정보 수집·이용 동의를 거부하실 수 있으며, 거부 시에는 이어톡 회원제 서비스 이용이 어렵습니다.
      </p>
      <div className="agreement-buttons">
        <button onClick={handleSubmit} className="agree-button">동의</button>
        <button onClick={handleCancel} className="cancel-button">취소</button>
      </div>
    </div>
  );
};

export default Agreement;
