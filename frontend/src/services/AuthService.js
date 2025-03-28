import $api from "../requests";

export default class AuthService {
  static async login(email, password) {
    return $api.post("/login", { email, password });
  }
  static async singin(usname, email, password) {
    return $api.post("/singin", { usname, email, password });
  }
  static async logout() {
    return $api.post("/logout");
  }
}
