import { Link } from "react-router";

function Header() {
  return (
    <header>
      <div className="header-container">
        <Link to="/about" className="header_item ">
          <span>О НАС</span>
        </Link>
        <Link to="/sing-in" className="header_item ">
          <span>ЗАРЕГИСТРИРОВАТЬСЯ</span>
        </Link>
        <Link to="/log-in" className="header_login ">
          <div className="header_login-text">
            <span className="white-p">ВОЙТИ</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
export default Header;
