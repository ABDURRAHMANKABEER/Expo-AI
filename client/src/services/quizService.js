import api from './api';

const quizService = {
  submitQuiz(testId, answers) {
    return api.post(`/quiz/${testId}/submit`, { answers }).then(res => res.data);
  },

  getResult(testId) {
    return api.get(`/quiz/${testId}/result`).then(res => res.data);
  },
};

export default quizService;
