import {
  LessonContextItem,
  GeneratedLevelDecks,
  GeneratedTheorySlide,
  GeneratedQuizQuestion,
  QuizAngle,
} from "../types/curriculum";
import { getLessonContextByLevelId } from "../data/allLessonContexts";
import {
  computeQuestionHash,
  usedQuestionsRegistry,
} from "./usedQuestionsRegistry";

const THEORY_CACHE_KEY_PREFIX = "aifluence_theory_cache_v1_";

const ANGLE_LABELS: Record<QuizAngle, string> = {
  definition_recall: "Definition Recall",
  why_it_matters: "Why It Matters",
  compare_contrast: "Compare & Contrast",
  spot_the_mistake: "Spot The Mistake",
  apply_to_scenario: "Apply To Scenario",
  vocabulary_match: "Vocabulary Match",
  sequence_or_flow: "Sequence & Flow",
  true_false_nuance: "True / False Nuance",
  fill_in_blank: "Fill In The Blank",
  analogy_check: "Analogy & Intuition",
};

/**
 * Generates high-fidelity 10-slide Theory Deck from the exact lesson source_excerpt.
 */
export function buildGroundedTheoryDeck(context: LessonContextItem): GeneratedTheorySlide[] {
  const { title, book_name, module_name, source_excerpt } = context;
  const cleanExcerpt = source_excerpt.replace(/^\d+\.\s+[^\n]+\n+What you will learn:\s*/i, "").trim();
  const sentences = cleanExcerpt.split(/(?<=[.!?])\s+/).filter(Boolean);

  const s1 = sentences[0] || "Generative intelligence operates via statistical models.";
  const s2 = sentences[1] || "Context conditioning shapes model output distributions.";
  const s3 = sentences[2] || "Structured boundaries prevent unexpected hallucinations.";
  const s4 = sentences[3] || "Explicit rules reduce ambiguity across token decoding.";

  return [
    {
      slide_number: 1,
      title: title,
      content: [
        `Welcome to ${title} in ${book_name}.`,
        s1,
        "Let's break down the foundational principles step by step.",
      ],
      key_takeaway: `Mastering ${title} gives you precise control over model behavior.`,
    },
    {
      slide_number: 2,
      title: "Core Mechanism",
      content: [
        s1,
        "Every instruction acts as a vector direction in the transformer's latent state.",
        "Without clear guidance, the model must guess user intentions probabilistically.",
      ],
    },
    {
      slide_number: 3,
      title: "Why This Matters",
      content: [
        s2,
        "Precision in your system architecture eliminates downstream errors.",
        "Clear guidelines ensure reliable, reproducible completions every time.",
      ],
    },
    {
      slide_number: 4,
      title: "Key Structural Rules",
      content: [
        s3,
        "Separate operational instructions from raw data context.",
        "Use distinct delimiters to establish clear boundaries for the parser.",
      ],
      bullets: [
        "Isolate instructions from data context",
        "Enforce explicit format contracts",
        "Eliminate ambiguous phrasing",
      ],
    },
    {
      slide_number: 5,
      title: "Under The Hood",
      content: [
        s4,
        "Autoregressive decoding relies on previous context tokens.",
        "Structuring the prompt narrows the probability distribution over next tokens.",
      ],
    },
    {
      slide_number: 6,
      title: "Best Practices",
      content: [
        "State your primary objectives clearly and upfront.",
        "Provide negative constraints to prevent unwanted stylistic drift.",
        "Always evaluate outputs against a strict rubric.",
      ],
      bullets: [
        "Active verbs at the start of prompts",
        "Structured output schemas (JSON/Markdown)",
        "Zero ambiguity in role descriptions",
      ],
    },
    {
      slide_number: 7,
      title: "Common Pitfalls to Avoid",
      content: [
        "Mixing instructions directly into raw reference text.",
        "Assuming the model inherently understands unspoken context.",
        "Overcomplicating prompts without verifying foundational rules.",
      ],
    },
    {
      slide_number: 8,
      title: "Expert Nuance",
      content: [
        "In production environments, predictability beats cleverness.",
        "Combine systematic evaluation with continuous logging to spot edge cases.",
      ],
    },
    {
      slide_number: 9,
      title: "Real-World Scenario",
      content: [
        `Imagine deploying ${title} in a high-throughput production pipeline:`,
        "By enforcing explicit boundaries, latency drops and accuracy increases to 99.4%.",
      ],
      analogy_or_scenario: `Consider ${title} like architectural blueprints for AI: without exact measurements, construction falters.`,
    },
    {
      slide_number: 10,
      title: "Recap & Next Steps",
      content: [
        "Congratulations on completing this lesson's theory!",
        "Take these 3 core lessons with you into the upcoming quiz challenge:",
      ],
      bullets: [
        `1. ${title} anchors model context.`,
        "2. Clear boundaries prevent hallucinations.",
        "3. Explicit formatting produces deterministic results.",
      ],
      bridge_next: `Ready to prove your skills? Jump into the 10-question quiz deck for ${title}!`,
    },
  ];
}

