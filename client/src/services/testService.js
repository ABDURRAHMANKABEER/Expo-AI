import api from './api';

const testService = {
  async createTest(data) {
    return api.post('/tests', data).then(res => res.data);
  },

  async getTestById(id) {
    return api.get(`/tests/${id}`).then(res => res.data);
  },

  async generateQuestions(payload) {
    return api.post('/tests/generate', payload).then(res => res.data);
  },
};

export default testService;