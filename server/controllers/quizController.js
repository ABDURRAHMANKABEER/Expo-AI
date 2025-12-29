import { Test } from "../models/Test.js";
import { Question } from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempts.js";

export const submitQuiz = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const userId = req.user._id;

    const test = await Test.findById(testId).select("questions");
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const questions = await Question.find({
      _id: { $in: test.questions }
    });

    let score = 0;
    const details = [];

    for (const [page, selectedIndex] of Object.entries(answers)) {
      const questionId = test.questions[page - 1];
      const question = questions.find(
        q => q._id.toString() === questionId.toString()
      );
      if (!question) continue;

      const correctOption = question.options.find(o => o.isCorrect);
      const selectedOption = question.options[selectedIndex];

      const isCorrect =
        selectedOption &&
        correctOption &&
        selectedOption.option === correctOption.option;

      if (isCorrect) score += question.metadata?.marks || 1;

      details.push({
        questionId: question._id,
        questionText: question.text,
        userAnswer: selectedOption?.option || null,
        correctAnswer: correctOption.option,
        isCorrect,
        explanation: question.explanation || null
      });
    }

    const correctCount = details.filter(d => d.isCorrect).length;

    const attempt = await QuizAttempt.create({
      userId,
      testId,
      score,
      correctCount,
      incorrectCount: details.length - correctCount,
      answers: details
    });

    res.json({
      message: "Quiz submitted successfully",
      totalQuestions: test.questions.length,
      correct: correctCount,
      incorrect: details.length - correctCount,
      score,
      details,
      attemptId: attempt._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Quiz Results
export const getResults = async (req, res) => {
  try {
    const { userId, attemptId } = req.query;

    if (attemptId) {
      const attempt = await QuizAttempt.findById(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Result not found" });
      }
      return res.json(attempt);
    }

    const attempts = await QuizAttempt
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({ attempts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get previous quiz attempts by user
export const getPreviousAttempts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .populate("testId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await QuizAttempt.countDocuments({
      userId: req.user._id
    });

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      attempts
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching attempts" });
  }
};