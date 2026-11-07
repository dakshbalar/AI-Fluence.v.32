export interface FeatureBullet {
  title: string;
  desc: string;
  iconName: string;
}

export interface FeatureItem {
  id: string;
  tabTitle: string;
  fullTitle: string;
  badge: string;
  tagline: string;
  description: string;
  bullets: FeatureBullet[];
  stats: { label: string; value: string }[];
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

export const LANDING_FEATURES_LIST: FeatureItem[] = [
  {
    id: "home",
    tabTitle: "Home",
    fullTitle: "Home — Your Learning Journey",
    badge: "Interactive Curriculum",
    tagline: "Navigate your personalized path one node at a time.",
    description:
      "Your home screen is a living game board. Every step on the path represents bite-sized concepts, milestone chests, and dynamic checkpoints that test and certify your mastery.",
    bullets: [
      {
        iconName: "MapPin",
        title: "153-Level Structured Map",
        desc: "Progress from foundational concepts to production-grade architecture without skipping critical steps."
      },
      {
        iconName: "Star",
        title: "Star Mastery Rating",
        desc: "Score up to 3 stars on every node; unlock subsequent tiers only when you achieve proven competency."
      },
      {
        iconName: "Gift",
        title: "Milestone Vault Chests",
        desc: "Reach boss and checkpoint nodes along the trail to unlock diamond stashes and bonus study packs."
      }
    ],
    stats: [
      { label: "Bite-Sized Levels", value: "153+" },
      { label: "Mastery Rating", value: "3 Stars" },
      { label: "Milestone Chests", value: "12 Stages" }
    ],
    accentColor: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200"
  },
  {
    id: "quest",
    tabTitle: "Quest",
    fullTitle: "Quest — Turn Learning Into a Game",
    badge: "Daily Gamification",
    tagline: "Turn daily study sessions into high-reward quest completions.",
    description:
      "Replace tedious homework with engaging daily quests, timed sprints, and progressive streak multipliers that make building technical fluency feel like leveling up your favorite RPG.",
    bullets: [
      {
        iconName: "Target",
        title: "Daily Mission Board",
        desc: "Receive customized daily tasks that adapt to your study schedule and focus goals."
      },
      {
        iconName: "Flame",
        title: "Streak Multipliers",
        desc: "Chain daily logins together to multiply your XP payout and unlock rare cosmetic collectibles."
      },
      {
        iconName: "Compass",
        title: "Weekly Adventures",
        desc: "Take on long-term challenges with friends and clans to conquer expansive weekly milestones."
      }
    ],
    stats: [
      { label: "Daily Missions", value: "4 Fresh/Day" },
      { label: "Streak Bonus", value: "Up to 3x XP" },
      { label: "Weekly Drops", value: "Every Sunday" }
    ],
    accentColor: "text-amber-500",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200"
  },
  {
    id: "courses",
    tabTitle: "Tracks",
    fullTitle: "Tracks — Dedicated AI & Coding Paths",
    badge: "Specialized Curricula",
    tagline: "Explore Generative AI, Data Structures & Algorithms, and AI for Everyone.",
    description:
      "Whether you want to fine-tune Large Language Models, build vector RAG pipelines, master LeetCode algorithmic patterns, or gain deep neural network intuition, switch tracks seamlessly with zero friction.",
    bullets: [
      {
        iconName: "Sparkles",
        title: "Generative AI Specialization",
        desc: "Prompt Engineering, LLM Fine-Tuning, and Retrieval-Augmented Generation (RAG) with real APIs."
      },
      {
        iconName: "Code2",
        title: "Data Structures & Algorithms",
        desc: "Master arrays, binary trees, sliding windows, dynamic programming, and interview patterns."
      },
      {
        iconName: "Cpu",
        title: "AI for Everyone & AI Tools",
        desc: "Understand neural networks, machine learning paradigms, multimodal models, and ethical AI tools."
      }
    ],
    stats: [
      { label: "Active Tracks", value: "3 Core Tracks" },
      { label: "Practice Modules", value: "320+ Levels" },
      { label: "Switching", value: "Instant" }
    ],
    accentColor: "text-indigo-600",
    accentBg: "bg-indigo-50",
    accentBorder: "border-indigo-200"
  },
  {
    id: "dsa_coding",
    tabTitle: "DSA & Coding",
    fullTitle: "DSA & Coding — Build Problem-Solving Skills",
    badge: "Interview Engineering",
    tagline: "Interactive coding environments with automated test case validation.",
    description:
      "Write real code in modern languages right in your browser. Get instant feedback on compiler errors, time complexity, and hidden edge cases to prepare for demanding technical screening rounds.",
    bullets: [
      {
        iconName: "Terminal",
        title: "Integrated Online IDE",
        desc: "Live code editor with syntax highlighting, automatic indentation, and zero environment setup."
      },
      {
        iconName: "CheckCircle",
        title: "Automated Test Suite",
        desc: "Test your solution against 12+ rigorous unit tests including boundary values and large input sets."
      },
      {
        iconName: "Cpu",
        title: "Algorithmic Efficiency",
        desc: "Measure Big-O runtime and memory footprints to learn the difference between O(N) and O(N²)."
      }
    ],
    stats: [
      { label: "Test Cases", value: "100% Automated" },
      { label: "Supported", value: "C++, Py, Java" },
      { label: "Difficulty", value: "Easy to Hard" }
    ],
    accentColor: "text-emerald-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200"
  },
  {
    id: "practice",
    tabTitle: "Practice",
    fullTitle: "Practice — Learn by Doing",
    badge: "Active Recall",
    tagline: "Reinforce key concepts with interactive drills and immediate feedback.",
    description:
      "Passive reading rarely creates long-term mastery. Our active recall drills challenge you with multiple choice, syntax puzzle fills, code ordering, and instant visual corrections.",
    bullets: [
      {
        iconName: "Zap",
        title: "Rapid-Fire Quizzes",
        desc: "Engaging bite-sized question decks designed to cement neural pathways in under 3 minutes."
      },
      {
        iconName: "RefreshCw",
        title: "Spaced Repetition Review",
        desc: "Weak areas and incorrect answers automatically recirculate into your upcoming practice decks."
      },
      {
        iconName: "Check",
        title: "Instant Audio-Visual Clarity",
        desc: "Receive clear explanations the moment you submit an answer so misconceptions are immediately cleared."
      }
    ],
    stats: [
      { label: "Question Types", value: "6 Formats" },
      { label: "Avg Drill Time", value: "2.5 Mins" },
      { label: "Retention Rate", value: "92% Boost" }
    ],
    accentColor: "text-cyan-600",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200"
  },
  {
    id: "theory",
    tabTitle: "Theory",
    fullTitle: "Theory — Understand With Theory",
    badge: "Conceptual Depth",
    tagline: "Visual slide decks that break down complex systems into clear mental models.",
    description:
      "Before writing code or memorizing facts, absorb the 'why'. Each level pairs hands-on practice with structured 10-slide visual guides featuring clear analogies, diagrams, and best practice summaries.",
    bullets: [
      {
        iconName: "BookOpen",
        title: "10-Slide Focused Decks",
        desc: "Every topic is distilled into 10 structured slides with zero unnecessary fluff or filler."
      },
      {
        iconName: "Layers",
        title: "Architectural Diagrams",
        desc: "Understand how memory pointers, transformers, neural layers, and tokenizers work under the hood."
      },
      {
        iconName: "FileText",
        title: "Digital Course Guidebooks",
        desc: "Bookmark reference rules, formula sheets, and syntax cheat sheets to study offline."
      }
    ],
    stats: [
      { label: "Slides Per Level", value: "10 Curated" },
      { label: "Visual Diagrams", value: "High-Res" },
      { label: "Takeaway Notes", value: "1-Click Copy" }
    ],
    accentColor: "text-purple-600",
    accentBg: "bg-purple-50",
    accentBorder: "border-purple-200"
  },
  {
    id: "progress_rewards",
    tabTitle: "Progress & Rewards",
    fullTitle: "Progress & Rewards — Track Progress & Earn Rewards",
    badge: "Quantified Growth",
    tagline: "Watch your experience grow from novice recruit to grandmaster scholar.",
    description:
      "Every question answered and line of code submitted contributes to your persistent progress. Accumulate XP, level up your rank, unlock diamond stashes, and visualize your daily consistency.",
    bullets: [
      {
        iconName: "BarChart3",
        title: "Dynamic XP & Rank Hierarchy",
        desc: "Climb through 10 distinct scholar ranks as you hit total lifetime experience milestones."
      },
      {
        iconName: "Gem",
        title: "Diamond Economy",
        desc: "Earn premium gems to acquire streak freezes, bonus power-ups, and exclusive avatar cosmetics."
      },
      {
        iconName: "Calendar",
        title: "Interactive Habit Calendar",
        desc: "Track your active study days, lessons completed, and weekly hours with precision analytics."
      }
    ],
    stats: [
      { label: "Scholar Ranks", value: "10 Tiers" },
      { label: "Daily XP Caps", value: "Unlimited" },
      { label: "Sync", value: "Cloud Realtime" }
    ],
    accentColor: "text-rose-600",
    accentBg: "bg-rose-50",
    accentBorder: "border-rose-200"
  },
  {
    id: "clans",
    tabTitle: "Clans",
    fullTitle: "Clans — Join. Compete. Grow.",
    badge: "Social Guilds",
    tagline: "Build a community of learners, share strategies, and climb global leaderboards.",
    description:
      "Learning is 10x more effective when you are not alone. Create or join custom clans with unique shields, coordinate group study goals, donate support, and challenge rival squads.",
    bullets: [
      {
        iconName: "Shield",
        title: "Custom Heraldic Shields",
        desc: "Design your clan emblem with custom shield shapes, colors, patterns, and legendary crests."
      },
      {
        iconName: "Share2",
        title: "Unique Clan ID & Quick Invites",
        desc: "Instantly copy and share your clan ID with classmates and colleagues to join with one click."
      },
      {
        iconName: "Users",
        title: "Cooperative Trophies",
        desc: "Pool individual trophy earnings into a collective clan standing to rank on regional leaderboards."
      }
    ],
    stats: [
      { label: "Max Members", value: "50 / Clan" },
      { label: "Clan Ranks", value: "Leader, Elder" },
      { label: "Global Sync", value: "Firestore DB" }
    ],
    accentColor: "text-blue-500",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200"
  },
  {
    id: "rewards",
    tabTitle: "Rewards",
    fullTitle: "Rewards — Stay Consistent. Earn More.",
    badge: "Loot & Perks",
    tagline: "Unlock animated pixel chests, surprise loot drops, and streak shields.",
    description:
      "Consistent study is celebrated with high-thrill reward moments. Open animated mystery chests to reveal diamonds, XP boosters, streak freeze shields, and collectible mascot gear.",
    bullets: [
      {
        iconName: "PackageOpen",
        title: "Multi-Tiered Mystery Chests",
        desc: "Discover Common, Rare, Epic, and Legendary chests with dramatic pixel-art unboxing reveals."
      },
      {
        iconName: "ShieldAlert",
        title: "Streak Freeze Insurance",
        desc: "Protect your hard-earned multi-week streaks from unexpected sick days or travel interruptions."
      },
      {
        iconName: "Sparkle",
        title: "Surprise Daily Drops",
        desc: "Log in every 24 hours to claim guaranteed bonus diamonds and experience multipliers."
      }
    ],
    stats: [
      { label: "Chest Rarities", value: "4 Tiers" },
      { label: "Streak Freezes", value: "Available" },
      { label: "Daily Drop", value: "Every 24h" }
    ],
    accentColor: "text-amber-600",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200"
  },
  {
    id: "avatars",
    tabTitle: "Avatars",
    fullTitle: "Avatars — Express Your Style",
    badge: "Custom Companions",
    tagline: "Personalize your study mascot with outfits, accessories, and glowing themes.",
    description:
      "Choose between Aiden, Lumi, Cyber Knights, and Robotic companions. Customize armor sets, glasses, colorways, and glowing backdrops to show off your identity across the platform.",
    bullets: [
      {
        iconName: "Palette",
        title: "Signature Characters",
        desc: "Choose from distinct robotic companions with expressive animations and reactions."
      },
      {
        iconName: "Sparkles",
        title: "Unlockable Skin Cosmetics",
        desc: "Earn exclusive themed skins such as Cyber Neon, Golden Master, and Retro 8-Bit."
      },
      {
        iconName: "Smile",
        title: "Dynamic Mood Reactions",
        desc: "Your companion celebrates your correct answers and cheers you on when problems get tough."
      }
    ],
    stats: [
      { label: "Base Mascots", value: "Aiden & Lumi" },
      { label: "Custom Skins", value: "15+ Styles" },
      { label: "Realtime View", value: "Live Render" }
    ],
    accentColor: "text-pink-600",
    accentBg: "bg-pink-50",
    accentBorder: "border-pink-200"
  },
  {
    id: "challenges",
    tabTitle: "Challenges",
    fullTitle: "Challenges — Take on New Challenges",
    badge: "Competitive Arenas",
    tagline: "Test your speed, logic, and endurance in timed community boss events.",
    description:
      "Ready to prove your skills against the clock? Enter periodic community tournaments and algorithmic boss battles where high scores earn massive diamond jackpots and bragging rights.",
    bullets: [
      {
        iconName: "Timer",
        title: "Timed Speedrun Sprints",
        desc: "Race against the clock to solve complex multi-step problems with the fewest errors."
      },
      {
        iconName: "Swords",
        title: "Boss Battle Checkpoints",
        desc: "Conquer end-of-unit boss problems combining multiple topics to test total mastery."
      },
      {
        iconName: "Trophy",
        title: "Exclusive Event Jackpots",
        desc: "Win rare profile crests and hundreds of diamonds by placing in the top percentiles."
      }
    ],
    stats: [
      { label: "Event Cadence", value: "Weekly" },
      { label: "Timer Mode", value: "Realtime" },
      { label: "Prize Pools", value: "500+ Gems" }
    ],
    accentColor: "text-violet-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200"
  },
  {
    id: "league",
    tabTitle: "League",
    fullTitle: "League — Compete. Climb Higher.",
    badge: "Tiered Divisions",
    tagline: "Climb through 8 competitive tiers from Bronze to Legend League.",
    description:
      "Battle against 30 learners in your weekly division. Gain trophies from quizzes and challenges to finish in the promotion zone and ascend to prestigious higher-ranked leagues.",
    bullets: [
      {
        iconName: "TrendingUp",
        title: "8 Competitive Tiers",
        desc: "Advance through Bronze, Silver, Gold, Crystal, Master, Champion, Titan, and Legend."
      },
      {
        iconName: "Crown",
        title: "Dynamic Ambient League Glow",
        desc: "The entire application interface responds with dynamic glowing gradients matching your active league."
      },
      {
        iconName: "Award",
        title: "Weekly Promotions & Demotions",
        desc: "Top 5 students get promoted every Sunday midnight, unlocking prestige badge emblems."
      }
    ],
    stats: [
      { label: "Division Size", value: "30 Players" },
      { label: "Trophy Tiers", value: "8 Leagues" },
      { label: "Promotion", value: "Top 5 Weekly" }
    ],
    accentColor: "text-amber-500",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200"
  },
  {
    id: "profile",
    tabTitle: "Profile",
    fullTitle: "Profile — Your Journey. Your Story.",
    badge: "Scholar Portfolio",
    tagline: "A comprehensive digital transcript of all your technical achievements.",
    description:
      "Your personal profile serves as a verified showcase of all completed tracks, current clan standing, badge trophies, total XP, and 30-day learning commitments.",
    bullets: [
      {
        iconName: "UserCheck",
        title: "Verified Student Passport",
        desc: "Display your primary language focus, active courses, and personalized curriculum goals."
      },
      {
        iconName: "Award",
        title: "Accomplishment Wall",
        desc: "Showcase earned milestone medals like 'First Blood', 'Algorithm Knight', and 'Clan Founder'."
      },
      {
        iconName: "Target",
        title: "Learning Commitments",
        desc: "Set and track daily time goals (10 to 60+ mins) with personalized adaptive milestone dates."
      }
    ],
    stats: [
      { label: "Milestone Badges", value: "24 Badges" },
      { label: "Exportable", value: "PDF & Share" },
      { label: "Sync", value: "Multi-Device" }
    ],
    accentColor: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200"
  },
  {
    id: "ai_support",
    tabTitle: "AI Support",
    fullTitle: "AI Support — Get Help Instantly",
    badge: "24/7 Intelligent Tutor",
    tagline: "Stuck on tricky syntax or grammar? Get immediate, guided AI explanations.",
    description:
      "Never wait for office hours again. Our integrated Gemini AI tutor analyzes your exact code or answer, highlights logical misconceptions, and provides Socratic hints without spoiling answers.",
    bullets: [
      {
        iconName: "Bot",
        title: "Socratic Hint Generator",
        desc: "Receive guided prompts that help you spot your own bugs rather than just copying solutions."
      },
      {
        iconName: "Sparkles",
        title: "Line-by-Line Code Reviews",
        desc: "Submit buggy snippets to receive instant explanations of off-by-one errors and syntax mistakes."
      },
      {
        iconName: "MessageSquare",
        title: "Natural Conversational Practice",
        desc: "Roleplay realistic dialogues in Spanish, French, Japanese, or German with context-aware responses."
      }
    ],
    stats: [
      { label: "Response Time", value: "< 1.2s" },
      { label: "Model", value: "Gemini 2.5/3" },
      { label: "Availability", value: "24/7 Unlimited" }
    ],
    accentColor: "text-cyan-600",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200"
  },
  {
    id: "institutions",
    tabTitle: "For Institutions",
    fullTitle: "For Institutions — A Modern Learning Solution",
    badge: "Classroom Analytics",
    tagline: "Empower schools, universities, and bootcamps with turnkey analytics.",
    description:
      "Designed for educators and department heads. Monitor student cohorts, track completion heatmaps, assign targeted curriculum modules, and spot struggling students automatically.",
    bullets: [
      {
        iconName: "School",
        title: "Classroom Cohort Dashboard",
        desc: "View class-wide progress bars, average quiz scores, and lesson completion rates in real time."
      },
      {
        iconName: "TrendingDown",
        title: "Struggle Detection Alerts",
        desc: "Automated alerts highlight topics where students fail multiple times so teachers can intervene."
      },
      {
        iconName: "CheckSquare",
        title: "Automated Homework & Grading",
        desc: "Eliminate manual grading with instant assessment telemetry, CSV exports, and LMS compatibility."
      }
    ],
    stats: [
      { label: "Completion Rate", value: "94% Avg" },
      { label: "Teacher Hours", value: "-60% Grading" },
      { label: "Scalability", value: "1,000+ Roster" }
    ],
    accentColor: "text-emerald-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200"
  }
];
