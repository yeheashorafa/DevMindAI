import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const analyzeCodeWithAI = async (code, language) => {
  const prompt = `You are an expert software engineer.
Analyze the following ${language} code and return ONLY a valid JSON object with exactly these fields:

{
  "analysis": "potential bugs, issues, and code quality problems found",
  "explanation": "step by step explanation of what the code does",
  "optimization": "performance and readability improvements with specific suggestions",
  "documentation": "JSDoc comments and documentation suggestions"
}

Do NOT wrap the JSON in markdown code fences. Return raw JSON only.

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a code analysis expert. Always respond with valid JSON only, no markdown formatting.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const text = response.choices[0].message.content;

  try {
    // Strip markdown fences as a safety net (in case model ignores instructions)
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      analysis: parsed.analysis || "",
      explanation: parsed.explanation || "",
      optimization: parsed.optimization || "",
      documentation: parsed.documentation || "",
    };
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error.message);
    console.error("Raw AI response:", text);
    // Fallback: return raw text in analysis field
    return {
      analysis: text,
      explanation: "",
      optimization: "",
      documentation: "",
    };
  }
};
