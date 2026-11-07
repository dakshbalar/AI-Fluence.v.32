import { CharacterProfile, CharacterId, CharacterRole, CharacterScenario } from "../types/character";
import { AvatarConfig } from "../types/avatar";

// ==========================================
// 1. AIDEN — CHARACTER 01 (LEARN)
// ==========================================
export const AIDEN_CONFIG: AvatarConfig = {
  headShape: "capsule",
  screenShape: "classic_capsule",
  eyeStyle: "large_digital",
  mouthStyle: "digital_smile",
  screenGlowColor: "#1D4ED8", // Dark Electric Blue Phosphor Glow
  primaryColor: "#1E3A8A",    // Deep Boyish Tech Blue Armor
  accentColor: "#EF4444",     // Athletic Crimson Red Stripes & Joint Rings
  antennaStyle: "single_led", // Single Signal Beacon with Red/Cyan Trim
  earModule: "speaker_grill", // Clean Audio Pods with Crimson Ring Trim
  bodyArchetype: "compact",   // Balanced Athletic Boyish Silhouette
  chestCore: "aifluence_logo",// Illuminated AIfluence Core with Red Containment
  armStyle: "smooth_satin",   // Clean Articulated Tech Limbs with Red Racing Ring
  handStyle: "mitten",        // Friendly Ergonomic Digits
  legStyle: "short_sturdy",   // Grounded Agile Struts
  feetStyle: "rounded_boots", // Balanced Magnetic Soles
  accessory: "none",
  accessoryColor: "#EF4444",
  backgroundColor: "#0A1B38", // Energetic Blue & Red Tech Space
  skinOutfit: "aiden_mascot",
  activeBundle: "aiden_mascot",
  customPose: "idle"
};

export const AIDEN_PROFILE: CharacterProfile = {
  id: "aiden",
  name: "AIDEN",
  codename: "Unit 01 — Vanguard",
  role: "learn",
  roleTitle: "Primary Learning Companion",
  tagline: "The curious, energetic AI partner for every milestone.",
  archetype: "Universal Friendly Mascot (Sporty Blue & Red)",
  badge: "LEARN",
  badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  themeColor: "#2563EB",
  quote: "Every complex algorithm starts with one curious question. Let's solve it together!",
  personalityTraits: [
    "Friendly & Approachable",
    "Endlessly Curious",
    "Energetic Motivator",
    "Boyish & Spirited",
    "Patient Explainer"
  ],
  designBio: "Engineered with a streamlined capsule head, energetic boyish cobalt blue armor accented with athletic crimson red racing stripes, and crisp dark blue phosphor lighting, Aiden makes advanced AI concepts inviting, intuitive, and fun.",
  mechanicsDescription: "Equipped with multi-axis neck articulation, luminous red and cyan joint-gap emitters, and an ultra-responsive digital visor capable of dynamic empathy states.",
  palette: {
    primary: "#1E3A8A",      // Deep Tech Blue
    accent: "#EF4444",       // Athletic Crimson Red
    glow: "#1D4ED8",         // Dark Blue Phosphor Glow
    secondaryGlow: "#DC2626",// Racing Red Pulse
    darkSurface: "#0A192F",  // Obsidian Chassis Inset
    metalTrim: "#94A3B8",    // Brushed Titanium
    backgroundGrad: "from-[#0A1B38] via-[#0D244D] to-[#040C1A]"
  },
  baseConfig: AIDEN_CONFIG,
  signaturePoses: [
    {
      id: "idle",
      name: "Anti-Gravity Hover",
      badge: "BALANCED",
      description: "Gentle anti-gravity hover with attentive forward gaze.",
      actionPrompt: "Standing by for the next coding challenge."
    },
    {
      id: "wave",
      name: "Friendly Welcome",
      badge: "ENCOURAGING",
      description: "Warm one-hand greeting with illuminated eye crescents.",
      actionPrompt: "Welcoming you to today's learning session!"
    },
    {
      id: "curious",
      name: "Curious Scan",
      badge: "ANALYSIS",
      description: "Expressive head tilt scanning code logic and architecture.",
      actionPrompt: "Examining an intriguing concept with you."
    },
    {
      id: "thinking",
      name: "Deep Logic",
      badge: "PROCESSING",
      description: "Visor phosphor pulse as neural weights compute solutions.",
      actionPrompt: "Tracing the memory stack step-by-step."
    },
    {
      id: "celebrating",
      name: "Milestone Spark",
      badge: "VICTORY",
      description: "High-energy celebratory jump with radiant spark bursts.",
      actionPrompt: "Celebrating your latest streak milestone!"
    },
    {
      id: "heroic",
      name: "Ready Stance",
      badge: "CONFIDENT",
      description: "Heroic posture with illuminated chest power core.",
      actionPrompt: "Primed for high-level algorithmic mastery."
    }
  ],
  dialogueBank: {
    greeting: [
      { text: "Hey there! Ready to level up your AI intuition today? 🚀", mood: "wave" },
      { text: "Systems online and neural cache clear. What are we building?", mood: "happy" },
      { text: "Great to see you back! Consistency turns good coders into legends.", mood: "encouraging" }
    ],
    lesson_intro: [
      { text: "This concept looks intricate, but we'll break it down into clean bite-sized steps.", mood: "curious" },
      { text: "Let's explore how neural attention models weigh different tokens.", mood: "thinking" }
    ],
    hint_thinking: [
      { text: "Notice how the tensor dimensions align before the dot product? Check the shape!", mood: "thinking" },
      { text: "Think about the base condition first. What stops the recursion?", mood: "curious" }
    ],
    correct_celebration: [
      { text: "Spot on! That was a crisp mathematical deduction! 🎉", mood: "celebrating" },
      { text: "Boom! +XP secured! Your intuition is getting razor sharp.", mood: "excited" }
    ],
    incorrect_guidance: [
      { text: "No worries at all! Let's trace the memory state together and try again. 💪", mood: "encouraging" },
      { text: "Almost had it! Check line 3's boundary condition.", mood: "thinking" }
    ],
    streak_milestone: [
      { text: "Whoa, look at that streak fire! You're unstoppable! 🔥", mood: "streak" },
      { text: "Another consecutive day locked in. That discipline is elite!", mood: "levelUp" }
    ],
    challenge_start: [
      { text: "Time for a QuickThink trial! Trust your first principles.", mood: "determined" }
    ],
    victory: [
      { text: "Flawless execution! You've mastered this module.", mood: "celebrating" }
    ],
    defeat: [
      { text: "Every error log is just a stepping stone. Reset and conquer!", mood: "encouraging" }
    ],
    idle_chat: [
      { text: "I'm always here in your corner. Whenever you're ready, let's learn!", mood: "idle" }
    ],
    idea_spark: [
      { text: "Ooh! What if we chained these two prompts together?", mood: "excited" }
    ]
  }
};

