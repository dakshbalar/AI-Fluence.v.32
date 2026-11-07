import { GenAILesson } from "./genaiPromptEngineeringData";

export const RAG_LESSONS: GenAILesson[] = [
  {
    id: 901,
    levelNumber: 1,
    moduleNumber: 1,
    moduleName: "Module 1: RAG Architecture",
    title: "1. Vector Embeddings & Similarity Search",
    subtitle: "Mapping human semantics into high-dimensional vector spaces",
    centralIdea: "Embeddings transform arbitrary text into dense numerical coordinate vectors where semantic meaning correlates with geometric proximity.",
    whyItMatters: "Vector similarity search allows finding contextually relevant knowledge across millions of documents in milliseconds.",
    keyTakeaway: "Cosine similarity measures the angle between vectors, independent of token length.",
    xpReward: 40,
    deeperConcept: "Embeddings place tokens into high-dimensional manifolds (e.g. 768 to 3072 dimensions) using learned contrastive representations.",
    diagnosticChecklist: [
      "Normalize vectors before cosine similarity calculations",
      "Chunk long documents to maintain semantic coherence",
      "Store metadata tags alongside vectors for hybrid filtering"
    ],
    characterDialogue: {
      "hook": "Words aren't just strings; they are points in a semantic hyperspace!",
      "mechanism": "Neural embedding encoders project sentences into directional vectors where cosine distance represents conceptual similarity.",
      "proTip": "Always chunk text into 256-512 token segments with overlap to preserve cross-sentence continuity.",
      "punchline": "Find the needles in the vector haystack!"
    },
    basicQuestions: [
      {
        id: "rag-q1",
        type: "multiple_choice",
        question: "What does cosine similarity measure between two document vectors?",
        options: [
          "The cosine of the angle between them, indicating semantic directional alignment",
          "The total number of identical character strings",
          "The file byte size difference on disk",
          "The inference latency in milliseconds"
        ],
        correctIndex: 0,
        explanation: "Cosine similarity calculates the dot product of normalized vectors, evaluating angle rather than magnitude."
      }
    ],
    advancedQuestions: [
      {
        id: "rag-q2",
        type: "true_false",
        question: "Hybrid search combines sparse lexical BM25 retrieval with dense vector cosine similarity for superior recall.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Hybrid search merges exact keyword matching (BM25) with semantic vector embeddings to capture both jargon acronyms and high-level ideas."
      }
    ]
  },
  {
    id: 902,
    levelNumber: 2,
    moduleNumber: 1,
    moduleName: "Module 1: RAG Architecture",
    title: "2. Chunking & Retrieval Pipelines",
    subtitle: "Optimizing retrieval accuracy with advanced chunking strategies",
    centralIdea: "Effective RAG systems segment documents into coherent contextual units with sliding-window overlaps, balancing granularity against context loss.",
    whyItMatters: "Chunks that are too large dilute semantic focus; chunks that are too small lack the context needed to answer questions accurately.",
    keyTakeaway: "Match chunk size to the expected granularity of user inquiries and downstream prompt context limits.",
    xpReward: 45,
    deeperConcept: "Hierarchical chunking indexes small child chunks for vector matching while returning larger parent chunks to the LLM generator.",
    diagnosticChecklist: [
      "Experiment with 300-500 token chunk sizes",
      "Implement 10-20% chunk token overlap",
      "Filter out low-similarity chunks via relevance score thresholds"
    ],
    characterDialogue: {
      "hook": "Garbage chunking in equals hallucinated answers out!",
      "mechanism": "Recursive character splitters divide text by paragraphs, sentences, and words to preserve natural boundaries.",
      "proTip": "Use parent-document retrievers so the vector search matches small quotes but gives the LLM the whole paragraph.",
      "punchline": "Precision retrieval unlocks zero-hallucination pipelines!"
    },
    basicQuestions: [
      {
        id: "rag-q3",
        type: "multiple_choice",
        question: "Why is chunk overlap used when splitting documents?",
        options: [
          "To avoid cutting key sentences or concepts in half across adjacent chunks",
          "To double the size of the database on disk",
          "To speed up GPU inference time",
          "To automatically translate documents to other languages"
        ],
        correctIndex: 0,
        explanation: "Chunk overlap ensures concepts that span across boundaries are not fragmented or lost during vector search."
      }
    ],
    advancedQuestions: [
      {
        id: "rag-q4",
        type: "true_false",
        question: "A re-ranker cross-encoder scores retrieved query-document pairs more accurately than bi-encoder cosine similarity alone.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Cross-encoders process query and document together through full self-attention layers, yielding superior ranking precision."
      }
    ]
  },
  {
    id: 903,
    levelNumber: 3,
    moduleNumber: 1,
    moduleName: "Module 1: RAG Architecture",
    title: "3. Vector Databases & ANN Indexing",
    subtitle: "Scaling similarity search with HNSW and IVF indexes",
    centralIdea: "Vector databases index embeddings using Approximate Nearest Neighbor (ANN) algorithms like HNSW (Hierarchical Navigable Small World) graphs to achieve sub-millisecond search over billions of vectors.",
    whyItMatters: "Exhaustive brute-force cosine comparison is O(N) and unusable at scale. HNSW delivers logarithmic O(log N) query times.",
    keyTakeaway: "HNSW builds multi-layered skip-list graphs where upper layers find the neighborhood and lower layers find the exact nearest vector.",
    xpReward: 45,
    deeperConcept: "IVF (Inverted File) indexes cluster vectors into Voronoi cells, querying only centroids closest to the search vector.",
    diagnosticChecklist: [
      "Select HNSW for low latency and high recall",
      "Tune ef_search parameter to balance speed vs precision",
      "Configure vector dimension matching embedding model"
    ],
    characterDialogue: {
      "hook": "Searching billions of vectors in 5 milliseconds? That's the power of graph indexing!",
      "mechanism": "HNSW navigates hierarchical proximity graphs with greedy routing, leaping across clusters before zooming into local nodes.",
      "proTip": "Increase efConstruction during index building to boost recall without sacrificing query latency.",
      "punchline": "Logarithmic speed, enterprise scale!"
    },
    basicQuestions: [
      {
        id: "rag-q5",
        type: "multiple_choice",
        question: "What is the primary computational benefit of HNSW indexing in vector databases?",
        options: [
          "Reduces search complexity from linear O(N) to logarithmic O(log N)",
          "Encrypts vectors with 256-bit keys",
          "Removes the need to embed text",
          "Translates vector math into SQL queries"
        ],
        correctIndex: 0,
        explanation: "HNSW graphs enable logarithmic routing through multi-layer skip networks, making massive vector databases search in milliseconds."
      }
    ],
    advancedQuestions: [
      {
        id: "rag-q6",
        type: "true_false",
        question: "Approximate Nearest Neighbor (ANN) algorithms trade a tiny fraction of recall precision for orders-of-magnitude faster query speed.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "ANN delivers 98-99% recall at 100x-1000x faster speeds compared to exact linear distance scans."
      }
    ]
  },
  {
    id: 904,
    levelNumber: 4,
    moduleNumber: 1,
    moduleName: "Module 1: RAG Architecture",
    title: "4. Hybrid Search & Reciprocal Rank Fusion",
    subtitle: "Combining sparse keyword precision with dense semantic vectors",
    centralIdea: "Hybrid search merges sparse lexical retrieval (BM25) with dense vector search, using Reciprocal Rank Fusion (RRF) to score and unify disparate ranking lists.",
    whyItMatters: "Vector embeddings often fail on exact part numbers, product SKUs, and rare acronyms; BM25 solves exact match while vectors handle semantic intent.",
    keyTakeaway: "RRF Score = ∑ 1 / (k + rank_i), assigning higher combined weight to documents ranked near the top of both lists.",
    xpReward: 50,
    deeperConcept: "BM25 scores term frequency and inverse document frequency; dense vectors score conceptual geometry. Combining them yields state-of-the-art recall.",
    diagnosticChecklist: [
      "Index both full-text BM25 tokens and dense embeddings",
      "Apply Reciprocal Rank Fusion with standard constant k=60",
      "Analyze failure cases where users search acronyms"
    ],
    characterDialogue: {
      "hook": "Why choose between keywords and semantics when you can dominate with both?",
      "mechanism": "BM25 pinpoints exact keyword occurrences while dense vectors capture abstract meaning; RRF normalizes their ranks seamlessly.",
      "proTip": "Always default to hybrid search in production e-commerce and legal document search.",
      "punchline": "Exact matches meet conceptual intuition!"
    },
    basicQuestions: [
      {
        id: "rag-q7",
        type: "multiple_choice",
        question: "Why is hybrid search (BM25 + Vectors) superior to vector search alone?",
        options: [
          "It captures both exact keyword matches (SKUs, IDs, acronyms) and fuzzy semantic concepts",
          "It cuts storage requirements by 50%",
          "It eliminates the need for an LLM generator",
          "It allows models to run on battery power"
        ],
        correctIndex: 0,
        explanation: "Combining lexical BM25 with dense semantic embeddings provides robust recall across both technical jargon and conceptual descriptions."
      }
    ],
    advancedQuestions: [
      {
        id: "rag-q8",
        type: "true_false",
        question: "Reciprocal Rank Fusion (RRF) merges search results based on rank positions rather than raw distance scores, avoiding score normalization bugs.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "RRF uses relative ordinal rankings, making it immune to scale discrepancies between BM25 scores and cosine similarities."
      }
    ]
  },
  {
    id: 905,
    levelNumber: 5,
    moduleNumber: 2,
    moduleName: "Module 2: Advanced Retrieval & Routing",
    title: "5. Cross-Encoder Reranking",
    subtitle: "Refining top candidate passages with joint self-attention",
    centralIdea: "Bi-encoders retrieve the top 50 candidates fast, then a heavy Cross-Encoder reranks the candidates by jointly attending over query and document tokens simultaneously.",
    whyItMatters: "Cross-encoders eliminate false positives and ensure only the most relevant top 3-5 passages are passed into the LLM context window.",
    keyTakeaway: "Bi-encoders prioritize speed for retrieval (O(1) vector lookup); cross-encoders prioritize precision for final ranking.",
    xpReward: 50,
    deeperConcept: "Cross-encoders allow all query tokens to interact with all document tokens via full self-attention, capturing nuanced contextual interactions that vector dots miss.",
    diagnosticChecklist: [
      "Retrieve top 25-50 candidates with hybrid search",
      "Pass candidates through a lightweight reranker (e.g., Cohere, BGE-Reranker)",
      "Send only the top 3-5 reranked passages to the generator"
    ],
    characterDialogue: {
      "hook": "Don't overwhelm your LLM with mediocre context! Reranking filters the gold from the gravel.",
      "mechanism": "Cross-encoders evaluate query and document in a single transformer pass, scoring semantic relevance with full bidirectional attention.",
      "proTip": "Adding a reranker typically boosts RAG accuracy metrics by 15-30% with minimal latency cost.",
      "punchline": "Filter the noise, amplify the signal!"
    },
    basicQuestions: [
      {
        id: "rag-q9",
        type: "multiple_choice",
        question: "What is the primary difference between a bi-encoder and a cross-encoder in RAG pipelines?",
        options: [
          "Bi-encoders embed query and document separately for fast lookup; cross-encoders process them jointly for deeper self-attention scoring",
          "Cross-encoders only work on images, while bi-encoders work on audio",
          "Bi-encoders require 100 GPUs, while cross-encoders run on mobile devices",
          "Cross-encoders are only used for training base models"
        ],
        correctIndex: 0,
        explanation: "Bi-encoders enable sub-millisecond vector search by embedding items independently; cross-encoders perform full joint attention to score relevance with high precision."
      }
    ],
    advancedQuestions: [
      {
        id: "rag-q10",
        type: "true_false",
        question: "Reranking allows developers to retrieve a wider net of documents (e.g. top 50) and prune them down to the top 3 most accurate chunks.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Two-stage retrieval combines high recall from wide retrieval with high precision from reranking."
      }
    ]
  },
  {
    id: 906,
    levelNumber: 6,
    moduleNumber: 2,
    moduleName: "Module 2: Advanced Retrieval & Routing",
    title: "6. Metadata Filtering & Self-Querying Systems",
    subtitle: "Structured query extraction from unstructured user prompts",
    centralIdea: "Self-querying LLM modules parse natural language questions into structured SQL/JSON metadata filters (e.g., year, department, author) alongside semantic vector queries.",
    whyItMatters: "Prevents vector search from returning 2021 financial reports when the user specifically asked for 'latest 2024 revenue growth'.",
    keyTakeaway: "Pre-filtering vectors by metadata reduces search space and guarantees strict attribute constraints.",
    xpReward: 55,
    deeperConcept: "Query construction prompts translate natural language into filter expressions: e.g., and(eq('year', 2024), in('dept', ['finance', 'billing'])).",
    diagnosticChecklist: [
      "Extract structured metadata during document ingestion",
      "Use few-shot prompts to translate user questions into structured filter JSON",
      "Apply pre-filters in vector database queries"
    ],
    characterDialogue: {
      "hook": "Vector search alone doesn't understand dates and categories. Combine it with metadata filtering for bulletproof accuracy!",
      "mechanism": "The self-query engine extracts structured boolean filters from user queries and applies them before vector distance evaluation.",
      "proTip": "Always store creation timestamp, document category, and access permissions in vector payload metadata.",
      "punchline": "Structured precision meets semantic depth!"
    },
    basicQuestions: [
      {
        id: "rag-q11",
        type: "multiple_choice",
        question: "How does a self-querying RAG system handle a question like 'Show me 2024 product returns'?",
        options: [
          "It extracts a metadata filter {year: 2024} and runs vector search on 'product returns' within that filtered subset",
          "It deletes all documents from 2023",
          "It searches Wikipedia for the history of 2024",
          "It ignores the year and guesses"
        ],
        correctIndex: 0,
        explanation: "Self-querying uses an LLM to parse natural language constraints into explicit database filters."
      }
    ],
    advancedQuestions: [
      {
        id: "rag-q12",
        type: "true_false",
        question: "Pre-filtering restricts vector similarity computation to documents that meet exact metadata criteria, improving search speed and accuracy.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Pre-filtering eliminates non-matching documents before computing expensive vector distances."
      }
    ]
  },
  {
    id: 907,
    levelNumber: 7,
    moduleNumber: 2,
    moduleName: "Module 2: Advanced Retrieval & Routing",
    title: "7. Parent-Document & Hierarchical Retrieval",
    subtitle: "Matching specific sentences while providing complete context",
    centralIdea: "Parent-Document retrieval indexes small child chunks (e.g. 100 tokens) for crisp vector matching, but passes the entire parent section (e.g. 1,000 tokens) to the generator.",
    whyItMatters: "Small chunks produce sharp vector embeddings that match specific queries, but lack sufficient background context for the LLM to generate comprehensive answers.",
    keyTakeaway: "Decouple the representation used for retrieval from the representation used for generation.",
    xpReward: 55,
    deeperConcept: "Child chunks contain pointers to parent IDs in a document store (Key-Value), returning full context without diluting vector specificity.",
    diagnosticChecklist: [
      "Create small 100-token child chunks for embedding index",
      "Store full 800-token parent documents in a key-value store",
      "Retrieve child IDs and resolve to parent documents"
    ],
    characterDialogue: {
      "hook": "Small chunks for pinpoint retrieval, large parents for rich generation!",
      "mechanism": "Embedding small sentences avoids semantic dilution; returning parent documents gives the LLM the full explanatory picture.",
      "proTip": "Use parent-child retrieval when working with legal contracts and regulatory compliance manuals.",
      "punchline": "Search with a laser, answer with a library!"
    },
    basicQuestions: [
      {
        id: "rag-q13",
        type: "multiple_choice",
        question: "What problem does the Parent-Document retriever solve in RAG?",
        options: [
          "Small chunks have high search precision but lack context, so it matches small chunks and feeds the larger parent to the LLM",
          "It automatically organizes files into desktop folders",
          "It prevents the user from typing long questions",
          "It translates documents into parent and child languages"
        ],
        correctIndex: 0,
        explanation: "Parent-document retrieval decouples vector matching units from context generation units, getting the best of both worlds."
      }
    ],
    advancedQuestions: [
      {
        id: "rag-q14",
        type: "true_false",
        question: "In parent-document retrieval, only the small child chunks are stored in the vector database index.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Only child chunks are embedded and indexed for vector search; the full parent documents are stored in a standard key-value or document store."
      }
    ]
  },
  {
    id: 908,
    levelNumber: 8,
    moduleNumber: 2,
    moduleName: "Module 2: Advanced Retrieval & Routing",
    title: "8. Agentic RAG & Corrective Feedback Loops",
    subtitle: "Self-RAG, corrective retrieval, and iterative web search fallbacks",
    centralIdea: "Agentic RAG evaluates retrieved context quality using self-reflection tokens. If context is insufficient or irrelevant, the agent rewrites the query, searches alternative sources, or web-searches before generating.",
    whyItMatters: "Static single-shot RAG fails whenever initial retrieval returns irrelevant documents. Agentic loops self-correct dynamically.",
    keyTakeaway: "Implement Grade Documents -> Rewrite Query -> Fallback Web Search -> Hallucination Check workflow.",
    xpReward: 60,
    deeperConcept: "Corrective RAG (CRAG) scores retrieval confidence: High triggers direct generation; Low triggers web query rewrite; Ambiguous blends knowledge streams.",
    diagnosticChecklist: [
      "Grade retrieved documents for relevance before generation",
      "Transform queries using rewrite agents when similarity is poor",
      "Verify generated answers against source context for hallucination check"
    ],
    characterDialogue: {
      "hook": "Don't settle for static retrieval! Give your RAG pipeline the autonomy to self-correct and verify its own facts.",
      "mechanism": "Reflection agents evaluate whether retrieved chunks answer the question, dynamically looping back to query rewrite if necessary.",
      "proTip": "Implement a citation attribution check to guarantee every assertion links directly to a source chunk.",
      "punchline": "Autonomous retrieval with zero hallucination tolerance!"
    },
    basicQuestions: [
      {
        id: "rag-q15",
        type: "multiple_choice",
        question: "What does an Agentic RAG system do when initial retrieval returns irrelevant documents?",
        options: [
          "It evaluates the low relevance score, rewrites the query, and searches secondary sources or the web",
          "It crashes and displays a 404 error",
          "It makes up random facts to fill the context",
          "It immediately logs out the user"
        ],
        correctIndex: 0,
        explanation: "Agentic RAG uses reflection and routing agents to dynamically re-query and fetch better context when initial attempts fail."
      }
    ],
    advancedQuestions: [
      {
        id: "rag-q16",
        type: "true_false",
        question: "Self-RAG trains models to output special reflection tokens indicating whether retrieved passages are relevant and whether generated facts are supported.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation: "Self-RAG incorporates critique tokens (Retrieve, IsRel, IsSup, IsUse) to monitor quality and citations throughout generation."
      }
    ]
  }
];
