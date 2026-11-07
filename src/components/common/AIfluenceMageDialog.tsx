import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Wand2 } from "lucide-react";

interface AIfluenceMageDialogProps {
  message?: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  autoCloseSeconds?: number;
}

export const AIfluenceMageDialog: React.FC<AIfluenceMageDialogProps> = ({
  message = "A wise engineer builds step by step. Keep your momentum going!",
  title = "Aiden the AI Mage",
  isOpen,
  onClose,
  autoCloseSeconds = 6,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseSeconds * 1000);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseSeconds, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-sky-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(56,189,248,0.25)] text-white flex items-start gap-3.5"
      >
        {/* Mage Avatar Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-900 border-2 border-sky-400/60 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
          <Wand2 className="w-6 h-6 text-cyan-300 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-sky-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {title}
            </span>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {message}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
