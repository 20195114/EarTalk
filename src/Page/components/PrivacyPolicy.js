import React from 'react';
import '../css/PrivacyPolicy.css';

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="privacy-policy-modal-overlay" onClick={onClose}>
      <div
        className="privacy-policy-modal"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
      >
        <div className="privacy-policy-header">
          <h2>개인정보처리방침</h2>
          <button className="close-button" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="privacy-policy-body">
            <li>
              <strong style={{ fontSize: "15px" }}>제1조(목적)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
                이어톡(이하 ‘회사'라고 함)는 회사가 제공하고자 하는 서비스(이하 ‘회사 서비스’)를
                이용하는 개인(이하 ‘이용자’ 또는 ‘개인’)의 개인정보를 보호하기 위해, 개인정보보호법,
                정보통신망법 등 관련 법령을 준수하고, 서비스 이용자의 개인정보 보호 관련한 고충을 신속하고
                원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침(이하 ‘본 방침’)을 수립합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제2조(개인정보 처리의 원칙)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
                개인정보 관련 법령 및 본 방침에 따라 회사는 이용자의 개인정보를 수집할 수 있으며 수집된
                개인정보는 개인의 동의가 있는 경우에 한해 제3자에게 제공될 수 있습니다. 단, 법령의 규정 등에
                의해 적법하게 강제되는 경우 회사는 수집한 이용자의 개인정보를 사전에 개인의 동의 없이
                제3자에게 제공할 수도 있습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제3조(본 방침의 공개)</strong>
              <p>
                1. 회사는 이용자가 언제든지 쉽게 본 방침을 확인할 수 있도록 앱 내 메뉴를 통해 본 방침을 상시
                공개하고 있습니다.
              </p>
              <p>
                2. 회사는 제1항에 따라 본 방침을 공개하는 경우 글자 크기, 색상 등을 활용하여 이용자가 본 방침을
                쉽게 확인할 수 있도록 합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제4조(본 방침의 변경)</strong>
              <p>
                1. 본 방침은 개인정보 관련 법령, 지침, 고시 또는 정부나 회사 서비스의 정책이나 내용의 변경에 따라 개정될 수 있습니다.
              </p>
              <p>
                2. 회사는 제1항에 따라 본 방침을 개정하는 경우 다음 각 호 하나 이상의 방법으로 공지합니다.
                <p style={{ paddingLeft: "15px" }}> a. 회사가 운영하는 서비스의 공지사항란 또는 별도의 창을 통하여 공지하는 방법</p>
                <p style={{ paddingLeft: "15px" }}> b. 로그인된 이메일의 전자우편으로 이용자에게 공지하는 방법</p>
              </p>
              <p>
                3. 회사는 제2항의 공지는 본 방침 개정의 시행일로부터 최소 7일 이전에 공지합니다. 
                다만, 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 공지합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제5조(회원 가입을 위한 정보)</strong>
              <p style={{ textIndent: "0", marginLeft:"-15px", paddingRight:"10px" }}>
              회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은 정보를 수집합니다.
              </p>
              <p style={{ paddingLeft: "5px" }}>
             1. 필수 수집 정보: 이메일 주소, 생년, 성별
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제6조(본인 인증을 위한 정보)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
              회사는 이용자의 본인인증을 위하여 다음과 같은 정보를 수집합니다.
              </p>
              <p style={{ paddingLeft: "5px" }}>
                1. 필수 수집 정보: 이메일 주소, 생년, 성별
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제7조(서비스 이용 및 부정 이용 확인을 위한 정보)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
              회사는 이용자의 서비스 이용에 따른 통계∙분석 및 부정이용의 확인∙분석을 위하여 다음과 같은 정보를 수집합니다. 
              (부정이용이란 회원탈퇴 후 재가입, 상품구매 후 구매취소 등을 반복적으로 행하는 등 회사가 제공하는 할인쿠폰, 
              이벤트 혜택 등의 경제상 이익을 불·편법적으로 수취하는 행위, 이용약관 등에서 금지하고 있는 행위, 명의도용 등의 
              불·편법행위 등을 말합니다.)
              </p>
              <p style={{ paddingLeft: "5px" }}>
                1. 필수 수집 정보: 서비스 이용기록, 접속지 정보 및 기기정보
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제8조(기타 수집 정보)</strong>
              <p style={{ textIndent: "0", marginLeft:"-15px", paddingRight:"10px" }}>
              회사는 아래와 같이 정보를 수집합니다.
              </p>
              <p style={{ paddingLeft: "5px" }} >
             1. 수집목적: 이용자 콘텐츠(이하 "오디오")
              </p>
              <p style={{ paddingLeft: "5px" }}>
             2. 수집정보: 귀하가 서비스를 이용할 때, 회사는 귀하가 입력하는 사항, 업로드하는 파일 
             또는 서비스에 대해 제공하는 피드백(“콘텐츠”)에 포함된 개인정보를 수집합니다.
              </p>
              <p style={{ paddingLeft: "5px" }}>
             3. 회사는 귀하의 데이터를 더 나은 서비스 제공을 위해 분석할 수 있습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제9조(개인정보 수집 방법)</strong>
              <p style={{ textIndent: "0", marginLeft:"-15px", paddingRight:"10px" }}>
              회사는 다음과 같은 방법으로 이용자의 개인정보를 수집합니다.
              </p>
              <p style={{ paddingLeft: "5px" }}>
             1. 이용자가 회사의 홈페이지에 자신의 개인정보를 입력하는 방식
              </p>
              <p style={{ paddingLeft: "5px" }}>
             2. 어플리케이션 등 회사가 제공하는 서비스를 통해 이용자가 자신의 개인정보를 입력하는 방식
              </p>
              <p style={{ paddingLeft: "5px" }}>
             3. 이용자가 고객센터의 상담, 게시판에서의 활동 등 회사의 서비스를 이용하는 과정에서 이용자가 입력하는 방식
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제10조(개인정보의 이용)</strong>
              <p style={{ textIndent: "0", marginLeft:"-15px", paddingRight:"10px" }}>
              회사는 개인정보를 다음 각 호의 경우에 이용합니다.
              </p>
              <p style={{ paddingLeft: "5px" }}>
             1. 공지사항의 전달 등 회사운영에 필요한 경우
              </p>
              <p style={{ paddingLeft: "5px" }}>
             2. 이용문의에 대한 회신, 불만의 처리 등 이용자에 대한 서비스 개선을 위한 경우
              </p>
              <p style={{ paddingLeft: "5px" }}>
             3. 회사의 서비스를 제공하기 위한 경우
              </p>
              <p style={{ paddingLeft: "5px" }}>
             4. 법령 및 회사 약관을 위반하는 회원에 대한 이용 제한 조치, 부정 이용 행위를 포함하여 
             서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및 제재를 위한 경우
              </p>
              <p style={{ paddingLeft: "5px" }}>
             5. 이벤트 및 행사 안내 등 마케팅을 위한 경우
              </p>
              <p style={{ paddingLeft: "5px" }}>
             6. 이벤트 및 행사 안내 등 마케팅을 위한 경우
              </p>
              <p style={{ paddingLeft: "5px" }}>
             7. 인구통계학적 분석, 서비스 방문 및 이용기록의 분석을 위한 경우
              </p>
              <p style={{ paddingLeft: "5px" }}>
             8. 개인정보 및 관심에 기반한 이용자간 관계의 형성을 위한 경우
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제11조(사전동의 등에 따른 개인정보의 제공)</strong>
              <p>
                1. 회사는 개인정보 제3자 제공 금지에도 불구하고, 
                이용자가 사전에 공개하거나 다음 각호 사항에 대하여 동의한 경우에는 
                제3자에게 개인정보를 제공할 수 있습니다. 다만 이 경우에도 회사는 관련 법령 내에서 최소한으로 개인정보를 제공합니다.
             <p style={{ paddingLeft: "15px" }}>
                a. ‘OpenAI’에게 ‘API 사용’을 위하여 ‘이용자 콘텐츠’ (오디오 텍스트)을 제공
                참고: https://openai.com/enterprise-privacy
              </p>
              <p style={{ paddingLeft: "15px" }}>
                b. 단, ‘OpenAI’에게 ‘이용자 콘텐츠’ 데이터를 AI 교육 목적으로 제공하지 않습니다. 
                (Enterprise privacy at OpenAI 내용 중 일부인 ‘We do not train on your business data 
                (data from ChatGPT Team, ChatGPT Enterprise, or our API Platform’에 근거))
              </p>
              </p>
              <p>
                2. 회사는 전항의 제3자 제공 관계에 변화가 있거나 제3자 제공 관계가 종결될 때도 같은 절차에 의해 이용자에게 고지 및 동의를 구합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제12조(개인정보의 보유 및 이용기간)</strong>
              <p>
                1. 회사는 이용자의 개인정보에 대해 개인정보의 수집·이용 목적 달성을 위한 기간 동안 개인정보를 보유 및 이용합니다.
              </p>
              <p>
                2. 전항에도 불구하고 회사는 내부 방침에 의해 서비스 부정이용기록은 부정 가입 및 이용 방지를 위하여 회원 탈퇴 시점으로부터 최대 1년간 보관합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제13조(법령에 따른 개인정보의 보유 및 이용기간)</strong>
              <p style={{ textIndent: "0" }}>
              회사는 관계법령에 따라 다음과 같이 개인정보를 보유 및 이용합니다.
              </p>
              <p style={{ paddingLeft: "5px" }}>
                1. 전자상거래 등에서의 소비자보호에 관한 법률에 따른 보유정보 및 보유기간
                <p style={{ paddingLeft: "15px" }}>
                    a. 전자상거래 등에서의 소비자보호에 관한 법률에 따른 보유정보 및 보유기간
                </p>
                <p style={{ paddingLeft: "15px" }}>
                    b. 대금결제 및 재화 등의 공급에 관한 기록 : 5년
                </p>
                <p style={{ paddingLeft: "15px" }}>
                    c. 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
                </p>
                <p style={{ paddingLeft: "15px" }}>
                    d. 표시•광고에 관한 기록 : 6개월
                </p>
              </p>
              <p style={{ paddingLeft: "5px" }}>
              2. 통신비밀보호법에 따른 보유정보 및 보유기간
              <p style={{ paddingLeft: "15px" }}>
                a. 웹사이트 로그 기록 자료 : 3개월
              </p>
              </p>
              <p style={{ paddingLeft: "5px" }}>
              3. 통신비밀보호법에 따른 보유정보 및 보유기간
              <p style={{ paddingLeft: "15px" }}>
                a. 전자금융거래에 관한 기록 : 5년
              </p>
              </p>
              <p style={{ paddingLeft: "5px" }}>
              4. 통신비밀보호법에 따른 보유정보 및 보유기간
              <p style={{ paddingLeft: "15px" }}>
                a. 개인위치정보에 관한 기록 : 6개월
              </p>
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제14조(개인정보의 파기원칙)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
              회사는 원칙적으로 이용자의 개인정보 처리 목적의 달성, 보유·이용기간의 경과 등 개인정보가 필요하지 않을 경우에는 해당 정보를 지체 없이 파기합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제15조(개인정보파기절차)</strong>
              <p>
                1. 이용자가 회원가입 등을 위해 입력한 정보는 개인정보 처리 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 
                내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기 되어집니다.
                </p>
              <p>
                2. 회사는 파기 사유가 발생한 개인정보를 개인정보보호 책임자의 승인절차를 거쳐 파기합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제16조(개인정보파기방법)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
              회사는 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 
              종이로 출력된 개인정보는 분쇄기로 분쇄하거나 소각 등을 통하여 파기합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제17조(광고성 정보의 전송 조치)</strong>
              <p>
              1. 회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 이용자의 명시적인 사전동의를 받습니다. 
              다만, 다음 각호 어느 하나에 해당하는 경우에는 사전 동의를 받지 않습니다
              <p style={{ paddingLeft: "15px" }}>
                a. 회사가 재화 등의 거래관계를 통하여 수신자로부터 직접 연락처를 수집한 경우, 
                거래가 종료된 날로부터 6개월 이내에 회사가 처리하고 수신자와 거래한 것과 동종의 재화 등에 대한 영리목적의 광고성 정보를 전송하려는 경우
              </p>
              <p style={{ paddingLeft: "15px" }}>
                b. 「방문판매 등에 관한 법률」에 따른 전화권유판매자가 육성으로 수신자에게 개인정보의 수집출처를 고지하고 전화권유를 하는 경우
              </p>
              </p>
              <p>
                2. 회사는 전항에도 불구하고 수신자가 수신거부의사를 표시하거나 사전 동의를 철회한 경우에는 
                영리목적의 광고성 정보를 전송하지 않으며 수신거부 및 수신동의 철회에 대한 처리 결과를 알립니다.
              </p>
              <p>
                3. 회사는 오후 9시부터 그다음 날 오전 8시까지의 시간에 전자적 전송매체를 이용하여 
                영리목적의 광고성 정보를 전송하는 경우에는 제1항에도 불구하고 그 수신자로부터 별도의 사전 동의를 받습니다.
              </p>
              <p>
                4. 회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 
                다음의 사항 등을 광고성 정보에 구체적으로 밝힙니다.
                <p style={{ paddingLeft: "15px" }}>
                a. 회사명 및 연락처
              </p>
              <p style={{ paddingLeft: "15px" }}>
                b. 수신 거부 또는 수신 동의의 철회 의사표시에 관한 사항의 표시
              </p>
              </p>
              <p>
                5. 회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 
                다음 각 호의 어느 하나에 해당하는 조치를 하지 않습니다.
                <p style={{ paddingLeft: "15px" }}>
                a. 광고성 정보 수신자의 수신거부 또는 수신동의의 철회를 회피·방해하는 조치
              </p>
              <p style={{ paddingLeft: "15px" }}>
                b. 숫자·부호 또는 문자를 조합하여 전화번호·전자우편주소 등 수신자의 연락처를 자동으로 만들어 내는 조치
              </p>
              <p style={{ paddingLeft: "15px" }}>
                c. 영리목적의 광고성 정보를 전송할 목적으로 전화번호 또는 전자우편주소를 자동으로 등록하는 조치
              </p>
              <p style={{ paddingLeft: "15px" }}>
                d. 광고성 정보 전송자의 신원이나 광고 전송 출처를 감추기 위한 각종 조치
              </p>
              <p style={{ paddingLeft: "15px" }}>
                e. 영리목적의 광고성 정보를 전송할 목적으로 수신자를 기망하여 회신을 유도하는 각종 조치
              </p>
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제18조(개인정보 조회 및 수집동의 철회)</strong>
              <p>
                1. 이용자 및 법정 대리인은 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 개인정보수집 동의 철회를 요청할 수 있습니다.
              </p>
              <p>
                2. 이용자 및 법정 대리인은 자신의 가입정보 수집 등에 대한 동의를 철회하기 위해서는 개인정보보호책임자 
                또는 담당자에게 서면, 전화 또는 전자우편주소로 연락하시면 회사는 지체 없이 조치하겠습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제19조(개인정보 정보변경 등)</strong>
              <p>
                1. 이용자는 회사에게 전조의 방법을 통해 개인정보의 오류에 대한 정정을 요청할 수 있습니다.
              </p>
              <p>
                2. 회사는 전항의 경우에 개인정보의 정정을 완료하기 전까지 개인정보를 이용 
                또는 제공하지 않으며 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 
                제3자에게 지체 없이 통지하여 정정이 이루어지도록 하겠습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제20조(이용자의 의무)</strong>
              <p>
                1. 이용자는 자신의 개인정보를 최신의 상태로 유지해야 하며, 
                이용자의 부정확한 정보 입력으로 발생하는 문제의 책임은 이용자 자신에게 있습니다.
              </p>
              <p>
                2. 타인의 개인정보를 도용한 회원가입의 경우 이용자 자격을 상실하거나 
                관련 개인정보보호 법령에 의해 처벌받을 수 있습니다.
              </p>
              <p>
                3. 이용자는 전자우편주소, 비밀번호 등에 대한 보안을 유지할 책임이 있으며 
                제3자에게 이를 양도하거나 대여할 수 없습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제21조(회사의 개인정보 관리)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
              회사는 이용자의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 유출, 변조, 훼손 등이 되지 아니하도록 
              안전성을 확보하기 위하여 필요한 기술적·관리적 보호대책을 강구하고 있습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제22조(삭제된 정보의 처리)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
              회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 회사가 수집하는 
              "개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의 용도로 열람 
              또는 이용할 수 없도록 처리하고 있습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제23조(비밀번호의 암호화)</strong>
              <p style={{ textIndent: "0" }}>
              이용자의 비밀번호는 일방향 암호화하여 저장 및 관리되고 있으며, 
              개인정보의 확인, 변경은 비밀번호를 알고 있는 본인에 의해서만 가능합니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제24조(해킹 등에 대비한 대책)</strong>
              <p>
                1. 회사는 해킹, 컴퓨터 바이러스 등 정보통신망 침입에 의해 
                이용자의 개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을 다하고 있습니다.
              </p>
              <p>
                2. 회사는 최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가 유출 또는 손상되지 않도록 방지하고 있습니다.
              </p>
              <p>
                3. 회사는 만일의 사태에 대비하여 침입차단 시스템을 이용하여 보안에 최선을 다하고 있습니다.
              </p>
              <p>
                4. 회사는 민감한 개인정보(를 수집 및 보유하고 있는 경우)를 암호화 통신 등을 통하여 
                네트워크상에서 개인정보를 안전하게 전송할 수 있도록 하고 있습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제25조(개인정보 처리 최소화 및 교육)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
              회사는 개인정보 관련 처리 담당자를 최소한으로 제한하며, 
              개인정보 처리자에 대한 교육 등 관리적 조치를 통해 법령 및 내부방침 등의 준수를 강조하고 있습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제26조(개인정보 유출 등에 대한 조치)</strong>
              <p style={{ textIndent: "0" , marginLeft:"-15px", paddingRight:"10px"}}>
              회사는 개인정보의 분실·도난·유출(이하 "유출 등"이라 한다) 사실을 안 때에는 지체 없이 
              다음 각 호의 모든 사항을 해당 이용자에게 알리고 방송통신위원회 또는 한국인터넷진흥원에 신고합니다.
              </p>
              <p style={{ paddingLeft: "5px" }}>
                1. 유출 등이 된 개인정보 항목
              </p>
              <p style={{ paddingLeft: "5px" }}>
                2. 유출 등이 발생한 시점
              </p>
              <p style={{ paddingLeft: "5px" }}>
                3. 이용자가 취할 수 있는 조치
              </p>
              <p style={{ paddingLeft: "5px" }}>
                4. 정보통신서비스 제공자 등의 대응 조치
              </p>
              <p style={{ paddingLeft: "5px" }}>
                5. 이용자가 상담 등을 접수할 수 있는 부서 및 연락처
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제27조(개인정보 유출 등에 대한 조치의 예외)</strong>
              <p style={{ textIndent: "0", marginLeft:"-15px", paddingRight:"10px" }}>
              회사는 전조에도 불구하고 이용자의 연락처를 알 수 없는 등 정당한 사유가 있는 경우에는 
              회사의 홈페이지에 30일 이상 게시하는 방법으로 전조의 통지를 갈음하는 조치를 취할 수 있습니다.
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제28조(회사의 개인정보 보호 책임자 지정)</strong>
              <p>
                1. 회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 
                아래와 같이 관련 부서 및 개인정보 보호 책임자를 지정하고 있습니다.
                <p style={{ paddingLeft: "15px" }}>
                    a. 개인정보 보호 책임자
                    <p style={{ paddingLeft: "25px" }}>
                        i. 성명: 김소율
                        </p>
                        <p style={{ paddingLeft: "25px" }}>
                        ii. 이메일: eartalk.for@gmail.com
                        </p>
              </p>
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>제29조(권익침해에 대한 구제방법)</strong>
              <p>
                1. 정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 
                한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 
                이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
                <p style={{ paddingLeft: "15px" }}>
                a. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
              </p>
              <p style={{ paddingLeft: "15px" }}>
                b. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
              </p>
              <p style={{ paddingLeft: "15px" }}>
                c. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)
              </p>
              <p style={{ paddingLeft: "15px" }}>
                d. 경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)
              </p>
              </p>
              <p>
                2. 회사는 정보주체의 개인정보자기결정권을 보장하고, 개인정보침해로 인한 상담 및 피해 구제를 위해 노력하고 있으며, 
                신고나 상담이 필요한 경우 제1항의 담당부서로 연락해주시기 바랍니다.
              </p>
              <p>
                3. 개인정보 보호법 제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 
                대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.
                <p style={{ paddingLeft: "15px" }}>
                a. 중앙행정심판위원회 : (국번없이) 110 (www.simpan.go.kr)
              </p>
              </p>
            </li>
            <li>
              <strong style={{ fontSize: "15px" }}>부칙</strong>
              <p style={{ textIndent: "0", marginLeft:"-15px", paddingRight:"10px" }}>
              제1조 본 방침은 2024.11.10부터 시행됩니다.
              </p>
            </li>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
