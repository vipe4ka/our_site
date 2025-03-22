function Header() {
  return (
    <header>
      <div className="header-container">
        <a href="/about" className="header_item ">
          <span>О НАС</span>
        </a>
        <a href="/sign-up" className="header_item ">
          <span>ЗАРЕГИСТРИРОВАТЬСЯ</span>
        </a>
        <a href="/log-in" className="header_login ">
          <div className="header_login-text">
            <span className="white-p">ВОЙТИ</span>
          </div>
        </a>
      </div>
    </header>
  );
}
export default Header;
