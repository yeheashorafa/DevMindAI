import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

// تسجيل مستخدم جديد
router.post("/register", registerUser);

// تسجيل دخول
router.post("/login", loginUser);

export default router;