import express from "express";
import { createTest, getTestById, generateQuestions } from "../controllers/testController.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create test (supports image/pdf)
router.post("/", uploadMiddleware.single("file"), createTest);

// Get test + questions
router.get("/:id", getTestById);

// Generate mock questions
router.post("/generate", generateQuestions);

export default router;