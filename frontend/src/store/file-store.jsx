import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";

export default class FileStore {
  user = "";
  isAuth = false;

  constructor() {
    makeAutoObservable(this);
    this.isAuth = sessionStorage.getItem("isAuth") === "true";
    this.user = sessionStorage.getItem("nickname") || "";
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
      this.setAuth(true);
      this.setUser(res.data.user);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("nickname", this.user);
      sessionStorage.setItem("isAuth", true);
      window.open("http://localhost:3000/user/" + this.user, "_self");
    } catch (e) {
      alert("Повторите попытку входа!");
      console.log(e.response.data.message);
    }
  }
  async singin(username, email, password) {
    try {
      const res = await AuthService.singin(username, email, password);
      this.setAuth(true);
      this.setUser(username);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("nickname", username);
      sessionStorage.setItem("isAuth", true);
      window.open("http://localhost:3000/user/" + username, "_self");
    } catch (e) {
      alert("Ошибка регистрации!");
      console.log(e.response.data.message);
    }
  }
  async logout() {
    try {
      this.setAuth(false);
      this.setUser("");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("nickname");
      sessionStorage.setItem("isAuth", false);
      window.open("http://localhost:3000/", "_self");
    } catch (e) {
      alert("При выходе возникла ошибка!");
    }
  }
}
