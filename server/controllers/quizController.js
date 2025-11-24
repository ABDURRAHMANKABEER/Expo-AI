const Test = require("../models/Test");
const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");

// Submit Quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { userId, testId, answers } = req.body;

    // Fetch questions for the test
    const questions = await Question.find({ testId });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "Test questions not found" });
    }

    let score = 0;
    const details = answers.map((ans) => {
      const question = questions.find(q => q._id.toString() === ans.questionId);
      if (!question) return null;

      const correctOption = question.options.find(o => o.isCorrect);
      const isCorrect = correctOption.option === ans.selectedOption;
      if (isCorrect) score += question.metadata.marks;

      return {
        questionId: question._id,
        correctAnswer: correctOption.option,
        userAnswer: ans.selectedOption,
        isCorrect
      };
    }).filter(Boolean);

    const correctCount = details.filter(d => d.isCorrect).length;
    const incorrectCount = details.filter(d => !d.isCorrect).length;

    // Save attempt
    const attempt = await QuizAttempt.create({
      userId,
      testId,
      score,
      correctCount,
      incorrectCount,
      answers: details
    });

    res.json({
      message: "Quiz submitted successfully",
      totalQuestions: questions.length,
      correct: correctCount,
      incorrect: incorrectCount,
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
exports.getResults = async (req, res) => {
  try {
    const { userId, attemptId } = req.query;

    let query = { userId };
    if (attemptId) query._id = attemptId;

    const attempts = await QuizAttempt.find(query).sort({ createdAt: -1 });

    res.json({
      userId,
      attempts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};