import {
  RobotHeadShape,
  RobotScreenShape,
  RobotBodyArchetype,
  RobotArmStyle,
  RobotHandStyle,
  RobotLegStyle,
  CharacterMood,
} from "../../types/avatar";

export interface Point2D {
  x: number;
  y: number;
}

export interface RobotRig {
  antennaSocket: Point2D;
  leftEarSocket: Point2D;
  rightEarSocket: Point2D;
  chestSocket: Point2D;
  torsoCenter: Point2D;
  mouthAnchor: Point2D;
  leftEyeAnchor: Point2D;
  rightEyeAnchor: Point2D;

  leftShoulderSocket: Point2D;
  rightShoulderSocket: Point2D;
  leftElbowJoint: Point2D;
  rightElbowJoint: Point2D;
  leftHandAnchor: Point2D;
  rightHandAnchor: Point2D;
  leftHandAngle: number;
  rightHandAngle: number;
  leftHandGesture: string;
  rightHandGesture: string;

  leftHipSocket: Point2D;
  rightHipSocket: Point2D;
  leftKneeJoint: Point2D;
  rightKneeJoint: Point2D;
  leftFootAnchor: Point2D;
  rightFootAnchor: Point2D;
  leftFootAngle: number;
  rightFootAngle: number;

  groundShadow: string;
  headPath: string;
  headHighlightPath: string;
  headShadowPath: string;
  headRimPath: string;

  screenBezelPath: string;
  screenCavityPath: string;
  screenGlassPath: string;
  screenGlossPath: string;

  torsoPath: string;
  torsoHighlightPath: string;
  torsoShadowPath: string;
  torsoRimPath: string;

  neckPath: string;
  neckShadowPath: string;

  leftArmPath: string;
  rightArmPath: string;
  leftLegPath: string;
  rightLegPath: string;
}

