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
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("nickname", this.user.username);
      this.setAuth(true);
      this.setUser(res.data.user);
      window.open("http://localhost:3000/user/" + this.user, "_self");
    } catch (e) {
      alert("Повторите попытку входа!");
      console.log(e.response.data.message);
    }
  }
  async singin(username, email, password) {
    try {
      const res = await AuthService.singin(username, email, password);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("nickname", username);
      this.setAuth(true);
      this.setUser(username);
      window.open("http://localhost:3000/user/" + username, "_self");
    } catch (e) {
      alert("Ошибка регистрации!");
      console.log(e.response.data.message);
    }
  }
  async logout() {
    try {
      const res = await AuthService.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      this.setAuth(false);
      this.setUser({});
      window.open("http://localhost:3000/", "_self");
    } catch (e) {
      alert("При выходе возникла ошибка!");
      console.log(e.res.data.message);
    }
  }
}