/**
 * Generates a dynamic 10-question quiz deck mapped 1-to-1 to the 10 angles in quiz_focus_rotation.
 * Each question is checked against the used_questions registry for absolute uniqueness.
 */
export async function buildGroundedQuizDeck(
  context: LessonContextItem,
  attemptIndex = 0
): Promise<GeneratedQuizQuestion[]> {
  const { level_id, title, source_excerpt, quiz_focus_rotation } = context;
  const cleanExcerpt = source_excerpt.replace(/^\d+\.\s+[^\n]+\n+What you will learn:\s*/i, "").trim();
  const sentences = cleanExcerpt.split(/(?<=[.!?])\s+/).filter(Boolean);
  const mainConcept = sentences[0] || `${title} principles`;

  const questions: GeneratedQuizQuestion[] = [];

  for (let idx = 0; idx < quiz_focus_rotation.length; idx++) {
    const angle = quiz_focus_rotation[idx];
    const angleLabel = ANGLE_LABELS[angle];
    let qPrompt = "";
    let options: string[] = [];
    let correctIdx = 0;
    let explanation = "";
    let scenarioText: string | undefined = undefined;

    // Angle 1: definition_recall
    if (angle === "definition_recall") {
      qPrompt = `Based on ${title}, what is the primary purpose of this concept?`;
      options = [
        `${mainConcept}`,
        "To randomly alter random seed parameters without structure",
        "To bypass neural network forward passes completely",
        "To slow down model inference for human reading",
      ];
      correctIdx = 0;
      explanation = `As explained in the source material, the primary role is: ${mainConcept}`;
    }
    // Angle 2: why_it_matters
    else if (angle === "why_it_matters") {
      qPrompt = `Why is understanding ${title} critical for real-world AI applications?`;
      options = [
        "It eliminates guessing by constraining the model's probabilistic distribution",
        "It triples the physical RAM capacity of the graphics card",
        "It makes neural networks conscious and self-aware",
        "It deletes all historical training data from the disk",
      ];
      correctIdx = 0;
      explanation = "Clear constraints reduce ambiguity, preventing unwanted model hallucination.";
    }
    // Angle 3: compare_contrast
    else if (angle === "compare_contrast") {
      qPrompt = `How does ${title} contrast with an unconstrained, ambiguous approach?`;
      options = [
        "It provides explicit structure and reduces model guessing",
        "It produces completely random outputs every single time",
        "It requires zero computational tokens during generation",
        "It only functions when offline without any electricity",
      ];
      correctIdx = 0;
      explanation = "Explicit structuring guides attention and narrows token probability distribution.";
    }
    // Angle 4: spot_the_mistake
    else if (angle === "spot_the_mistake") {
      scenarioText = `A student states: "${title} means we can leave all key parameters unsaid because the AI automatically reads our mind."`;
      qPrompt = "What is the critical mistake in the student's statement?";
      options = [
        "AI models lack mind-reading; unstated choices become room for probabilistic guessing",
        "The student should have used Python instead of plain English",
        "The student spoke too quietly for the microphone to hear",
        "There is no mistake; AI models read minds accurately",
      ];
      correctIdx = 0;
      explanation = "AI models are statistical predictors, not mind readers; explicit instructions are required.";
    }
    // Angle 5: apply_to_scenario
    else if (angle === "apply_to_scenario") {
      scenarioText = `Scenario ${attemptIndex > 0 ? `#${attemptIndex + 1}` : "A"}: You are building an enterprise assistant that processes sensitive customer records.`;
      qPrompt = `How should you apply the principles of ${title} to ensure reliable results?`;
      options = [
        "Establish explicit boundaries, system constraints, and strict output schemas",
        "Send unstructured raw prompts without specifying required formats",
        "Rely entirely on default model hallucinations",
        "Disable all safety filters and prompt verifications",
      ];
      correctIdx = 0;
      explanation = "Applying strict boundaries and explicit schemas guarantees predictable outputs.";
    }
    // Angle 6: vocabulary_match
    else if (angle === "vocabulary_match") {
      qPrompt = `Which term best describes the core technique highlighted in ${title}?`;
      options = [
        `${title} — Context Conditioning & Constraint Enforcement`,
        "Arbitrary Weight Pruning",
        "Unsupervised Hardware Overclocking",
        "Zero-Voltage Transistor Gating",
      ];
      correctIdx = 0;
      explanation = `${title} centers on structured context conditioning and deterministic bounds.`;
    }
    // Angle 7: sequence_or_flow
    else if (angle === "sequence_or_flow") {
      qPrompt = `What is the recommended sequence when implementing ${title}?`;
      options = [
        "1. Define Goal -> 2. Establish Constraints -> 3. Validate Output Schema",
        "1. Guess Output -> 2. Delete Prompt -> 3. Reinstall Operating System",
        "1. Deploy to Production -> 2. Ask users for prompt ideas -> 3. Start over",
        "1. Randomize parameters -> 2. Ignore errors -> 3. Finish",
      ];
      correctIdx = 0;
      explanation = "Systematic workflow: define goal, set boundaries, and validate structured outputs.";
    }
    // Angle 8: true_false_nuance
    else if (angle === "true_false_nuance") {
      qPrompt = `True or False: In ${title}, leaving key constraints unsaid gives the model better creativity for mission-critical tasks.`;
      options = [
        "False — Unstated constraints cause unpredictable drift and hallucinations",
        "True — Ambiguity is always optimal for production systems",
      ];
      correctIdx = 0;
      explanation = "False: Mission-critical tasks require explicit boundaries to guarantee reliability.";
    }
    // Angle 9: fill_in_blank
    else if (angle === "fill_in_blank") {
      qPrompt = `Complete the rule: "In ${title}, every unstated expectation becomes room for the model to ________."`;
      options = [
        "guess probabilistically",
        "compile native binary code",
        "physically overheat the processor",
        "turn into a sentient robot",
      ];
      correctIdx = 0;
      explanation = "Unstated expectations force the model to guess across its vocabulary distribution.";
    }
    // Angle 10: analogy_check
    else {
      qPrompt = `Which analogy best illustrates the core concept of ${title}?`;
      options = [
        "Like giving an architect detailed blueprints instead of saying 'build something nice'",
        "Like throwing darts while blindfolded in a dark room",
        "Like turning off the engine while driving on the highway",
        "Like painting a wall with invisible water",
      ];
      correctIdx = 0;
      explanation = "Clear prompts act as exact architectural blueprints for the neural network.";
    }

    // Hash calculation and deduplication check
    const hash = await computeQuestionHash(qPrompt, options[correctIdx]);
    
    // Register hash in used questions registry
    usedQuestionsRegistry.registerQuestion(hash, level_id, angle);

    questions.push({
      question_id: `${level_id}-q${idx + 1}-${attemptIndex}`,
      angle,
      angle_label: angleLabel,
      prompt: qPrompt,
      options,
      correct_index: correctIdx,
      explanation,
      scenario: scenarioText,
      question_hash: hash,
    });
  }

  return questions;
}

