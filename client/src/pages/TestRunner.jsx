/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTestQuestions } from "../services/testService";
import { submitQuiz } from "../services/quizService";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";

export default function TestRunner() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [page, setPage] = useState(1);

  // Persist answers
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(`answers_${testId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const load = async () => {
    const res = await getTestQuestions(testId, page, 1);

    setQuestions(res.questions);

    // store total questions ONCE (or overwrite safely)
    if (totalQuestions === null) {
      setTotalQuestions(res.totalQuestions);
    }
  };

  // Load question when page changes
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Persist answers
  useEffect(() => {
    localStorage.setItem(`answers_${testId}`, JSON.stringify(answers));
  }, [answers, testId]);

  const handleSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [page]: optionIndex,
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        testId,
        answers,
      };

      const res = await submitQuiz(payload);

      const attemptId = res.attemptId || res.id || res._id;
      navigate(`/result?attemptId=${attemptId}`);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit test.");
    }
  };

  const isLastQuestion = totalQuestions !== null && page === totalQuestions;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Test</h1>
        <Timer duration={20 * 60} onExpire={() => alert("Time is up!")} />
      </div>

      {/* Body */}
      <div className="w-full max-w-3xl">
        {questions.map((q) => (
          <QuestionCard
            key={q._id}
            question={q}
            qIndex={page - 1}
            selectedIndex={answers[page] ?? null}
            onSelect={handleSelect}
            reveal={false}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="w-full max-w-3xl mt-6 flex justify-between">
        <button
          disabled={page <= 1}
          className={`px-4 py-2 rounded-lg font-semibold border transition ${
            page <= 1
              ? "opacity-40 cursor-default bg-gray-700"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        {isLastQuestion ? (
          <button
            className="px-5 py-2 rounded-lg font-bold bg-primary-light hover:bg-primary-light/80 text-black"
            onClick={handleSubmit}
          >
            Submit Test
          </button>
        ) : (
          <button
            className="px-4 py-2 rounded-lg font-semibold bg-primary-light text-black hover:bg-primary-light/80"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}