export function calculateRobotRig(
  headShape: RobotHeadShape = "capsule",
  screenShape: RobotScreenShape = "classic_capsule",
  bodyArchetype: RobotBodyArchetype = "compact",
  _armStyle: RobotArmStyle = "smooth_satin",
  _handStyle: RobotHandStyle = "mitten",
  legStyle: RobotLegStyle = "short_sturdy",
  mood: CharacterMood = "idle"
): RobotRig {
  // Base coordinate system: 400x400 SVG
  let antennaSocket: Point2D = { x: 200, y: 74 };
  let leftEarSocket: Point2D = { x: 134, y: 145 };
  let rightEarSocket: Point2D = { x: 266, y: 145 };
  let mouthAnchor: Point2D = { x: 200, y: 168 };
  let leftEyeAnchor: Point2D = { x: 178, y: 144 };
  let rightEyeAnchor: Point2D = { x: 222, y: 144 };

  let chestSocket: Point2D = { x: 200, y: 248 };
  let torsoCenter: Point2D = { x: 200, y: 248 };

  let leftShoulderSocket: Point2D = { x: 152, y: 232 };
  let rightShoulderSocket: Point2D = { x: 248, y: 232 };
  let leftElbowJoint: Point2D = { x: 128, y: 262 };
  let rightElbowJoint: Point2D = { x: 272, y: 262 };
  let leftHandAnchor: Point2D = { x: 118, y: 290 };
  let rightHandAnchor: Point2D = { x: 282, y: 290 };
  let leftHandAngle = 10;
  let rightHandAngle = -10;
  let leftHandGesture = "mitten";
  let rightHandGesture = "mitten";

  let leftHipSocket: Point2D = { x: 174, y: 286 };
  let rightHipSocket: Point2D = { x: 226, y: 286 };
  let leftKneeJoint: Point2D = { x: 172, y: 320 };
  let rightKneeJoint: Point2D = { x: 228, y: 320 };
  let leftFootAnchor: Point2D = { x: 168, y: 350 };
  let rightFootAnchor: Point2D = { x: 232, y: 350 };
  let leftFootAngle = 0;
  let rightFootAngle = 0;

  // 1. Head shape adjustments
  let headPath = "M 136 145 C 136 94, 164 76, 200 76 C 236 76, 264 94, 264 145 C 264 195, 236 210, 200 210 C 164 210, 136 195, 136 145 Z";
  let headShadowPath = "M 138 165 C 148 198, 172 208, 200 208 C 228 208, 252 198, 262 165 C 252 190, 226 200, 200 200 C 174 200, 148 190, 138 165 Z";

  if (headShape === "soft_square" || headShape === "rounded_square") {
    headPath = "M 134 100 C 134 82, 148 76, 200 76 C 252 76, 266 82, 266 100 L 266 190 C 266 206, 250 212, 200 212 C 150 212, 134 206, 134 190 Z";
  } else if (headShape === "compact_dome" || headShape === "soft_dome") {
    headPath = "M 130 148 C 130 96, 160 80, 200 80 C 240 80, 270 96, 270 148 C 270 196, 240 210, 200 210 C 160 210, 130 196, 130 148 Z";
    leftEarSocket = { x: 128, y: 148 };
    rightEarSocket = { x: 272, y: 148 };
  } else if (headShape === "panoramic_visor" || headShape === "wide_capsule") {
    headPath = "M 126 145 C 126 92, 158 74, 200 74 C 242 74, 274 92, 274 145 C 274 198, 242 212, 200 212 C 158 212, 126 198, 126 145 Z";
    leftEarSocket = { x: 124, y: 145 };
    rightEarSocket = { x: 276, y: 145 };
  } else if (headShape === "tall_capsule") {
    headPath = "M 136 140 C 136 82, 164 64, 200 64 C 236 64, 264 82, 264 140 C 264 198, 236 214, 200 214 C 164 214, 136 198, 136 140 Z";
    antennaSocket = { x: 200, y: 62 };
  } else if (headShape === "tech_angular") {
    headPath = "M 136 120 L 170 76 L 230 76 L 264 120 L 264 180 L 230 212 L 170 212 L 136 180 Z";
  } else if (headShape === "orbital" || headShape === "floating_core") {
    headPath = "M 132 144 C 132 92, 162 76, 200 76 C 238 76, 268 92, 268 144 C 268 196, 238 212, 200 212 C 162 212, 132 196, 132 144 Z";
  } else if (headShape === "cyclops_visor") {
    headPath = "M 134 145 C 134 90, 162 74, 200 74 C 238 74, 266 90, 266 145 C 266 196, 238 210, 200 210 C 162 210, 134 196, 134 145 Z";
  } else if (headShape === "dual_ocular") {
    headPath = "M 132 145 C 132 94, 160 76, 200 76 C 240 76, 268 94, 268 145 C 268 196, 240 212, 200 212 C 160 212, 132 196, 132 145 Z";
  }

  // 2. Visor Screen Glass Geometries
  let screenGlassPath = "M 152 144 C 152 120, 171 110, 200 110 C 229 110, 248 120, 248 144 C 248 168, 229 180, 200 180 C 171 180, 152 168, 152 144 Z";

  if (screenShape === "panoramic_wide" || screenShape === "wide_capsule" || screenShape === "panoramic") {
    screenGlassPath = "M 142 144 C 142 118, 166 108, 200 108 C 234 108, 258 118, 258 144 C 258 170, 234 182, 200 182 C 166 182, 142 170, 142 144 Z";
  } else if (screenShape === "soft_square" || screenShape === "rounded_rectangle") {
    screenGlassPath = "M 150 120 C 150 112, 158 110, 200 110 C 242 110, 250 112, 250 120 L 250 168 C 250 178, 242 180, 200 180 C 158 180, 150 178, 150 168 Z";
  } else if (screenShape === "compact_window" || screenShape === "compact") {
    screenGlassPath = "M 158 144 C 158 122, 174 114, 200 114 C 226 114, 242 122, 242 144 C 242 166, 226 176, 200 176 C 174 176, 158 166, 158 144 Z";
  } else if (screenShape === "cyclops_bar") {
    screenGlassPath = "M 144 144 C 144 130, 166 126, 200 126 C 234 126, 256 130, 256 144 C 256 158, 234 162, 200 162 C 166 162, 144 158, 144 144 Z";
    leftEyeAnchor = { x: 182, y: 144 };
    rightEyeAnchor = { x: 218, y: 144 };
    mouthAnchor = { x: 200, y: 172 };
  } else if (screenShape === "dual_eyes") {
    screenGlassPath = "M 148 144 C 148 124, 164 120, 182 120 C 196 120, 204 128, 200 144 C 196 160, 186 168, 182 168 C 164 168, 148 160, 148 144 Z M 200 144 C 196 128, 204 120, 218 120 C 236 120, 252 124, 252 144 C 252 160, 236 168, 218 168 C 214 168, 204 160, 200 144 Z";
  } else if (screenShape === "angular_visor" || screenShape === "tech_visor") {
    screenGlassPath = "M 148 132 L 180 112 L 220 112 L 252 132 L 246 162 L 200 180 L 154 162 Z";
  } else if (screenShape === "slit_matrix") {
    screenGlassPath = "M 146 144 C 146 124, 168 114, 200 114 C 232 114, 254 124, 254 144 C 254 164, 232 176, 200 176 C 168 176, 146 164, 146 144 Z";
  }

  // 3. Body Archetype Torso & Shoulder Geometry
  let torsoPath = "M 156 220 C 156 214, 174 212, 200 212 C 226 212, 244 214, 244 220 L 240 282 C 240 290, 222 294, 200 294 C 178 294, 160 290, 160 282 Z";

  if (bodyArchetype === "heavy") {
    torsoPath = "M 146 218 C 146 210, 170 208, 200 208 C 230 208, 254 210, 254 218 L 248 286 C 248 296, 226 300, 200 300 C 174 300, 152 296, 152 286 Z";
    leftShoulderSocket = { x: 144, y: 228 };
    rightShoulderSocket = { x: 256, y: 228 };
  } else if (bodyArchetype === "mini") {
    torsoPath = "M 164 224 C 164 218, 180 216, 200 216 C 220 216, 236 218, 236 224 L 232 276 C 232 284, 218 288, 200 288 C 182 288, 168 284, 168 276 Z";
    leftShoulderSocket = { x: 158, y: 236 };
    rightShoulderSocket = { x: 242, y: 236 };
    chestSocket = { x: 200, y: 244 };
  } else if (bodyArchetype === "explorer" || bodyArchetype === "tech") {
    torsoPath = "M 152 218 L 248 218 L 244 284 L 200 294 L 156 284 Z";
  } else if (bodyArchetype === "floating_pod" || bodyArchetype === "floating_core") {
    torsoPath = "M 158 218 C 158 212, 176 210, 200 210 C 224 210, 242 212, 242 218 L 234 272 C 234 286, 218 296, 200 296 C 182 296, 166 286, 166 272 Z";
  }

  // 4. Kinematic Poses (25 Analytical Postures)
  if (mood === "heroic" || mood === "confident") {
    // Confident hands on hips, grounded stance
    leftElbowJoint = { x: 114, y: 252 };
    leftHandAnchor = { x: 148, y: 274 };
    leftHandAngle = 45;
    rightElbowJoint = { x: 286, y: 252 };
    rightHandAnchor = { x: 252, y: 274 };
    rightHandAngle = -45;
    leftFootAnchor = { x: 160, y: 350 };
    rightFootAnchor = { x: 240, y: 350 };
  } else if (mood === "wave") {
    // Friendly wave: Right hand lifted high, Left hand relaxed
    rightElbowJoint = { x: 280, y: 198 };
    rightHandAnchor = { x: 290, y: 152 };
    rightHandAngle = -75;
    rightHandGesture = "open_palm";
    leftElbowJoint = { x: 126, y: 264 };
    leftHandAnchor = { x: 120, y: 294 };
  } else if (mood === "point") {
    // Target Point: Right arm extended forward
    rightElbowJoint = { x: 278, y: 236 };
    rightHandAnchor = { x: 310, y: 236 };
    rightHandAngle = -90;
    rightHandGesture = "open_palm";
  } else if (mood === "run") {
    // Speed Sprint: dynamic asymmetric stride
    leftElbowJoint = { x: 116, y: 240 };
    leftHandAnchor = { x: 126, y: 210 };
    rightElbowJoint = { x: 276, y: 274 };
    rightHandAnchor = { x: 294, y: 298 };
    leftKneeJoint = { x: 158, y: 312 };
    leftFootAnchor = { x: 144, y: 342 };
    leftFootAngle = 20;
    rightKneeJoint = { x: 244, y: 326 };
    rightFootAnchor = { x: 256, y: 356 };
    rightFootAngle = -15;
  } else if (mood === "jump") {
    // Anti-Grav Leap: elevated limbs
    leftElbowJoint = { x: 112, y: 206 };
    leftHandAnchor = { x: 104, y: 172 };
    leftHandAngle = 60;
    rightElbowJoint = { x: 288, y: 206 };
    rightHandAnchor = { x: 296, y: 172 };
    rightHandAngle = -60;
    leftKneeJoint = { x: 160, y: 310 };
    leftFootAnchor = { x: 150, y: 338 };
    leftFootAngle = -25;
    rightKneeJoint = { x: 240, y: 310 };
    rightFootAnchor = { x: 250, y: 338 };
    rightFootAngle = 25;
  } else if (mood === "sit") {
    // Grounded Rest: knees bent outward, hands resting
    leftElbowJoint = { x: 124, y: 268 };
    leftHandAnchor = { x: 146, y: 296 };
    leftHandAngle = 20;
    rightElbowJoint = { x: 276, y: 268 };
    rightHandAnchor = { x: 254, y: 296 };
    rightHandAngle = -20;
    leftKneeJoint = { x: 150, y: 324 };
    leftFootAnchor = { x: 154, y: 344 };
    rightKneeJoint = { x: 250, y: 324 };
    rightFootAnchor = { x: 246, y: 344 };
  } else if (mood === "lean" || mood === "witty" || mood === "smirk") {
    // Casual asymmetric lean
    leftElbowJoint = { x: 120, y: 258 };
    leftHandAnchor = { x: 138, y: 282 };
    leftHandAngle = 30;
    rightElbowJoint = { x: 276, y: 262 };
    rightHandAnchor = { x: 286, y: 292 };
    leftFootAnchor = { x: 164, y: 350 };
    rightFootAnchor = { x: 238, y: 350 };
  } else if (mood === "crouch") {
    // Tactical low crouch
    leftElbowJoint = { x: 120, y: 270 };
    leftHandAnchor = { x: 136, y: 300 };
    rightElbowJoint = { x: 280, y: 270 };
    rightHandAnchor = { x: 264, y: 300 };
    leftKneeJoint = { x: 154, y: 324 };
    leftFootAnchor = { x: 156, y: 346 };
    rightKneeJoint = { x: 246, y: 324 };
    rightFootAnchor = { x: 244, y: 346 };
  } else if (mood === "facepalm") {
    // Right hand over visor face
    rightElbowJoint = { x: 276, y: 202 };
    rightHandAnchor = { x: 218, y: 154 };
    rightHandAngle = -120;
  } else if (mood === "meditate") {
    // Levitating zen open palms
    leftElbowJoint = { x: 118, y: 252 };
    leftHandAnchor = { x: 136, y: 278 };
    leftHandAngle = 40;
    leftHandGesture = "open_palm";
    rightElbowJoint = { x: 282, y: 252 };
    rightHandAnchor = { x: 264, y: 278 };
    rightHandAngle = -40;
    rightHandGesture = "open_palm";
    leftFootAnchor = { x: 172, y: 338 };
    rightFootAnchor = { x: 228, y: 338 };
  } else if (mood === "thinking" || mood === "curious") {
    // Thinking: hand under chin
    rightElbowJoint = { x: 270, y: 220 };
    rightHandAnchor = { x: 226, y: 196 };
    rightHandAngle = -85;
  } else if (mood === "celebrating" || mood === "cheer") {
    // Both arms raised high
    leftElbowJoint = { x: 116, y: 196 };
    leftHandAnchor = { x: 108, y: 156 };
    leftHandAngle = 60;
    rightElbowJoint = { x: 284, y: 196 };
    rightHandAnchor = { x: 292, y: 156 };
    rightHandAngle = -60;
  } else if (mood === "streak" || mood === "boss") {
    // Power muscle flex
    leftElbowJoint = { x: 110, y: 240 };
    leftHandAnchor = { x: 122, y: 196 };
    leftHandAngle = 80;
    rightElbowJoint = { x: 290, y: 240 };
    rightHandAnchor = { x: 278, y: 196 };
    rightHandAngle = -80;
  } else if (mood === "levelUp") {
    // Sky punch right fist
    rightElbowJoint = { x: 276, y: 180 };
    rightHandAnchor = { x: 278, y: 128 };
    rightHandAngle = -90;
    leftElbowJoint = { x: 118, y: 252 };
    leftHandAnchor = { x: 144, y: 276 };
  } else if (mood === "angry") {
    // Battle tense fists
    leftElbowJoint = { x: 122, y: 254 };
    leftHandAnchor = { x: 126, y: 284 };
    rightElbowJoint = { x: 278, y: 254 };
    rightHandAnchor = { x: 274, y: 284 };
  }

  // Dynamic quadratic Bezier limb paths
  const leftArmPath = `M ${leftShoulderSocket.x} ${leftShoulderSocket.y} Q ${leftElbowJoint.x} ${leftElbowJoint.y} ${leftHandAnchor.x} ${leftHandAnchor.y}`;
  const rightArmPath = `M ${rightShoulderSocket.x} ${rightShoulderSocket.y} Q ${rightElbowJoint.x} ${rightElbowJoint.y} ${rightHandAnchor.x} ${rightHandAnchor.y}`;

  let leftLegPath = `M ${leftHipSocket.x} ${leftHipSocket.y} Q ${leftKneeJoint.x} ${leftKneeJoint.y} ${leftFootAnchor.x} ${leftFootAnchor.y}`;
  let rightLegPath = `M ${rightHipSocket.x} ${rightHipSocket.y} Q ${rightKneeJoint.x} ${rightKneeJoint.y} ${rightFootAnchor.x} ${rightFootAnchor.y}`;

  if (legStyle === "hover_thruster") {
    leftLegPath = `M ${leftHipSocket.x} ${leftHipSocket.y} L ${leftFootAnchor.x} ${leftFootAnchor.y - 10}`;
    rightLegPath = `M ${rightHipSocket.x} ${rightHipSocket.y} L ${rightFootAnchor.x} ${rightFootAnchor.y - 10}`;
  }

  return {
    antennaSocket,
    leftEarSocket,
    rightEarSocket,
    chestSocket,
    torsoCenter,
    mouthAnchor,
    leftEyeAnchor,
    rightEyeAnchor,

    leftShoulderSocket,
    rightShoulderSocket,
    leftElbowJoint,
    rightElbowJoint,
    leftHandAnchor,
    rightHandAnchor,
    leftHandAngle,
    rightHandAngle,
    leftHandGesture,
    rightHandGesture,

    leftHipSocket,
    rightHipSocket,
    leftKneeJoint,
    rightKneeJoint,
    leftFootAnchor,
    rightFootAnchor,
    leftFootAngle,
    rightFootAngle,

    groundShadow: "M 130 368 C 130 358, 270 358, 270 368 C 270 378, 130 378, 130 368 Z",
    headPath,
    headHighlightPath: "M 152 104 C 162 88, 184 82, 204 82 C 188 84, 168 92, 156 108 C 153 112, 150 110, 152 104 Z",
    headShadowPath,
    headRimPath: "M 262 106 C 267 132, 266 162, 254 186",

    screenBezelPath: screenGlassPath,
    screenCavityPath: screenGlassPath,
    screenGlassPath,
    screenGlossPath: "M 158 132 C 168 118, 184 112, 206 112 C 226 112, 238 116, 244 122 C 224 118, 192 120, 166 134 C 162 136, 158 134, 158 132 Z",

    torsoPath,
    torsoHighlightPath: "M 164 224 C 172 216, 186 214, 200 214 C 186 214, 174 218, 168 228 Z",
    torsoShadowPath: "M 160 270 C 170 284, 185 290, 200 290 C 215 290, 230 284, 240 270 C 232 280, 218 286, 200 286 C 182 286, 168 280, 160 270 Z",
    torsoRimPath: "M 242 224 L 238 276",

    neckPath: "M 188 206 L 212 206 L 210 214 L 190 214 Z",
    neckShadowPath: "M 188 206 C 196 211, 204 211, 212 206 L 210 211 C 204 214, 196 214, 190 211 Z",

    leftArmPath,
    rightArmPath,
    leftLegPath,
    rightLegPath,
  };
}

