import { Link } from "react-router";
import { Context } from "..";
import { useContext } from "react";
function Header(props) {
  const { isLog } = props;
  const { store } = useContext(Context);

  return (
    <header>
      <div className="header-container">
        <Link to="/about" className="header_item ">
          <span>О НАС</span>
        </Link>
        {isLog ? (
          <>
            <Link to="/user" className="header_item ">
              <span>ПОЛЬЗОВАТЕЛИ</span>
            </Link>
            <Link to={"/user/" + store.user} className="header_login ">
              <div className="header_login-text">
                <span className="white-p">ЛИЧНЫЙ КАБИНЕТ</span>
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/sing-in" className="header_item ">
              <span>ЗАРЕГИСТРИРОВАТЬСЯ</span>
            </Link>
            <Link to="/log-in" className="header_login ">
              <div className="header_login-text">
                <span className="white-p">ВОЙТИ</span>
              </div>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
export default Header;