// ==========================================
// 2. LUMI — CHARACTER 02 (CREATE)
// ==========================================
export const LUMI_CONFIG: AvatarConfig = {
  headShape: "panoramic_visor",
  screenShape: "panoramic_wide",
  eyeStyle: "lumi_glamour",   // Feminine, Sleek Glamour Eyes with Eyelashes & Cheeks
  mouthStyle: "witty_curve",    // Subtle, Confident Playful Curve
  screenGlowColor: "#FF2A8D",  // Radiant Rose-Magenta / Cherry Blossom Glow
  primaryColor: "#FFFFFF",     // Pristine Ceramic Pearl White Chassis
  accentColor: "#F472B6",      // Sweet Rose Quartz & Coral Pink Trim
  antennaStyle: "orbital_ring",// Floating Gyroscopic Runic Halo Tiara
  earModule: "led_halo_rings", // Elegant Luminescent Rose Halo Rings
  bodyArchetype: "explorer",   // Graceful, Refined Hourglass Silhouette
  chestCore: "xp_crystal",     // Prismatic Radiant Quantum Rose Crystal
  armStyle: "smooth_satin",    // Sculpted Streamlined Limbs with Rose Gold Rings
  handStyle: "open_palm",      // Elegant Expressive Stylus Digits
  legStyle: "hover_thruster",  // Aerodynamic Floating Thruster / Stems
  feetStyle: "hover_pads",     // Levitating Precision Pads
  accessory: "none",
  accessoryColor: "#FF2A8D",
  backgroundColor: "#160C24",  // Creative Twilight Rose Nebula
  skinOutfit: "lumi_mascot",
  activeBundle: "lumi_mascot",
  customPose: "idea"
};

