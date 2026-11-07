import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ShieldCheck,
  Search,
  Database,
  Hash,
  BookOpen,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { usedQuestionsRegistry } from "../../services/usedQuestionsRegistry";
import { UsedQuestionRecord } from "../../types/curriculum";

interface UsedQuestionsRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsedQuestionsRegistryModal: React.FC<UsedQuestionsRegistryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [records, setRecords] = useState<UsedQuestionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>("ALL");
  const [stats, setStats] = useState(usedQuestionsRegistry.getStats());

  useEffect(() => {
    if (isOpen) {
      setRecords(usedQuestionsRegistry.getAllRecords());
      setStats(usedQuestionsRegistry.getStats());
    }
  }, [isOpen]);

  const handleRefresh = () => {
    setRecords(usedQuestionsRegistry.getAllRecords());
    setStats(usedQuestionsRegistry.getStats());
  };

  if (!isOpen) return null;

  const filteredRecords = records.filter((r) => {
    const matchesBook =
      selectedBookFilter === "ALL" || r.level_id.startsWith(`${selectedBookFilter}-`);
    const matchesQuery =
      searchQuery === "" ||
      r.level_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.question_hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.angle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBook && matchesQuery;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-gradient-to-b from-[#0b1220] via-[#070d18] to-[#03060c] border-2 border-emerald-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-700/50">
                    Section 5.2 Registry
                  </span>
                  <span className="text-xs text-slate-400">Zero-Collision Tracker</span>
                </div>
                <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                  Used Questions SHA-256 Registry
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh registry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-950/60 border-b border-white/10">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Hashed</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">{stats.totalQuestionsRegistered}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-[10px] uppercase font-bold text-cyan-400">Prompt Eng (PE)</div>
              <div className="text-lg font-black text-white mt-0.5">{stats.byBook.PE}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-[10px] uppercase font-bold text-purple-400">Fine-Tuning (FT)</div>
              <div className="text-lg font-black text-white mt-0.5">{stats.byBook.FT}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-[10px] uppercase font-bold text-amber-400">RAG & AFE</div>
              <div className="text-lg font-black text-white mt-0.5">{stats.byBook.RAG + stats.byBook.AFE}</div>
            </div>
          </div>

          {/* Filter / Search Bar */}
          <div className="p-4 border-b border-white/10 flex flex-wrap gap-2.5 items-center justify-between">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search level ID, hash, or angle..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-1">
              {["ALL", "PE", "FT", "RAG", "AFE"].map((bk) => (
                <button
                  key={bk}
                  onClick={() => setSelectedBookFilter(bk)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    selectedBookFilter === bk
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {bk}
                </button>
              ))}
            </div>
          </div>

          {/* Records Table */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60">
                      {rec.level_id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/60">
                      {rec.angle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] truncate max-w-sm">
                    <Hash className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{rec.question_hash}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p>Registry active. Start levels to populate and verify zero-collision hashes.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Lifetime Deduplication Enforced
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