// 3D Color & Lighting Helpers for Volumetric Shading
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean || "ffffff", 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1)}`;
}

function blendColor(hex: string, targetHex: string, factor: number): string {
  const c1 = hexToRgb(hex);
  const c2 = hexToRgb(targetHex);
  return rgbToHex(
    c1.r + (c2.r - c1.r) * factor,
    c1.g + (c2.g - c1.g) * factor,
    c1.b + (c2.b - c1.b) * factor
  );
}

export function getShellShades(primaryColor: string) {
  const base = primaryColor || "#F8FAFC";
  return {
    specular: blendColor(base, "#FFFFFF", 0.85),
    highlight: blendColor(base, "#FFFFFF", 0.45),
    keyLight: blendColor(base, "#FFFFFF", 0.25),
    base,
    shadow: blendColor(base, "#0F172A", 0.35),
    deepShadow: blendColor(base, "#020617", 0.7),
    rimLight: blendColor(base, "#38BDF8", 0.4),
    outline: blendColor(base, "#020617", 0.85),
  };
}

export function getAccentShades(accentColor: string) {
  const base = accentColor || "#00E5FF";
  return {
    specular: "#FFFFFF",
    highlight: blendColor(base, "#FFFFFF", 0.6),
    keyLight: blendColor(base, "#FFFFFF", 0.3),
    base,
    shadow: blendColor(base, "#0369A1", 0.45),
    deepShadow: blendColor(base, "#020617", 0.75),
    rimLight: blendColor(base, "#FFFFFF", 0.7),
    outline: blendColor(base, "#020617", 0.85),
  };
}

export function getScreenShades(screenGlowColor: string) {
  const glow = screenGlowColor || "#00E5FF";
  return {
    specular: "#FFFFFF",
    highlight: blendColor(glow, "#FFFFFF", 0.5),
    base: glow,
    shadow: blendColor(glow, "#0284C7", 0.4),
    deepShadow: "#050811",
    glow,
  };
}

export function getMetalShades(_baseColor?: string) {
  return {
    specular: "#FFFFFF",
    highlight: "#E2E8F0",
    keyLight: "#CBD5E1",
    base: "#64748B",
    shadow: "#334155",
    deepShadow: "#0F172A",
    outline: "#020617",
  };
}

export function getRubberShades() {
  return {
    highlight: "#334155",
    base: "#1E293B",
    shadow: "#0F172A",
    deepShadow: "#020617",
    outline: "#000000",
  };
}
