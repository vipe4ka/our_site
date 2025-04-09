import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";

export default class FileStore {
  user = "";
  isAuth = false;

  constructor() {
    makeAutoObservable(this);
    this.isAuth = localStorage.getItem("isAuth") === "true";
    this.user = localStorage.getItem("nickname") || "";
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
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("nickname", this.user);
      localStorage.setItem("isAuth", true);
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
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("nickname", username);
      localStorage.setItem("isAuth", true);
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
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      localStorage.setItem("isAuth", false);
      window.open("http://localhost:3000/", "_self");
    } catch (e) {
      alert("При выходе возникла ошибка!");
    }
  }
}
