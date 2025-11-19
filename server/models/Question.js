import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true
    },

    questionText: { type: String, required: true },

    options: [
      {
        option: String,
        isCorrect: Boolean,
      }
    ],

    explanation: { type: String },

    difficulty: { type: String, default: "medium" },

    metadata: {
      topic: String,
      subtopic: String,
      marks: Number,
    }
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);