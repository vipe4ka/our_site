import BrandName from "./ common/BrandName";
import GreenButton from "./ common/GreenButton";
import Header from "./Header";
import { Link } from "react-router";
export default function UserPage() {
  return (
    <>
      <Header isLog={true} />
      <div className="block-file-container">
        <BrandName theme={"dark"} />
      </div>
      <div>
        <div className="user-container">
          <img src="/pictures/face.png" alt="face"></img>
          <div className="user-header">
            <p className="main-text-header">ЮЗЕРНЭЙМ</p>
            <Link to="/edit" className="header_login invert">
              <div className="header_login-text">
                <span className="white-p">Редактировать профиль</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="user-content-container">
          <p>Список файлов:</p>
          <div className="toggle-btn">
            <input type="checkbox" id="toggle-btn" />
            <label for="toggle-btn"></label>
          </div>
        </div>

        <div className="user-content"></div>
      </div>
      <GreenButton mode={"small-button share-btn"} content={"Поделиться"} />
    </>
  );
}
