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
      <p style={{ textIndent: "0" }}>
      이어톡은(는) 『개인정보 보호법』 등 관련 법령에 따라 이용자의 개인정보를 보호하고, 
      개인정보와 관련한 이용자의 권익을 보호하기 위하여 다음과 같이 개인정보를 수집 및 이용하고자 합니다. 
      아래 내용을 자세히 읽어보신 후 동의 여부를 결정해 주시기 바랍니다.
        </p>
        <strong style={{ fontSize: "13px"}}>1. 수집하는 개인정보 항목</strong>
      <p style={{ textIndent: "0" }}>
        <li>필수항목: 이메일 주소, 생년, 성별</li>
        </p>
        <strong style={{ fontSize: "13px"}}>2. 개인정보의 수집 및 이용 목적</strong>
      <p style={{ textIndent: "0" }}>
        <li>회원 가입 및 관리</li>
        <li>서비스 제공 및 이행</li>
        </p>
        <strong style={{ fontSize: "13px"}}>3. 개인정보의 보유 및 이용 기간</strong>
      <p style={{ textIndent: "0" }}>
        <li>회원 탈퇴 시까지</li>
        <li>단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보유</li>
        </p>
        <strong style={{ fontSize: "13px"}}>4. 동의 거부 권리 및 불이익</strong>
      <p style={{ textIndent: "0" }}>
        <li>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다</li>
        <li>다만, 필수항목에 대한 동의를 거부하실 경우 서비스 이용에 제한이 있을 수 있습니다.</li>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyConsent;
