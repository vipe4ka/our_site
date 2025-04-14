import Loading from "./ common/Loading";
import { useContext, useEffect, useState } from "react";
import UserService from "../services/UserService";
import Header from "./Header";
import { Context } from "..";
import NotFound from "./NotFound";
import CardItem from "./ common/cardItem";
import { Link } from "react-router";
import BrandName from "./ common/BrandName";
export default function AllUsers() {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { store } = useContext(Context);
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await UserService.getUsers();
        setUsersData(
          response.data.users.filter(
            (user) => user.nickname !== sessionStorage.getItem("nickname")
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении данных пользователей:", error);
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (!store.isAuth) {
    return <NotFound />;
  }
  return (
    <>
    <div className="all-header-container">
      <BrandName theme={"light"}/>
      <Header isLog={store.isAuth} />
    </div>
      <div className="card-user-container">
        {usersData.map((item) => {
          return (
            <Link to={`/user/${item.nickname}`}>
              <CardItem nickname={item.nickname} fcount={item.fcount} />
            </Link>
          );
        })}
      </div>
    </>
  );
}
