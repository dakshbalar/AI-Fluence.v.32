import React, { useState } from "react";
import { 
  Sparkles, 
  Flame, 
  Brain, 
  Lightbulb, 
  Swords, 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Volume2, 
  Eye, 
  RefreshCw,
  Cpu,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { AIfluenceAvatar } from "./AIfluenceAvatar";
import { 
  AIFLUENCE_CHARACTER_TRIO, 
  getCharacterById, 
  getRandomDialogue,
  AIDEN_PROFILE,
  LUMI_PROFILE,
  VEX_PROFILE
} from "../../data/characters";
import { CharacterId, CharacterProfile, CharacterScenario } from "../../types/character";
import { AvatarConfig, CharacterMood } from "../../types/avatar";
import { triggerCharacterStoryEvent } from "../../utils/storyEventManager";
import { triggerFeatureExperience, generateContextualWelcomeBack } from "../../utils/featureExperienceManager";

interface CharacterTrioShowcaseProps {
  currentConfig?: AvatarConfig;
  onSelectCharacter?: (config: AvatarConfig, characterId: CharacterId) => void;
  onOpenStudio?: (config: AvatarConfig) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const CharacterTrioShowcase: React.FC<CharacterTrioShowcaseProps> = ({
  currentConfig,
  onSelectCharacter,
  onOpenStudio,
  onClose,
  isModal = false
}) => {
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>("aiden");
  const [activeMoodOverride, setActiveMoodOverride] = useState<CharacterMood | null>(null);
  const [activeScenario, setActiveScenario] = useState<CharacterScenario>("greeting");
  const [currentDialogue, setCurrentDialogue] = useState<{ text: string; mood: CharacterMood }>(() => 
    getRandomDialogue("aiden", "greeting")
  );
  const [activeTab, setActiveTab] = useState<"showcase" | "compare" | "specs" | "stories">("showcase");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const selectedChar: CharacterProfile = getCharacterById(selectedCharId);

  // Trigger Dialogue Voice Line
  const triggerDialogue = (scenario: CharacterScenario) => {
    setActiveScenario(scenario);
    const line = getRandomDialogue(selectedCharId, scenario);
    setCurrentDialogue(line);
    setActiveMoodOverride(line.mood);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2400);
  };

  // Switch Character
  const handleCharSwitch = (id: CharacterId) => {
    setSelectedCharId(id);
    setActiveMoodOverride(null);
    const line = getRandomDialogue(id, activeScenario);
    setCurrentDialogue(line);
  };

  // Current preview configuration with dynamic pose / mood
  const currentPreviewConfig: AvatarConfig = {
    ...selectedChar.baseConfig,
    customPose: activeMoodOverride || selectedChar.baseConfig.customPose
  };

  const activeMoodToRender = activeMoodOverride || selectedChar.baseConfig.customPose || "idle";

  return (
    <div className={`w-full max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
      isModal ? "bg-[#090D1A]/95 text-white" : "bg-gradient-to-b from-[#090D1A] to-[#04060C] text-white"
    }`}>
      {/* Top Header Bar */}
      <div className="p-6 pb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-red-500 p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-display tracking-tight text-white">
                AIfluence Mascot Trio
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                OFFICIAL MASCOTS
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono">
              Premium Futuristic Character System — Learn, Create & Challenge
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/40 border border-white/10">
          <button
            onClick={() => setActiveTab("showcase")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "showcase"
                ? "bg-white/15 text-white shadow-md border border-white/10"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Mascot Studio
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "compare"
                ? "bg-white/15 text-white shadow-md border border-white/10"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Trio Lineup
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "specs"
                ? "bg-white/15 text-white shadow-md border border-white/10"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Engineering Spec
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "stories"
                ? "bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 text-white shadow-md border border-pink-400/40"
                : "text-pink-300/70 hover:text-pink-200"
            }`}
          >
            Story Moments 💬
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "showcase" && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Character Switcher & 3D Interactive Stage (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 3-Way Mascot Selector Cards */}
            <div className="grid grid-cols-3 gap-3">
              {AIFLUENCE_CHARACTER_TRIO.map((char) => {
                const isSelected = selectedCharId === char.id;
                const roleIcon = 
                  char.role === "learn" ? <Brain className="w-3.5 h-3.5" /> :
                  char.role === "create" ? <Lightbulb className="w-3.5 h-3.5" /> :
                  <Swords className="w-3.5 h-3.5" />;

                return (
                  <button
                    key={char.id}
                    onClick={() => handleCharSwitch(char.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                      isSelected
                        ? "bg-white/[0.08] border-white/30 shadow-[0_0_25px_rgba(0,0,0,0.5)] scale-[1.02]"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Active Accent Glow Bar */}
                    {isSelected && (
                      <div 
                        className="absolute top-0 left-0 right-0 h-1 shadow-sm"
                        style={{ backgroundColor: char.themeColor }}
                      />
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <span 
                        className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 border"
                        style={{
                          backgroundColor: `${char.themeColor}15`,
                          color: char.themeColor,
                          borderColor: `${char.themeColor}30`
                        }}
                      >
                        {roleIcon}
                        {char.badge}
                      </span>
                      <span className="text-[10px] font-mono text-white/30">{char.id.toUpperCase()}</span>
                    </div>

                    <div className="font-display font-black text-base text-white tracking-wide">
                      {char.name}
                    </div>
                    <div className="text-[11px] text-white/50 font-mono truncate">
                      {char.roleTitle.split(" ")[0]} {char.roleTitle.split(" ")[1]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 3D Holographic Mascot Pedestal */}
            <div className={`relative rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center overflow-hidden min-h-[420px] bg-gradient-to-b ${selectedChar.palette.backgroundGrad}`}>
              {/* Background Cyber Grid Floor */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{
                  backgroundImage: `radial-gradient(${selectedChar.themeColor} 1px, transparent 1px)`,
                  backgroundSize: "24px 24px"
                }}
              />

              {/* Dynamic Aura Glow behind avatar */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: selectedChar.themeColor }}
              />

              {/* Character Floating Dialogue Bubble */}
              <div className="relative z-10 mb-4 max-w-md w-full animate-fade-in">
                <div 
                  className={`p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 relative ${
                    isSpeaking 
                      ? "bg-black/80 border-white/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] scale-105" 
                      : "bg-black/60 border-white/10 shadow-lg"
                  }`}
                  style={{
                    borderLeftColor: selectedChar.themeColor,
                    borderLeftWidth: "4px"
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" style={{ color: selectedChar.themeColor }} />
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-white/70">
                        {selectedChar.name} AI VOICE SYNTH
                      </span>
                    </div>
                    <span 
                      className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${selectedChar.themeColor}20`,
                        color: selectedChar.themeColor
                      }}
                    >
                      {activeMoodToRender}
                    </span>
                  </div>
                  <p className="text-sm font-sans text-white/90 leading-relaxed font-medium">
                    "{currentDialogue.text}"
                  </p>
                </div>
              </div>

              {/* The Live Interactive Avatar */}
              <div className="relative z-10 flex flex-col items-center">
                <AIfluenceAvatar
                  config={currentPreviewConfig}
                  size={120}
                  mood={activeMoodToRender}
                  showBackground={false}
                  className="filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-300"
                />

                {/* Pedestal Laser Plate */}
                <div className="relative -mt-4 w-48 h-6 flex items-center justify-center pointer-events-none">
                  <div 
                    className="w-40 h-3 rounded-[100%] opacity-60 blur-[2px] transition-colors duration-500"
                    style={{ backgroundColor: selectedChar.themeColor }}
                  />
                  <div className="absolute inset-0 border-t border-white/20 rounded-[100%]" />
                </div>
              </div>

              {/* Bottom Quick Status Strip */}
              <div className="relative z-10 mt-4 flex items-center gap-4 text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: selectedChar.themeColor }} />
                  ONLINE
                </span>
                <span>•</span>
                <span>{selectedChar.codename}</span>
                <span>•</span>
                <span>{selectedChar.archetype}</span>
              </div>
            </div>

            {/* Quick Companion Equip Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectCharacter?.(selectedChar.baseConfig, selectedChar.id)}
                className="flex-1 py-3 px-6 rounded-2xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: selectedChar.themeColor,
                  color: selectedChar.id === "vex" ? "#FFFFFF" : "#000000"
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Equip {selectedChar.name} as Companion</span>
              </button>

              {onOpenStudio && (
                <button
                  onClick={() => onOpenStudio(selectedChar.baseConfig)}
                  className="py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-bold text-white/90 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>Customize in Studio</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Poses & Scenario Dialogue Simulator (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Signature Poses & Expressions Studio */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: selectedChar.themeColor }} />
                  <h3 className="text-xs font-mono font-black uppercase text-white tracking-wider">
                    {selectedChar.name} Signature Poses
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-white/40">Click to animate</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {selectedChar.signaturePoses.map((pose) => {
                  const isActive = activeMoodToRender === pose.id;
                  return (
                    <button
                      key={pose.id}
                      onClick={() => setActiveMoodOverride(pose.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-white/15 border-white/40 shadow-sm"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono font-bold text-white truncate">
                          {pose.name}
                        </span>
                        <span 
                          className="text-[9px] font-mono px-1 rounded"
                          style={{
                            backgroundColor: `${selectedChar.themeColor}15`,
                            color: selectedChar.themeColor
                          }}
                        >
                          {pose.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/40 line-clamp-2 leading-tight">
                        {pose.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Scenario Dialogue Simulator */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" style={{ color: selectedChar.themeColor }} />
                  <h3 className="text-xs font-mono font-black uppercase text-white tracking-wider">
                    Contextual Learning Dialogue
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-white/40">Test reactions</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => triggerDialogue("lesson_intro")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center gap-2 ${
                    activeScenario === "lesson_intro" ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lesson Intro</span>
                </button>

                <button
                  onClick={() => triggerDialogue("hint_thinking")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center gap-2 ${
                    activeScenario === "hint_thinking" ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Thinking Hint</span>
                </button>

                <button
                  onClick={() => triggerDialogue("correct_celebration")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center gap-2 ${
                    activeScenario === "correct_celebration" ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Correct Win</span>
                </button>

                <button
                  onClick={() => triggerDialogue("incorrect_guidance")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center gap-2 ${
                    activeScenario === "incorrect_guidance" ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mistake Review</span>
                </button>

                <button
                  onClick={() => triggerDialogue("streak_milestone")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center gap-2 ${
                    activeScenario === "streak_milestone" ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Streak Fire</span>
                </button>

                <button
                  onClick={() => triggerDialogue("challenge_start")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center gap-2 ${
                    activeScenario === "challenge_start" ? "bg-white/10 border-white/30 text-white" : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  <span>Boss Trial</span>
                </button>
              </div>
            </div>

            {/* 3. Personality & Visual Traits Pill Sheet */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-mono font-black uppercase text-white tracking-wider">
                Personality & Identity
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                {selectedChar.designBio}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedChar.personalityTraits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-white/80"
                  >
                    • {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lineup View: Side-by-Side Trio Comparison */}
      {activeTab === "compare" && (
        <div className="p-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-black font-display text-white">
              The AIfluence Robot Species
            </h3>
            <p className="text-xs text-white/60 font-mono">
              Three distinct identities sharing the same modular robotics architecture, capsule screen-face, and premium material language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AIFLUENCE_CHARACTER_TRIO.map((char) => (
              <div
                key={char.id}
                className="bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Accent Top Strip */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: char.themeColor }}
                />

                {/* Character Badge */}
                <div 
                  className="px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest uppercase mb-4 border"
                  style={{
                    backgroundColor: `${char.themeColor}15`,
                    color: char.themeColor,
                    borderColor: `${char.themeColor}40`
                  }}
                >
                  {char.role.toUpperCase()} COMPANION
                </div>

                {/* Avatar Display */}
                <div className="my-2 relative">
                  <AIfluenceAvatar
                    config={char.baseConfig}
                    size={95}
                    mood={char.baseConfig.customPose || "idle"}
                    showBackground={true}
                    className="rounded-2xl shadow-xl"
                  />
                </div>

                <h4 className="text-lg font-black font-display text-white mt-4">
                  {char.name}
                </h4>
                <p className="text-xs text-white/50 font-mono mb-3">
                  {char.tagline}
                </p>

                <div className="w-full bg-white/5 rounded-xl p-3 text-left space-y-1.5 my-3 border border-white/5">
                  <div className="text-[10px] font-mono text-white/40 uppercase">Core Role</div>
                  <div className="text-xs font-bold text-white/90">{char.roleTitle}</div>
                  <div className="text-[11px] text-white/60 font-sans italic">"{char.quote}"</div>
                </div>

                <button
                  onClick={() => {
                    handleCharSwitch(char.id);
                    setActiveTab("showcase");
                  }}
                  className="w-full mt-auto py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/15 bg-white/5 hover:bg-white/15 text-white cursor-pointer"
                >
                  <span>Inspect {char.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engineering Spec & Design Language Tab */}
      {activeTab === "specs" && (
        <div className="p-6 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-black font-display text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Unified Robotics Architecture & Differentiation Strategy
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              To achieve the recognizable brand presence of Duolingo's Duo while maintaining a premium 3D tech SaaS identity, all three AIfluence characters share identical joint sockets, 2-bone inverse kinematics chains, and screen-cavity head geometry. They are differentiated through silhouette volume, material coatings, lighting spectral signatures, and eye expression language.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-2">
                <div className="text-cyan-400 font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> AIDEN — Learn
                </div>
                <p className="text-[11px] text-white/60 font-mono leading-relaxed">
                  <strong>Frame:</strong> Balanced compact geometry<br />
                  <strong>Materials:</strong> Matte navy polymer + cyan joint rings<br />
                  <strong>Core:</strong> AIfluence illuminated icon<br />
                  <strong>Optics:</strong> Large digital crescent pupils
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-purple-500/20 space-y-2">
                <div className="text-purple-400 font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> LUMI — Create
                </div>
                <p className="text-[11px] text-white/60 font-mono leading-relaxed">
                  <strong>Frame:</strong> Aerodynamic panoramic visor & curved hips<br />
                  <strong>Materials:</strong> Deep indigo + magenta plasma conduits<br />
                  <strong>Core:</strong> Prismatic XP quantum crystal<br />
                  <strong>Optics:</strong> Sleek glamour cat-eye with twin sparkles
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 space-y-2">
                <div className="text-red-400 font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                  <Swords className="w-4 h-4" /> VEX — Challenge
                </div>
                <p className="text-[11px] text-white/60 font-mono leading-relaxed">
                  <strong>Frame:</strong> Fortified heavy armor & angular radiators<br />
                  <strong>Materials:</strong> Matte obsidian carbon + gunmetal<br />
                  <strong>Core:</strong> High-output photon reactor<br />
                  <strong>Optics:</strong> Narrowed predatory slits & lock-on reticles
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Moments Tab: Trigger and Test In-App Trio Encounters */}
      {activeTab === "stories" && (
        <div className="p-6 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-black font-display text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-400" />
                Character Story Event Engine (Duolingo-Style In-App Encounters)
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold">
                REUSABLE ENGINE
              </span>
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Instead of full-screen takeovers or disruptive pages, Aiden, Lumi, and Vex seamlessly enter into the active dashboard with a smooth dark overlay and trigger short, rich interactive story beats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Daily Welcome Sync */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-cyan-950/20 to-black/60 border border-cyan-500/30 flex flex-col justify-between gap-4 shadow-lg hover:border-cyan-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-400/30">
                    DAILY BRIEFING
                  </span>
                  <span className="text-xs text-slate-400 font-mono">1st Login Today</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🌅 Morning Sync with Aiden, Lumi & Vex</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  The trio enters from the right side. Aiden welcomes you back, Lumi calculates pending XP (+120 XP), Vex dares you to claim it, and Lumi reveals today's locked objective targets.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerCharacterStoryEvent("daily_welcome");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
              >
                <span>Launch Daily Story Beat 🚀</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* 2. Failed Challenge Diagnostics */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/40 via-purple-950/20 to-black/60 border border-red-500/30 flex flex-col justify-between gap-4 shadow-lg hover:border-red-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-300 font-mono text-[10px] font-bold border border-red-400/30">
                    VEX CHALLENGE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">On 3 Fails</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>💥 Vex Roast & Diagnostics</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "You had three attempts. And somehow... you used all three." Vex challenges you while Aiden provides debugging encouragement and Lumi offers stack trace hints.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerCharacterStoryEvent("failed_challenge");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                <span>Test Failed Challenge Story ⚡</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* 3. 7-Day Streak Milestone */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-950/40 via-amber-950/20 to-black/60 border border-orange-500/30 flex flex-col justify-between gap-4 shadow-lg hover:border-orange-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 text-orange-300 font-mono text-[10px] font-bold border border-orange-400/30">
                    MILESTONE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Streak Event</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🔥 7-Day Streak Celebration</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "Seven days! Okay, you're actually becoming dangerous." Aiden and Vex acknowledge your consistency while Lumi unlocks +250 streak bonus XP.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerCharacterStoryEvent("streak_milestone");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
              >
                <span>Play Streak Celebration 🎉</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* 4. Project Completed / Mastery */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-pink-950/20 to-black/60 border border-purple-500/30 flex flex-col justify-between gap-4 shadow-lg hover:border-purple-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-400/30">
                    PATH UNLOCK
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Academy Win</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🗺️ Path Advancement Briefing</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "I've updated your learning path. You're ready for something harder." Lumi recalibrates your roadmap while Aiden praises your clean architecture.
                </p>
              </div>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerCharacterStoryEvent("project_completed");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer"
              >
                <span>Play Path Mastery Beat 🗺️</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* FULL-SCREEN FEATURE INTRODUCTION EXPERIENCES (NEW SYSTEM)     */}
          {/* ------------------------------------------------------------- */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-pink-300 flex items-center gap-2">
                <Sparkles size={14} className="text-pink-400" />
                <span>Full-Screen Character Feature Introductions & Welcome Back</span>
              </h4>
              <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold border border-pink-500/30">
                FULL-PAGE SYSTEM
              </span>
            </div>
            <p className="text-xs text-white/60">
              Test every contextual Welcome Back state and feature introduction powered by the unified full-screen character engine:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience(generateContextualWelcomeBack({ forcedReason: "daily_sync" }));
                }}
                className="p-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-cyan-400 font-bold">WELCOME BACK</div>
                <div className="text-xs text-white font-semibold group-hover:text-cyan-200">Daily Sync (+120 XP)</div>
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience(generateContextualWelcomeBack({ forcedReason: "after_lesson" }));
                }}
                className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 hover:border-blue-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-blue-400 font-bold">WELCOME BACK</div>
                <div className="text-xs text-white font-semibold group-hover:text-blue-200">After Lesson Momentum</div>
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience(generateContextualWelcomeBack({ forcedReason: "after_break" }));
                }}
                className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 hover:border-amber-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-amber-400 font-bold">WELCOME BACK</div>
                <div className="text-xs text-white font-semibold group-hover:text-amber-200">After Break Recovery</div>
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience("streak_goals");
                }}
                className="p-2.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/30 hover:border-orange-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-orange-400 font-bold">FEATURE INTRO</div>
                <div className="text-xs text-white font-semibold group-hover:text-orange-200">Streak Pacing Goal 🎯</div>
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience("home_screen_widget");
                }}
                className="p-2.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/30 hover:border-pink-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-pink-400 font-bold">FEATURE INTRO</div>
                <div className="text-xs text-white font-semibold group-hover:text-pink-200">Home Screen Widget 📱</div>
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience("smart_reminders");
                }}
                className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 hover:border-red-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-red-400 font-bold">FEATURE INTRO</div>
                <div className="text-xs text-white font-semibold group-hover:text-red-200">Streak Defender Alerts 🔔</div>
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience("algo_attack_arena");
                }}
                className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 hover:border-red-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-red-400 font-bold">NEW MODE</div>
                <div className="text-xs text-white font-semibold group-hover:text-red-200">Algo Attack Arena ⚔️</div>
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience("xp_crystal_surge");
                }}
                className="p-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-cyan-400 font-bold">REWARD DROP</div>
                <div className="text-xs text-white font-semibold group-hover:text-cyan-200">XP Crystal Surge 💎</div>
              </button>

              <button
                onClick={() => {
                  if (onClose) onClose();
                  triggerFeatureExperience("achievement_master_architect");
                }}
                className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 text-left transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-purple-400 font-bold">ACHIEVEMENT</div>
                <div className="text-xs text-white font-semibold group-hover:text-purple-200">Master Architect 🏅</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
