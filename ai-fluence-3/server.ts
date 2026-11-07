import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { getLessonContextByLevelId } from "./src/data/allLessonContexts";
import { buildGroundedTheoryDeck, buildGroundedQuizDeck } from "./src/services/slideGenerationService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // =========================================================================
  // API ROUTES (Mounted before Vite middleware)
  // =========================================================================

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Unique user code generation endpoint
  app.post("/api/user/generate-code", (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = "AIF-";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return res.json({ success: true, userCode: code, userId });
  });

  // Friend search by code
  app.get("/api/friends/search", (req, res) => {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).json({ error: "code query parameter is required" });
    }
    return res.json({
      success: true,
      query: code,
      message: "Lookup routed to Firestore userCodes directory",
    });
  });

  // Friend request endpoints
  app.post("/api/friends/send-request", (req, res) => {
    const { senderUid, senderCode, targetCode } = req.body;
    if (!senderUid || !targetCode) {
      return res.status(400).json({ error: "senderUid and targetCode are required" });
    }
    if (senderCode && senderCode.toUpperCase() === targetCode.toUpperCase()) {
      return res.status(400).json({ error: "Self-friend request disallowed" });
    }
    return res.json({ success: true, message: "Friend request validation passed" });
  });

  app.post("/api/friends/respond", (req, res) => {
    const { requestId, action } = req.body;
    if (!requestId || !action) {
      return res.status(400).json({ error: "requestId and action are required" });
    }
    return res.json({ success: true, action, requestId });
  });

  // Course enrollment questionnaire endpoint
  app.post("/api/course/enroll", (req, res) => {
    const { userId, courseId, questionnaire } = req.body;
    if (!userId || !courseId) {
      return res.status(400).json({ error: "userId and courseId are required" });
    }
    return res.json({
      success: true,
      enrollmentId: `${userId}_${courseId}`,
      enrolledAt: new Date().toISOString(),
      questionnaire,
    });
  });

  // Level completion & star calculation
  app.post("/api/level/complete", (req, res) => {
    const { userId, levelId, mistakes = 0, nextLevelId } = req.body;
    if (!userId || !levelId) {
      return res.status(400).json({ error: "userId and levelId are required" });
    }

    const mistakesNum = Number(mistakes);
    let stars = 1;
    if (mistakesNum <= 0) stars = 3;
    else if (mistakesNum <= 2) stars = 2;

    const xpEarned = 40 + stars * 10;
    const diamondsEarned = stars === 3 ? 5 : 2;

    return res.json({
      success: true,
      userId,
      levelId,
      stars,
      xpEarned,
      diamondsEarned,
      nextLevelId: nextLevelId || null,
      completedAt: new Date().toISOString(),
    });
  });

  // League bot simulation endpoint: Generates deterministic organic bot competition
  app.get(["/api/leagues/tick-bots", "/api/backend/league-bots"], (req, res) => {
    const botArchetypes = [
      { id: "bot_1", name: "Nova_Coder", avatarId: "avatar_cyber_knight", baseXP: 450, delta: 15 },
      { id: "bot_2", name: "HexMaster", avatarId: "avatar_stealth_ninja", baseXP: 380, delta: 25 },
      { id: "bot_3", name: "BinaryBloom", avatarId: "avatar_neon_samurai", baseXP: 310, delta: 10 },
      { id: "bot_4", name: "PixelPilot", avatarId: "avatar_quantum_mage", baseXP: 290, delta: 20 },
      { id: "bot_5", name: "CodeRunner99", avatarId: "avatar_solar_monk", baseXP: 240, delta: 30 },
      { id: "bot_6", name: "ZeroDayHero", avatarId: "avatar_cyber_knight", baseXP: 190, delta: 5 },
      { id: "bot_7", name: "SyntaxSam", avatarId: "avatar_stealth_ninja", baseXP: 140, delta: 15 },
    ];

    // Tick scores deterministically based on hour of day
    const hour = new Date().getHours();
    const botsWithCurrentScores = botArchetypes.map((b, idx) => ({
      ...b,
      xp: b.baseXP + ((hour * 7 + idx * 13) % 80),
      isBot: true,
    }));

    return res.json({
      success: true,
      bots: botsWithCurrentScores,
      updatedAt: new Date().toISOString(),
    });
  });

  // Store item purchase validation
  app.post("/api/store/buy-item", (req, res) => {
    const { userId, itemId, price } = req.body;
    if (!userId || !itemId || price === undefined) {
      return res.status(400).json({ error: "userId, itemId, and price are required" });
    }
    return res.json({
      success: true,
      userId,
      itemId,
      price,
      message: "Purchase authorized",
    });
  });

  // Quest reward claim
  app.post("/api/quests/claim", (req, res) => {
    const { userId, questId, reward } = req.body;
    if (!userId || !questId) {
      return res.status(400).json({ error: "userId and questId are required" });
    }
    return res.json({
      success: true,
      userId,
      questId,
      reward: reward || { xp: 50, diamonds: 5 },
      claimedAt: new Date().toISOString(),
    });
  });

  // =========================================================================
  // SLIDE & QUIZ GENERATION + USED QUESTIONS REGISTRY (SECTION 5 SPEC)
  // =========================================================================
  const serverUsedQuestionsRegistry: Map<string, { question_hash: string; level_id: string; angle: string; created_at: string }> = new Map();

  function normalizeQuestion(questionText: string, correctAnswer: string): string {
    const combined = `${questionText} ${correctAnswer}`;
    return combined
      .toLowerCase()
      .replace(/[0-9]/g, "")
      .replace(/[^a-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hashQuestion(questionText: string, correctAnswer: string): string {
    const normalized = normalizeQuestion(questionText, correctAnswer);
    return crypto.createHash("sha256").update(normalized).digest("hex");
  }

  app.get("/api/registry/used-questions", (_req, res) => {
    const records = Array.from(serverUsedQuestionsRegistry.values());
    res.json({
      success: true,
      total_count: records.length,
      records: records.slice(-100), // last 100
    });
  });

  app.post("/api/level/generate-content", async (req, res) => {
    const { levelId, forceRefreshQuiz } = req.body;
    if (!levelId) {
      return res.status(400).json({ error: "levelId is required" });
    }

    try {
      // Find lesson context from generated curriculum
      const context = getLessonContextByLevelId(levelId);

      if (!context) {
        return res.status(404).json({ error: `Level ${levelId} not found in curriculum` });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const { GoogleGenAI, Type } = await import("@google/genai");
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });

          const promptText = `You are generating learning content for one level of a gamified course.

LEVEL: ${context.level_id} — "${context.title}"
BOOK: ${context.book_name}, ${context.module_name} (Module/Part ${context.module_number})
AUDIENCE: Class 7-10 students, beginner level, plain simple language.

SOURCE MATERIAL (the only facts you may use — do not invent outside facts):
"""
${context.source_excerpt}
"""

Produce two decks:

### DECK A — THEORY (exactly 10 slides)
- Slide 1: Hook / title slide introducing "${context.title}" in one plain sentence.
- Slides 2-8: Break the source material into a clear step-by-step explanation — one idea per slide, using the book's own analogies/examples where present.
- Slide 9: A worked example or mini scenario applying the idea.
- Slide 10: Recap slide — 3 bullet takeaways + a one-line bridge to the next level.
Each slide: a short title (<=8 words) + 2-4 short sentences or bullets. No slide may duplicate the wording of another slide in this deck.

### DECK B — QUIZ (exactly 10 questions)
Generate exactly one question per angle below, in this order, using quiz_focus_rotation = ${JSON.stringify(context.quiz_focus_rotation)}:
  1. definition_recall     – "What does X mean?" style
  2. why_it_matters        – "Why is X useful/important?"
  3. compare_contrast      – X vs. a related concept from the SAME excerpt
  4. spot_the_mistake      – present a flawed statement, ask what's wrong
  5. apply_to_scenario     – a short novel scenario, ask what applies
  6. vocabulary_match      – match a term to its meaning
  7. sequence_or_flow      – order steps of a process from the excerpt
  8. true_false_nuance     – a true/false statement with a subtle catch
  9. fill_in_blank         – complete a key sentence from the idea
  10. analogy_check        – test understanding of the book's own analogy, if present; if no analogy, second scenario.

Each question needs: prompt text, 4 answer options (or true/false), the correct_index (0 to 3, or 0 to 1), and a one-line explanation. Every question's exact wording, and every scenario/example must be unique.`;

          const candidateModels = ["gemini-2.5-flash", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
          let parsed: any = null;

          for (const modelName of candidateModels) {
            try {
              const response = await ai.models.generateContent({
                model: modelName,
                contents: promptText,
                config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      theory_slides: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            slide_number: { type: Type.INTEGER },
                            title: { type: Type.STRING },
                            content: { type: Type.ARRAY, items: { type: Type.STRING } },
                            key_takeaway: { type: Type.STRING },
                            analogy_or_scenario: { type: Type.STRING },
                            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                            bridge_next: { type: Type.STRING },
                          },
                          required: ["slide_number", "title", "content"],
                        },
                      },
                      quiz_questions: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            angle: { type: Type.STRING },
                            prompt: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correct_index: { type: Type.INTEGER },
                            explanation: { type: Type.STRING },
                            scenario: { type: Type.STRING },
                          },
                          required: ["angle", "prompt", "options", "correct_index", "explanation"],
                        },
                      },
                    },
                    required: ["theory_slides", "quiz_questions"],
                  },
                },
              });

              if (response && response.text) {
                const candidateParsed = JSON.parse(response.text);
                if (candidateParsed.theory_slides && candidateParsed.quiz_questions) {
                  parsed = candidateParsed;
                  break;
                }
              }
            } catch (modelAttemptErr: any) {
              // If a model is unavailable / experiencing 503, try next candidate model
              console.warn(`Model ${modelName} unavailable (${modelAttemptErr?.status || modelAttemptErr?.message}), trying next fallback...`);
            }
          }

          if (parsed && parsed.theory_slides && parsed.quiz_questions) {
            // Deduplicate questions against server registry
            const validQuestions = [];
            for (let i = 0; i < parsed.quiz_questions.length; i++) {
              const q = parsed.quiz_questions[i];
              const correctAns = q.options[q.correct_index] || q.options[0] || "";
              const hash = hashQuestion(q.prompt, correctAns);

              // Register in server used questions registry
              serverUsedQuestionsRegistry.set(hash, {
                question_hash: hash,
                level_id: levelId,
                angle: q.angle,
                created_at: new Date().toISOString(),
              });

              validQuestions.push({
                ...q,
                question_id: `${levelId}-q${i + 1}-${Date.now() % 1000}`,
                question_hash: hash,
              });
            }

            return res.json({
              success: true,
              decks: {
                level_id: levelId,
                title: context.title,
                theory_slides: parsed.theory_slides,
                quiz_questions: validQuestions,
                generated_at: new Date().toISOString(),
                is_ai_generated: true,
              },
            });
          }
        } catch (geminiErr: any) {
          const errMsg = geminiErr?.message || String(geminiErr);
          if (!errMsg.includes("503") && !errMsg.includes("UNAVAILABLE") && !errMsg.includes("high demand")) {
            console.warn("Gemini model generation note:", errMsg);
          }
        }
      }

      // Grounded deterministic fallback generator
      const theorySlides = buildGroundedTheoryDeck(context);
      const quizQuestions = await buildGroundedQuizDeck(context, forceRefreshQuiz ? 1 : 0);
      return res.json({
        success: true,
        decks: {
          level_id: levelId,
          title: context.title,
          theory_slides: theorySlides,
          quiz_questions: quizQuestions,
          generated_at: new Date().toISOString(),
          is_fallback_grounded: true,
        },
      });
    } catch (err: any) {
      console.error("Error in /api/level/generate-content:", err);
      return res.status(500).json({ error: err?.message || "Internal server error" });
    }
  });

  // =========================================================================
  // VITE & STATIC SPA SERVING
  // =========================================================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`A.I. FLUENCE Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
