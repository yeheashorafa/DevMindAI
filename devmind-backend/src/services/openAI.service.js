import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const AI_PROVIDER = process.env.AI_PROVIDER || "static"; // "openai" | "ollama" | "static"

let openaiClient = null;
if (AI_PROVIDER === "openai") {
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "[AI] AI_PROVIDER=openai لكن OPENAI_API_KEY غير موجود. سيتم استخدام fallback static."
    );
  } else {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
}

const parseAIResponseToResult = (textOrObject) => {
  if (typeof textOrObject === "object" && textOrObject !== null) {
    return {
      analysis: textOrObject.analysis || "",
      explanation: textOrObject.explanation || "",
      optimization: textOrObject.optimization || "",
      documentation: textOrObject.documentation || "",
    };
  }

  const text = String(textOrObject);

  try {
    const parsed = JSON.parse(
      text
        .trim()
        .replace(/^```(?:json)?\n?/i, "")
        .replace(/\n?```$/i, "")
    );

    return {
      analysis: parsed.analysis || "",
      explanation: parsed.explanation || "",
      optimization: parsed.optimization || "",
      documentation: parsed.documentation || "",
    };
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error.message);
    console.error("Raw AI response:", text);
    return {
      analysis: text,
      explanation: "",
      optimization: "",
      documentation: "",
    };
  }
};

const buildPrompt = (code, language) => {
  return `You are an expert software engineer.
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
};

const analyzeWithOpenAI = async (code, language) => {
  if (!openaiClient) {
    throw new Error("OpenAI client is not configured");
  }

  const prompt = buildPrompt(code, language);

  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a code analysis expert. Always respond with valid JSON only, no markdown formatting.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const text = response.choices[0].message.content;
  return parseAIResponseToResult(text);
};

const analyzeWithOllama = async (code, language) => {
  const prompt = buildPrompt(code, language);
  const model = process.env.OLLAMA_MODEL || "llama3";
  const endpoint = process.env.OLLAMA_ENDPOINT || "http://localhost:11434/api/chat";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a code analysis expert. Always respond with valid JSON only, no markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Ollama request failed with status ${res.status}: ${text || res.statusText}`
    );
  }

  const data = await res.json();
  const text = data?.message?.content || data?.choices?.[0]?.message?.content || "";
  return parseAIResponseToResult(text);
};

const analyzeStatically = (code, language) => {
  const lang = (language || "").toLowerCase();
  const lines = code.split("\n");
  const lineCount = lines.length;

  const hasConsoleLog = code.includes("console.log");
  const hasEval = code.includes("eval(");
  const hasTodo = /TODO|FIXME/i.test(code);
  const hasInnerHTML = /innerHTML\s*=/.test(code);
  const hasDangerousReact = /dangerouslySetInnerHTML/.test(code);
  const hasAnyLoop = /(for|while)\s*\(/.test(code);
  const longFunctions = (code.match(/function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?}/g) || []).filter(
    (fn) => fn.split("\n").length > 40
  );

  const analysisParts = [];

  if (hasEval) {
    analysisParts.push(
      "- Security: Usage of `eval` detected. This is generally unsafe and should be avoided for security and performance reasons."
    );
  }
  if (hasInnerHTML || hasDangerousReact) {
    analysisParts.push(
      "- Security: Direct DOM HTML injection (`innerHTML` / `dangerouslySetInnerHTML`) detected. Make sure all content is sanitized to avoid XSS vulnerabilities."
    );
  }
  if (hasConsoleLog) {
    analysisParts.push(
      "- Cleanliness: Many `console.log` statements can clutter output; consider removing them or using a proper logger."
    );
  }
  if (hasTodo) {
    analysisParts.push(
      "- Maintenance: Found TODO/FIXME comments. Make sure to address them before production."
    );
  }
  if (hasAnyLoop && lineCount > 150) {
    analysisParts.push(
      "- Performance: Detected loops in a relatively large file. Review nested loops and heavy computations for potential optimizations."
    );
  }
  if (longFunctions.length > 0) {
    analysisParts.push(
      `- Design: Detected ${longFunctions.length} long function(s) (> 40 lines). Consider splitting them into smaller, focused helpers.`
    );
  }
  if (analysisParts.length === 0) {
    analysisParts.push(
      "- No obvious red flags were detected with simple static checks. A deeper review or AI model could still find issues."
    );
  }

  const explanation = [
    `- The snippet is treated as ${lang || "generic"} code.`,
    `- It contains approximately ${lineCount} lines of code.`,
    "- This explanation is generated by a simple static analyzer (no external AI model).",
  ].join("\n");

  const optimization = [
    "- Consider breaking large functions into smaller, focused ones to improve readability and testability.",
    "- Use consistent naming conventions and formatting across the codebase.",
    "- Remove dead code, commented-out blocks, and unnecessary logs before deploying to production.",
  ].join("\n");

  const documentation = [
    "You can document your main function like this (example):",
    "",
    "/**",
    " * Briefly describes what this function does.",
    " *",
    " * @param {...any} args - Describe the parameters here.",
    " * @returns {any} Describe the return value here.",
    " */",
    "function example(/* args */) {",
    "  // ...",
    "}",
  ].join("\n");

  return {
    analysis: analysisParts.join("\n"),
    explanation,
    optimization,
    documentation,
  };
};

export const analyzeCodeWithAI = async (code, language) => {
  if (AI_PROVIDER === "openai" && openaiClient) {
    return analyzeWithOpenAI(code, language);
  }

  if (AI_PROVIDER === "ollama") {
    return analyzeWithOllama(code, language);
  }

  console.info(
    `[AI] Using static analysis provider (AI_PROVIDER=${AI_PROVIDER}). No external API will be called.`
  );
  return analyzeStatically(code, language);
};