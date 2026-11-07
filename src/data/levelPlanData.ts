import { LevelPlanData, LevelPlanCourse, LevelPlanBook, LevelPlanModule, LevelPlanLevel } from "../types/curriculum";

export const LEVEL_PLAN_DATA: LevelPlanData = {
  "courses": [
    {
      "course_id": "genai",
      "course_name": "Generative AI",
      "books": [
        {
          "book_id": "PE",
          "book_name": "Prompt Engineering 101",
          "unit_word": "Module",
          "modules": [
            {
              "module_id": "PE-M1",
              "module_number": 1,
              "module_name": "Foundations of Prompt Engineering",
              "levels": [
                {
                  "level_id": "PE-M1-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 1,
                  "global_index": 1,
                  "title": "Meet Generative AI"
                },
                {
                  "level_id": "PE-M1-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 2,
                  "global_index": 2,
                  "title": "Instructions vs Context"
                },
                {
                  "level_id": "PE-M1-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 3,
                  "global_index": 3,
                  "title": "Delimiters and Formatting"
                },
                {
                  "level_id": "PE-M1-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 4,
                  "global_index": 4,
                  "title": "Directing Model Tone and Persona"
                },
                {
                  "level_id": "PE-M1-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 5,
                  "global_index": 5,
                  "title": "Zero-Shot Reasoning and Prompt Clarity"
                }
              ]
            },
            {
              "module_id": "PE-M2",
              "module_number": 2,
              "module_name": "The Anatomy of a Powerful Prompt",
              "levels": [
                {
                  "level_id": "PE-M2-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 6,
                  "global_index": 6,
                  "title": "The Task: Give AI a Job"
                },
                {
                  "level_id": "PE-M2-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 7,
                  "global_index": 7,
                  "title": "System vs User Roles"
                },
                {
                  "level_id": "PE-M2-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 8,
                  "global_index": 8,
                  "title": "XML Tags and Clear Boundaries"
                },
                {
                  "level_id": "PE-M2-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 9,
                  "global_index": 9,
                  "title": "Specifying Output Formats"
                },
                {
                  "level_id": "PE-M2-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 10,
                  "global_index": 10,
                  "title": "Negative Constraints and Avoidance"
                }
              ]
            },
            {
              "module_id": "PE-M3",
              "module_number": 3,
              "module_name": "Few-Shot & In-Context Learning",
              "levels": [
                {
                  "level_id": "PE-M3-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 11,
                  "global_index": 11,
                  "title": "Why Examples Beat Explanations"
                },
                {
                  "level_id": "PE-M3-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 12,
                  "global_index": 12,
                  "title": "Choosing Representative Exemplars"
                },
                {
                  "level_id": "PE-M3-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 13,
                  "global_index": 13,
                  "title": "Edge Case Conditioning"
                },
                {
                  "level_id": "PE-M3-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 14,
                  "global_index": 14,
                  "title": "Formatting Demonstration Pairs"
                },
                {
                  "level_id": "PE-M3-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 15,
                  "global_index": 15,
                  "title": "Balancing Class Distributions"
                }
              ]
            },
            {
              "module_id": "PE-M4",
              "module_number": 4,
              "module_name": "Chain-of-Thought & Complex Reasoning",
              "levels": [
                {
                  "level_id": "PE-M4-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 16,
                  "global_index": 16,
                  "title": "Zero-Shot Chain of Thought"
                },
                {
                  "level_id": "PE-M4-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 17,
                  "global_index": 17,
                  "title": "Step-by-Step Mathematical Derivations"
                },
                {
                  "level_id": "PE-M4-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 18,
                  "global_index": 18,
                  "title": "Self-Consistency Sampling"
                },
                {
                  "level_id": "PE-M4-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 19,
                  "global_index": 19,
                  "title": "Least-to-Most Decomposition"
                },
                {
                  "level_id": "PE-M4-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 20,
                  "global_index": 20,
                  "title": "Tree of Thoughts (ToT)"
                }
              ]
            },
            {
              "module_id": "PE-M5",
              "module_number": 5,
              "module_name": "Structured Outputs & JSON Contracts",
              "levels": [
                {
                  "level_id": "PE-M5-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 21,
                  "global_index": 21,
                  "title": "Constrained Decoding & JSON Schemas"
                },
                {
                  "level_id": "PE-M5-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 22,
                  "global_index": 22,
                  "title": "Schema Validation & Typing"
                },
                {
                  "level_id": "PE-M5-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 23,
                  "global_index": 23,
                  "title": "Nested JSON Extraction"
                },
                {
                  "level_id": "PE-M5-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 24,
                  "global_index": 24,
                  "title": "Tables and Markdown Generation"
                },
                {
                  "level_id": "PE-M5-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 25,
                  "global_index": 25,
                  "title": "Handling Schema Failures and Retries"
                }
              ]
            },
            {
              "module_id": "PE-M6",
              "module_number": 6,
              "module_name": "Prompt Defense & Safety",
              "levels": [
                {
                  "level_id": "PE-M6-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 26,
                  "global_index": 26,
                  "title": "Direct Prompt Injection Attacks"
                },
                {
                  "level_id": "PE-M6-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 27,
                  "global_index": 27,
                  "title": "Indirect Injection & Untrusted Data"
                },
                {
                  "level_id": "PE-M6-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 28,
                  "global_index": 28,
                  "title": "System Prompt Leakage Defense"
                },
                {
                  "level_id": "PE-M6-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 29,
                  "global_index": 29,
                  "title": "Delimiter Jailbreak Mitigation"
                },
                {
                  "level_id": "PE-M6-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 30,
                  "global_index": 30,
                  "title": "Guardrail Evaluation Frameworks"
                }
              ]
            },
            {
              "module_id": "PE-M7",
              "module_number": 7,
              "module_name": "Autonomous Agents & Tool Calling",
              "levels": [
                {
                  "level_id": "PE-M7-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 31,
                  "global_index": 31,
                  "title": "Tool Use & Function Calling Architecture"
                },
                {
                  "level_id": "PE-M7-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 32,
                  "global_index": 32,
                  "title": "ReAct: Reasoning and Action Loops"
                },
                {
                  "level_id": "PE-M7-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 33,
                  "global_index": 33,
                  "title": "Parsing Tool Outputs"
                },
                {
                  "level_id": "PE-M7-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 34,
                  "global_index": 34,
                  "title": "Multi-Step Task Execution"
                },
                {
                  "level_id": "PE-M7-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 35,
                  "global_index": 35,
                  "title": "Error Recovery & Fallbacks in Agents"
                }
              ]
            },
            {
              "module_id": "PE-M8",
              "module_number": 8,
              "module_name": "Production Optimization & Evaluation",
              "levels": [
                {
                  "level_id": "PE-M8-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 36,
                  "global_index": 36,
                  "title": "Prompt Caching & Latency Optimization"
                },
                {
                  "level_id": "PE-M8-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 37,
                  "global_index": 37,
                  "title": "Token Compression Techniques"
                },
                {
                  "level_id": "PE-M8-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 38,
                  "global_index": 38,
                  "title": "Automated Prompt Evaluation with LLM-as-a-Judge"
                },
                {
                  "level_id": "PE-M8-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 39,
                  "global_index": 39,
                  "title": "Systematic A/B Prompt Testing"
                },
                {
                  "level_id": "PE-M8-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 40,
                  "global_index": 40,
                  "title": "Version Control and Prompt Registry"
                }
              ]
            }
          ]
        },
        {
          "book_id": "FT",
          "book_name": "Fine-Tuning LLM 101",
          "unit_word": "Module",
          "modules": [
            {
              "module_id": "FT-M1",
              "module_number": 1,
              "module_name": "Fine-Tuning Foundations",
              "levels": [
                {
                  "level_id": "FT-M1-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 1,
                  "global_index": 41,
                  "title": "Why and When to Fine-Tune"
                },
                {
                  "level_id": "FT-M1-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 2,
                  "global_index": 42,
                  "title": "Prompting vs Fine-Tuning vs RAG"
                },
                {
                  "level_id": "FT-M1-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 3,
                  "global_index": 43,
                  "title": "Full Parameter vs Parameter-Efficient Tuning"
                },
                {
                  "level_id": "FT-M1-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 4,
                  "global_index": 44,
                  "title": "Compute & Hardware Requirements"
                },
                {
                  "level_id": "FT-M1-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 5,
                  "global_index": 45,
                  "title": "The Anatomy of Loss in Transformer Training"
                }
              ]
            },
            {
              "module_id": "FT-M2",
              "module_number": 2,
              "module_name": "Dataset Preparation & Curation",
              "levels": [
                {
                  "level_id": "FT-M2-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 6,
                  "global_index": 46,
                  "title": "Collecting High-Quality Domain Data"
                },
                {
                  "level_id": "FT-M2-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 7,
                  "global_index": 47,
                  "title": "Instruction Tuning Formats (Alpaca, ChatML)"
                },
                {
                  "level_id": "FT-M2-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 8,
                  "global_index": 48,
                  "title": "Data Cleaning, Deduplication & Filtering"
                },
                {
                  "level_id": "FT-M2-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 9,
                  "global_index": 49,
                  "title": "Synthetic Data Generation with Frontier Models"
                },
                {
                  "level_id": "FT-M2-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 10,
                  "global_index": 50,
                  "title": "Tokenization Nuances & Padding Strategy"
                }
              ]
            },
            {
              "module_id": "FT-M3",
              "module_number": 3,
              "module_name": "Parameter-Efficient Fine-Tuning (PEFT) & LoRA",
              "levels": [
                {
                  "level_id": "FT-M3-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 11,
                  "global_index": 51,
                  "title": "Low-Rank Adaptation (LoRA) Theory"
                },
                {
                  "level_id": "FT-M3-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 12,
                  "global_index": 52,
                  "title": "Choosing LoRA Rank (r) and Alpha (\u03b1)"
                },
                {
                  "level_id": "FT-M3-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 13,
                  "global_index": 53,
                  "title": "Target Modules (q_proj, v_proj, mlp)"
                },
                {
                  "level_id": "FT-M3-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 14,
                  "global_index": 54,
                  "title": "Memory Savings & Mathematical Decomposition"
                },
                {
                  "level_id": "FT-M3-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 15,
                  "global_index": 55,
                  "title": "Merging LoRA Weights into Base Models"
                }
              ]
            },
            {
              "module_id": "FT-M4",
              "module_number": 4,
              "module_name": "Quantization & QLoRA",
              "levels": [
                {
                  "level_id": "FT-M4-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 16,
                  "global_index": 56,
                  "title": "Post-Training Quantization vs Quantized Training"
                },
                {
                  "level_id": "FT-M4-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 17,
                  "global_index": 57,
                  "title": "4-bit NormalFloat (NF4) Data Type"
                },
                {
                  "level_id": "FT-M4-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 18,
                  "global_index": 58,
                  "title": "Double Quantization & Paged Optimizers"
                },
                {
                  "level_id": "FT-M4-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 19,
                  "global_index": 59,
                  "title": "Training 70B Models on Consumer GPUs"
                },
                {
                  "level_id": "FT-M4-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 20,
                  "global_index": 60,
                  "title": "Quantization Degradation & Calibration"
                }
              ]
            },
            {
              "module_id": "FT-M5",
              "module_number": 5,
              "module_name": "Training Dynamics & Hyperparameters",
              "levels": [
                {
                  "level_id": "FT-M5-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 21,
                  "global_index": 61,
                  "title": "Learning Rate Schedules & Warmup"
                },
                {
                  "level_id": "FT-M5-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 22,
                  "global_index": 62,
                  "title": "Batch Size, Gradient Accumulation & Steps"
                },
                {
                  "level_id": "FT-M5-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 23,
                  "global_index": 63,
                  "title": "Overfitting, Catastrophic Forgetting & Regularization"
                },
                {
                  "level_id": "FT-M5-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 24,
                  "global_index": 64,
                  "title": "Loss Curves & Evaluation Benchmarks"
                },
                {
                  "level_id": "FT-M5-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 25,
                  "global_index": 65,
                  "title": "Checkpoint Management & Model Saving"
                }
              ]
            },
            {
              "module_id": "FT-M6",
              "module_number": 6,
              "module_name": "Alignment & Preference Optimization",
              "levels": [
                {
                  "level_id": "FT-M6-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 26,
                  "global_index": 66,
                  "title": "Reinforcement Learning from Human Feedback (RLHF)"
                },
                {
                  "level_id": "FT-M6-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 27,
                  "global_index": 67,
                  "title": "Reward Modeling Architecture"
                },
                {
                  "level_id": "FT-M6-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 28,
                  "global_index": 68,
                  "title": "Direct Preference Optimization (DPO)"
                },
                {
                  "level_id": "FT-M6-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 29,
                  "global_index": 69,
                  "title": "Kahneman-Tversky Optimization (KTO)"
                },
                {
                  "level_id": "FT-M6-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 30,
                  "global_index": 70,
                  "title": "Mitigating Sycophancy & Alignment Tax"
                }
              ]
            },
            {
              "module_id": "FT-M7",
              "module_number": 7,
              "module_name": "Domain Adaptation & Task Specialization",
              "levels": [
                {
                  "level_id": "FT-M7-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 31,
                  "global_index": 71,
                  "title": "Code Generation & Repository Tuning"
                },
                {
                  "level_id": "FT-M7-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 32,
                  "global_index": 72,
                  "title": "Medical, Legal & Financial Specialization"
                },
                {
                  "level_id": "FT-M7-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 33,
                  "global_index": 73,
                  "title": "Multilingual & Low-Resource Adaptation"
                },
                {
                  "level_id": "FT-M7-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 34,
                  "global_index": 74,
                  "title": "Structured Function-Calling Specialization"
                },
                {
                  "level_id": "FT-M7-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 35,
                  "global_index": 75,
                  "title": "Continual Pre-Training on Raw Text"
                }
              ]
            },
            {
              "module_id": "FT-M8",
              "module_number": 8,
              "module_name": "Serving, Evaluation & Deployment",
              "levels": [
                {
                  "level_id": "FT-M8-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 36,
                  "global_index": 76,
                  "title": "vLLM & High-Throughput Serving"
                },
                {
                  "level_id": "FT-M8-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 37,
                  "global_index": 77,
                  "title": "PagedAttention & Continuous Batching"
                },
                {
                  "level_id": "FT-M8-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 38,
                  "global_index": 78,
                  "title": "Speculative Decoding & Draft Models"
                },
                {
                  "level_id": "FT-M8-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 39,
                  "global_index": 79,
                  "title": "Evaluation Suites (MMLU, HumanEval, MT-Bench)"
                },
                {
                  "level_id": "FT-M8-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 40,
                  "global_index": 80,
                  "title": "LoRA Adapter Hot-Swapping in Production"
                },
                {
                  "level_id": "FT-M8-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 41,
                  "global_index": 81,
                  "title": "Production Monitoring & Drift Detection"
                }
              ]
            }
          ]
        },
        {
          "book_id": "RAG",
          "book_name": "RAG 101",
          "unit_word": "Module",
          "modules": [
            {
              "module_id": "RAG-M1",
              "module_number": 1,
              "module_name": "RAG Architecture & Foundations",
              "levels": [
                {
                  "level_id": "RAG-M1-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 1,
                  "global_index": 82,
                  "title": "Vector Embeddings & Semantic Spaces"
                },
                {
                  "level_id": "RAG-M1-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 2,
                  "global_index": 83,
                  "title": "Cosine Similarity vs Dot Product vs Euclidean"
                },
                {
                  "level_id": "RAG-M1-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 3,
                  "global_index": 84,
                  "title": "The Naive RAG Pipeline"
                },
                {
                  "level_id": "RAG-M1-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 4,
                  "global_index": 85,
                  "title": "Limitations of Naive RAG & Hallucination Points"
                },
                {
                  "level_id": "RAG-M1-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 5,
                  "global_index": 86,
                  "title": "Choosing Embedding Models (MTEB Leaderboard)"
                }
              ]
            },
            {
              "module_id": "RAG-M2",
              "module_number": 2,
              "module_name": "Document Ingestion & Chunking",
              "levels": [
                {
                  "level_id": "RAG-M2-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 6,
                  "global_index": 87,
                  "title": "Fixed-Size vs Recursive Character Chunking"
                },
                {
                  "level_id": "RAG-M2-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 7,
                  "global_index": 88,
                  "title": "Semantic & Document-Aware Chunking"
                },
                {
                  "level_id": "RAG-M2-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 8,
                  "global_index": 89,
                  "title": "Chunk Overlap & Boundary Preservation"
                },
                {
                  "level_id": "RAG-M2-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 9,
                  "global_index": 90,
                  "title": "Multi-Modal Document Parsing (PDFs, Tables, OCR)"
                },
                {
                  "level_id": "RAG-M2-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 10,
                  "global_index": 91,
                  "title": "Extracting & Storing Rich Metadata"
                }
              ]
            },
            {
              "module_id": "RAG-M3",
              "module_number": 3,
              "module_name": "Vector Databases & Indexing",
              "levels": [
                {
                  "level_id": "RAG-M3-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 11,
                  "global_index": 92,
                  "title": "Flat Index vs Approximate Nearest Neighbors (ANN)"
                },
                {
                  "level_id": "RAG-M3-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 12,
                  "global_index": 93,
                  "title": "Hierarchical Navigable Small World (HNSW)"
                },
                {
                  "level_id": "RAG-M3-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 13,
                  "global_index": 94,
                  "title": "Inverted File with Product Quantization (IVF-PQ)"
                },
                {
                  "level_id": "RAG-M3-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 14,
                  "global_index": 95,
                  "title": "Vector Database Architectures (Pinecone, Qdrant, Milvus, Chroma)"
                },
                {
                  "level_id": "RAG-M3-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 15,
                  "global_index": 96,
                  "title": "Index Maintenance, CRUD & Sharding"
                }
              ]
            },
            {
              "module_id": "RAG-M4",
              "module_number": 4,
              "module_name": "Advanced Retrieval Strategies",
              "levels": [
                {
                  "level_id": "RAG-M4-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 16,
                  "global_index": 97,
                  "title": "Hybrid Search: Sparse (BM25) + Dense (Vector)"
                },
                {
                  "level_id": "RAG-M4-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 17,
                  "global_index": 98,
                  "title": "Parent Document & Auto-Merging Retrievers"
                },
                {
                  "level_id": "RAG-M4-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 18,
                  "global_index": 99,
                  "title": "Sentence Window Retrieval"
                },
                {
                  "level_id": "RAG-M4-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 19,
                  "global_index": 100,
                  "title": "Multi-Query Generation & Query Expansion"
                },
                {
                  "level_id": "RAG-M4-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 20,
                  "global_index": 101,
                  "title": "Contextual Compression & Filtering"
                }
              ]
            },
            {
              "module_id": "RAG-M5",
              "module_number": 5,
              "module_name": "Query Transformation & Routing",
              "levels": [
                {
                  "level_id": "RAG-M5-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 21,
                  "global_index": 102,
                  "title": "Query Rewriting & Disambiguation"
                },
                {
                  "level_id": "RAG-M5-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 22,
                  "global_index": 103,
                  "title": "Step-Back Prompting for Broader Context"
                },
                {
                  "level_id": "RAG-M5-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 23,
                  "global_index": 104,
                  "title": "Sub-Query Decomposition for Multi-Hop QA"
                },
                {
                  "level_id": "RAG-M5-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 24,
                  "global_index": 105,
                  "title": "Semantic Routing across Multiple Indexes"
                },
                {
                  "level_id": "RAG-M5-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 25,
                  "global_index": 106,
                  "title": "Fallback Strategies & Web Search Augmentation"
                },
                {
                  "level_id": "RAG-M5-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 26,
                  "global_index": 107,
                  "title": "Query Intent Classification"
                }
              ]
            },
            {
              "module_id": "RAG-M6",
              "module_number": 6,
              "module_name": "Reranking & Context Optimization",
              "levels": [
                {
                  "level_id": "RAG-M6-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 27,
                  "global_index": 108,
                  "title": "Cross-Encoder vs Bi-Encoder Architecture"
                },
                {
                  "level_id": "RAG-M6-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 28,
                  "global_index": 109,
                  "title": "Cohere & BGE Reranker Models"
                },
                {
                  "level_id": "RAG-M6-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 29,
                  "global_index": 110,
                  "title": "Lost in the Middle: Mitigating Primacy/Recency Bias"
                },
                {
                  "level_id": "RAG-M6-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 30,
                  "global_index": 111,
                  "title": "Context Pruning & Dynamic Truncation"
                },
                {
                  "level_id": "RAG-M6-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 31,
                  "global_index": 112,
                  "title": "Citation Generation & Grounded Attributions"
                },
                {
                  "level_id": "RAG-M6-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 32,
                  "global_index": 113,
                  "title": "Re-ordering Chunks for LLM Attention"
                }
              ]
            },
            {
              "module_id": "RAG-M7",
              "module_number": 7,
              "module_name": "Agentic & Corrective RAG",
              "levels": [
                {
                  "level_id": "RAG-M7-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 33,
                  "global_index": 114,
                  "title": "Self-RAG: Reflection Tokens & Self-Assessment"
                },
                {
                  "level_id": "RAG-M7-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 34,
                  "global_index": 115,
                  "title": "Corrective RAG (CRAG) & Document Grading"
                },
                {
                  "level_id": "RAG-M7-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 35,
                  "global_index": 116,
                  "title": "Adaptive RAG: Deciding When to Retrieve"
                },
                {
                  "level_id": "RAG-M7-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 36,
                  "global_index": 117,
                  "title": "GraphRAG: Knowledge Graphs for Global Sensemaking"
                },
                {
                  "level_id": "RAG-M7-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 37,
                  "global_index": 118,
                  "title": "Multi-Agent RAG with Specialized Researcher Agents"
                },
                {
                  "level_id": "RAG-M7-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 38,
                  "global_index": 119,
                  "title": "Tool-Augmented Retrieval with SQL & APIs"
                }
              ]
            },
            {
              "module_id": "RAG-M8",
              "module_number": 8,
              "module_name": "Evaluation, Observability & Production",
              "levels": [
                {
                  "level_id": "RAG-M8-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 39,
                  "global_index": 120,
                  "title": "The RAG Triad: Context Relevance, Groundedness, Answer Relevance"
                },
                {
                  "level_id": "RAG-M8-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 40,
                  "global_index": 121,
                  "title": "RAGAS & TruLens Automated Evaluation"
                },
                {
                  "level_id": "RAG-M8-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 41,
                  "global_index": 122,
                  "title": "Synthetic Test Set Generation"
                },
                {
                  "level_id": "RAG-M8-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 42,
                  "global_index": 123,
                  "title": "Caching Strategies (Semantic Cache, Exact Cache)"
                },
                {
                  "level_id": "RAG-M8-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 43,
                  "global_index": 124,
                  "title": "Latency Budgeting & Streaming RAG Pipelines"
                },
                {
                  "level_id": "RAG-M8-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 44,
                  "global_index": 125,
                  "title": "Security & Access-Control-Aware Retrieval"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "course_id": "afe",
      "course_name": "AI for Everyone",
      "books": [
        {
          "book_id": "AFE",
          "book_name": "AI for Everyone",
          "unit_word": "Part",
          "modules": [
            {
              "module_id": "AFE-M1",
              "module_number": 1,
              "module_name": "What is AI?",
              "levels": [
                {
                  "level_id": "AFE-M1-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 1,
                  "global_index": 126,
                  "title": "Demystifying Artificial Intelligence"
                },
                {
                  "level_id": "AFE-M1-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 2,
                  "global_index": 127,
                  "title": "Traditional Code vs Machine Learning"
                },
                {
                  "level_id": "AFE-M1-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 3,
                  "global_index": 128,
                  "title": "Supervised Learning & Labeled Data"
                },
                {
                  "level_id": "AFE-M1-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 4,
                  "global_index": 129,
                  "title": "Unsupervised Learning & Clustering"
                },
                {
                  "level_id": "AFE-M1-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 5,
                  "global_index": 130,
                  "title": "Reinforcement Learning & Reward Signals"
                },
                {
                  "level_id": "AFE-M1-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 6,
                  "global_index": 131,
                  "title": "The Deep Learning Revolution"
                },
                {
                  "level_id": "AFE-M1-L7",
                  "star_number": 7,
                  "lesson_number_in_book": 7,
                  "global_index": 132,
                  "title": "What AI Can and Cannot Do Today"
                }
              ]
            },
            {
              "module_id": "AFE-M2",
              "module_number": 2,
              "module_name": "Building AI Projects",
              "levels": [
                {
                  "level_id": "AFE-M2-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 8,
                  "global_index": 133,
                  "title": "The Workflow of a Machine Learning Project"
                },
                {
                  "level_id": "AFE-M2-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 9,
                  "global_index": 134,
                  "title": "Data Collection, Cleaning & Labeling Pipelines"
                },
                {
                  "level_id": "AFE-M2-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 10,
                  "global_index": 135,
                  "title": "Feature Engineering & Selection"
                },
                {
                  "level_id": "AFE-M2-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 11,
                  "global_index": 136,
                  "title": "Training, Validation & Test Sets"
                },
                {
                  "level_id": "AFE-M2-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 12,
                  "global_index": 137,
                  "title": "Model Evaluation Metrics (Accuracy, Precision, Recall, F1)"
                },
                {
                  "level_id": "AFE-M2-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 13,
                  "global_index": 138,
                  "title": "Deploying Models to Production"
                },
                {
                  "level_id": "AFE-M2-L7",
                  "star_number": 7,
                  "lesson_number_in_book": 14,
                  "global_index": 139,
                  "title": "Monitoring Model Drift in the Real World"
                }
              ]
            },
            {
              "module_id": "AFE-M3",
              "module_number": 3,
              "module_name": "AI in Your Business & Society",
              "levels": [
                {
                  "level_id": "AFE-M3-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 15,
                  "global_index": 140,
                  "title": "Identifying High-Value AI Opportunities"
                },
                {
                  "level_id": "AFE-M3-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 16,
                  "global_index": 141,
                  "title": "Buy vs Build: Off-the-Shelf vs Custom Models"
                },
                {
                  "level_id": "AFE-M3-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 17,
                  "global_index": 142,
                  "title": "Working with AI Teams & Data Engineers"
                },
                {
                  "level_id": "AFE-M3-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 18,
                  "global_index": 143,
                  "title": "Common Pitfalls in AI Transformation"
                },
                {
                  "level_id": "AFE-M3-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 19,
                  "global_index": 144,
                  "title": "Multimodal AI: Vision, Voice, and Language"
                },
                {
                  "level_id": "AFE-M3-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 20,
                  "global_index": 145,
                  "title": "AI in Healthcare, Finance, and Education"
                },
                {
                  "level_id": "AFE-M3-L7",
                  "star_number": 7,
                  "lesson_number_in_book": 21,
                  "global_index": 146,
                  "title": "The Economic Impact of Automation"
                }
              ]
            },
            {
              "module_id": "AFE-M4",
              "module_number": 4,
              "module_name": "Ethics, Bias & Future of AI",
              "levels": [
                {
                  "level_id": "AFE-M4-L1",
                  "star_number": 1,
                  "lesson_number_in_book": 22,
                  "global_index": 147,
                  "title": "Algorithmic Bias & Fair Datasets"
                },
                {
                  "level_id": "AFE-M4-L2",
                  "star_number": 2,
                  "lesson_number_in_book": 23,
                  "global_index": 148,
                  "title": "Transparency, Explainability & Black-Box Models"
                },
                {
                  "level_id": "AFE-M4-L3",
                  "star_number": 3,
                  "lesson_number_in_book": 24,
                  "global_index": 149,
                  "title": "Privacy, Data Sovereignty & GDPR"
                },
                {
                  "level_id": "AFE-M4-L4",
                  "star_number": 4,
                  "lesson_number_in_book": 25,
                  "global_index": 150,
                  "title": "Deepfakes, Misinformation & Provenance"
                },
                {
                  "level_id": "AFE-M4-L5",
                  "star_number": 5,
                  "lesson_number_in_book": 26,
                  "global_index": 151,
                  "title": "Environmental Footprint of AI Training"
                },
                {
                  "level_id": "AFE-M4-L6",
                  "star_number": 6,
                  "lesson_number_in_book": 27,
                  "global_index": 152,
                  "title": "Alignment & Artificial General Intelligence (AGI)"
                },
                {
                  "level_id": "AFE-M4-L7",
                  "star_number": 7,
                  "lesson_number_in_book": 28,
                  "global_index": 153,
                  "title": "Lifelong Learning & Navigating the AI Era"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const ALL_COURSES: LevelPlanCourse[] = LEVEL_PLAN_DATA.courses;

export function getCourseById(courseId: string): LevelPlanCourse | undefined {
  return ALL_COURSES.find((c) => c.course_id === courseId);
}

export function getBookById(courseId: string, bookId: string): LevelPlanBook | undefined {
  const course = getCourseById(courseId);
  return course?.books.find((b) => b.book_id === bookId);
}

export function getModuleById(moduleId: string): LevelPlanModule | undefined {
  for (const course of ALL_COURSES) {
    for (const book of course.books) {
      const mod = book.modules.find((m) => m.module_id === moduleId);
      if (mod) return mod;
    }
  }
  return undefined;
}

export function getLevelById(levelId: string): { level: LevelPlanLevel; module: LevelPlanModule; book: LevelPlanBook; course: LevelPlanCourse } | undefined {
  for (const course of ALL_COURSES) {
    for (const book of course.books) {
      for (const mod of book.modules) {
        const lvl = mod.levels.find((l) => l.level_id === levelId);
        if (lvl) {
          return { level: lvl, module: mod, book, course };
        }
      }
    }
  }
  return undefined;
}

export function getTotalLevelCount(): number {
  let total = 0;
  for (const course of ALL_COURSES) {
    for (const book of course.books) {
      for (const mod of book.modules) {
        total += mod.levels.length;
      }
    }
  }
  return total;
}
