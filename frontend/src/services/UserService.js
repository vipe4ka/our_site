import $api from "../requests";

export default class UserService {
  static usersRequest(username) {
    return $api.get(`/user/${username}`);
  }
  
  static getUsers() {
    return $api.get(`/user/getUsers`);
  }
  
  static loadRequest(username, file) {
    const formData = new FormData();
    formData.append('file', file);
    return $api.post(`/user/${username}/loadFile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=UTF-8'
      }
    });
  }

  static deleteRequest(username, fileId) {
    return $api.delete(`/user/${username}/deleteFile?fileId=${fileId}`);
  }

  static changeVisibilityRequest(username, fileId, newVisibilityStatus) {
    return $api.put(`/user/${username}/changeFileVisibility?fileId=${fileId}&newVisibilityStatus=${newVisibilityStatus}`);
  }

}
