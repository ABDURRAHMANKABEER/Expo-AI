import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPreviousAttempts } from "../services/quizService";

export default function Previous() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPreviousAttempts();
        setAttempts(data.attempts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading previous tests...
      </div>
    );
  }

  if (!attempts.length) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        No previous tests found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8">
          Previous Tests
        </h1>

        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div
              key={attempt._id}
              onClick={() =>
                navigate(`/result?attemptId=${attempt._id}`)
              }
              className="cursor-pointer p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    {attempt.testId?.title || "Untitled Test"}
                  </h2>
                  <p className="text-sm opacity-70">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-primary-light">
                    {attempt.score}
                  </p>
                  <p className="text-xs opacity-70">Score</p>
                </div>
              </div>

              <div className="mt-2 text-sm flex gap-4">
                <span className="text-green-500">
                  ✔ {attempt.correctCount} correct
                </span>
                <span className="text-red-500">
                  ✖ {attempt.incorrectCount} incorrect
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}