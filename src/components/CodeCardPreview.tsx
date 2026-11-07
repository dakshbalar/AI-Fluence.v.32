import React from "react";

export function CodeCardPreview({ type = "html" }: { type?: string }) {
  return (
    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 font-mono text-xs text-cyan-400">
      &lt;/{type.toUpperCase()}&gt; PREVIEW
    </div>
  );
}

export default CodeCardPreview;
