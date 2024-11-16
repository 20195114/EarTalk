import React from 'react';

const PrivacyPolicyConsent = ({ isChecked, onChange }) => {
  return (
    <div className="agreement-section">
      <input
        type="checkbox"
        id="privacy"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="privacy">개인정보 수집 및 이용 동의 (필수)</label>
      <div className="terms-content">
        <p>
          수집하는 개인 정보 항목 및 수집방법 회사는 이용자가 회원제 서비스를 이용하기 위해 회원으로
          가입하실 때 서비스를 위한 필수적인 정보를 온라인상에서 수집하고 있습니다.
        </p>
        {/* 개인정보 수집 및 이용 동의 내용 추가 가능 */}
      </div>
    </div>
  );
};

export default PrivacyPolicyConsent;
