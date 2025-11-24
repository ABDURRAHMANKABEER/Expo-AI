import express from "express";
const router = express.Router();
import { submitQuiz, getResults } from "../controllers/quizController.js";

// POST: Submit quiz answers
router.post("/submit", submitQuiz);

// GET: Get user quiz results
router.get("/results", getResults);

export default router;