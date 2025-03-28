import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";

export default class FileStore {
  user = {};
  isAuth = false;
  constructor() {
    makeAutoObservable(this);
  }
  setAuth(value) {
    this.isAuth = value;
  }
  setUser(user) {
    this.user = user;
  }
  async login(email, password) {
    try {
      const res = await AuthService.login(email, password);
      console.log(res);
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
      alert("Авторизация прошла успешно!");
    } catch (e) {
      alert("Повторите попытку входа!");
      console.log(e.res.data.message);
    }
  }
  async singin(usname, email, password) {
    try {
      const res = await AuthService.singin(usname, email, password);
      localStorage.setItem("token", res.data.accessToken);
      this.setAuth(true);
      this.setUser(res.data.user);
      alert("Регистриция прошла успешно!");
    } catch (e) {
      alert("Возникла ошибка регистрации!");
      console.log(e.res.data.message);
    }
  }
  async logout() {
    try {
      const res = await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({});
      alert("Вы успешно покинули систему!");
    } catch (e) {
      alert("При выходе возникла ошибка!");
      console.log(e.res.data.message);
    }
  }
}
