import api from "./api";

/**
 * createTest(payload)
 * Expects backend to return: { message, test }
 */
export const createTest = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/api/tests", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { message, test }
};

/**
 * generateTest(payload)
 * backend blocks until generation completes and returns the generated test or a success message.
 * We'll send { testId } if available. Some servers may accept full metadata too.
 */
export const generateTestQuestions = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/api/tests/generate", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

/**
 * getTestById(id)
 * Returns populated Test object (with questions array).
 */
export const getTestById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/api/tests/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

/**
 * getTestQuestions(testId, page=1, limit=1)
 */
export const getTestQuestions = async (testId, page = 1, limit = 1) => {
  const res = await api.get(
    `/api/tests/${testId}/questions?page=${page}&limit=${limit}`
  );
  return res.data;
};