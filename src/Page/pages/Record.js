import React from "react";
import '../css/Record.css';

const Record = () => {
  const wavFiles = ["WAV 1", "WAV 2", "WAV 3", "WAV 4", "WAV 5", "WAV 6"];

  return (
    <div className="record-container">
      <aside className="logo-container">
        <img src="your-logo-url-here" alt="이어톡" className="logo-image" />
        <h1 className="logo-text">이어톡</h1>
      </aside>
      <main className="wav-list">
        {wavFiles.map((file, index) => (
          <div key={index} className="wav-item">
            {file}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Record;
