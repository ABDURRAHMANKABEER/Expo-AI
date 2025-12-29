import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { getResults } from "../services/quizService";

export default function Result() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const attemptId = params.get("attemptId");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getResults(attemptId);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading results...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        No result found.
      </div>
    );
  }

  const {
    score,
    correctCount,
    incorrectCount,
    answers = []
  } = result;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8">Your Result</h1>

        {/* Score summary */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div>
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-sm">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              {correctCount}
            </div>
            <div className="text-sm">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-500">
              {incorrectCount}
            </div>
            <div className="text-sm">Incorrect</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          {answers.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-slate-800 rounded-lg"
            >
              <p className="font-medium mb-1">
                {idx + 1}. {item.questionText}
              </p>

              <p className="text-sm">
                Your answer:{" "}
                <span
                  className={
                    item.isCorrect ? "text-green-500" : "text-red-500"
                  }
                >
                  {item.userAnswer}
                </span>
              </p>

              {!item.isCorrect && (
                <p className="text-sm">
                  Correct answer:{" "}
                  <span className="text-green-500">
                    {item.correctAnswer}
                  </span>
                </p>
              )}

              {item.explanation && (
                <div className="mt-2 text-sm opacity-80">
                  {item.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Go Home
          </Button>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Retake Test
          </Button>
        </div>
      </div>
    </div>
  );
}