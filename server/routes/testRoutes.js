import express from "express";
import { 
  createTest, 
  getTestById, 
  generateQuestions ,
  getTestQuestions
} from "../controllers/testController.js";

import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { protect /*, roleAuth */ } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * CREATE TEST
 * - Protected: user must be logged in
 * - Supports MULTIPLE uploads: images or PDFs
 * - Field name: "attachments"
 */
router.post(
  "/", 
  protect,
  uploadMiddleware.array("attachments", 3),  // up to 3 files
  createTest
);

/**
 * GENERATE QUESTIONS (AI)
 * - Protected: user must be logged in
 * - Body: { testId, additionalInfo }
 * - Optional: uncomment roleAuth to restrict to admins only
 */
router.post("/generate", protect, /* roleAuth('admin'), */ generateQuestions);

router.get("/:id/questions", protect, getTestQuestions);

/**
 * GET TEST BY ID (with questions)
 * - Protected: only authenticated users can fetch their tests (or admins)
 */
router.get("/:id", protect, getTestById);

export default router;