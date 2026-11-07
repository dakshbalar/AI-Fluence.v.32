export type RobotHeadShape = 
  | "capsule" 
  | "panoramic_visor" 
  | "soft_square" 
  | "compact_dome" 
  | "cyclops_visor" 
  | "dual_ocular" 
  | "tech_angular" 
  | "orbital"
  | "floating_core"
  // Legacy aliases
  | "soft_dome"
  | "wide_capsule"
  | "tall_capsule"
  | "rounded_square";

export type RobotScreenShape = 
  | "classic_capsule" 
  | "panoramic_wide" 
  | "soft_square" 
  | "compact_window" 
  | "cyclops_bar" 
  | "dual_eyes" 
  | "tech_visor"
  | "angular_visor"
  | "slit_matrix"
  // Legacy aliases
  | "wide_capsule" 
  | "rounded_rectangle" 
  | "panoramic" 
  | "compact";

export type RobotEyeStyle = 
  | "large_digital" 
  | "soft_digital" 
  | "anime_digital" 
  | "pixel" 
  | "dot" 
  | "led_visor" 
  | "visor_bar"
  | "dual_pupil"
  | "focus_crosshair"
  | "lumi_glamour"
  | "vex_predator"
  | "vex_narrowed";

export type RobotMouthStyle = 
  | "digital_smile" 
  | "small_smile" 
  | "pixel_smile" 
  | "open_smile" 
  | "tiny_line" 
  | "dot_mouth" 
  | "waveform" 
  | "happy_arc" 
  | "surprised_o" 
  | "smirk"
  | "evil_smile"
  | "confident_smile"
  | "witty_curve"
  | "grimace_scowl"
  | "none";

export type RobotAntennaStyle = 
  | "none" 
  | "single_led" 
  | "double_antenna" 
  | "orb_beacon" 
  | "orbital_ring" 
  | "satellite_dish" 
  | "lightning_fin" 
  | "star_reactor"
  // Legacy aliases
  | "single_ball"
  | "tall_led"
  | "star_tip"
  | "ring_antenna"
  | "small_stub";

export type RobotEarModule = 
  | "none" 
  | "speaker_grill" 
  | "led_halo_rings" 
  | "mechanical_discs" 
  | "comm_pods" 
  | "cooling_fins" 
  | "headphones"
  // Legacy aliases
  | "round_ears"
  | "speaker_pods"
  | "led_rings"
  | "side_fins"
  | "glowing_studs";

export type RobotBodyArchetype = 
  | "compact" 
  | "explorer" 
  | "heavy" 
  | "mini" 
  | "tech" 
  | "floating_pod"
  | "floating_core"
  // Legacy aliases
  | "friendly";

export type RobotChestCore = 
  | "none" 
  | "aifluence_logo" 
  | "photon_reactor" 
  | "pulse_heart" 
  | "xp_crystal" 
  | "energy_gauge" 
  | "tech_badge"
  // Legacy aliases
  | "glowing_core"
  | "star_reactor"
  | "energy_bar"
  | "learning_spark";

export type RobotArmStyle = 
  | "smooth_satin" 
  | "mechanical_segmented" 
  | "flexible_bellows" 
  | "armored_tech" 
  | "mini_paws"
  // Legacy aliases
  | "rounded"
  | "mechanical"
  | "soft_robotic"
  | "tech_segmented";

export type RobotHandStyle = 
  | "mitten" 
  | "three_finger" 
  | "four_finger" 
  | "claw_grabber" 
  | "open_palm"
  // Legacy aliases
  | "claw"
  | "digital_pad";

export type RobotLegStyle = 
  | "short_sturdy" 
  | "hover_thruster" 
  | "mechanical_struts" 
  | "explorer_treads" 
  | "compact_pegs"
  // Legacy aliases
  | "rounded_legs";

export type RobotFeetStyle = 
  | "rounded_boots" 
  | "hover_pads" 
  | "magnetic_soles" 
  | "robotic_feet" 
  | "tread_soles"
  | "none";

