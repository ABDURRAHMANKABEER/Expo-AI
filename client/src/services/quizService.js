import api from "./api";

/**
 * submitQuiz(payload)
 * payload: { testId, answers: [{ questionId, selectedIndex, userAnswer }], timeTaken? }
 * backend returns:
 * {
 *   message,
 *   totalQuestions,
 *   correct,
 *   incorrect,
 *   score,
 *   details,
 *   attemptId
 * }
 */
export const submitQuiz = async (payload) => {
  const res = await api.post("/api/quiz/submit", payload);
  return res.data;
};

export const getResults = async (attemptId) => {
  const url = attemptId
    ? `/api/quiz/results?attemptId=${attemptId}`
    : `/api/quiz/results`;

  const res = await api.get(url);
  return res.data;
};

// Get previous quiz attempts
export const getPreviousAttempts = async (page = 1, limit = 10) => {
  const res = await api.get(
    `/api/quiz/previous?page=${page}&limit=${limit}`
  );
  return res.data;
};