import React from "react";
import { X, Award, Gem } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { COC_LEAGUES, getLeagueForTrophies } from "../../data/leaguesData";
import { LeagueEmblem } from "./LeagueEmblem";

interface LeaguesOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserXp?: number;
  currentUserTrophies?: number;
}

export const LeaguesOverviewModal: React.FC<LeaguesOverviewModalProps> = ({
  isOpen,
  onClose,
  currentUserXp,
  currentUserTrophies,
}) => {
  const trophies = currentUserTrophies ?? currentUserXp ?? 0;
  const currentTier = getLeagueForTrophies(trophies);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="w-full max-w-lg bg-[#0b0b0e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-left relative"
          >
            {/* Top Header */}
            <div className="bg-[#111116] border-b border-white/10 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-inner">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide uppercase">
                    Clash Leagues Roadmap
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Earn Trophies to advance through competitive tiers
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Current League Quick Banner */}
            <div className="px-5 py-3 bg-[#111116] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <LeagueEmblem
                  leagueId={currentTier.id}
                  subTier={currentTier.subTier}
                  size="sm"
                />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                    Your Current League
                  </span>
                  <span className="text-sm font-black text-white">
                    {currentTier.fullName}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-black text-amber-300 block">
                  🏆 {trophies.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  +{currentTier.bonusPercentage}% XP Bonus
                </span>
              </div>
            </div>

            {/* Scrollable list of Leagues */}
            <div className="p-4 space-y-2.5 overflow-y-auto flex-1 divide-y divide-white/5">
              {COC_LEAGUES.map((tier) => {
                const isCurrent = tier.fullName === currentTier.fullName;
                const minT = tier.minTrophies ?? tier.minXp;
                const maxT = tier.maxTrophies ?? tier.maxXp;
                const isUnlocked = trophies >= minT;

                return (
                  <div
                    key={tier.fullName}
                    className={`pt-2.5 first:pt-0 rounded-2xl p-3 transition-all ${
                      isCurrent
                        ? "bg-amber-400/10 border border-amber-400/50 shadow-md"
                        : isUnlocked
                        ? "bg-white/[0.03] border border-white/10 hover:border-white/20"
                        : "bg-black/40 border border-white/5 opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <LeagueEmblem
                          leagueId={tier.id}
                          subTier={tier.subTier}
                          size="md"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-extrabold truncate ${
                                isCurrent
                                  ? "text-amber-300 font-black"
                                  : "text-white"
                              }`}
                            >
                              {tier.fullName}
                            </h4>
                            {isCurrent && (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {tier.description}
                          </p>
                        </div>
                      </div>

                      {/* Trophies & Rewards */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-black text-amber-400 block">
                          {maxT === 999999
                            ? `${minT.toLocaleString()}+ 🏆`
                            : `${minT.toLocaleString()} - ${maxT.toLocaleString()} 🏆`}
                        </span>
                        <div className="flex items-center justify-end gap-2 text-[10px] text-slate-300 font-mono mt-0.5">
                          <span className="text-sky-300 font-bold">
                            +{tier.bonusPercentage}% XP
                          </span>
                          <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                            <Gem className="w-2.5 h-2.5" />
                            {tier.dailyGemsBonus}/d
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Dismiss */}
            <div className="p-3 bg-[#111116] border-t border-white/10 text-center shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Roadmap
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
