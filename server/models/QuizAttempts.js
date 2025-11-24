import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  testId: { type: String, required: true },
  score: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  answers: [
    {
      questionId: { type: String },
      correctAnswer: { type: String },
      userAnswer: { type: String },
      isCorrect: { type: Boolean }
    }
  ]
}, { timestamps: true });

export default mongoose.model("QuizAttempt", quizAttemptSchema);