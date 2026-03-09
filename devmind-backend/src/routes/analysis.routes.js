import express from "express";
import {
  createAnalysis,
  getAnalyses,
  getUserAnalyses,
} from "../controllers/analysis.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create new analysis
router.post("/", protect, createAnalysis);

// Get all analyses
router.get("/", protect, getAnalyses);

router.get("/history", protect, getUserAnalyses);

export default router;
