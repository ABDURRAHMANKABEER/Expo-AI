import { Test } from "../models/Test.js";
import { Question } from "../models/Question.js";

export const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      examType,
      organization,
      subject,
      additionalInfo,
    } = req.body;

    let attachment = {};

    if (req.file) {
      attachment = {
        fileType: req.file.mimetype,
        fileUrl: req.file.path,
      };
    }

    const test = await Test.create({
      title,
      description,
      examType,
      organization,
      subject,
      additionalInfo,
      attachment,
    });

    res.status(201).json({ message: "Test created", test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get test by ID with populated questions
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate("questions");

    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Mock AI Generator (POST /tests/generate)
export const generateQuestions = async (req, res) => {
  try {
    const { testId, numberOfQuestions } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const generatedQuestions = [];

    for (let i = 1; i <= numberOfQuestions; i++) {
      const q = await Question.create({
        testId,
        questionText: `Mock question ${i} for ${test.title}`,
        options: [
          { option: "Option A", isCorrect: i % 4 === 0 },
          { option: "Option B", isCorrect: i % 4 === 1 },
          { option: "Option C", isCorrect: i % 4 === 2 },
          { option: "Option D", isCorrect: i % 4 === 3 },
        ],
        explanation: "Mock explanation",
      });

      generatedQuestions.push(q._id);
    }

    await Test.findByIdAndUpdate(testId, {
      $push: { questions: { $each: generatedQuestions } },
    });

    res.json({
      message: "Mock questions generated",
      questions: generatedQuestions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
