import React, { useRef } from "react";
import Header from "./Header";

export default function MainPage() {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Выбран файл:", file.name);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Header />
      <main>
        <div className="block-file-container">
          <div className="file-text-container">
            <p>
              f<span>i</span>le
            </p>
          </div>
        </div>
        <div className="main-container">
          <div className="main-text-container">
            <p className="main-text-header">Загрузить файлы</p>
            <p className="main-text-desc">Передача ваших файлов — наша задача!</p>
          </div>
          <div className="image-container">
            <img src="/pictures/hosting.png" alt="main-picture" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
          />
          <button type="button" className="upload-button" onClick={handleButtonClick}>
            <span>Выбрать файл</span>
          </button>
        </div>
      </main>
    </div>
  );
}