import api from './api';

const authService = {
  async signup(data) {
    const res = await api.post('/api/auth/signup', data);
    return res.data;
  },

  async login(data) {
    const res = await api.post('/api/auth/login', data);

    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }

    return res.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

export default authService;