export type RobotAccessory = 
  | "none" 
  | "crown" 
  | "cap" 
  | "visor" 
  | "jetpack" 
  | "backpack" 
  | "scarf" 
  | "floating_companion" 
  | "mini_drone" 
  | "celebration_sparks"
  | "headphones"
  | "antenna_star"
  | "shoulder_pads"
  | "chest_badge";

export type RobotSkinOutfit =
  | "none"
  | "aiden_mascot"
  | "lumi_mascot"
  | "vex_mascot"
  | "military"
  | "snow_military"
  | "cyber_king"
  | "terminator"
  | "football"
  | "cyber_ninja"
  | "space_explorer"
  | "astronaut_suit"
  | "inferno_warrior"
  | "racing"
  | "formula_racer"
  | "pirate"
  | "arcane_machine"
  | "mechanic"
  | "agent"
  | "arctic_explorer"
  | "cyber_samurai"
  | "streetwear_tracksuit"
  | "tech_mage"
  | "heavy_hazard_exosuit"
  | "deep_sea_diver"
  | "royal_monarch"
  | "prism_hologram";

export type CharacterMood = 
  | "idle" 
  | "thinking" 
  | "happy" 
  | "excited" 
  | "celebrating" 
  | "encouraging" 
  | "confused" 
  | "sad" 
  | "determined" 
  | "streak" 
  | "levelUp" 
  | "proud" 
  | "surprised" 
  | "curious" 
  | "sleep" 
  | "wave" 
  | "dance"
  | "still"
  | "angry"
  | "heroic"
  | "focused"
  | "point"
  | "pointing"
  | "walk"
  | "walking"
  | "run"
  | "running"
  | "jump"
  | "jumping"
  | "sit"
  | "sitting"
  | "lean"
  | "leaning"
  | "crouch"
  | "crouching"
  | "facepalm"
  | "meditate"
  | "smirk"
  | "suspicious"
  | "challenging"
  | "boss"
  | "idea"
  | "witty"
  | "confident"
  | "cheer";

// Primary Robot Avatar Configuration
export interface AvatarConfig {
  headShape: RobotHeadShape;
  screenShape: RobotScreenShape;
  eyeStyle: RobotEyeStyle;
  mouthStyle: RobotMouthStyle;
  screenGlowColor: string;
  primaryColor: string; // Main molded shell
  accentColor: string;  // Secondary trim / socket joints
  antennaStyle: RobotAntennaStyle;
  earModule: RobotEarModule;
  bodyArchetype: RobotBodyArchetype;
  chestCore: RobotChestCore;
  armStyle: RobotArmStyle;
  handStyle: RobotHandStyle;
  legStyle: RobotLegStyle;
  feetStyle: RobotFeetStyle;
  accessory: RobotAccessory;
  accessoryColor: string;
  backgroundColor: string;
  skinOutfit?: RobotSkinOutfit; // 1-Piece full body suit/outfit
  activeBundle?: string; // Currently equipped Full Bundle ID (locked costume)
  customPose?: CharacterMood;

  // Compatibility fallback fields
  faceShape?: any;
  skinTone?: string;
  hairStyle?: any;
  hairColor?: string;
  eyebrowStyle?: any;
  eyeShape?: any;
  eyeColor?: string;
  glassesStyle?: any;
  glassesColor?: string;
  noseStyle?: any;
  facialHair?: any;
  earShape?: any;
  earAccessories?: any;
  clothingStyle?: any;
  clothingColor?: string;
}

export interface AvatarUnlockRequirement {
  id: string;
  category: string;
  name: string;
  type: "xp" | "streak" | "diamonds" | "completedLevels" | "free";
  value: number;
  description: string;
}

// Backward compatibility type aliases
export type FaceShape = RobotHeadShape;
export type HairStyle = string;
export type EyebrowStyle = string;
export type EyeShape = RobotEyeStyle;
export type GlassesStyle = string;
export type NoseStyle = string;
export type MouthStyle = RobotMouthStyle;
export type FacialHairStyle = string;
export type EarShape = string;
export type EarAccessory = RobotEarModule;
export type ClothingStyle = RobotBodyArchetype;
export type AccessoryType = RobotAccessory;
