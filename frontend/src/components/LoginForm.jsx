import { useContext, useState } from "react";
import GreenButton from "./ common/GreenButton";
import { Context } from "../index";
import BrandName from "./ common/BrandName";
export default function LoginForm(props) {
  const { isRegist } = props;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store } = useContext(Context);

  return (
    <>
      <BrandName theme={"light"} />
      <img
        className="regist-icon i_right"
        src="/pictures/reg-right.png"
        alt="icon"
      ></img>
      <img
        className="regist-icon i_left"
        src="/pictures/reg-left.png"
        alt="icon"
      ></img>
      <img
        className="regist-icon i_middle"
        src="/pictures/reg-middle.png"
        alt="icon"
      ></img>
      <img
        className="regist-icon i_bottom"
        src="/pictures/reg-bottom.png"
        alt="icon"
      ></img>
      <div className="form-content">
        <div className="form-header">
          <img src="/pictures/face.png" alt="face"></img>
          <p>{isRegist ? "РЕГИСТРАЦИЯ" : "ВХОД"}</p>
        </div>
        <div className="form-container">
          {isRegist && (
            <div className="form-item">
              <p className="form-text">ФИО</p>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder=""
              />
            </div>
          )}
          <div className="form-item">
            <p className="form-text">email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder=""
            />
          </div>
          <div className="form-item">
            <p className="form-text">Пароль</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder=""
            />
          </div>
          <GreenButton
            mode={"small-button"}
            content={isRegist ? "Зарегистрироваться" : "Войти"}
            handle={() => {
              isRegist
                ? store.singin(username, email, password)
                : store.login(email, password);
            }}
          />
        </div>
      </div>
    </>
  );
}
