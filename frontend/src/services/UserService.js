import $api from "../requests";

export default class UserService {
  static usersRequest(username) {
    return $api.get(`/user/${username}`);
  }
}
