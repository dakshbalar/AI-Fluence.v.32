import React, { useState } from "react";
import { Sparkles, Terminal, ArrowRight } from "lucide-react";

interface MapStyleAuthCardProps {
  onSuccess: () => void;
  onContinueAsGuest: () => void;
}

export const MapStyleAuthCard: React.FC<MapStyleAuthCardProps> = ({
  onSuccess,
  onContinueAsGuest,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="w-full max-w-md bg-[#0a1020]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
          <Terminal className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-1.5">
            ENTER AI FLUENCE <Sparkles className="w-4 h-4 text-pink-500" />
          </h2>
          <p className="text-xs text-slate-400">Sign in to sync your streak and battle stats</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="developer@aifluence.ai"
            className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-[0_4px_16px_rgba(0,229,255,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Sign In & Enter Map <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          Continue as Guest &rarr;
        </button>
      </div>
    </div>
  );
};