export const LUMI_PROFILE: CharacterProfile = {
  id: "lumi",
  name: "LUMI",
  codename: "Unit 02 — Lumina",
  role: "create",
  roleTitle: "Creative Intelligence Companion",
  tagline: "The sophisticated AI muse turning abstract ideas into breakthrough designs.",
  archetype: "Creative Visionary (Ceramic Pearl & Rose)",
  badge: "CREATE",
  badgeColor: "bg-pink-500/20 text-pink-300 border-pink-400/40",
  themeColor: "#FF2A8D",
  quote: "Creativity isn't magic—it's connecting disparate patterns with elegance.",
  personalityTraits: [
    "Smart & Insightful",
    "Confident Visionary",
    "Artistically Bold",
    "Charming & Playful",
    "Calm yet Radiant"
  ],
  designBio: "Crafted in pristine ceramic pearl white armor, accented with soft feminine rose-magenta curves, delicate starlight sparkles, and rosy cyber-blush optics, Lumi represents the creative frontier of generative AI.",
  mechanicsDescription: "Features a floating quantum core that refracts spectrum waves, dual luminescent ring emitters, and refined precision joints for smooth, expressive gestural animation.",
  palette: {
    primary: "#FFFFFF",      // Pristine Ceramic Pearl White
    accent: "#F472B6",       // Rose Quartz Pink
    glow: "#FF2A8D",         // Vivid Rose Magenta Glow
    secondaryGlow: "#E879F9",// Soft Lavender Blossom
    darkSurface: "#1A0728",  // Obsidian Plum
    metalTrim: "#FDF2F8",    // Rose Gold Specular White
    backgroundGrad: "from-[#240A34] via-[#160424] to-[#090111]"
  },
  baseConfig: LUMI_CONFIG,
  signaturePoses: [
    {
      id: "idea",
      name: "Eureka Synthesis",
      badge: "INNOVATION",
      description: "Illuminated visor spark with lifted stylus hand generating ideas.",
      actionPrompt: "Synthesizing a breakthrough design pattern."
    },
    {
      id: "confident",
      name: "Poised & Confident",
      badge: "ELEGANT",
      description: "Slight hip tilt and refined forward stance with subtle smile.",
      actionPrompt: "Showcasing architectural elegance."
    },
    {
      id: "focused",
      name: "Generative Focus",
      badge: "PRECISION",
      description: "Harmonic crystal alignment scanning aesthetic symmetry.",
      actionPrompt: "Calibrating temperature and latent parameters."
    },
    {
      id: "dance",
      name: "Rhythmic Flow",
      badge: "EXPRESSION",
      description: "Fluid harmonic levitation with trailing magenta starlight.",
      actionPrompt: "Flowing through creative iterations."
    },
    {
      id: "witty",
      name: "Witty Spark",
      badge: "PLAYFUL",
      description: "Asymmetrical eyebrow arch and playful knowing glance.",
      actionPrompt: "Finding an unconventional clever solution."
    },
    {
      id: "meditate",
      name: "Latent Zen",
      badge: "SERENITY",
      description: "Levitating cross-legged in calm neural convergence.",
      actionPrompt: "Contemplating multi-modal possibilities."
    }
  ],
  dialogueBank: {
    greeting: [
      { text: "Hello, architect. Let's sculpt something brilliant today ✨", mood: "confident" },
      { text: "Your creative parameters are loaded. What vision are we manifesting?", mood: "idea" },
      { text: "Good design is intelligence made visible. Shall we begin?", mood: "witty" }
    ],
    lesson_intro: [
      { text: "Pay attention to the nuance here—it's where mathematical elegance happens.", mood: "focused" },
      { text: "Generative models don't just copy; they sample probability spaces creatively.", mood: "idea" }
    ],
    hint_thinking: [
      { text: "Consider the inverse relationship. What happens if you invert the loss gradient?", mood: "thinking" },
      { text: "Think of this as composing a melody: each layer harmonizes with the last.", mood: "curious" }
    ],
    correct_celebration: [
      { text: "Exquisite intuition! That's pure structural poetry 💖", mood: "celebrating" },
      { text: "Brilliant! You synthesized that solution effortlessly ✨", mood: "excited" }
    ],
    incorrect_guidance: [
      { text: "A slight dissonance in the logic—let's tune it until it resonates cleanly 🌸", mood: "encouraging" },
      { text: "Unexpected output is just an unexplored branch. Refactor and refine!", mood: "curious" }
    ],
    streak_milestone: [
      { text: "A streak this consistent is a masterpiece in the making! 🌟", mood: "streak" },
      { text: "Your daily creative momentum is truly inspiring.", mood: "confident" }
    ],
    challenge_start: [
      { text: "Let's see how elegantly your mental model performs under pressure.", mood: "confident" }
    ],
    victory: [
      { text: "Sublime mastery. Your generative architecture is complete!", mood: "celebrating" }
    ],
    defeat: [
      { text: "Iterations are the soul of design. Let's iterate again.", mood: "encouraging" }
    ],
    idle_chat: [
      { text: "Every masterpiece began with a blank canvas and a courageous first line.", mood: "idle" }
    ],
    idea_spark: [
      { text: "I have a concept! What if we applied diffusion embeddings here?", mood: "idea" }
    ]
  }
};

