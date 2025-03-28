import $api from "../requests";

export default class UserService {
  static usersRequest() {
    return $api.get("/users");
  }
}
