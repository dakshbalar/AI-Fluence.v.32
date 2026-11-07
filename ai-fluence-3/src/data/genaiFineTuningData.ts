import { GenAILesson } from "./genaiPromptEngineeringData";

export const FINE_TUNING_LESSONS: GenAILesson[] = [
  {
    id: 801,
    levelNumber: 1,
    moduleNumber: 1,
    moduleName: "Module 1: Fine-Tuning Foundations",
    title: "1. Why & When to Fine-Tune",
    subtitle: "Understanding prompt engineering vs. weight adaptation",
    centralIdea: "Fine-tuning permanently modifies internal model weights on curated domain datasets, enforcing tone, format adherence, and specialized syntax that prompting alone struggles to guarantee.",
    whyItMatters: "Using fine-tuning for static stylistic consistency saves token latency and produces deterministic output structures across millions of inferences.",
    keyTakeaway: "Fine-tuning is for syntax, style, and structure; retrieval (RAG) is for dynamic facts and knowledge.",
    xpReward: 40,
    deeperConcept: "Supervised Fine-Tuning (SFT) optimizes cross-entropy loss over target completion tokens while conditioning on prompt prefixes.",
    diagnosticChecklist: [
      "Are you trying to teach behavior/form or volatile external facts?",
      "Do you have at least 500-1000 clean input/output pairs?",
      "Have you exhaustively tested few-shot system prompts first?"
    ],
    characterDialogue: {
      "hook": "Stop retraining models from scratch! We adapt pre-trained transformers by updating specific weight matrices.",
      "mechanism": "Backpropagation calculates loss gradients across task-specific pairs, shifting attention projections toward your desired domain structure.",
      "proTip": "Always start with LoRA (Low-Rank Adaptation) before even considering full-parameter tuning.",
      "punchline": "Tune the behavior, retrieve the facts!"
    },
    basicQuestions: [
      {
        id: "ft-q1",
        type: "multiple_choice",
        question: "When is Supervised Fine-Tuning (SFT) the most suitable strategy?",
        options: [
          "When you need to guarantee consistent JSON schema formatting and tone across millions of calls",
          "When you want real-time stock ticker prices updated every second",
          "When you have only 2 example sentences",
          "When you don't have access to model weights or a fine-tuning endpoint"
        ],
        correctIndex: 0,
        explanation: "Fine-tuning permanently adapts behavioral traits, response formats, and stylistic syntax into model weights."
      }
    ],
    advancedQuestions: [
      {
        id: "ft-q2",
        type: "true_false",
        question: "LoRA reduces memory consumption during fine-tuning by decomposing weight update matrices into low-rank representations.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "LoRA freezes original pre-trained weights and injects trainable rank decomposition matrices (A and B), vastly cutting VRAM demands."
      }
    ]
  },
  {
    id: 802,
    levelNumber: 2,
    moduleNumber: 1,
    moduleName: "Module 1: Fine-Tuning Foundations",
    title: "2. Parameter-Efficient Fine-Tuning (PEFT) & LoRA",
    subtitle: "Adapting billion-parameter models with low-rank matrices",
    centralIdea: "LoRA decomposes the weight update matrix ΔW into two low-rank matrices (A and B), reducing trainable parameters by up to 99% without losing accuracy.",
    whyItMatters: "Allows training 70B parameter models on consumer GPUs instead of requiring multi-node enterprise clusters.",
    keyTakeaway: "Low rank r (e.g., r=8 or 16) captures the intrinsic low-dimensional manifold of task adaptation.",
    xpReward: 45,
    deeperConcept: "ΔW = B · A where B ∈ R^(d×r) and A ∈ R^(r×k) with r ≪ min(d, k).",
    diagnosticChecklist: [
      "Select rank r (typically 8 to 64)",
      "Set alpha scaling parameter (typically 2 * r)",
      "Target attention projection layers (q_proj, v_proj)"
    ],
    characterDialogue: {
      "hook": "Why store gigabytes of new weights when a low-rank adapter only needs megabytes?",
      "mechanism": "LoRA freezes the original pre-trained weights W0 and adds a parallel bypass ΔW = B x A.",
      "proTip": "Tune q_proj and v_proj for quick wins, or all linear layers for maximum task convergence.",
      "punchline": "Small rank, massive capability!"
    },
    basicQuestions: [
      {
        id: "ft-q3",
        type: "multiple_choice",
        question: "In LoRA, what is the primary benefit of freezing pre-trained weights?",
        options: [
          "Prevents catastrophic forgetting and dramatically cuts VRAM optimizer states",
          "Makes the model run 100x faster during inference",
          "Removes the need for any training dataset",
          "Allows models to read live internet URLs"
        ],
        correctIndex: 0,
        explanation: "Freezing weights ensures baseline language capability is preserved while drastically reducing memory required for optimizer states."
      }
    ],
    advancedQuestions: [
      {
        id: "ft-q4",
        type: "true_false",
        question: "QLoRA combines 4-bit NormalFloat (NF4) quantization with LoRA to enable fine-tuning large models on a single GPU.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "QLoRA quantizes the base model to 4 bits and backpropagates through the frozen quantized weights into LoRA adapters."
      }
    ]
  },
  {
    id: 803,
    levelNumber: 3,
    moduleNumber: 1,
    moduleName: "Module 1: Fine-Tuning Foundations",
    title: "3. QLoRA & 4-bit NormalFloat Quantization",
    subtitle: "Memory-efficient training on consumer-grade hardware",
    centralIdea: "QLoRA quantizes base model weights to 4-bit NormalFloat (NF4), applies Double Quantization to save memory on scale factors, and uses Paged Optimizers to eliminate OOM spikes.",
    whyItMatters: "Enables developers to fine-tune a 65B/70B parameter model on a single 48GB GPU or a 7B model on a 16GB GPU with zero performance degradation.",
    keyTakeaway: "NF4 information-theoretically optimizes quantization bins for normally distributed pre-trained neural weights.",
    xpReward: 45,
    deeperConcept: "Double Quantization quantizes quantization constants, saving 0.37 bits per parameter (~3GB on a 65B model).",
    diagnosticChecklist: [
      "Load base model in 4-bit with BitsAndBytes",
      "Attach LoRA adapters in 16-bit brain float (bfloat16)",
      "Enable gradient checkpointing to trade compute for memory"
    ],
    characterDialogue: {
      "hook": "No datacenter? No problem! QLoRA brings enterprise fine-tuning to desktop workstations.",
      "mechanism": "NF4 bins weights into 16 discrete levels optimized for normal distributions, then dequantizes on-the-fly during forward passes.",
      "proTip": "Use bfloat16 for adapters to avoid numerical instability during mixed-precision backprop.",
      "punchline": "4-bit precision, full 16-bit performance!"
    },
    basicQuestions: [
      {
        id: "ft-q5",
        type: "multiple_choice",
        question: "What does NormalFloat4 (NF4) specifically optimize for in QLoRA?",
        options: [
          "The zero-mean normal distribution typical of deep neural network weights",
          "Text compression for faster hard drive loading",
          "Converting natural text directly into binary assembly",
          "Automated translation between programming languages"
        ],
        correctIndex: 0,
        explanation: "NF4 constructs quantization bins with equal probability under a normal distribution, minimizing information loss."
      }
    ],
    advancedQuestions: [
      {
        id: "ft-q6",
        type: "true_false",
        question: "Double Quantization in QLoRA quantizes the quantization constants themselves to save additional VRAM.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Double Quantization reduces memory overhead by compressing the scaling constants from 32-bit floats to 8-bit integers."
      }
    ]
  },
  {
    id: 804,
    levelNumber: 4,
    moduleNumber: 1,
    moduleName: "Module 1: Fine-Tuning Foundations",
    title: "4. Dataset Curation & Formatting Schemes",
    subtitle: "Crafting high-quality JSONL instruction datasets",
    centralIdea: "Dataset quality vastly outweighs raw sample volume in modern SFT. 1,000 pristine, diverse, human-verified examples consistently outperform 50,000 noisy scraped samples.",
    whyItMatters: "Garbage data produces hallucinated tokens and corrupts reasoning capabilities through catastrophic forgetting.",
    keyTakeaway: "Format data using standardized template schemas (e.g. ChatML, Alpaca, ShareGPT) with clear role markers.",
    xpReward: 50,
    deeperConcept: "Loss masking ensures the loss is only computed on assistant response tokens, ignoring system and user prompt tokens during gradient updates.",
    diagnosticChecklist: [
      "Filter out repetitive, low-variance examples",
      "Apply token-level loss masking on prompt inputs",
      "Verify syntax validity across all JSON/JSONL rows"
    ],
    characterDialogue: {
      "hook": "Quantity is a vanity metric; quality is your sanity check!",
      "mechanism": "Loss masking isolates assistant tokens so the model learns generative outputs rather than memorizing prompt questions.",
      "proTip": "Include negative examples and refusal patterns to teach boundary enforcement.",
      "punchline": "Curate with care, deploy with confidence!"
    },
    basicQuestions: [
      {
        id: "ft-q7",
        type: "multiple_choice",
        question: "Why should you apply loss masking to user prompt tokens during SFT?",
        options: [
          "To ensure the model only learns how to generate answers, not memorize the user questions",
          "To hide the user's password from the training log",
          "To speed up hard drive reading speeds",
          "To reduce the number of tokens in the dataset file"
        ],
        correctIndex: 0,
        explanation: "Loss masking zeroes out gradients for prompt tokens so the model optimizes solely for producing high-quality assistant completions."
      }
    ],
    advancedQuestions: [
      {
        id: "ft-q8",
        type: "true_false",
        question: "1,000 highly curated, diverse instruction examples can outperform 50,000 noisy uncurated pairs in task-specific fine-tuning.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "The LIMA (Less Is More for Alignment) paper proved that superficial alignment requires only a small set of high-quality examples."
      }
    ]
  },
  {
    id: 805,
    levelNumber: 5,
    moduleNumber: 2,
    moduleName: "Module 2: Training & Optimization",
    title: "5. Hyperparameter Tuning for LLMs",
    subtitle: "Mastering learning rates, warmups, and batch sizing",
    centralIdea: "Fine-tuning requires delicate hyperparameter balancing: learning rates that are too high destroy foundational capabilities, while rates that are too low fail to converge.",
    whyItMatters: "Proper scheduling prevents loss spikes and ensures stable adapter weight convergence.",
    keyTakeaway: "Use cosine learning rate decay with a 3-5% warmup phase and effective batch sizes of 16-64 via gradient accumulation.",
    xpReward: 50,
    deeperConcept: "Gradient Accumulation simulates larger batch sizes without increasing per-step VRAM allocation.",
    diagnosticChecklist: [
      "Set LoRA learning rate around 1e-4 to 2e-4",
      "Use cosine decay schedule with 0.03 warmup ratio",
      "Enable gradient accumulation steps to reach target batch size"
    ],
    characterDialogue: {
      "hook": "Finding the sweet spot between underfitting and catastrophic weight collapse is pure engineering craft!",
      "mechanism": "Warmup schedules gradually ramp up learning rates, allowing optimizer momentums (AdamW) to stabilize before full updates.",
      "proTip": "If loss plateaus too early, increase rank r or unfreeze projection layers in the multi-head attention blocks.",
      "punchline": "Smooth loss curves, sharp model performance!"
    },
    basicQuestions: [
      {
        id: "ft-q9",
        type: "multiple_choice",
        question: "What is the primary function of learning rate warmup in LLM training?",
        options: [
          "Prevents early unstable gradient updates from corrupting pre-trained weights while Adam momentums stabilize",
          "Warms up the GPU temperature to prevent hardware throttle",
          "Increases inference speed after training is complete",
          "Automatically expands dataset size"
        ],
        correctIndex: 0,
        explanation: "Warmup slowly increases learning rate from zero, allowing momentum estimates to form reliable directional vectors."
      }
    ],
    advancedQuestions: [
      {
        id: "ft-q10",
        type: "true_false",
        question: "Gradient accumulation allows you to achieve the mathematical equivalent of a 64-sample batch size on limited GPU memory.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Gradient accumulation sums gradients over multiple micro-batches before performing a single optimizer step."
      }
    ]
  },
  {
    id: 806,
    levelNumber: 6,
    moduleNumber: 2,
    moduleName: "Module 2: Training & Optimization",
    title: "6. Mitigating Catastrophic Forgetting",
    subtitle: "Preserving general reasoning while gaining specialized skills",
    centralIdea: "When fine-tuning on a narrow task, models can lose general knowledge and mathematical reasoning. Replay buffers and weight decay protect foundational intellect.",
    whyItMatters: "A medical classification model that forgets basic conversational syntax or logic is unusable in production.",
    keyTakeaway: "Mix in 10-20% general instructional data alongside your domain dataset to anchor baseline capabilities.",
    xpReward: 55,
    deeperConcept: "Elastic Weight Consolidation (EWC) penalizes updates to parameters deemed critical to previous tasks based on Fisher Information matrices.",
    diagnosticChecklist: [
      "Include general conversational data in training mix",
      "Monitor MMLU and GSM8K benchmark scores during validation",
      "Keep LoRA rank modest to restrict parameter drift"
    ],
    characterDialogue: {
      "hook": "Don't let your model gain a specialization only to lose its common sense!",
      "mechanism": "Co-training with general instruction sets prevents attention matrices from overfitting to narrow task manifolds.",
      "proTip": "Always run baseline validation benchmarks (like ARC or HellaSwag) before and after training.",
      "punchline": "Specialized mastery with zero cognitive decay!"
    },
    basicQuestions: [
      {
        id: "ft-q11",
        type: "multiple_choice",
        question: "How can you most effectively protect a model from catastrophic forgetting during domain fine-tuning?",
        options: [
          "Mix 10-20% diverse general instruction data into your domain training dataset",
          "Set the learning rate to 1.0",
          "Train for 100 epochs on a single paragraph",
          "Delete the base model weights before training"
        ],
        correctIndex: 0,
        explanation: "Co-training with general data maintains broad linguistic and reasoning representations across all attention heads."
      }
    ],
    advancedQuestions: [
      {
        id: "ft-q12",
        type: "true_false",
        question: "LoRA adapters naturally reduce catastrophic forgetting because the underlying base model weights remain completely frozen.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Because base weights W0 are untouched, the original model knowledge is safely preserved and can be restored by detaching the adapter."
      }
    ]
  },
  {
    id: 807,
    levelNumber: 7,
    moduleNumber: 2,
    moduleName: "Module 2: Training & Optimization",
    title: "7. Direct Preference Optimization (DPO) vs. RLHF",
    subtitle: "Aligning model outputs with human preferences",
    centralIdea: "DPO eliminates the complex, unstable pipeline of training separate reward models by directly optimizing policy probabilities on pairs of chosen vs. rejected completions.",
    whyItMatters: "Reduces alignment training from a fragile 4-model RL setup (PPO) to a simple, stable supervised loss function.",
    keyTakeaway: "DPO uses an implicit reward function formulated mathematically through the log-ratio of policy and reference models.",
    xpReward: 55,
    deeperConcept: "Loss = -E[log σ(β log(π_θ(y_w|x)/π_ref(y_w|x)) - β log(π_θ(y_l|x)/π_ref(y_l|x)))].",
    diagnosticChecklist: [
      "Collect prompt pairs with explicit chosen (y_w) and rejected (y_l) completions",
      "Keep reference model frozen to compute KL divergence penalty",
      "Tune beta hyperparameter (typically 0.1 to 0.5) to control divergence"
    ],
    characterDialogue: {
      "hook": "Say goodbye to the headache of reinforcement learning reward models! DPO delivers direct preference alignment.",
      "mechanism": "DPO algebraically reparameterizes the reward model into the language model's policy, directly increasing chosen likelihood while suppressing rejected tokens.",
      "proTip": "Start with SFT first, then apply DPO on top for safety, tone, and formatting preference alignment.",
      "punchline": "Direct alignment, zero RL instability!"
    },
    basicQuestions: [
      {
        id: "ft-q13",
        type: "multiple_choice",
        question: "What is the key structural advantage of DPO over traditional RLHF (PPO)?",
        options: [
          "It directly optimizes on preference pairs without needing a separate reward model or reinforcement learning loop",
          "It removes the need for any human evaluation data",
          "It trains 10,000 times faster on CPU",
          "It requires zero mathematical loss computation"
        ],
        correctIndex: 0,
        explanation: "DPO mathematically derives the optimal policy directly from preference data, avoiding the instability of PPO."
      }
    ],
    advancedQuestions: [
      {
        id: "ft-q14",
        type: "true_false",
        question: "In DPO, the beta (β) hyperparameter controls how strictly the model is penalized for drifting away from the reference model.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Higher beta values enforce tighter adherence to the reference model, preventing excessive drift from base capabilities."
      }
    ]
  },
  {
    id: 808,
    levelNumber: 8,
    moduleNumber: 2,
    moduleName: "Module 2: Training & Optimization",
    title: "8. Evaluation & Production Deployment",
    subtitle: "Merging adapters, benchmarking accuracy, and low-latency serving",
    centralIdea: "Deploy fine-tuned models either by merging LoRA weights back into the base model for zero runtime latency, or by serving dynamic multi-adapter routers for multi-tenant efficiency.",
    whyItMatters: "Dynamic adapter serving allows hundreds of specialized models to share a single base model in GPU memory.",
    keyTakeaway: "Merge weights (W = W0 + B · A) for standalone high-throughput endpoints; use multi-LoRA serving (vLLM/TGI) for diverse multi-task platforms.",
    xpReward: 60,
    deeperConcept: "Adapter swapping in engines like vLLM takes milliseconds, allowing single GPU clusters to serve bespoke fine-tunes per enterprise customer.",
    diagnosticChecklist: [
      "Benchmark against held-out test datasets with LLM-as-a-judge",
      "Verify latency impact before and after adapter merging",
      "Implement canary deployments to track real-world user metrics"
    ],
    characterDialogue: {
      "hook": "Training is only half the battle! Production deployment is where your custom weights prove their worth.",
      "mechanism": "Merging weights permanently adds BA to W0 with zero computational overhead during inference.",
      "proTip": "Use vLLM or S-LoRA to dynamically swap adapters per request with zero cold-start delay.",
      "punchline": "From checkpoint to production powerhouse!"
    },
    basicQuestions: [
      {
        id: "ft-q15",
        type: "multiple_choice",
        question: "What is the main benefit of merging LoRA weights back into the base model before production serving?",
        options: [
          "Zero additional inference latency compared to the original base model",
          "Reduces the size of the dataset on disk",
          "Allows the model to continue training during live inference",
          "Guarantees the model will never make mistakes"
        ],
        correctIndex: 0,
        explanation: "Merging computes W_final = W_base + ΔW directly, eliminating the need to evaluate the parallel LoRA branch during generation."
      }
    ],
    advancedQuestions: [
      {
        id: "ft-q16",
        type: "true_false",
        question: "Modern serving frameworks like vLLM can host multiple LoRA adapters on top of a single base model in memory without duplicating base weights.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Multi-LoRA serving allows dozens of custom adapters to dynamically bind to a single shared base model instance in VRAM."
      }
    ]
  }
];
