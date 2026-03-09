import prisma from "../config/db.js";
import { analyzeCodeWithAI } from "../services/openAI.service.js";

export const createAnalysis = async (req, res) => {
  try {
    const { language, code } = req.body;

    // Validate required fields
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "Code is required" });
    }
    if (!language) {
      return res.status(400).json({ error: "Language is required" });
    }

    const userId = req.user.id;

    // Analyze code with AI
    let aiResult;
    try {
      aiResult = await analyzeCodeWithAI(code, language);
    } catch (aiError) {
      console.error("OpenAI API error:", aiError.message);
      return res.status(503).json({
        error: "AI service is currently unavailable. Please try again.",
      });
    }

    const newAnalysis = await prisma.analysis.create({
      data: {
        userId,
        language,
        code,
        analysis: aiResult.analysis,
        explanation: aiResult.explanation,
        optimization: aiResult.optimization,
        documentation: aiResult.documentation,
      },
    });

    res.status(201).json(newAnalysis);
  } catch (error) {
    console.error("createAnalysis error:", error);
    res.status(500).json({ error: "Failed to analyze code" });
  }
};

export const getAnalyses = async (req, res) => {
  try {
    const analyses = await prisma.analysis.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(analyses);
  } catch (error) {
    console.error("getAnalyses error:", error);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
};

export const getUserAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    const analyses = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        language: true,
        code: true,
        createdAt: true,
      },
    });
    res.status(200).json(analyses);
  } catch (error) {
    console.error("getUserAnalyses error:", error);
    res.status(500).json({ error: "Failed to fetch analysis history" });
  }
};
