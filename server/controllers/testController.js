import { Test } from "../models/Test.js";
import { Question } from "../models/Question.js";
import { openrouter } from "../utils/openrouter.js";

/**
 * CREATE TEST
 * - Handles multiple uploads (images/PDFs)
 * - Saves URLs from Cloudinary to test document
 */
export const createTest = async (req, res) => {
  try {
    const { title, description, examType, organization, subject, additionalInfo, numQuestions } = req.body;

    // Map uploaded files to Cloudinary URLs
    const attachments = req.files || [];
    const imageUrls = attachments
      .filter(f => f.mimetype.startsWith("image"))
      .map(f => f.path);
    const pdfUrls = attachments
      .filter(f => f.mimetype === "application/pdf")
      .map(f => f.path);

    const test = new Test({
      title,
      description,
      examType,
      organization,
      subject,
      additionalInfo,
      numQuestions: numQuestions || 10,
      imageUrls,
      pdfUrls,
      user: req.user._id,
      questions: [],
      status: "pending"
    });

    await test.save();
    res.status(201).json({ message: "Test created successfully", test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create test", error: error.message });
  }
};

/**
 * GET TEST BY ID
 * - Populates questions
 * - Only owner or admin can access
 */
export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id).populate("questions");

    if (!test) return res.status(404).json({ message: "Test not found" });

    // Optional: restrict to owner or admin
    if (test.user && 
      test.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ test });
  } catch (error) {
    res.status(500).json({ message: "Error fetching test", error: error.message });
  }
};

/**
 * GET TESTS CREATED BY LOGGED-IN USER
 * - Optional pagination
 */
export const getTestsByUser = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tests = await Test.find({ user: req.user._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Test.countDocuments({ user: req.user._id });

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      tests
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user tests", error: error.message });
  }
};

// ------------------------------------------------------
// Generate Questions via OpenRouter (GPT-4.1-mini)
// ------------------------------------------------------
export const generateQuestions = async (req, res) => {
  try {
    const { testId, additionalInfo } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const prompt = `
You must generate EXACT, mathematically and logically correct aptitude questions for tests.

RULES:
1. Do NOT invent wrong answers.
2. All calculations must be correct.
3. All terms must be standard.
4. Options MUST include exactly ONE correct answer.
5. Explanations must match the correct answer.
6. Difficulty rating must be accurate: 
   - easy: simple arithmetic, simple sets
   - medium: algebraic manipulation, basic patterns
   - hard: multi-step reasoning, tricky logic

FORMAT STRICTLY:
{
  "questions": [
    {
      "questionText": "...",
      "difficulty": "...",
      "options": [
        {"option": "...", "isCorrect": true},
        {"option": "...", "isCorrect": false},
        ...
      ],
      "explanation": "...",
      "metadata": {
        "topic": "...",
        "subtopic": "...",
        "marks": 1
      }
    }
  ]
}

DON'T include anything else outside JSON.

Do NOT add markdown or commentary. Return JSON ONLY.

Exam Details:
- Type: ${test.examType}
- Organization: ${test.organization}
- Additional Info: ${test.additionalInfo || "None"}

User Uploaded Extras:
- Image URLs: ${JSON.stringify(test.imageUrls || [])}
- PDF URLs: ${JSON.stringify(test.pdfUrls || [])}

Extra Info Passed Now:
${additionalInfo || "None"}

Generate at least ${test.numQuestions || 10} questions.
    `;

    // Call OpenRouter
    const response = await openrouter.post("/chat/completions", {
      model: "mistralai/mistral-nemo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return STRICT JSON. No markdown." },
        { role: "user", content: prompt }
      ]
    });

    const aiJSON = response.data.choices[0].message.content;
    const parsed = JSON.parse(aiJSON);

    // Insert into DB
    const questionDocs = await Question.insertMany(
      parsed.questions.map((q) => ({
        testId,
        questionText: q.questionText,
        options: q.options,
        explanation: q.explanation,
        difficulty: q.difficulty,
        metadata: q.metadata
      }))
    );

    test.questions = questionDocs.map((q) => q._id);
    test.status = "generated";
    await Test.findByIdAndUpdate(
      testId,
      {
        questions: questionDocs.map((q) => q._id),
        status: "generated"
      },
      { new: true }
    );

    res.json({
      message: "Questions generated successfully",
      count: questionDocs.length,
      questions: questionDocs
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message
    });
  }
};

// ------------------------------------------------------
// Pagination: Get Questions of a Test
// ------------------------------------------------------
export const getTestQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;

    const test = await Test.findById(id).select("questions");
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const totalQuestions = test.questions.length;

    const safePage = Math.min(page, totalQuestions || 1);
    const skip = (safePage - 1) * limit;

    // slice the question IDs first (IMPORTANT)
    const questionIds = test.questions.slice(skip, skip + limit);

    // then fetch the actual question documents
    const questions = await Question.find({
      _id: { $in: questionIds }
    }).sort({
      _id: 1
    });

    res.json({
      totalQuestions,
      currentQuestion: safePage,
      questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching test questions",
      error: error.message
    });
  }
};
