import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Lock, Sparkles, Bot, ShieldCheck, Award, Layers } from "lucide-react";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import {
  AvatarSkinUnlock,
  AVATAR_SKIN_UNLOCKS,
  isAvatarSkinUnlocked,
  persistActiveBundleId,
} from "../../data/avatarSkinsData";
import { saveProfile } from "../../utils/engagementStore";

interface AvatarSkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBundleId: string;
  onSelectUnlock: (unlock: AvatarSkinUnlock) => void;
  completedLevelsCount: number;
  currentSectionNumber?: number;
  themeColor?: string;
}

export const AvatarSkinsModal: React.FC<AvatarSkinsModalProps> = ({
  isOpen,
  onClose,
  activeBundleId,
  onSelectUnlock,
  completedLevelsCount,
  currentSectionNumber = 1,
  themeColor = "purple",
}) => {
  const [selectedBundleId, setSelectedBundleId] = useState<string>(activeBundleId);
  const [testUnlockAll, setTestUnlockAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const effectiveCompletedCount = testUnlockAll ? 99 : completedLevelsCount;
  const activeUnlock =
    AVATAR_SKIN_UNLOCKS.find((u) => u.bundleId === selectedBundleId) ||
    AVATAR_SKIN_UNLOCKS[0];
  const activeBundle = activeUnlock.bundle;
  const isSelectedUnlocked = isAvatarSkinUnlocked(
    activeUnlock,
    effectiveCompletedCount,
    testUnlockAll ? 99 : currentSectionNumber
  );
  const isCurrentlyEquipped = activeBundleId === activeBundle.id;

  const handleEquip = (unlock: AvatarSkinUnlock) => {
    if (!isAvatarSkinUnlocked(unlock, effectiveCompletedCount, testUnlockAll ? 99 : currentSectionNumber)) return;
    persistActiveBundleId(unlock.bundleId);
    saveProfile({ avatarConfig: unlock.bundle.config });
    onSelectUnlock(unlock);
  };

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case "Mythic":
        return "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white border-pink-400/50 shadow-[0_0_12px_rgba(236,72,153,0.5)]";
      case "Legendary":
        return "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]";
      case "Elite":
        return "bg-gradient-to-r from-purple-600 to-indigo-600 text-purple-200 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const unlockedCount = AVATAR_SKIN_UNLOCKS.filter((u) =>
    isAvatarSkinUnlocked(u, effectiveCompletedCount, testUnlockAll ? 99 : currentSectionNumber)
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-lg bg-[#0a0f1d] border-2 border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,229,255,0.2)] flex flex-col my-auto max-h-[92vh]"
      >
        {/* =========================================================================
            1. MODAL TOP HEADER
            ========================================================================= */}
        <div className="w-full bg-[#0d1424] border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                <span>Avatar Skins & Bundles</span>
                <span className="text-xs text-cyan-400 font-mono">⚡</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Clear course sections to unlock official AIfluence robot armor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================================
            2. 3D SHOWCASE STAGE (Active Selected Robot Bundle)
            ========================================================================= */}
        <div className="relative w-full bg-gradient-to-b from-[#0e1628] via-[#090d18] to-[#0a0f1d] border-b border-white/10 p-5 flex flex-col items-center overflow-hidden">
          {/* Backlight aura */}
          <div
            className="absolute w-52 h-52 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{ background: activeBundle.accentGlow || "#00E5FF" }}
          />

          {/* Rarity and Title */}
          <div className="flex items-center gap-2 mb-2 z-10">
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getRarityBadgeStyle(
                activeBundle.rarity
              )}`}
            >
              {activeBundle.rarity}
            </span>
            <span className="text-xs text-slate-400 font-bold font-mono">
              {activeBundle.emoji} {activeUnlock.unlockTitle}
            </span>
          </div>

          {/* 2.5D Animated Robot Avatar Stage Preview */}
          <div className="relative flex flex-col items-center my-1 z-10">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
            >
              <AIfluenceAvatar
                config={activeBundle.config}
                size={160}
                mood="happy"
                animate={true}
                showBackground={false}
              />
            </motion.div>

            {/* Glowing Stage Pedestal */}
            <div className="w-40 h-6 rounded-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-2 border-white/30 shadow-[0_6px_0_#0f172a,0_0_20px_rgba(0,229,255,0.25)] flex items-center justify-center -mt-6">
              <div
                className="w-28 h-1 rounded-full blur-[1px]"
                style={{ background: activeBundle.accentGlow || "#00E5FF" }}
              />
            </div>
          </div>

          {/* Bundle Name & Tagline */}
          <h3 className="text-lg font-black text-white tracking-tight mt-2 z-10 flex items-center gap-1.5">
            <span>{activeBundle.name}</span>
          </h3>
          <p className="text-xs text-cyan-300 font-medium z-10">
            {activeBundle.tagline}
          </p>
          <p className="text-[11px] text-slate-300 text-center max-w-sm font-normal mt-1 leading-relaxed z-10">
            {activeBundle.description}
          </p>

          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-2.5 max-w-md z-10">
            {activeBundle.features.map((feat, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono"
              >
                {feat}
              </span>
            ))}
          </div>

          {/* Unlock Requirement & Equip Action Bar */}
          <div className="w-full max-w-md mt-3 pt-3 border-t border-white/10 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              {isSelectedUnlocked ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Unlocked ({activeUnlock.unlockConditionText})</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{activeUnlock.unlockConditionText}</span>
                </div>
              )}
            </div>

            {/* Equip Button */}
            {isSelectedUnlocked ? (
              <button
                onClick={() => handleEquip(activeUnlock)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:translate-y-0.5 ${
                  isCurrentlyEquipped
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 cursor-default"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border border-cyan-300 shadow-[0_4px_12px_rgba(6,182,212,0.4)]"
                }`}
              >
                {isCurrentlyEquipped ? "Equipped ✓" : "Equip Skin"}
              </button>
            ) : (
              <div className="text-[11px] font-mono text-slate-400 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                Clear Section {activeUnlock.requiredSection}
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            3. AVATAR BUNDLES GRID
            ========================================================================= */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Available Avatar Skins ({unlockedCount}/{AVATAR_SKIN_UNLOCKS.length})</span>
            </span>

            {/* Quick Test Unlock Toggle */}
            <button
              onClick={() => setTestUnlockAll((prev) => !prev)}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              {testUnlockAll ? "Reset to Actual Progress" : "Preview All (Test Mode)"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AVATAR_SKIN_UNLOCKS.map((unlock) => {
              const bundle = unlock.bundle;
              const unlocked = isAvatarSkinUnlocked(
                unlock,
                effectiveCompletedCount,
                testUnlockAll ? 99 : currentSectionNumber
              );
              const isSelected = selectedBundleId === unlock.bundleId;
              const isEquipped = activeBundleId === unlock.bundleId;

              return (
                <button
                  key={unlock.bundleId}
                  onClick={() => setSelectedBundleId(unlock.bundleId)}
                  className={`relative p-2.5 rounded-2xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-white/10 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.3)]"
                      : "bg-[#0f172a]/60 hover:bg-[#0f172a] border-white/10 hover:border-white/20"
                  } ${!unlocked ? "opacity-60" : ""}`}
                >
                  {/* Top Badge: Equipped or Locked */}
                  <div className="w-full flex items-center justify-between text-[10px]">
                    <span className="text-xs">{bundle.emoji}</span>
                    {isEquipped && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black">
                        EQUIPPED
                      </span>
                    )}
                    {!unlocked && (
                      <span className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                        <Lock className="w-3 h-3" />
                        <span>Sec {unlock.requiredSection}</span>
                      </span>
                    )}
                  </div>

                  {/* Mini Avatar Thumbnail Preview */}
                  <div className="relative py-1 flex items-center justify-center">
                    <AIfluenceAvatar
                      config={bundle.config}
                      size={65}
                      mood="idle"
                      animate={false}
                      showBackground={false}
                    />
                  </div>

                  {/* Bundle Info */}
                  <div className="w-full text-center truncate">
                    <p className="text-xs font-black text-white truncate">
                      {bundle.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate font-mono">
                      {unlock.unlockTitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            4. FOOTER NOTE
            ========================================================================= */}
        <div className="w-full bg-[#080c16] border-t border-white/10 px-5 py-3 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Levels cleared: <strong className="text-white">{effectiveCompletedCount}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
