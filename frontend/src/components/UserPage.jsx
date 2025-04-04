import BrandName from "./ common/BrandName";
import GreenButton from "./ common/GreenButton";
import NotFound from "./NotFound";
import UserService from "../services/UserService";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router";
import OtherPage from "./OtherPage";
import { Context } from "../index";

export default function UserPage() {
  const { nickname } = useParams();
  const [userData, setUserData] = useState(null);
  const store = useContext(Context);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await UserService.usersRequest(nickname);
        setUserData(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    }

    fetchUserData();
  }, [nickname]); 

  if (!userData) {
    return <NotFound />;
  }

  if (!userData.isItYou) {
    return <OtherPage name={nickname} />;
  }
  return (
    <>
      <header>
        <div className="header-container">
          <Link to="/about" className="header_item ">
            <span>О НАС</span>
          </Link>
          <Link
            to="/"
            className="header_login "
            onClick={(e) => {
              e.preventDefault();
              store.logout();
            }}
          >
            <div className="header_login-text">
              <span className="white-p">ВЫХОД</span>
            </div>
          </Link>
        </div>
      </header>{" "}
      <div className="block-file-container">
        <BrandName theme={"dark"} />
      </div>
      <div>
        <div className="user-container">
          <img className="user-icon" src="/pictures/face.png" alt="face"></img>
          <div className="user-header">
            <p className="main-text-header">{nickname.toUpperCase()}</p>
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
};
