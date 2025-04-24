import React, { useContext, useRef } from "react";
import Header from "./Header";
import GreenButton from "./ common/GreenButton";
import BrandName from "./ common/BrandName";
import { Context } from "../index";
import UserService from "../services/UserService";

export default function MainPage() {
  const { store } = useContext(Context);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Выбран файл:", file.name);
      UserService.loadRequest(store.user, file)
        .then(console.log("Файл успешно загружен"))
        .catch(console.log("При загрузке возникли проблемы"));
    }
  };

  const handleButtonClick = () => {
    store.isAuth
      ? fileInputRef.current.click()
      : window.open("http://localhost:3000/log-in/", "_self");
  };

  return (
    <div>
      <Header isLog={store.isAuth} />
      <main>
        <div className="block-file-container">
          <BrandName theme={"dark"} />
        </div>
        <div className="main-container">
          <div className="main-text-container">
            <p className="main-text-header">Загрузить файлы</p>
            <p className="main-text-desc">
              Передача ваших файлов — наша задача!
            </p>
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
          <GreenButton
            handle={handleButtonClick}
            mode={"upload-button"}
            content={"Выбрать файл"}
          />
        </div>
      </main>
    </div>
  );
}
