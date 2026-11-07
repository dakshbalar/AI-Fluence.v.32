import os
import html

def create_svg(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created: {path}")

def get_base_defs():
    return """
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#070913" />
        <stop offset="40%" stop-color="#0b1122" />
        <stop offset="80%" stop-color="#090d1a" />
        <stop offset="100%" stop-color="#050811" />
      </linearGradient>
      
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="50%" stop-color="#3b82f6" />
        <stop offset="100%" stop-color="#8b5cf6" />
      </linearGradient>

      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>

      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#8b5cf6" />
        <stop offset="100%" stop-color="#ec4899" />
      </linearGradient>

      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#fbbf24" />
      </linearGradient>

      <pattern id="dotGrid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#38bdf8" fill-opacity="0.12" />
      </pattern>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="25" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="neon" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    """

# ----------------------------------------------------
# 1. 9:16 HERO SVG (1080 x 1920)
# ----------------------------------------------------
def build_hero_svg_9_16():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="100%" height="100%">
    {get_base_defs()}
    
    <!-- Background Canvas -->
    <rect width="1080" height="1920" fill="url(#bgGrad)" />
    <rect width="1080" height="1920" fill="url(#dotGrid)" />

    <!-- Ambient Glow Orbs -->
    <circle cx="200" cy="300" r="300" fill="#3b82f6" fill-opacity="0.22" filter="url(#glow)" />
    <circle cx="900" cy="800" r="350" fill="#8b5cf6" fill-opacity="0.20" filter="url(#glow)" />
    <circle cx="300" cy="1400" r="320" fill="#06b6d4" fill-opacity="0.18" filter="url(#glow)" />

    <!-- Isometric Grid Floor at bottom -->
    <g opacity="0.25" stroke="#38bdf8" stroke-width="1.2">
      <line x1="0" y1="1720" x2="1080" y2="1720" />
      <line x1="0" y1="1800" x2="1080" y2="1800" />
      <line x1="0" y1="1880" x2="1080" y2="1880" />
      <line x1="200" y1="1680" x2="0" y2="1920" />
      <line x1="540" y1="1680" x2="540" y2="1920" />
      <line x1="880" y1="1680" x2="1080" y2="1920" />
    </g>

    <!-- Top Status Bar (y=60) -->
    <g transform="translate(60, 60)">
      <rect width="960" height="84" rx="24" fill="#0c1224" fill-opacity="0.9" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
      
      <!-- Brand icon -->
      <rect x="20" y="16" width="52" height="52" rx="16" fill="url(#cyanGrad)" />
      <path d="M46 28 L57 44 L35 44 Z" fill="#ffffff" />
      <circle cx="46" cy="56" r="3.5" fill="#ffffff" />
      
      <text x="88" y="48" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24" letter-spacing="1">A.I. FLUENCE</text>
      <text x="88" y="68" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="800" font-size="11" letter-spacing="2">EDITION 2026</text>

      <!-- Badges -->
      <g transform="translate(600, 20)">
        <rect width="150" height="44" rx="14" fill="#1e293b" stroke="#f97316" stroke-width="1.5" stroke-opacity="0.6" />
        <text x="18" y="29" font-size="20">🔥</text>
        <text x="48" y="28" fill="#fb923c" font-family="monospace" font-weight="900" font-size="15">14 DAYS</text>

        <rect x="165" y="0" width="160" height="44" rx="14" fill="url(#purpleGrad)" />
        <text x="182" y="29" font-size="18">🏆</text>
        <text x="212" y="28" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="13">CHAMPION</text>
      </g>
    </g>

    <!-- Hero Title & Mission Tagline (y=180 to 420) -->
    <g transform="translate(60, 180)">
      <rect width="250" height="38" rx="12" fill="#3b82f6" fill-opacity="0.18" stroke="#3b82f6" stroke-width="1.2" />
      <text x="125" y="25" fill="#60a5fa" font-family="system-ui, sans-serif" font-weight="900" font-size="13" letter-spacing="2" text-anchor="middle">NEXT-GEN LEARNING GAME</text>

      <text x="0" y="105" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" letter-spacing="-1">Learn. Play. Build.</text>
      <text x="0" y="165" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" letter-spacing="-1">Master AI &amp; Code.</text>

      <text x="0" y="215" fill="#94a3b8" font-family="system-ui, sans-serif" font-weight="500" font-size="22">Turn dry textbooks into an epic RPG coding quest with real-time AI.</text>
    </g>

    <!-- Central Interactive Game Console Canvas (y=440 to 1280) -->
    <g transform="translate(60, 440)">
      <!-- Console Container Frame -->
      <rect width="960" height="840" rx="32" fill="#090e1c" fill-opacity="0.95" stroke="url(#heroGrad)" stroke-width="2.5" />
      
      <!-- Console Header Bar -->
      <rect width="960" height="60" rx="32 32 0 0" fill="#0e1529" />
      <circle cx="36" cy="30" r="8" fill="#ef4444" />
      <circle cx="62" cy="30" r="8" fill="#f59e0b" />
      <circle cx="88" cy="30" r="8" fill="#10b981" />
      <text x="120" y="36" fill="#94a3b8" font-family="monospace" font-size="16">mission_control.py — A.I. Fluence Engine</text>
      <rect x="760" y="14" width="165" height="32" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="1" />
      <text x="842" y="35" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="12" text-anchor="middle">LIVE SESSION</text>

      <!-- Central Visual: Gamified Winding Map Inside Console -->
      <g transform="translate(40, 90)">
        <rect width="880" height="340" rx="20" fill="#060913" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        
        <!-- Winding Trail -->
        <path d="M 80 260 Q 240 140 440 210 T 780 110" fill="none" stroke="url(#cyanGrad)" stroke-width="8" stroke-dasharray="14 14" stroke-linecap="round" />
        
        <!-- Node 1: Completed -->
        <circle cx="80" cy="260" r="30" fill="#10b981" />
        <text x="80" y="268" fill="#fff" font-size="20" font-weight="bold" text-anchor="middle">✓</text>
        <text x="80" y="315" fill="#a7f3d0" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">Variables &amp; Loops</text>

        <!-- Node 2: Completed -->
        <circle cx="280" cy="170" r="30" fill="#3b82f6" />
        <text x="280" y="178" fill="#fff" font-size="20" font-weight="bold" text-anchor="middle">✓</text>
        <text x="280" y="225" fill="#93c5fd" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">Binary Trees</text>

        <!-- Node 3: Current / Active -->
        <circle cx="500" cy="200" r="38" fill="url(#purpleGrad)" />
        <circle cx="500" cy="200" r="50" fill="none" stroke="#ec4899" stroke-width="3" stroke-dasharray="6 6" />
        <text x="500" y="210" fill="#fff" font-size="26" font-weight="bold" text-anchor="middle">⚡</text>
        <text x="500" y="275" fill="#f472b6" font-family="sans-serif" font-weight="bold" font-size="15" text-anchor="middle">Transformers [Active]</text>

        <!-- Node 4: Boss Citadel -->
        <rect x="730" y="60" width="100" height="100" rx="22" fill="#1e1b4b" stroke="#facc15" stroke-width="3" />
        <text x="780" y="120" font-size="40" text-anchor="middle">👑</text>
        <text x="780" y="185" fill="#facc15" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">Boss Citadel</text>
      </g>

      <!-- Code Execution & Output Terminal (y=460) -->
      <g transform="translate(40, 460)">
        <rect width="880" height="230" rx="20" fill="#040711" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.3" />
        <rect x="0" y="0" width="880" height="42" rx="20 20 0 0" fill="#090f1f" />
        <text x="24" y="27" fill="#64748b" font-family="monospace" font-size="13">TERMINAL OUTPUT — GCC 14.2 / PYTHON 3.12</text>
        
        <g transform="translate(24, 70)" font-family="monospace" font-size="16">
          <text x="0" y="0" fill="#10b981">● All 15 Test Cases Passed! Execution: 12ms</text>
          <text x="0" y="32" fill="#e2e8f0">def attention(Q, K, V):</text>
          <text x="32" y="64" fill="#94a3b8">scores = matmul(Q, K.T) / sqrt(d_k)</text>
          <text x="32" y="96" fill="#60a5fa">return softmax(scores) @ V  # Perfect O(N^2)</text>
          <text x="0" y="130" fill="#facc15">★ +120 XP Earned! Streak Multiplier: 1.5x</text>
        </g>
      </g>

      <!-- AI Coach Pill Inside Console -->
      <g transform="translate(40, 720)">
        <rect width="880" height="88" rx="20" fill="#0f172a" stroke="#818cf8" stroke-width="1.5" />
        <rect x="20" y="18" width="52" height="52" rx="14" fill="url(#purpleGrad)" />
        <text x="46" y="53" font-size="26" text-anchor="middle">🤖</text>
        <text x="88" y="42" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="bold" font-size="16">Lumi AI Copilot:</text>
        <text x="88" y="64" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="15">"Spot-on implementation! Your attention matrix handles causal masking flawlessly."</text>
      </g>
    </g>

    <!-- 4 Track Highlights Pills (y=1310 to 1530) -->
    <g transform="translate(60, 1310)">
      <rect width="960" height="200" rx="28" fill="#0c1222" fill-opacity="0.9" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      
      <text x="40" y="44" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="900" font-size="13" letter-spacing="1.5">INDUSTRY-STANDARD TRACKS</text>
      
      <g transform="translate(40, 70)">
        <!-- Box 1 -->
        <rect width="200" height="95" rx="18" fill="#131b2e" stroke="#0284c7" stroke-width="1" />
        <text x="20" y="40" font-size="24">🤖</text>
        <text x="60" y="38" fill="#fff" font-family="sans-serif" font-weight="bold" font-size="16">Gen AI</text>
        <text x="20" y="72" fill="#94a3b8" font-family="sans-serif" font-size="13">LLMs &amp; Agents</text>

        <!-- Box 2 -->
        <rect x="220" y="0" width="200" height="95" rx="18" fill="#131b2e" stroke="#7c3aed" stroke-width="1" />
        <text x="240" y="40" font-size="24">⚡</text>
        <text x="280" y="38" fill="#fff" font-family="sans-serif" font-weight="bold" font-size="16">DSA</text>
        <text x="240" y="72" fill="#94a3b8" font-family="sans-serif" font-size="13">Algorithms &amp; Big-O</text>

        <!-- Box 3 -->
        <rect x="440" y="0" width="200" height="95" rx="18" fill="#131b2e" stroke="#059669" stroke-width="1" />
        <text x="460" y="40" font-size="24">🌐</text>
        <text x="500" y="38" fill="#fff" font-family="sans-serif" font-weight="bold" font-size="16">Web Dev</text>
        <text x="460" y="72" fill="#94a3b8" font-family="sans-serif" font-size="13">Full Stack Core</text>

        <!-- Box 4 -->
        <rect x="660" y="0" width="220" height="95" rx="18" fill="#131b2e" stroke="#ea580c" stroke-width="1" />
        <text x="680" y="40" font-size="24">🛡️</text>
        <text x="720" y="38" fill="#fff" font-family="sans-serif" font-weight="bold" font-size="16">Clans</text>
        <text x="680" y="72" fill="#94a3b8" font-family="sans-serif" font-size="13">Multiplayer Leagues</text>
      </g>
    </g>

    <!-- Bottom Feature Count & Badge (y=1540 to 1840) -->
    <g transform="translate(60, 1540)">
      <rect width="960" height="260" rx="32" fill="url(#heroGrad)" />
      
      <g transform="translate(40, 50)">
        <rect width="180" height="34" rx="10" fill="#ffffff" fill-opacity="0.2" />
        <text x="90" y="23" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="12" letter-spacing="1.5" text-anchor="middle">COMPLETE PLATFORM</text>
        
        <text x="0" y="95" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="44">15 Interactive Systems</text>
        <text x="0" y="140" fill="#e0e7ff" font-family="system-ui, sans-serif" font-weight="600" font-size="22">Scroll down to explore all 15 game features in full screen.</text>
        
        <rect x="0" y="165" width="280" height="50" rx="16" fill="#ffffff" />
        <text x="140" y="197" fill="#1e1b4b" font-family="system-ui, sans-serif" font-weight="900" font-size="16" letter-spacing="1" text-anchor="middle">START LEARNING FREE ➔</text>
      </g>
    </g>

</svg>"""

# ----------------------------------------------------
# 2. 15 FEATURE SVGS IN 9:16 RATIO (1080 x 1920)
# ----------------------------------------------------
FEATURES_9_16 = [
    {
        "id": "home",
        "num": 1,
        "title": "Home — Your Learning Journey",
        "badge": "MISSION CONTROL",
        "tagline": "A living, dynamic map of your coding adventure",
        "theme": ("#06b6d4", "#3b82f6"),
        "icon": "🗺️",
        "bullets": [
            "153+ gamified progression nodes with branching paths",
            "Real-time milestone checkpoints & world landmarks",
            "Seamless curriculum tracking from beginner to AI architect"
        ],
        "stat_label": "LEVELS COMPLETED",
        "stat_val": "42 / 153",
        "mockup_type": "map"
    },
    {
        "id": "quest",
        "num": 2,
        "title": "Quest — Turn Learning Into a Game",
        "badge": "DAILY MISSIONS",
        "tagline": "Turn daily study habits into rewarding RPG quests",
        "theme": ("#8b5cf6", "#ec4899"),
        "icon": "⚔️",
        "bullets": [
            "Daily & weekly coding quests tailored to your skill level",
            "Earn bonus XP, gems, and legendary loot chests",
            "Dynamic boss-fight coding drills at milestone gates"
        ],
        "stat_label": "ACTIVE QUESTS",
        "stat_val": "3 IN PROGRESS",
        "mockup_type": "quests"
    },
    {
        "id": "courses",
        "num": 3,
        "title": "Courses — Multiple Learning Paths",
        "badge": "CURRICULUM",
        "tagline": "Specialized industry tracks built for modern engineers",
        "theme": ("#3b82f6", "#6366f1"),
        "icon": "📚",
        "bullets": [
            "Generative AI & LLM Systems architecture",
            "Data Structures & Algorithms in Python & C++",
            "Full-Stack Web Foundations & AI for Everyone"
        ],
        "stat_label": "ACTIVE TRACKS",
        "stat_val": "4 SPECIALIZATIONS",
        "mockup_type": "courses"
    },
    {
        "id": "dsa",
        "num": 4,
        "title": "DSA & Coding — Problem-Solving Skills",
        "badge": "ALGORITHMIC PRECISION",
        "tagline": "Master LeetCode patterns with visual algorithmic aids",
        "theme": ("#10b981", "#06b6d4"),
        "icon": "⚡",
        "bullets": [
            "Curated problem sets spanning Dynamic Programming to Graphs",
            "Big-O Space & Time complexity radar analyzers",
            "Visual recursion call trees & pointer step-throughs"
        ],
        "stat_label": "PROBLEMS SOLVED",
        "stat_val": "89 PROBLEMS",
        "mockup_type": "dsa"
    },
    {
        "id": "practice",
        "num": 5,
        "title": "Practice — Learn by Doing",
        "badge": "LIVE RUNTIME",
        "tagline": "In-browser compiler with sub-second execution",
        "theme": ("#f59e0b", "#ef4444"),
        "icon": "💻",
        "bullets": [
            "Zero-configuration browser execution environment",
            "Instant test-suite feedback on every key stroke",
            "Preloaded test benches for Python, C++, JS, and SQL"
        ],
        "stat_label": "TEST CASES PASSED",
        "stat_val": "12 / 12 (100%)",
        "mockup_type": "practice"
    },
    {
        "id": "theory",
        "num": 6,
        "title": "Theory — Understand With Theory",
        "badge": "DEEP CONCEPTS",
        "tagline": "Visual architectural blueprints before writing code",
        "theme": ("#6366f1", "#a855f7"),
        "icon": "🧠",
        "bullets": [
            "Animated Transformer self-attention matrix diagrams",
            "Interactive neural embedding space projections",
            "Memory pointer allocation & cache optimization models"
        ],
        "stat_label": "MASTERY INDEX",
        "stat_val": "94.2% DEPTH",
        "mockup_type": "theory"
    },
    {
        "id": "progress",
        "num": 7,
        "title": "Progress & Rewards — Track Growth",
        "badge": "ANALYTICS & METRICS",
        "tagline": "Granular metrics tracking your engineering velocity",
        "theme": ("#06b6d4", "#10b981"),
        "icon": "📈",
        "bullets": [
            "30-day streak heatmaps & consistency multipliers",
            "Dimensional skill radars across Algorithms & Systems",
            "Daily XP velocity graphs and milestone countdowns"
        ],
        "stat_label": "CURRENT STREAK",
        "stat_val": "28 DAYS FIRE",
        "mockup_type": "progress"
    },
    {
        "id": "clans",
        "num": 8,
        "title": "Clans — Join. Compete. Grow.",
        "badge": "MULTIPLAYER SQUADS",
        "tagline": "Assemble a 50-developer engineering squad",
        "theme": ("#ec4899", "#8b5cf6"),
        "icon": "🛡️",
        "bullets": [
            "Form clans with friends or join top-tier global teams",
            "Compete in weekly Clan Wars on high-stakes challenges",
            "Share solutions, custom study rooms, and collective perks"
        ],
        "stat_label": "CLAN RANK",
        "stat_val": "#4 GLOBAL",
        "mockup_type": "clans"
    },
    {
        "id": "rewards",
        "num": 9,
        "title": "Rewards — Stay Consistent. Earn More.",
        "badge": "LOOT & CHESTS",
        "tagline": "Turn daily consistency into valuable game power-ups",
        "theme": ("#f59e0b", "#10b981"),
        "icon": "💎",
        "bullets": [
            "Claim mystery chests with rare gems and artifacts",
            "Equip Streak Freeze shields to protect your milestones",
            "Activate 2x XP boosts to rapidly ascend league divisions"
        ],
        "stat_label": "DIAMOND BALANCE",
        "stat_val": "1,450 GEMS",
        "mockup_type": "rewards"
    },
    {
        "id": "avatars",
        "num": 10,
        "title": "Avatars — Express Your Style",
        "badge": "CYBERNETIC PERSONAS",
        "tagline": "Unlock futuristic personas and modular cyber gear",
        "theme": ("#8b5cf6", "#06b6d4"),
        "icon": "👤",
        "bullets": [
            "Choose between Techno, Aiden, Lumi, and Cyber Knight",
            "Equip holographic headgear, neon auras, and shields",
            "Custom badge borders reflecting your coding tier"
        ],
        "stat_label": "ACTIVE PERSONA",
        "stat_val": "CYBER KNIGHT",
        "mockup_type": "avatars"
    },
    {
        "id": "challenges",
        "num": 11,
        "title": "Challenges — Take on New Challenges",
        "badge": "HIGH-STAKES BATTLES",
        "tagline": "Real-time algorithmic duels and sudden death sprints",
        "theme": ("#ef4444", "#f97316"),
        "icon": "🎯",
        "bullets": [
            "1v1 timed code showdowns against global peers",
            "Live split test-case runner with visual lead indicators",
            "Seasonal tournaments with exclusive champion titles"
        ],
        "stat_label": "WIN RATE",
        "stat_val": "78% (32 WINS)",
        "mockup_type": "challenges"
    },
    {
        "id": "league",
        "num": 12,
        "title": "League — Compete. Climb Higher.",
        "badge": "RANKED LADDER",
        "tagline": "Weekly promotion races across competitive tiers",
        "theme": ("#f59e0b", "#8b5cf6"),
        "icon": "🏆",
        "bullets": [
            "Promotion & demotion zones with weekly cutoff timers",
            "Climb through Gold, Crystal, Master, Champion and Legend",
            "Earn seasonal badge emblems and permanent credentials"
        ],
        "stat_label": "CURRENT DIVISION",
        "stat_val": "CHAMPION III",
        "mockup_type": "league"
    },
    {
        "id": "profile",
        "num": 13,
        "title": "Profile — Your Journey. Your Story.",
        "badge": "DEVELOPER PASSPORT",
        "tagline": "A verifiable portfolio of your engineering achievements",
        "theme": ("#06b6d4", "#a855f7"),
        "icon": "🎖️",
        "bullets": [
            "Verifiable proof of skill completion & certifications",
            "Curriculum mastery breakdown and verified problem logs",
            "Personalized learning commitments & graduation timeline"
        ],
        "stat_label": "VERIFIED BADGES",
        "stat_val": "12 EARNED",
        "mockup_type": "profile"
    },
    {
        "id": "ai_support",
        "num": 14,
        "title": "AI Support — Get Help Instantly",
        "badge": "AUTONOMOUS COPILOT",
        "tagline": "Instant, context-aware AI coaching available 24/7",
        "theme": ("#38bdf8", "#818cf8"),
        "icon": "🤖",
        "bullets": [
            "Real-time voice & text code debugging with Lumi AI",
            "Contextual step-by-step guidance without spoiling answers",
            "Adaptive explanations tailored to your current proficiency"
        ],
        "stat_label": "RESPONSE TIME",
        "stat_val": "< 200 MS",
        "mockup_type": "ai_support"
    },
    {
        "id": "institutions",
        "num": 15,
        "title": "For Institutions — A Modern Solution",
        "badge": "ENTERPRISE & CAMPUS",
        "tagline": "Scalable classroom management and learner telemetry",
        "theme": ("#059669", "#0284c7"),
        "icon": "🏛️",
        "bullets": [
            "Classroom cohort analytics and engagement telemetry",
            "Custom curriculum dispatch with automated grading pipelines",
            "Enterprise student safety and seamless LMS integration"
        ],
        "stat_label": "CAMPUS COHORTS",
        "stat_val": "24 ACTIVE GROUPS",
        "mockup_type": "institutions"
    }
]

def render_feature_svg_9_16(f):
    color1, color2 = f["theme"]
    title = html.escape(f["title"])
    tagline = html.escape(f["tagline"])
    badge = html.escape(f["badge"])
    icon = f["icon"]
    num = f["num"]
    stat_label = html.escape(f["stat_label"])
    stat_val = html.escape(f["stat_val"])

    bullets_xml = ""
    for i, b in enumerate(f["bullets"]):
        bullets_xml += f"""
        <g transform="translate(0, {i * 70})">
          <circle cx="20" cy="20" r="14" fill="{color1}" fill-opacity="0.2" />
          <circle cx="20" cy="20" r="6" fill="{color1}" />
          <text x="50" y="27" fill="#e2e8f0" font-family="system-ui, sans-serif" font-weight="600" font-size="20">{html.escape(b)}</text>
        </g>
        """

    # Mockup canvas inside 9:16 layout (880 wide by 720 high)
    mt = f["mockup_type"]
    if mt == "map":
        mockup = f"""
        <rect width="880" height="720" rx="28" fill="#090d1a" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        <path d="M 100 580 Q 240 400 440 480 T 700 240 T 800 160" fill="none" stroke="{color1}" stroke-width="8" stroke-dasharray="14 14" stroke-linecap="round" />
        <circle cx="100" cy="580" r="32" fill="{color1}" />
        <text x="100" y="588" fill="#fff" font-size="20" font-weight="bold" text-anchor="middle">✓</text>
        <text x="100" y="635" fill="#94a3b8" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">Foundations</text>
        
        <circle cx="360" cy="440" r="38" fill="{color2}" />
        <circle cx="360" cy="440" r="50" fill="none" stroke="{color2}" stroke-width="3" stroke-dasharray="6 6" />
        <text x="360" y="450" fill="#fff" font-size="24" font-weight="bold" text-anchor="middle">⚡</text>
        <text x="360" y="515" fill="#fff" font-size="18" font-family="sans-serif" font-weight="bold" text-anchor="middle">Transformers [Current]</text>
        
        <circle cx="620" cy="360" r="32" fill="#1e293b" stroke="{color1}" stroke-width="2" />
        <text x="620" y="368" fill="#cbd5e1" font-size="18" text-anchor="middle">🔒</text>
        <text x="620" y="415" fill="#94a3b8" font-size="16" font-family="sans-serif" text-anchor="middle">Attention Deep-Dive</text>

        <rect x="720" y="110" width="100" height="100" rx="20" fill="url(#heroGrad)" stroke="#facc15" stroke-width="3" />
        <text x="770" y="170" font-size="38" text-anchor="middle">👑</text>
        <text x="770" y="235" fill="#facc15" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">Boss Challenge</text>
        """
    elif mt in ["dsa", "practice"]:
        mockup = f"""
        <rect width="880" height="720" rx="28" fill="#090d1a" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        <rect x="0" y="0" width="880" height="56" rx="28 28 0 0" fill="#0c1322" />
        <circle cx="30" cy="28" r="7" fill="#ef4444" />
        <circle cx="52" cy="28" r="7" fill="#f59e0b" />
        <circle cx="74" cy="28" r="7" fill="#10b981" />
        <text x="110" y="34" fill="#94a3b8" font-family="monospace" font-size="15">solution_optimized.py — 0ms Latency</text>
        
        <g transform="translate(40, 95)" font-family="monospace" font-size="17">
          <text x="0" y="30" fill="{color2}">def</text><text x="45" y="30" fill="#60a5fa"> find_max_path_sum</text><text x="240" y="30" fill="#fff">(root: TreeNode) -&gt; int:</text>
          <text x="30" y="75" fill="#94a3b8"># Compute maximum path sum in O(N)</text>
          <text x="30" y="120" fill="#fff">max_sum = float('-inf')</text>
          <text x="30" y="165" fill="{color2}">def</text><text x="75" y="165" fill="#60a5fa"> dfs</text><text x="115" y="165" fill="#fff">(node):</text>
          <text x="60" y="210" fill="{color2}">if not</text><text x="140" y="210" fill="#fff"> node: </text><text x="215" y="210" fill="{color2}">return</text><text x="290" y="210" fill="#facc15"> 0</text>
          <text x="60" y="255" fill="#fff">left = max(0, dfs(node.left))</text>
          <text x="60" y="300" fill="#fff">right = max(0, dfs(node.right))</text>
          <text x="60" y="345" fill="#fff">max_sum = max(max_sum, left + right + node.val)</text>
          <text x="60" y="390" fill="{color2}">return</text><text x="135" y="390" fill="#fff"> node.val + max(left, right)</text>
        </g>
        <rect x="40" y="520" width="800" height="160" rx="16" fill="#04060c" stroke="{color1}" stroke-width="1.5" />
        <g transform="translate(60, 560)" font-family="monospace">
          <text x="0" y="0" fill="#10b981" font-size="18" font-weight="bold">✓ 15/15 Test Cases Passed! (Runtime: 4ms)</text>
          <text x="0" y="35" fill="#94a3b8" font-size="15">Memory Usage: 16.4 MB (Beats 98.2% of submissions)</text>
          <text x="0" y="70" fill="{color1}" font-size="15">Complexity: O(N) Time • O(H) Space [PASSED]</text>
        </g>
        """
    elif mt == "quests":
        mockup = f"""
        <rect width="880" height="720" rx="28" fill="#090d1a" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        <g transform="translate(40, 40)">
          <rect width="800" height="190" rx="20" fill="#111827" stroke="#3b82f6" stroke-width="1.5" />
          <text x="30" y="45" font-size="32">⚡</text>
          <text x="75" y="44" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="20">Daily Quest: Dynamic Matrix Multiplier</text>
          <text x="75" y="75" fill="#94a3b8" font-family="sans-serif" font-size="15">Implement sub-quadratic Strassen matrix multiplication in Python</text>
          <rect x="75" y="105" width="580" height="16" rx="8" fill="#1f2937" />
          <rect x="75" y="105" width="480" height="16" rx="8" fill="url(#heroGrad)" />
          <text x="675" y="119" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="14">82%</text>
          <text x="75" y="155" fill="#facc15" font-family="sans-serif" font-weight="bold" font-size="15">+250 XP • 💎 45 Gems • Rare Blueprint</text>
        </g>
        <g transform="translate(40, 260)">
          <rect width="800" height="190" rx="20" fill="#111827" stroke="#8b5cf6" stroke-width="1.5" />
          <text x="30" y="45" font-size="32">🛡️</text>
          <text x="75" y="44" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="20">Weekly Clan Siege: Graph Traversal Sprint</text>
          <text x="75" y="75" fill="#94a3b8" font-family="sans-serif" font-size="15">Solve 5 Hard Graph problems with your squad under 30 minutes</text>
          <rect x="75" y="105" width="580" height="16" rx="8" fill="#1f2937" />
          <rect x="75" y="105" width="290" height="16" rx="8" fill="url(#purpleGrad)" />
          <text x="675" y="119" fill="#ec4899" font-family="monospace" font-weight="bold" font-size="14">50%</text>
          <text x="75" y="155" fill="#facc15" font-family="sans-serif" font-weight="bold" font-size="15">+1,000 XP • 💎 120 Gems • Champion Badge</text>
        </g>
        <g transform="translate(40, 480)">
          <rect width="800" height="190" rx="20" fill="#111827" stroke="#f59e0b" stroke-width="1.5" />
          <text x="30" y="45" font-size="32">👑</text>
          <text x="75" y="44" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="20">Boss Challenge: The Transformer Citadel</text>
          <text x="75" y="75" fill="#94a3b8" font-family="sans-serif" font-size="15">Construct an attention head from scratch without external libraries</text>
          <rect x="75" y="105" width="580" height="16" rx="8" fill="#1f2937" />
          <rect x="75" y="105" width="120" height="16" rx="8" fill="url(#goldGrad)" />
          <text x="675" y="119" fill="#facc15" font-family="monospace" font-weight="bold" font-size="14">20%</text>
          <text x="75" y="155" fill="#facc15" font-family="sans-serif" font-weight="bold" font-size="15">+2,500 XP • 👑 Legendary Crown Persona</text>
        </g>
        """
    elif mt == "courses":
        mockup = f"""
        <rect width="880" height="720" rx="28" fill="#090d1a" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        <g transform="translate(40, 40)">
          <!-- Course Card 1 -->
          <rect width="380" height="300" rx="22" fill="#0f172a" stroke="#0284c7" stroke-width="2" />
          <rect x="25" y="25" width="60" height="60" rx="16" fill="#0369a1" />
          <text x="55" y="64" font-size="32" text-anchor="middle">🤖</text>
          <text x="100" y="55" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="18">Generative AI</text>
          <text x="100" y="78" fill="#38bdf8" font-family="sans-serif" font-size="13">LLMs &amp; Transformers</text>
          <text x="25" y="130" fill="#94a3b8" font-family="sans-serif" font-size="14">Build autonomous agents, fine-tuning pipelines, and RAG architectures.</text>
          <rect x="25" y="200" width="330" height="12" rx="6" fill="#1e293b" />
          <rect x="25" y="200" width="220" height="12" rx="6" fill="url(#cyanGrad)" />
          <text x="25" y="250" fill="#38bdf8" font-family="sans-serif" font-weight="bold" font-size="15">68% Completed • 32 Levels</text>
        </g>
        <g transform="translate(460, 40)">
          <!-- Course Card 2 -->
          <rect width="380" height="300" rx="22" fill="#0f172a" stroke="#7c3aed" stroke-width="2" />
          <rect x="25" y="25" width="60" height="60" rx="16" fill="#581c87" />
          <text x="55" y="64" font-size="32" text-anchor="middle">⚡</text>
          <text x="100" y="55" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="18">DSA Mastery</text>
          <text x="100" y="78" fill="#a855f7" font-family="sans-serif" font-size="13">Python &amp; C++ Track</text>
          <text x="25" y="130" fill="#94a3b8" font-family="sans-serif" font-size="14">Dynamic programming, graph algorithms, bit manipulation &amp; trees.</text>
          <rect x="25" y="200" width="330" height="12" rx="6" fill="#1e293b" />
          <rect x="25" y="200" width="160" height="12" rx="6" fill="url(#purpleGrad)" />
          <text x="25" y="250" fill="#c084fc" font-family="sans-serif" font-weight="bold" font-size="15">45% Completed • 48 Levels</text>
        </g>
        <g transform="translate(40, 370)">
          <!-- Course Card 3 -->
          <rect width="380" height="300" rx="22" fill="#0f172a" stroke="#059669" stroke-width="2" />
          <rect x="25" y="25" width="60" height="60" rx="16" fill="#065f46" />
          <text x="55" y="64" font-size="32" text-anchor="middle">🌐</text>
          <text x="100" y="55" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="18">Web Foundations</text>
          <text x="100" y="78" fill="#34d399" font-family="sans-serif" font-size="13">Full Stack Architecture</text>
          <text x="25" y="130" fill="#94a3b8" font-family="sans-serif" font-size="14">HTML, modern CSS layout engines, JavaScript state machines, and APIs.</text>
          <rect x="25" y="200" width="330" height="12" rx="6" fill="#1e293b" />
          <rect x="25" y="200" width="300" height="12" rx="6" fill="#10b981" />
          <text x="25" y="250" fill="#34d399" font-family="sans-serif" font-weight="bold" font-size="15">92% Completed • 24 Levels</text>
        </g>
        <g transform="translate(460, 370)">
          <!-- Course Card 4 -->
          <rect width="380" height="300" rx="22" fill="#0f172a" stroke="#ea580c" stroke-width="2" />
          <rect x="25" y="25" width="60" height="60" rx="16" fill="#7c2d12" />
          <text x="55" y="64" font-size="32" text-anchor="middle">💡</text>
          <text x="100" y="55" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="18">AI for Everyone</text>
          <text x="100" y="78" fill="#fb923c" font-family="sans-serif" font-size="13">Concepts &amp; Intuition</text>
          <text x="25" y="130" fill="#94a3b8" font-family="sans-serif" font-size="14">No math prerequisites: learn neural networks, embeddings, and prompting.</text>
          <rect x="25" y="200" width="330" height="12" rx="6" fill="#1e293b" />
          <rect x="25" y="200" width="100" height="12" rx="6" fill="#f97316" />
          <text x="25" y="250" fill="#fb923c" font-family="sans-serif" font-weight="bold" font-size="15">30% Completed • 16 Levels</text>
        </g>
        """
    else:
        # Default high-tech telemetry showcase
        mockup = f"""
        <rect width="880" height="720" rx="28" fill="#090d1a" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        <rect x="40" y="40" width="800" height="280" rx="22" fill="#0f172a" stroke="rgba(255,255,255,0.08)" />
        <text x="70" y="90" font-size="44">{icon}</text>
        <text x="140" y="85" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="24">{badge}</text>
        <text x="140" y="115" fill="{color1}" font-family="sans-serif" font-size="16">{tagline}</text>
        <line x1="70" y1="145" x2="780" y2="145" stroke="rgba(255,255,255,0.08)" />
        <text x="70" y="195" fill="#94a3b8" font-family="sans-serif" font-size="17">Real-time telemetry, gamified progress counters, and high-adrenaline coding.</text>
        <text x="70" y="240" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="16">STATUS: FULLY OPERATIONAL IN VERSION 2.0</text>
        
        <g transform="translate(40, 360)">
          <rect width="380" height="310" rx="22" fill="#0c1222" stroke="{color1}" stroke-width="1.5" />
          <text x="35" y="55" fill="#94a3b8" font-family="sans-serif" font-size="15">PRIMARY METRIC</text>
          <text x="35" y="115" fill="#ffffff" font-family="monospace" font-weight="bold" font-size="44">{stat_val}</text>
          <text x="35" y="160" fill="{color1}" font-family="sans-serif" font-size="15">{stat_label}</text>
          <rect x="35" y="200" width="310" height="60" rx="14" fill="{color1}" fill-opacity="0.15" />
          <text x="190" y="238" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">ACTIVE TELEMETRY</text>
        </g>
        
        <g transform="translate(460, 360)">
          <rect width="380" height="310" rx="22" fill="#0c1222" stroke="{color2}" stroke-width="1.5" />
          <text x="35" y="55" fill="#94a3b8" font-family="sans-serif" font-size="15">LEAGUE STANDING</text>
          <text x="35" y="115" fill="#ffffff" font-family="monospace" font-weight="bold" font-size="44">TOP 1.4%</text>
          <text x="35" y="160" fill="{color2}" font-family="sans-serif" font-size="15">GLOBAL LEADERBOARD</text>
          <rect x="35" y="200" width="310" height="60" rx="14" fill="{color2}" fill-opacity="0.15" />
          <text x="190" y="238" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">CHAMPION DIVISION</text>
        </g>
        """

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="100%" height="100%">
    {get_base_defs()}

    <!-- Background Canvas -->
    <rect width="1080" height="1920" fill="url(#bgGrad)" />
    <rect width="1080" height="1920" fill="url(#dotGrid)" />

    <!-- Ambient Glow Orbs -->
    <circle cx="200" cy="350" r="300" fill="{color1}" fill-opacity="0.22" filter="url(#glow)" />
    <circle cx="850" cy="1100" r="350" fill="{color2}" fill-opacity="0.18" filter="url(#glow)" />

    <!-- Isometric Grid Floor at bottom -->
    <g opacity="0.2" stroke="{color1}" stroke-width="1.2">
      <line x1="0" y1="1740" x2="1080" y2="1740" />
      <line x1="0" y1="1820" x2="1080" y2="1820" />
      <line x1="0" y1="1900" x2="1080" y2="1900" />
      <line x1="200" y1="1700" x2="0" y2="1920" />
      <line x1="540" y1="1700" x2="540" y2="1920" />
      <line x1="880" y1="1700" x2="1080" y2="1920" />
    </g>

    <!-- Top Status Bar (y=60) -->
    <g transform="translate(60, 60)">
      <rect width="960" height="84" rx="24" fill="#0c1224" fill-opacity="0.9" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
      
      <rect x="20" y="16" width="52" height="52" rx="16" fill="{color1}" />
      <text x="46" y="52" font-size="28" text-anchor="middle">{icon}</text>
      
      <text x="88" y="48" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24" letter-spacing="1">A.I. FLUENCE</text>
      <text x="88" y="68" fill="{color1}" font-family="system-ui, sans-serif" font-weight="800" font-size="12" letter-spacing="2">FEATURE {num} / 15</text>

      <g transform="translate(680, 20)">
        <rect width="240" height="44" rx="14" fill="{color1}" fill-opacity="0.2" stroke="{color1}" stroke-width="1.2" />
        <text x="120" y="28" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="12" letter-spacing="1.5" text-anchor="middle">{badge}</text>
      </g>
    </g>

    <!-- Headline & Narrative (y=180 to 420) -->
    <g transform="translate(60, 180)">
      <rect width="180" height="34" rx="10" fill="{color1}" fill-opacity="0.18" stroke="{color1}" stroke-width="1" />
      <text x="90" y="22" fill="{color1}" font-family="system-ui, sans-serif" font-weight="900" font-size="12" letter-spacing="1.5" text-anchor="middle">FEATURE #{num}</text>

      <text x="0" y="100" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" letter-spacing="-1">{title.split('—')[0].strip()}</text>
      <text x="0" y="155" fill="{color1}" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="34" letter-spacing="-0.5">{title.split('—')[1].strip() if '—' in title else ''}</text>

      <text x="0" y="205" fill="#94a3b8" font-family="system-ui, sans-serif" font-weight="500" font-size="22">{tagline}</text>
    </g>

    <!-- Main Central HD Mockup Canvas (y=430 to 1180) -->
    <g transform="translate(100, 430)">
      {mockup}
    </g>

    <!-- Feature Capabilities Bullet List (y=1200 to 1480) -->
    <g transform="translate(100, 1200)">
      <rect width="880" height="260" rx="28" fill="#0c1222" fill-opacity="0.9" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      <g transform="translate(40, 40)">
        {bullets_xml}
      </g>
    </g>

    <!-- Bottom Metric Banner & Call to Action (y=1500 to 1830) -->
    <g transform="translate(100, 1500)">
      <rect width="880" height="290" rx="32" fill="url(#heroGrad)" />
      
      <g transform="translate(50, 45)">
        <text x="0" y="30" fill="#e0e7ff" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" letter-spacing="2">{stat_label}</text>
        <text x="0" y="90" fill="#ffffff" font-family="monospace" font-weight="900" font-size="52">{stat_val}</text>
        <text x="0" y="135" fill="#e0e7ff" font-family="system-ui, sans-serif" font-size="20">Fully synchronized in real time with cloud persistence.</text>

        <!-- CTA pill -->
        <rect x="0" y="170" width="300" height="54" rx="18" fill="#ffffff" />
        <text x="150" y="204" fill="#1e1b4b" font-family="system-ui, sans-serif" font-weight="900" font-size="16" letter-spacing="1" text-anchor="middle">LAUNCH THIS FEATURE ➔</text>
      </g>
    </g>

</svg>"""
    return svg

def main():
    print("Generating 9:16 SVGs (viewBox 0 0 1080 1920)...")
    
    # 1. Hero 9:16
    hero = build_hero_svg_9_16()
    create_svg("public/hero.svg", hero)

    # 2. 15 Features 9:16
    for f in FEATURES_9_16:
        content = render_feature_svg_9_16(f)
        create_svg(f"public/features/{f['id']}.svg", content)
        create_svg(f"public/feature_{f['id']}.svg", content)

    print("SUCCESS: Generated 16 SVGs in 9:16 Aspect Ratio (1080x1920)!")

if __name__ == "__main__":
    main()