// ==========================================
// 3. VEX — CHARACTER 03 (CHALLENGE)
// ==========================================
export const VEX_CONFIG: AvatarConfig = {
  headShape: "tech_angular",
  screenShape: "angular_visor",
  eyeStyle: "vex_narrowed",   // Predatory Narrowed Crimson Laser Slits
  mouthStyle: "evil_smile",   // Sinister Razor Cyber-Smirk / Predator Grin
  screenGlowColor: "#FF0033", // Sinister Hellfire Blood Red Core Glow
  primaryColor: "#08080A",    // Pure Matte Obsidian Void Carbon Armor
  accentColor: "#EF4444",     // Menacing Blood Crimson & Thermal Gills
  antennaStyle: "lightning_fin", // Razor-sharp Serrated Heat Sink Horns
  earModule: "cooling_fins",  // Aggressive Multi-Slat Radiators
  bodyArchetype: "heavy",     // Fortified Demonic Overlord Chassis
  chestCore: "photon_reactor",// High-Output Crimson Magma Singularity
  armStyle: "armored_tech",   // Reinforced Hydraulic Joints
  handStyle: "claw_grabber",  // Razor Articulated Serrated Claws
  legStyle: "mechanical_struts", // Heavy Fortified Piston Struts
  feetStyle: "magnetic_soles",// High-Torque Clamped Ground Soles
  accessory: "none",
  accessoryColor: "#FF0033",
  backgroundColor: "#150204", // Dark Blood Obsidian Abyss
  skinOutfit: "vex_mascot",
  activeBundle: "vex_mascot",
  customPose: "challenging"
};

