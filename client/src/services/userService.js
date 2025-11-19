import api from './api';

const userService = {
  getProfile() {
    return api.get('/users/me').then(res => res.data);
  },

  getPreviousTests() {
    return api.get('/users/me/tests').then(res => res.data);
  },
};

export default userService;
