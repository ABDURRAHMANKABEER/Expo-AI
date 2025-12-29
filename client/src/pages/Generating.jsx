import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateTestQuestions, getTestById } from "../services/testService";

export default function Generating() {
  const { testId } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const generate = async () => {
      try {
        // 1. Fetch test
        console.log(testId);
        const { test } = await getTestById(testId);
        if (!test) throw new Error("Test not found");

        // 2. Prepare info
        const additionalInfo = test.additionalInfo || "";

        // 3. Generate questions
        await generateTestQuestions({ testId, additionalInfo });

        // 4. Navigate to test view page
        nav(`/test/${testId}`);
      } catch (err) {
        alert(
          "Generation failed: " + (err.response?.data?.message || err.message)
        );
        return;
      }
    };

    generate();
  }, [nav, testId]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">Generating Questions...</h1>
      <p className="opacity-70">AI is generating your test. Please wait.</p>

      <div className="mt-8 animate-spin border-4 border-gray-400 border-t-transparent rounded-full w-16 h-16"></div>
    </div>
  );
}