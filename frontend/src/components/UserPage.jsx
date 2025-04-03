import BrandName from "./ common/BrandName";
import GreenButton from "./ common/GreenButton";
import Header from "./Header";
import UserService from "../services/UserService"
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { Link } from "react-router";
export default function UserPage() {
  const { nickname } = useParams(); // Получение параметра nickname из URL
  const [userData, setUserData] = useState(null); // Состояние для хранения данных пользователя
  const [loading, setLoading] = useState(true); // Флаг загрузки данных

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await UserService.usersRequest(nickname); // Запрос на сервер
        setUserData(response.data); // Сохраняем полученные данные
        setLoading(false); // Завершаем загрузку
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        setLoading(false); // Завершаем загрузку даже при ошибке
      }
    }

    fetchUserData(); // Вызываем функцию для получения данных
  }, [nickname]); // Выполняем запрос только при изменении nickname

  if (loading) {
    return <p>Загрузка...</p>; // Показываем индикатор загрузки
  }

  if (!userData) {
    return <p>Пользователь не найден.</p>; // Сообщение, если пользователь не существует
  }


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