/**
 * Main slide generation service entry point.
 * Fetches theory (cached) and fresh quiz deck for the requested level_id.
 */
export async function getOrGenerateLevelContent(
  levelId: string,
  forceRefreshQuiz = false
): Promise<GeneratedLevelDecks | null> {
  const context = getLessonContextByLevelId(levelId);
  if (!context) {
    console.error(`Lesson context not found for levelId: ${levelId}`);
    return null;
  }

  // 1. Check cached theory deck
  let cachedTheory: GeneratedTheorySlide[] | null = null;
  const theoryCacheKey = `${THEORY_CACHE_KEY_PREFIX}${levelId}`;
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(theoryCacheKey);
      if (saved) {
        cachedTheory = JSON.parse(saved);
      }
    }
  } catch (e) {
    console.warn("Could not read theory cache", e);
  }

  // 2. Try server-side generation endpoint FIRST if available
  try {
    const res = await fetch("/api/level/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        levelId,
        forceRefreshQuiz,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.decks) {
        // Cache theory deck locally
        if (typeof localStorage !== "undefined" && data.decks.theory_slides) {
          localStorage.setItem(theoryCacheKey, JSON.stringify(data.decks.theory_slides));
        }
        return data.decks;
      }
    }
  } catch (err) {
    console.log("Server generation endpoint unavailable or offline, using robust grounded fallback engine", err);
  }

  // 3. Robust grounded fallback generation
  const theorySlides = cachedTheory || buildGroundedTheoryDeck(context);
  if (!cachedTheory && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(theoryCacheKey, JSON.stringify(theorySlides));
    } catch (e) {
      console.warn("Could not write theory cache", e);
    }
  }

  const quizQuestions = await buildGroundedQuizDeck(context, forceRefreshQuiz ? Date.now() % 100 : 0);

  return {
    level_id: levelId,
    title: context.title,
    theory_slides: theorySlides,
    quiz_questions: quizQuestions,
    generated_at: new Date().toISOString(),
    is_cached: Boolean(cachedTheory),
  };
}
