import Header from "./Header";
import BrandName from "./ common/BrandName";
import GreenButton from "./ common/GreenButton";
import { Context } from "..";
import { useContext } from "react";
export default function OtherPage(props) {

    const { store } = useContext(Context);
  return (
    <>
      <Header isLog={store.isAuth} />
      <div className="block-file-container">
        <BrandName theme={"dark"} />
      </div>
      <div>
        <div className="user-container">
          <div className="other-header">
            <div className="other-check-text-container">
            <p className="main-text-header">{props.name.toUpperCase()}</p>
            <img
              className="check-icon"
              src="/pictures/check-icon.png"
              alt="check-icon"
            ></img></div>
            <img
              className="user-file-icon"
              src="/pictures/user-file.png"
              alt="file"
            ></img>
          </div>
        </div>
        <div className="user-content-container other-content">
          <p>Список файлов:</p>
        </div>

        <div className="user-content"></div>
      </div>
      <GreenButton mode={"small-button share-btn"} content={"Скачать"} />
    </>
  );
}
