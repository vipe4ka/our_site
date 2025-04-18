import BrandName from "./ common/BrandName";
import GreenButton from "./ common/GreenButton";
import NotFound from "./NotFound";
import UserService from "../services/UserService";
import { useContext, useRef, useEffect, useState, use } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router";
import OtherPage from "./OtherPage";
import Loading from "./ common/Loading";
import FileList from "./FileList";
import { Context } from "../index";
import SearchButton from "./ common/SearchButton";
export default function UserPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { store } = useContext(Context);
  const { nickname } = useParams();
  const [update, setUpdate] = useState(null);
  const fileInputRef = useRef(null);
  const [showFiles, setShowFiles] = useState([]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Выбран файл:", file.name);
      UserService.loadRequest(nickname, file)
        .then(() => {
          console.log("Файл успешно загружен");
          setUpdate(Math.random());
        })
        .catch(console.log("При загрузке возникли проблемы"));
    }
  };
  const handleButtonClick = () => {
    store.isAuth
      ? fileInputRef.current.click()
      : window.open("http://localhost:3000/log-in/", "_self");
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await UserService.usersRequest(nickname);
        setUserData(response.data);
        setLoading(false);
        setShowFiles(response.data.files)
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        setLoading(false);
      }
    }

    fetchUserData();
  }, [nickname, update]);

  if (loading) {
    return <Loading />;
  }

  if (!userData) {
    return <NotFound />;
  }

  if (!userData.isItYou) {
    return (
      <OtherPage
        name={nickname}
        f_list={showFiles}
        setShowFiles={setShowFiles}
        all_f_list={userData.files}
        setUpdate={setUpdate}
      />
    );
  }
  return (
    <>
      <header>
        <div className="header-container">
          <Link to="/about" className="header_item ">
            <span>О НАС</span>
          </Link>
          <Link to="/user" className="header_item ">
            <span>ПОЛЬЗОВАТЕЛИ</span>
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
      </header>
      <div className="block-file-container">
        <BrandName theme={"dark"} />
      </div>
      <div>
        <div className="user-container">
          <img className="user-icon" src="/pictures/face.png" alt="face"></img>
          <div className="user-header">
            <p className="main-text-header">{store.user.toUpperCase()}</p>
            <Link to="/edit" className="header_login invert">
              <div className="header_login-text">
                <span className="white-p">Редактировать профиль</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="user-content-container">
          <p>Список файлов:</p>
          <SearchButton
          setShowFiles={setShowFiles}
          f_list={userData.files}
          />
        </div>
        <div className="user-content">
          <FileList
            isYou={true}
            f_list={showFiles}
            setUpdate={setUpdate}
          />
        </div>
      </div>
      <div className="user-button-container">
        <GreenButton
         mode={"small-button"}
         handle={() => {alert("Качаем...")}}
         content={"Скачать"} />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
        />
        <GreenButton
          mode={"small-button"}
          handle={handleButtonClick}
          content={"Поделиться"}
        />
      </div>
    </>
  );
}
