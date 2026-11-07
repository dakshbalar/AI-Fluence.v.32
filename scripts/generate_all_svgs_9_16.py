import os
import html

def create_svg(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created: {path}")

def get_defs_9_16(theme_color1="#3b82f6", theme_color2="#8b5cf6"):
    return f"""
    <defs>
      <!-- Background Gradients -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#070913" />
        <stop offset="40%" stop-color="#0c1322" />
        <stop offset="80%" stop-color="#080c18" />
        <stop offset="100%" stop-color="#04060c" />
      </linearGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#111827" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#0b1120" stop-opacity="0.95" />
      </linearGradient>

      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="{theme_color1}" />
        <stop offset="100%" stop-color="{theme_color2}" />
      </linearGradient>

      <linearGradient id="cyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>

      <linearGradient id="purplePink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8b5cf6" />
        <stop offset="100%" stop-color="#ec4899" />
      </linearGradient>

      <linearGradient id="goldOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#ef4444" />
      </linearGradient>

      <linearGradient id="emeraldTeal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>

      <!-- Grid Pattern -->
      <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
      </pattern>

      <!-- Glow Filters -->
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="16" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    """

def get_phone_frame_header(title="A.I. FLUENCE", subtitle="GAMIFIED TECH ACADEMY", active_tab="home"):
    return f"""
    <!-- Device Notch & Status Bar (9:16 mobile mockup) -->
    <rect width="1080" height="1920" fill="url(#bgGrad)" />
    <rect width="1080" height="1920" fill="url(#gridPattern)" />

    <!-- Ambient Glow Orbs -->
    <circle cx="200" cy="300" r="300" fill="#3b82f6" fill-opacity="0.12" filter="url(#glow)" />
    <circle cx="900" cy="800" r="350" fill="#8b5cf6" fill-opacity="0.12" filter="url(#glow)" />
    <circle cx="540" cy="1400" r="400" fill="#06b6d4" fill-opacity="0.08" filter="url(#glow)" />

    <!-- Status Bar -->
    <g transform="translate(60, 36)">
      <text x="0" y="24" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="28">9:41</text>
      <!-- Dynamic Island Capsule -->
      <rect x="360" y="0" width="240" height="48" rx="24" fill="#000000" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
      <circle cx="390" cy="24" r="7" fill="#10b981" />
      <circle cx="560" cy="24" r="8" fill="#1e293b" />
      <!-- Status Icons -->
      <g transform="translate(860, 4)">
        <path d="M0 18 L6 12 L12 18 Z M6 12 L12 6 L18 12 Z M12 6 L18 0 L24 6 Z" fill="#ffffff" />
        <text x="35" y="20" fill="#ffffff" font-size="22">5G</text>
        <rect x="75" y="4" width="34" height="18" rx="4" fill="none" stroke="#ffffff" stroke-width="2.5" />
        <rect x="78" y="7" width="22" height="12" rx="2" fill="#10b981" />
        <rect x="110" y="9" width="3" height="8" rx="1" fill="#ffffff" />
      </g>
    </g>

    <!-- Top App Navigation & Player Stats Bar -->
    <g transform="translate(50, 110)">
      <rect width="980" height="96" rx="28" fill="#0b1220" fill-opacity="0.9" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
      
      <!-- Brand Avatar -->
      <rect x="20" y="16" width="64" height="64" rx="20" fill="url(#cyanBlue)" />
      <text x="52" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="30" text-anchor="middle">⚡</text>
      
      <!-- Title & Live Status -->
      <text x="102" y="48" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="26" letter-spacing="0.5">{title}</text>
      <text x="104" y="72" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="15" letter-spacing="1">{subtitle}</text>

      <!-- Live Player Badges -->
      <g transform="translate(540, 24)">
        <!-- Streak -->
        <rect x="0" y="0" width="130" height="48" rx="16" fill="#1e293b" stroke="#f97316" stroke-width="1.5" />
        <text x="16" y="32" font-size="22">🔥</text>
        <text x="48" y="32" fill="#fb923c" font-family="monospace" font-weight="900" font-size="18">14 D</text>

        <!-- Gems -->
        <rect x="145" y="0" width="130" height="48" rx="16" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5" />
        <text x="160" y="32" font-size="20">💎</text>
        <text x="195" y="32" fill="#38bdf8" font-family="monospace" font-weight="900" font-size="18">820</text>

        <!-- Level XP -->
        <rect x="290" y="0" width="135" height="48" rx="16" fill="url(#purplePink)" />
        <text x="306" y="32" font-size="20">⚡</text>
        <text x="340" y="32" fill="#ffffff" font-family="monospace" font-weight="900" font-size="17">LVL 8</text>
      </g>
    </g>
    """

def get_bottom_nav(active_tab="home"):
    tabs = [
      ("home", "Home", "🗺️"),
      ("quest", "Quests", "⚔️"),
      ("courses", "Courses", "📚"),
      ("dsa", "Practice", "💻"),
      ("profile", "Profile", "👤")
    ]
    xml = """
    <!-- Bottom Floating Navigation Bar (9:16 screen) -->
    <g transform="translate(50, 1750)">
      <rect width="980" height="110" rx="36" fill="#0b111e" fill-opacity="0.95" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    """
    for i, (tab_id, label, icon) in enumerate(tabs):
        x = 50 + i * 180
        is_active = (tab_id == active_tab)
        if is_active:
            xml += f"""
            <g transform="translate({x}, 15)">
              <rect width="140" height="80" rx="24" fill="url(#cyanBlue)" />
              <text x="70" y="44" font-size="30" text-anchor="middle">{icon}</text>
              <text x="70" y="70" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="15" text-anchor="middle">{label}</text>
            </g>
            """
        else:
            xml += f"""
            <g transform="translate({x}, 20)">
              <text x="70" y="42" font-size="28" text-anchor="middle">{icon}</text>
              <text x="70" y="68" fill="#64748b" font-family="system-ui, sans-serif" font-weight="700" font-size="14" text-anchor="middle">{label}</text>
            </g>
            """
    xml += """
    </g>
    <!-- Home Indicator Bar -->
    <rect x="390" y="1885" width="300" height="8" rx="4" fill="#ffffff" fill-opacity="0.4" />
    """
    return xml

def build_hero_svg_9_16():
    defs = get_defs_9_16("#06b6d4", "#3b82f6")
    header = get_phone_frame_header("A.I. FLUENCE", "AUTONOMOUS LEARNING OS", "home")
    bottom = get_bottom_nav("home")

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="100%" height="100%">
    {defs}
    {header}

    <!-- Hero Screen Mission Overview Banner -->
    <g transform="translate(50, 230)">
      <rect width="980" height="240" rx="32" fill="url(#cardGrad)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="2" />
      <g transform="translate(40, 40)">
        <rect width="180" height="38" rx="12" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="1.2" />
        <text x="90" y="24" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="900" font-size="15" text-anchor="middle" letter-spacing="1">CURRENT MISSION</text>
        <text x="0" y="86" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="34">Neural Attention Engine</text>
        <text x="0" y="122" fill="#94a3b8" font-family="system-ui, sans-serif" font-weight="600" font-size="19">Stage 4/7: Multi-Head Projection &amp; Softmax</text>
        
        <!-- Progress Bar -->
        <rect x="0" y="145" width="650" height="20" rx="10" fill="#1e293b" />
        <rect x="0" y="145" width="455" height="20" rx="10" fill="url(#cyanBlue)" />
        <text x="680" y="162" fill="#38bdf8" font-family="monospace" font-weight="900" font-size="19">70%</text>
      </g>

      <!-- Action Button inside Banner -->
      <g transform="translate(740, 50)">
        <rect width="200" height="140" rx="24" fill="url(#cyanBlue)" filter="url(#subtleGlow)" />
        <text x="100" y="65" font-size="44" text-anchor="middle">🚀</text>
        <text x="100" y="110" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="18" text-anchor="middle">RESUME</text>
      </g>
    </g>

    <!-- Gamified Roadmap Visual Canvas (Center Screen) -->
    <g transform="translate(50, 495)">
      <rect width="980" height="880" rx="36" fill="#080e1b" fill-opacity="0.95" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
      
      <!-- World Map Section Title -->
      <g transform="translate(40, 40)">
        <text x="0" y="24" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="900" font-size="16" letter-spacing="2">WORLD 2 • SECTOR: TRANSFORMERS</text>
        <text x="0" y="62" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="28">Branching Skill Pathway</text>
      </g>

      <!-- Map Path Winding Curve -->
      <path d="M 220 740 C 220 540, 800 680, 800 480 C 800 300, 300 360, 490 180" 
            fill="none" stroke="#0284c7" stroke-width="14" stroke-linecap="round" stroke-dasharray="18 18" opacity="0.6" />

      <!-- Level Node 1: Completed -->
      <g transform="translate(220, 740)">
        <circle cx="0" cy="0" r="54" fill="#059669" filter="url(#subtleGlow)" />
        <circle cx="0" cy="0" r="42" fill="#10b981" />
        <text x="0" y="14" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="38" text-anchor="middle">✓</text>
        <rect x="-90" y="68" width="180" height="34" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1" />
        <text x="0" y="90" fill="#a7f3d0" font-family="system-ui, sans-serif" font-weight="800" font-size="14" text-anchor="middle">1. Foundations</text>
      </g>

      <!-- Level Node 2: Completed -->
      <g transform="translate(520, 610)">
        <circle cx="0" cy="0" r="50" fill="#059669" />
        <circle cx="0" cy="0" r="38" fill="#10b981" />
        <text x="0" y="12" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="34" text-anchor="middle">✓</text>
        <rect x="-90" y="62" width="180" height="34" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1" />
        <text x="0" y="84" fill="#a7f3d0" font-family="system-ui, sans-serif" font-weight="800" font-size="14" text-anchor="middle">2. Embeddings</text>
      </g>

      <!-- Level Node 3: Active Pulsing Node -->
      <g transform="translate(800, 480)">
        <circle cx="0" cy="0" r="75" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="10 8" opacity="0.8" />
        <circle cx="0" cy="0" r="60" fill="url(#cyanBlue)" filter="url(#glow)" />
        <circle cx="0" cy="0" r="48" fill="#0284c7" />
        <text x="0" y="16" font-size="44" text-anchor="middle">⚡</text>
        <!-- Floating Active Tooltip -->
        <g transform="translate(-130, -95)">
          <rect width="260" height="52" rx="16" fill="#0369a1" stroke="#38bdf8" stroke-width="2" />
          <text x="130" y="32" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">ACTIVE QUEST (LVL 3)</text>
        </g>
        <rect x="-100" y="72" width="200" height="36" rx="10" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5" />
        <text x="0" y="96" fill="#e0f2fe" font-family="system-ui, sans-serif" font-weight="900" font-size="15" text-anchor="middle">Self-Attention</text>
      </g>

      <!-- Level Node 4: Locked -->
      <g transform="translate(360, 320)">
        <circle cx="0" cy="0" r="50" fill="#1e293b" stroke="#475569" stroke-width="2" />
        <text x="0" y="12" font-size="30" text-anchor="middle">🔒</text>
        <rect x="-90" y="62" width="180" height="34" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1" />
        <text x="0" y="84" fill="#64748b" font-family="system-ui, sans-serif" font-weight="800" font-size="14" text-anchor="middle">4. Encoders</text>
      </g>

      <!-- Level Node 5: Master Boss Gate -->
      <g transform="translate(490, 160)">
        <rect x="-60" y="-60" width="120" height="120" rx="32" fill="url(#goldOrange)" filter="url(#glow)" stroke="#fef08a" stroke-width="3" />
        <text x="0" y="18" font-size="56" text-anchor="middle">👑</text>
        <rect x="-110" y="74" width="220" height="38" rx="12" fill="#451a03" stroke="#f59e0b" stroke-width="1.5" />
        <text x="0" y="99" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="15" text-anchor="middle">BOSS: Agent Architect</text>
      </g>
    </g>

    <!-- Lower Interactive Clan & AI Copilot Cards (Grid 2-col) -->
    <g transform="translate(50, 1400)">
      <!-- Left Card: Clan Battle Progress -->
      <rect width="475" height="320" rx="30" fill="url(#cardGrad)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.5" />
      <g transform="translate(30, 30)">
        <rect width="52" height="52" rx="16" fill="url(#goldOrange)" />
        <text x="26" y="38" font-size="28" text-anchor="middle">⚔️</text>
        <text x="68" y="28" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="20">CLAN RAID</text>
        <text x="68" y="50" fill="#f59e0b" font-family="system-ui, sans-serif" font-weight="700" font-size="14">LARGEGAMER • #3</text>

        <text x="0" y="105" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Boss Health: 42,500 / 100K</text>
        <rect x="0" y="125" width="415" height="16" rx="8" fill="#1e293b" />
        <rect x="0" y="125" width="240" height="16" rx="8" fill="url(#goldOrange)" />
        
        <rect x="0" y="170" width="415" height="90" rx="20" fill="#1e293b" stroke="rgba(255,255,255,0.06)" />
        <text x="20" y="210" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="15">Clan Reward Pool:</text>
        <text x="20" y="240" fill="#facc15" font-family="monospace" font-weight="900" font-size="22">+1,500 🏆 XP &amp; Gold Chest</text>
      </g>

      <!-- Right Card: Lumi AI Live Coach -->
      <g transform="translate(505, 0)">
        <rect width="475" height="320" rx="30" fill="url(#cardGrad)" stroke="rgba(168, 85, 247, 0.4)" stroke-width="1.5" />
        <g transform="translate(30, 30)">
          <rect width="52" height="52" rx="16" fill="url(#purplePink)" />
          <text x="26" y="38" font-size="28" text-anchor="middle">🤖</text>
          <text x="68" y="28" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="20">LUMI COACH</text>
          <text x="68" y="50" fill="#c084fc" font-family="system-ui, sans-serif" font-weight="700" font-size="14">Voice &amp; Code Copilot</text>

          <rect x="0" y="85" width="415" height="175" rx="20" fill="#0b0f19" stroke="rgba(255,255,255,0.06)" />
          <text x="20" y="120" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="bold" font-size="15">💡 Tip from Lumi:</text>
          <text x="20" y="150" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="15">"Divide by sqrt(d_k) before softmax</text>
          <text x="20" y="176" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="15">to avoid vanishing gradients!"</text>
          <text x="20" y="235" fill="#4ade80" font-family="monospace" font-weight="bold" font-size="14">● Copilot Listening...</text>
        </g>
      </g>
    </g>

    {bottom}
</svg>"""

FEATURES_DATA = [
    {
        "id": "home",
        "title": "Home",
        "subtitle": "YOUR LEARNING JOURNEY",
        "headline": "Mission Control & Adventure Map",
        "color1": "#06b6d4",
        "color2": "#3b82f6",
        "active_tab": "home",
        "icon": "🗺️",
        "mockup": "map"
    },
    {
        "id": "quest",
        "title": "Quest",
        "subtitle": "TURN LEARNING INTO A GAME",
        "headline": "Daily Quests & Milestone Gates",
        "color1": "#8b5cf6",
        "color2": "#ec4899",
        "active_tab": "quest",
        "icon": "⚔️",
        "mockup": "quests"
    },
    {
        "id": "courses",
        "title": "Courses",
        "subtitle": "MULTIPLE LEARNING PATHS",
        "headline": "Diverse Industry Engineering Tracks",
        "color1": "#3b82f6",
        "color2": "#6366f1",
        "active_tab": "courses",
        "icon": "📚",
        "mockup": "courses"
    },
    {
        "id": "dsa",
        "title": "DSA & Coding",
        "subtitle": "BUILD PROBLEM-SOLVING SKILLS",
        "headline": "Interactive Algorithm Solver & Big-O",
        "color1": "#10b981",
        "color2": "#06b6d4",
        "active_tab": "dsa",
        "icon": "⚡",
        "mockup": "dsa"
    },
    {
        "id": "practice",
        "title": "Practice",
        "subtitle": "LEARN BY DOING",
        "headline": "Sub-Second In-Browser Code Compiler",
        "color1": "#6366f1",
        "color2": "#a855f7",
        "active_tab": "dsa",
        "icon": "💻",
        "mockup": "practice"
    },
    {
        "id": "theory",
        "title": "Theory",
        "subtitle": "UNDERSTAND WITH THEORY",
        "headline": "Interactive Visual Neural Models",
        "color1": "#ec4899",
        "color2": "#f43f5e",
        "active_tab": "courses",
        "icon": "🧠",
        "mockup": "theory"
    },
    {
        "id": "progress",
        "title": "Progress & Rewards",
        "subtitle": "TRACK PROGRESS & EARN REWARDS",
        "headline": "Streak Velocity & Multidimensional Radars",
        "color1": "#f59e0b",
        "color2": "#10b981",
        "active_tab": "profile",
        "icon": "📈",
        "mockup": "progress"
    },
    {
        "id": "clans",
        "title": "Clans",
        "subtitle": "JOIN. COMPETE. GROW.",
        "headline": "50-Member Collaborative Clan Wars",
        "color1": "#f97316",
        "color2": "#eab308",
        "active_tab": "quest",
        "icon": "🛡️",
        "mockup": "clans"
    },
    {
        "id": "rewards",
        "title": "Rewards",
        "subtitle": "STAY CONSISTENT. EARN MORE.",
        "headline": "Mystery Loot Chests & Power-Ups",
        "color1": "#eab308",
        "color2": "#3b82f6",
        "active_tab": "home",
        "icon": "💎",
        "mockup": "rewards"
    },
    {
        "id": "avatars",
        "title": "Avatars",
        "subtitle": "EXPRESS YOUR STYLE",
        "headline": "Cyber Personas & Custom Gear",
        "color1": "#a855f7",
        "color2": "#06b6d4",
        "active_tab": "profile",
        "icon": "👤",
        "mockup": "avatars"
    },
    {
        "id": "challenges",
        "title": "Challenges",
        "subtitle": "TAKE ON NEW CHALLENGES",
        "headline": "Timed 1v1 Algorithmic Sprints",
        "color1": "#ef4444",
        "color2": "#f59e0b",
        "active_tab": "quest",
        "icon": "🎯",
        "mockup": "challenges"
    },
    {
        "id": "league",
        "title": "League",
        "subtitle": "COMPETE. CLIMB HIGHER.",
        "headline": "Ranked Tiers: Bronze to Legend",
        "color1": "#3b82f6",
        "color2": "#8b5cf6",
        "active_tab": "quest",
        "icon": "🏆",
        "mockup": "league"
    },
    {
        "id": "profile",
        "title": "Profile",
        "subtitle": "YOUR JOURNEY. YOUR STORY.",
        "headline": "Verifiable Developer Credentials",
        "color1": "#06b6d4",
        "color2": "#a855f7",
        "active_tab": "profile",
        "icon": "🎖️",
        "mockup": "profile"
    },
    {
        "id": "ai_support",
        "title": "AI Support",
        "subtitle": "GET HELP INSTANTLY",
        "headline": "24/7 Contextual Voice & Speech AI",
        "color1": "#38bdf8",
        "color2": "#818cf8",
        "active_tab": "dsa",
        "icon": "🤖",
        "mockup": "ai_support"
    },
    {
        "id": "institutions",
        "title": "For Institutions",
        "subtitle": "A MODERN LEARNING SOLUTION",
        "headline": "Campus Telemetry & Automated Grading",
        "color1": "#059669",
        "color2": "#0284c7",
        "active_tab": "courses",
        "icon": "🏛️",
        "mockup": "institutions"
    }
]

def render_feature_mockup_body(m_type, color1, color2, title, subtitle):
    if m_type == "map":
        return f"""
        <!-- Gamified Roadmap Visual Canvas -->
        <rect width="980" height="1060" rx="36" fill="#080e1b" fill-opacity="0.95" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
        <path d="M 220 900 C 220 700, 800 800, 800 580 C 800 360, 300 440, 490 220" 
              fill="none" stroke="{color1}" stroke-width="14" stroke-linecap="round" stroke-dasharray="18 18" opacity="0.7" />

        <!-- Node 1 -->
        <g transform="translate(220, 900)">
          <circle cx="0" cy="0" r="54" fill="#059669" filter="url(#subtleGlow)" />
          <text x="0" y="14" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="38" text-anchor="middle">✓</text>
          <rect x="-90" y="68" width="180" height="34" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="1" />
          <text x="0" y="90" fill="#a7f3d0" font-family="system-ui, sans-serif" font-weight="800" font-size="14" text-anchor="middle">Foundations</text>
        </g>

        <!-- Node 2 -->
        <g transform="translate(800, 580)">
          <circle cx="0" cy="0" r="75" fill="none" stroke="{color1}" stroke-width="4" stroke-dasharray="10 8" opacity="0.8" />
          <circle cx="0" cy="0" r="60" fill="url(#accentGrad)" filter="url(#glow)" />
          <text x="0" y="16" font-size="44" text-anchor="middle">⚡</text>
          <rect x="-100" y="74" width="200" height="36" rx="10" fill="#0c4a6e" stroke="{color1}" stroke-width="1.5" />
          <text x="0" y="98" fill="#e0f2fe" font-family="system-ui, sans-serif" font-weight="900" font-size="15" text-anchor="middle">Active Level</text>
        </g>

        <!-- Node 3 (Boss) -->
        <g transform="translate(490, 220)">
          <rect x="-60" y="-60" width="120" height="120" rx="32" fill="url(#goldOrange)" filter="url(#glow)" stroke="#fef08a" stroke-width="3" />
          <text x="0" y="18" font-size="56" text-anchor="middle">👑</text>
          <rect x="-100" y="74" width="200" height="36" rx="12" fill="#451a03" stroke="#f59e0b" stroke-width="1.5" />
          <text x="0" y="99" fill="#fef08a" font-family="system-ui, sans-serif" font-weight="900" font-size="15" text-anchor="middle">Grand Champion</text>
        </g>
        """
    elif m_type in ["dsa", "practice"]:
        return f"""
        <!-- Code IDE & Terminal Frame -->
        <rect width="980" height="1060" rx="36" fill="#080e1a" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        <rect width="980" height="70" rx="36 36 0 0" fill="#0d1526" />
        <circle cx="45" cy="35" r="9" fill="#ef4444" />
        <circle cx="75" cy="35" r="9" fill="#f59e0b" />
        <circle cx="105" cy="35" r="9" fill="#10b981" />
        <text x="160" y="42" fill="#94a3b8" font-family="monospace" font-size="19">solution_optimized.py • GCC 11 &amp; Py3</text>

        <!-- Code Snippet -->
        <g transform="translate(45, 120)" font-family="monospace" font-size="22">
          <text x="0" y="30" fill="{color2}">class</text><text x="75" y="30" fill="#60a5fa"> Solution</text><text x="195" y="30" fill="#ffffff">:</text>
          <text x="40" y="75" fill="{color2}">def</text><text x="90" y="75" fill="#facc15"> findMaxProfit</text><text x="270" y="75" fill="#ffffff">(self, prices):</text>
          <text x="80" y="120" fill="#94a3b8"># O(N) single pass Dynamic Programming</text>
          <text x="80" y="165" fill="#ffffff">min_price = float('inf')</text>
          <text x="80" y="210" fill="#ffffff">max_profit = 0</text>
          <text x="80" y="255" fill="{color2}">for</text><text x="135" y="255" fill="#ffffff"> p </text><text x="175" y="255" fill="{color2}">in</text><text x="215" y="255" fill="#ffffff"> prices:</text>
          <text x="120" y="300" fill="#ffffff">min_price = min(min_price, p)</text>
          <text x="120" y="345" fill="#ffffff">max_profit = max(max_profit, p - min_price)</text>
          <text x="80" y="390" fill="{color2}">return</text><text x="170" y="390" fill="#4ade80"> max_profit</text>
        </g>

        <!-- Test Results Terminal Output -->
        <g transform="translate(45, 590)">
          <rect width="890" height="420" rx="24" fill="#04060c" stroke="rgba(74, 222, 128, 0.4)" stroke-width="2" />
          <rect x="30" y="25" width="220" height="40" rx="12" fill="rgba(74, 222, 128, 0.15)" />
          <text x="45" y="52" fill="#4ade80" font-family="monospace" font-weight="900" font-size="17">✔ ALL TESTS PASSED (12/12)</text>
          
          <text x="30" y="115" fill="#e2e8f0" font-family="monospace" font-size="19">Runtime: 24 ms • Beats 99.1% of global submissions</text>
          <text x="30" y="155" fill="#facc15" font-family="monospace" font-size="19">Space Complexity: O(1) Auxiliary Memory</text>
          <text x="30" y="195" fill="#38bdf8" font-family="monospace" font-size="19">Time Complexity: O(N) Linear Time</text>

          <line x1="30" y1="230" x2="860" y2="230" stroke="rgba(255,255,255,0.08)" />
          
          <text x="30" y="275" fill="#a7f3d0" font-family="monospace" font-size="18">✔ Case 1: [7,1,5,3,6,4] -&gt; Output: 5</text>
          <text x="30" y="315" fill="#a7f3d0" font-family="monospace" font-size="18">✔ Case 2: [7,6,4,3,1] -&gt; Output: 0</text>
          <text x="30" y="355" fill="#a7f3d0" font-family="monospace" font-size="18">✔ Case 3: [1,2,3,4,5] -&gt; Output: 4</text>
          <text x="30" y="395" fill="#facc15" font-family="monospace" font-weight="bold" font-size="18">⚡ +150 XP AWARDED &amp; LEVEL COMPLETED!</text>
        </g>
        """
    elif m_type == "quests":
        return f"""
        <!-- Daily & Weekly Quests Board -->
        <rect width="980" height="1060" rx="36" fill="#080e1b" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        
        <!-- Quest Item 1 -->
        <g transform="translate(45, 50)">
          <rect width="890" height="220" rx="28" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
          <circle cx="65" cy="65" r="36" fill="#065f46" />
          <text x="65" y="78" font-size="34" text-anchor="middle">⚡</text>
          <text x="130" y="55" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">Solve 3 Algorithm Drills</text>
          <text x="130" y="85" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="17">Complete 3 recursion or dynamic programming problems</text>
          <rect x="130" y="115" width="550" height="18" rx="9" fill="#1e293b" />
          <rect x="130" y="115" width="550" height="18" rx="9" fill="#10b981" />
          <text x="700" y="131" fill="#4ade80" font-family="monospace" font-weight="900" font-size="17">3/3 DONE</text>
          <rect x="130" y="150" width="160" height="42" rx="14" fill="#059669" />
          <text x="210" y="177" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">CLAIM +80 💎</text>
        </g>

        <!-- Quest Item 2 -->
        <g transform="translate(45, 300)">
          <rect width="890" height="220" rx="28" fill="#0f172a" stroke="{color1}" stroke-width="1.5" />
          <circle cx="65" cy="65" r="36" fill="#1e293b" />
          <text x="65" y="78" font-size="34" text-anchor="middle">🔥</text>
          <text x="130" y="55" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">Keep Streak Burning</text>
          <text x="130" y="85" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="17">Log in and spend at least 15 minutes coding today</text>
          <rect x="130" y="115" width="550" height="18" rx="9" fill="#1e293b" />
          <rect x="130" y="115" width="400" height="18" rx="9" fill="url(#accentGrad)" />
          <text x="700" y="131" fill="{color1}" font-family="monospace" font-weight="900" font-size="17">12/15 MIN</text>
          <rect x="130" y="150" width="160" height="42" rx="14" fill="#1e293b" stroke="{color1}" stroke-width="1" />
          <text x="210" y="177" fill="{color1}" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">IN PROGRESS</text>
        </g>

        <!-- Quest Item 3 (Boss Raid) -->
        <g transform="translate(45, 550)">
          <rect width="890" height="240" rx="28" fill="#1a102b" stroke="url(#purplePink)" stroke-width="2" />
          <circle cx="65" cy="65" r="36" fill="url(#purplePink)" />
          <text x="65" y="78" font-size="34" text-anchor="middle">👑</text>
          <text x="130" y="55" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">Weekly Clan Boss Raid</text>
          <text x="130" y="85" fill="#c084fc" font-family="system-ui, sans-serif" font-size="17">Join clan members to conquer the Neural Dragon</text>
          <rect x="130" y="115" width="550" height="18" rx="9" fill="#1e293b" />
          <rect x="130" y="115" width="320" height="18" rx="9" fill="url(#purplePink)" />
          <text x="700" y="131" fill="#f472b6" font-family="monospace" font-weight="900" font-size="17">62% HP</text>
          <rect x="130" y="155" width="220" height="46" rx="14" fill="url(#purplePink)" />
          <text x="240" y="184" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">FIGHT NOW (+500 XP)</text>
        </g>

        <!-- Mystery Chest Banner -->
        <g transform="translate(45, 820)">
          <rect width="890" height="200" rx="28" fill="url(#cardGrad)" stroke="#f59e0b" stroke-width="1.5" />
          <text x="50" y="60" font-size="54">🎁</text>
          <text x="130" y="55" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">Daily Mystery Loot Chest</text>
          <text x="130" y="85" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Complete 1 more quest to unlock today's legendary drop</text>
          <rect x="130" y="110" width="220" height="44" rx="14" fill="url(#goldOrange)" />
          <text x="240" y="138" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">UNLOCK CHEST</text>
        </g>
        """
    elif m_type == "courses":
        return f"""
        <!-- Courses Tracks Directory -->
        <rect width="980" height="1060" rx="36" fill="#080e1b" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        
        <!-- Track 1: Generative AI & LLMs -->
        <g transform="translate(45, 45)">
          <rect width="890" height="225" rx="28" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
          <rect x="30" y="30" width="70" height="70" rx="22" fill="url(#cyanBlue)" />
          <text x="65" y="76" font-size="38" text-anchor="middle">🤖</text>
          <text x="125" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">Generative AI &amp; LLM Systems</text>
          <text x="125" y="88" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="700" font-size="15">Master Transformers, Attention &amp; Agents</text>
          <text x="30" y="145" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">14 Chapters • 42 Coding Projects • 8 Boss Challenges</text>
          <rect x="30" y="165" width="600" height="14" rx="7" fill="#1e293b" />
          <rect x="30" y="165" width="420" height="14" rx="7" fill="url(#cyanBlue)" />
          <rect x="670" y="145" width="190" height="48" rx="16" fill="url(#cyanBlue)" />
          <text x="765" y="175" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">CONTINUE</text>
        </g>

        <!-- Track 2: Data Structures & Algorithms -->
        <g transform="translate(45, 295)">
          <rect width="890" height="225" rx="28" fill="#0f172a" stroke="#10b981" stroke-width="2" />
          <rect x="30" y="30" width="70" height="70" rx="22" fill="url(#emeraldTeal)" />
          <text x="65" y="76" font-size="38" text-anchor="middle">⚡</text>
          <text x="125" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">DSA: Think. Solve. Excel.</text>
          <text x="125" y="88" fill="#34d399" font-family="system-ui, sans-serif" font-weight="700" font-size="15">LeetCode Patterns, Trees, Graphs &amp; DP</text>
          <text x="30" y="145" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">28 Chapters • 150+ Algorithmic Challenges</text>
          <rect x="30" y="165" width="600" height="14" rx="7" fill="#1e293b" />
          <rect x="30" y="165" width="300" height="14" rx="7" fill="url(#emeraldTeal)" />
          <rect x="670" y="145" width="190" height="48" rx="16" fill="#059669" />
          <text x="765" y="175" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">RESUME</text>
        </g>

        <!-- Track 3: Full-Stack Web Technologies -->
        <g transform="translate(45, 545)">
          <rect width="890" height="225" rx="28" fill="#0f172a" stroke="#8b5cf6" stroke-width="2" />
          <rect x="30" y="30" width="70" height="70" rx="22" fill="url(#purplePink)" />
          <text x="65" y="76" font-size="38" text-anchor="middle">🌐</text>
          <text x="125" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">Full-Stack Web Foundations</text>
          <text x="125" y="88" fill="#c084fc" font-family="system-ui, sans-serif" font-weight="700" font-size="15">HTML5, Tailwind CSS, TypeScript &amp; React</text>
          <text x="30" y="145" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">18 Chapters • Interactive Sandbox Exercises</text>
          <rect x="30" y="165" width="600" height="14" rx="7" fill="#1e293b" />
          <rect x="30" y="165" width="510" height="14" rx="7" fill="url(#purplePink)" />
          <rect x="670" y="145" width="190" height="48" rx="16" fill="#7c3aed" />
          <text x="765" y="175" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">PRACTICE</text>
        </g>

        <!-- Track 4: AI for Everyone -->
        <g transform="translate(45, 795)">
          <rect width="890" height="225" rx="28" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />
          <rect x="30" y="30" width="70" height="70" rx="22" fill="url(#goldOrange)" />
          <text x="65" y="76" font-size="38" text-anchor="middle">🎓</text>
          <text x="125" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="24">AI for Everyone &amp; Prompt Engineering</text>
          <text x="125" y="88" fill="#fbbf24" font-family="system-ui, sans-serif" font-weight="700" font-size="15">Zero to Hero in Practical Generative Tools</text>
          <text x="30" y="145" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">10 Interactive Visual Modules • 100% Free</text>
          <rect x="30" y="165" width="600" height="14" rx="7" fill="#1e293b" />
          <rect x="30" y="165" width="180" height="14" rx="7" fill="url(#goldOrange)" />
          <rect x="670" y="145" width="190" height="48" rx="16" fill="#d97706" />
          <text x="765" y="175" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">START</text>
        </g>
        """
    else:
        # Generic High-Impact 9:16 Mockup Card Stack
        return f"""
        <rect width="980" height="1060" rx="36" fill="#080e1b" stroke="{color1}" stroke-width="2" stroke-opacity="0.4" />
        
        <!-- Top Feature Hero Card -->
        <g transform="translate(45, 45)">
          <rect width="890" height="340" rx="30" fill="url(#cardGrad)" stroke="{color1}" stroke-width="2" />
          <rect x="35" y="35" width="80" height="80" rx="24" fill="url(#accentGrad)" />
          <text x="75" y="88" font-size="44" text-anchor="middle">✨</text>
          <text x="140" y="65" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="28">{title}</text>
          <text x="140" y="98" fill="{color1}" font-family="system-ui, sans-serif" font-weight="700" font-size="17">{subtitle}</text>
          
          <rect x="35" y="145" width="820" height="150" rx="20" fill="#060913" stroke="rgba(255,255,255,0.08)" />
          <text x="65" y="195" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="20">Real-Time Interactive Engine</text>
          <text x="65" y="235" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Experience seamless live state persistence, dynamic test suites, and 24/7 AI assistance.</text>
          <text x="65" y="270" fill="#4ade80" font-family="monospace" font-weight="bold" font-size="15">● Synchronized with Cloud Database &amp; Client Sandbox</text>
        </g>

        <!-- Metric Grid -->
        <g transform="translate(45, 415)">
          <rect width="430" height="180" rx="24" fill="#0f172a" stroke="{color1}" stroke-width="1.5" />
          <text x="35" y="55" fill="#94a3b8" font-family="system-ui, sans-serif" font-weight="bold" font-size="15">ACTIVE PARTICIPANTS</text>
          <text x="35" y="125" fill="#ffffff" font-family="monospace" font-weight="900" font-size="44">18,420</text>
          <text x="35" y="155" fill="#10b981" font-family="system-ui, sans-serif" font-weight="bold" font-size="14">▲ 34% this month</text>

          <g transform="translate(460, 0)">
            <rect width="430" height="180" rx="24" fill="#0f172a" stroke="{color2}" stroke-width="1.5" />
            <text x="35" y="55" fill="#94a3b8" font-family="system-ui, sans-serif" font-weight="bold" font-size="15">TOTAL XP AWARDED</text>
            <text x="35" y="125" fill="#facc15" font-family="monospace" font-weight="900" font-size="44">4.2M</text>
            <text x="35" y="155" fill="#38bdf8" font-family="system-ui, sans-serif" font-weight="bold" font-size="14">Across 153 Levels</text>
          </g>
        </g>

        <!-- Detailed Feature Activity Stream -->
        <g transform="translate(45, 625)">
          <rect width="890" height="390" rx="28" fill="#0c1222" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
          <text x="40" y="50" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="22">Platform Highlights</text>
          
          <g transform="translate(40, 80)">
            <circle cx="20" cy="20" r="14" fill="{color1}" fill-opacity="0.2" />
            <circle cx="20" cy="20" r="6" fill="{color1}" />
            <text x="50" y="27" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="18">Instant Test-Case Verification</text>
            <text x="50" y="52" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">Automated grader passes solution across custom edge cases in under 40ms.</text>
          </g>

          <g transform="translate(40, 170)">
            <circle cx="20" cy="20" r="14" fill="{color2}" fill-opacity="0.2" />
            <circle cx="20" cy="20" r="6" fill="{color2}" />
            <text x="50" y="27" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="18">Competitive Clan Leagues &amp; Tournaments</text>
            <text x="50" y="52" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">Collaborate with fellow engineers to climb global seasonal division leaderboards.</text>
          </g>

          <g transform="translate(40, 260)">
            <circle cx="20" cy="20" r="14" fill="#10b981" fill-opacity="0.2" />
            <circle cx="20" cy="20" r="6" fill="#10b981" />
            <text x="50" y="27" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="18">Speech &amp; Code AI Copilot (Lumi)</text>
            <text x="50" y="52" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">Receive voice tips and contextual debugging assistance without giving away answers.</text>
          </g>
        </g>
        """

def build_feature_svg_9_16(feat):
    color1 = feat["color1"]
    color2 = feat["color2"]
    title = html.escape(feat["title"])
    subtitle = html.escape(feat["subtitle"])
    active_tab = feat["active_tab"]
    icon = feat["icon"]
    m_type = feat["mockup"]

    defs = get_defs_9_16(color1, color2)
    header = get_phone_frame_header(title.upper(), subtitle, active_tab)
    bottom = get_bottom_nav(active_tab)

    mockup_body = render_feature_mockup_body(m_type, color1, color2, title, subtitle)

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="100%" height="100%">
    {defs}
    {header}

    <!-- Feature Screen Title Header Card -->
    <g transform="translate(50, 230)">
      <rect width="980" height="200" rx="30" fill="url(#cardGrad)" stroke="{color1}" stroke-width="1.8" />
      <g transform="translate(40, 36)">
        <rect width="180" height="34" rx="10" fill="{color1}" fill-opacity="0.18" stroke="{color1}" stroke-width="1" />
        <text x="90" y="22" fill="{color1}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="1">OPTION FOCUS</text>
        <text x="0" y="78" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="32">{title}</text>
        <text x="0" y="112" fill="#94a3b8" font-family="system-ui, sans-serif" font-weight="600" font-size="17">{subtitle}</text>
      </g>
      <rect x="830" y="45" width="110" height="110" rx="28" fill="url(#accentGrad)" filter="url(#subtleGlow)" />
      <text x="885" y="115" font-size="52" text-anchor="middle">{icon}</text>
    </g>

    <!-- Main Feature Showcase Body (Center Screen) -->
    <g transform="translate(50, 455)">
      {mockup_body}
    </g>

    <!-- Lower Status Pill -->
    <g transform="translate(50, 1540)">
      <rect width="980" height="180" rx="28" fill="#0b1120" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      <g transform="translate(35, 35)">
        <rect width="50" height="50" rx="16" fill="{color1}" fill-opacity="0.2" />
        <text x="25" y="36" font-size="28" text-anchor="middle">💎</text>
        <text x="70" y="32" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="20">Ready to level up?</text>
        <text x="70" y="58" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">Join 18,000+ engineers solving daily challenges on A.I. Fluence</text>

        <rect x="680" y="10" width="220" height="60" rx="18" fill="url(#accentGrad)" />
        <text x="790" y="46" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="17" text-anchor="middle">START NOW ➔</text>
      </g>
    </g>

    {bottom}
</svg>"""

def main():
    print("Generating pure 9:16 SVGs (viewBox 0 0 1080 1920)...")
    
    # 1. Generate 9:16 hero.svg
    hero_content = build_hero_svg_9_16()
    create_svg("public/hero.svg", hero_content)

    # 2. Generate all 15 9:16 feature SVGs
    for feat in FEATURES_DATA:
        svg_content = build_feature_svg_9_16(feat)
        path1 = f"public/features/{feat['id']}.svg"
        create_svg(path1, svg_content)
        path2 = f"public/feature_{feat['id']}.svg"
        create_svg(path2, svg_content)

    print("ALL 16 SVGs in pure 9:16 ratio successfully created!")

if __name__ == "__main__":
    main()
