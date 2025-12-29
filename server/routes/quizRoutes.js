import express from "express";
const router = express.Router();
import { submitQuiz, getResults, getPreviousAttempts } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

// POST: Submit quiz answers
router.post("/submit", protect, submitQuiz);

// GET: Get user quiz results
router.get("/results", protect, getResults);

/* Previous Attempts */
router.get("/previous", protect, getPreviousAttempts);

export default router;