import { Link } from "react-router";

function Header(props) {
  const { isLog } = props;
  const username = localStorage.getItem('nickname');
  return (
    <header>
      <div className="header-container">
        <Link to="/about" className="header_item ">
          <span>О НАС</span>
        </Link>
        {isLog ? (
          <Link to={"/user/"+username} className="header_login ">
            <div className="header_login-text">
              <span className="white-p">ЛИЧНЫЙ КАБИНЕТ</span>
            </div>
          </Link>
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