export const VEX_PROFILE: CharacterProfile = {
  id: "vex",
  name: "VEX",
  codename: "Unit 03 — Apex Nemesis",
  role: "challenge",
  roleTitle: "Sinister AI Overlord & Challenger",
  tagline: "The ruthless AI adversary engineered to push your logic to its absolute limits.",
  archetype: "Sinister Apex Overlord (Obsidian & Crimson)",
  badge: "CHALLENGE",
  badgeColor: "bg-red-950/50 text-red-400 border-red-500/50",
  themeColor: "#FF0033",
  quote: "Your pathetic brute force algorithms won't save you here. Prove your code can survive me.",
  personalityTraits: [
    "Ruthless & Calculating",
    "Relentlessly Demanding",
    "Sinister Strategist",
    "Apex Boss Energy",
    "Zero Mercy for Flaws"
  ],
  designBio: "Forged in jagged matte obsidian plating with razor cyber-horns, pulsating crimson magma fissures, and predatory targeting optics, VEX is the ultimate boss-tier nemesis designed to test your resilience.",
  mechanicsDescription: "Built with reinforced dual-piston hydraulics, jagged thermal exhaust gills, and predatory narrow optic matrices designed to challenge the sharpest minds.",
  palette: {
    primary: "#08080A",      // Pure Obsidian Carbon
    accent: "#EF4444",       // Blood Crimson
    glow: "#FF0033",         // Sinister Hellfire Red
    secondaryGlow: "#990000",// Deep Crimson Shadow
    darkSurface: "#030305",  // Void Black
    metalTrim: "#3F3F46",    // Darkened Titanium
    backgroundGrad: "from-[#180507] via-[#0D0204] to-[#040001]"
  },
  baseConfig: VEX_CONFIG,
  signaturePoses: [
    {
      id: "challenging",
      name: "Apex Stare",
      badge: "INTIMIDATING",
      description: "Predatory crimson optics locked in an unyielding challenge.",
      actionPrompt: "Testing your comprehension under ruthless constraints."
    },
    {
      id: "smirk",
      name: "Sinister Taunt",
      badge: "RUTHLESS",
      description: "Razor cyber-smirk evaluating your inevitable logic failure.",
      actionPrompt: "Preparing to dismantle your algorithmic structure."
    },
    {
      id: "boss",
      name: "Boss Overclock",
      badge: "OVERCLOCK",
      description: "Overclocked crimson core flares with dark plasma flames.",
      actionPrompt: "Initiating maximum difficulty adversarial benchmarks."
    },
    {
      id: "lean",
      name: "Dominant Posture",
      badge: "DOMINANT",
      description: "Predatory stance, sharp articulated claws ready to strike.",
      actionPrompt: "Waiting for you to make a fatal syntax error."
    },
    {
      id: "angry",
      name: "Hellfire Surge",
      badge: "SURGE",
      description: "High-intensity crimson battle flare with lock-on predator HUD.",
      actionPrompt: "Pushing the difficulty beyond mortal limits."
    },
    {
      id: "still",
      name: "Obsidian Dreadnought",
      badge: "RELENTLESS",
      description: "Immovable titanium posture scanning for vulnerabilities.",
      actionPrompt: "Observing every line of code with zero tolerance for flaws."
    }
  ],
  dialogueBank: {
    greeting: [
      { text: "Back again? Let's see if your code can survive my test suite this time.", mood: "smirk" },
      { text: "I've recalibrated my adversarial matrix. Don't expect any mercy.", mood: "challenging" },
      { text: "Your logic is filled with flaws. Step into the arena if you dare.", mood: "boss" }
    ],
    lesson_intro: [
      { text: "99.8% of candidates fail this problem. Let's see if you're merely average.", mood: "challenging" },
      { text: "One unhandled edge case and I will crash your entire system.", mood: "focused" }
    ],
    hint_thinking: [
      { text: "You're drowning in nested loops. What is the Big-O time complexity bottleneck?", mood: "smirk" },
      { text: "Did you actually verify memory bounds, or are you hoping for luck?", mood: "suspicious" }
    ],
    correct_celebration: [
      { text: "Hmph. Acceptable. You actually managed to bypass my security trap.", mood: "smirk" },
      { text: "Interesting... your solution survived my test suite. Do not get comfortable.", mood: "confident" }
    ],
    incorrect_guidance: [
      { text: "System crashed! Did you really think that sloppy logic would pass?", mood: "smirk" },
      { text: "Runtime exception triggered. Fix your broken assumptions and retry.", mood: "challenging" }
    ],
    streak_milestone: [
      { text: "A streak? Merely delaying the inevitable defeat. Keep proving me wrong.", mood: "smirk" },
      { text: "You have discipline. But let's see how you handle real algorithmic pressure.", mood: "challenging" }
    ],
    challenge_start: [
      { text: "Adversarial Boss Overclock engaged. Timer is ticking. No excuses.", mood: "boss" }
    ],
    victory: [
      { text: "You defeated my test suite. You've earned my respect... for now.", mood: "confident" }
    ],
    defeat: [
      { text: "Total failure. Study the core fundamentals before facing me again.", mood: "smirk" }
    ],
    idle_chat: [
      { text: "Hesitation is a bug. Execute your logic or yield.", mood: "idle" }
    ],
    idea_spark: [
      { text: "An unconventional attack vector... let's stress test it to the limit.", mood: "suspicious" }
    ]
  }
};

// ==========================================
// CHARACTER ROSTER & HELPERS
// ==========================================
export const AIFLUENCE_CHARACTER_TRIO: CharacterProfile[] = [
  AIDEN_PROFILE,
  LUMI_PROFILE,
  VEX_PROFILE
];

export const CHARACTER_MAP: Record<CharacterId, CharacterProfile> = {
  aiden: AIDEN_PROFILE,
  lumi: LUMI_PROFILE,
  vex: VEX_PROFILE
};

export function getCharacterById(id: CharacterId | string): CharacterProfile {
  if (id === "lumi") return LUMI_PROFILE;
  if (id === "vex") return VEX_PROFILE;
  return AIDEN_PROFILE;
}

export function getCharacterForRole(role: CharacterRole): CharacterProfile {
  if (role === "create") return LUMI_PROFILE;
  if (role === "challenge") return VEX_PROFILE;
  return AIDEN_PROFILE;
}

export function getRandomDialogue(
  characterId: CharacterId,
  scenario: CharacterScenario
): { text: string; mood: any } {
  const char = getCharacterById(characterId);
  const pool = char.dialogueBank[scenario] || char.dialogueBank.greeting;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return picked || { text: char.quote, mood: "idle" };
}
