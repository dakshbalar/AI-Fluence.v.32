import React from "react";
import { StudentProfile } from "../../types/engagement";
import { Sparkles, MapPin } from "lucide-react";

interface PersonalizedPathMapViewProps {
  pathPlan?: any;
  studentProfile?: StudentProfile;
  onOpenAvatarStudio?: () => void;
  onSelectNodeAction?: (actionType: string, target?: string) => void;
}

export const PersonalizedPathMapView: React.FC<PersonalizedPathMapViewProps> = ({
  studentProfile,
  onOpenAvatarStudio,
  onSelectNodeAction,
}) => {
  return (
    <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-4xl w-full mx-auto shadow-2xl relative text-left">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white font-mono flex items-center gap-2">
            HOLOGRAPHIC QUEST MAP <Sparkles className="w-5 h-5 text-cyan-400" />
          </h2>
          <p className="text-xs text-slate-400">
            Explorer: {studentProfile?.username || "Adventurer"} | Path Calibrated
          </p>
        </div>
        {onOpenAvatarStudio && (
          <button
            onClick={onOpenAvatarStudio}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30"
          >
            Avatar Studio
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { id: "html", name: "Semantic Web Realm", desc: "HTML & DOM trees" },
          { id: "dsa", name: "Algorithm Sanctum", desc: "Two pointers & sorting" },
          { id: "ai", name: "Neural Nexus", desc: "LLMs, RAG & agents" },
        ].map((node) => (
          <div
            key={node.id}
            onClick={() => onSelectNodeAction?.("launch", node.id)}
            className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-400 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{node.name}</span>
            </div>
            <p className="text-xs text-slate-400">{node.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedPathMapView;
