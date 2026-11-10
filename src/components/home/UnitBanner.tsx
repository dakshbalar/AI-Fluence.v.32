import React, { useState } from "react";
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2, Layers } from "lucide-react";

export type UnitBannerTheme = "purple" | "green" | "red" | "blue" | "emerald" | "cyan" | "amber" | "yellow";

export interface SectionSummaryItem {
  sectionNumber: number;
  sectionTitle: string;
  unitNumber: number;
  unitTitle: string;
  levelCount?: number;
  completedCount?: number;
  isUnlocked?: boolean;
}

interface UnitBannerProps {
  sectionNumber: number;
  totalSections?: number;
  unitNumber: number;
  unitTitle: string;
  courseName: string;
  themeColor?: UnitBannerTheme;
  allSections?: SectionSummaryItem[];
  activeTrack?: "theory" | "questions";
  hasBothTracks?: boolean;
  activeSubjectName?: string;
  onSelectTrack?: (track: "theory" | "questions") => void;
  onSelectSection?: (sectionNumber: number) => void;
  onNextSection?: () => void;
  onPrevSection?: () => void;
  onOpenGuidebook?: () => void;
  onOpenSections?: () => void;
}

export const UnitBanner: React.FC<UnitBannerProps> = ({
  sectionNumber = 1,
  totalSections = 4,
  unitTitle,
  courseName = "AI for Everyone",
  themeColor = "yellow",
  allSections = [],
  onSelectSection,
  onPrevSection,
  onNextSection,
  onOpenGuidebook,
  onOpenSections,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Map themeColor or courseName to track key for data-track attributes
  const trackKey = (themeColor === "purple" || courseName.toLowerCase().includes("dsa") || courseName.toLowerCase().includes("cpp") || courseName.toLowerCase().includes("data"))
    ? "dsa"
    : (themeColor === "yellow" || themeColor === "amber" || courseName.toLowerCase().includes("everyone"))
    ? "everyone"
    : (themeColor === "blue" || courseName.toLowerCase().includes("genai") || courseName.toLowerCase().includes("generative"))
    ? "genai"
    : (themeColor === "green" || themeColor === "emerald")
    ? "green"
    : (themeColor === "red")
    ? "red"
    : themeColor === "cyan"
    ? "cyan"
    : "dsa";

  return (
    <div className="w-full select-none relative z-40 font-kanit" data-track={trackKey}>
      {/* 3D Curved Section Banner (.sec) */}
      <div className="sec relative rounded-[32px] p-4 flex gap-2.5 items-center color-inherit transition-all">
        <div className="flex-1 min-w-0 text-left">
          {/* Section Chip Button (.chip) - Toggles Section Dropdown */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="chip text-[0.68rem] font-medium tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full truncate border-0 cursor-pointer max-w-full inline-flex items-center gap-1.5 active:scale-95 transition-transform"
            title="Click to switch section"
          >
            <span className="truncate">{courseName} · Section {sectionNumber} of {totalSections} ▾</span>
          </button>

          {/* Section Title */}
          <h2
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="font-extrabold text-xl sm:text-2xl leading-snug mt-2 text-inherit line-clamp-2 break-words cursor-pointer hover:opacity-90"
          >
            {unitTitle}
          </h2>
        </div>

        {/* Action Square Buttons (.sb & .sq) */}
        <div className="sb flex gap-1.5 sm:gap-2 shrink-0 items-center flex-nowrap">
          {onPrevSection && sectionNumber > 1 && (
            <button
              onClick={onPrevSection}
              className="sq w-[44px] h-[48px] rounded-[16px] border-2 border-black/35 bg-black/20 color-inherit grid place-items-center active:scale-95 transition-transform cursor-pointer"
              aria-label="Previous section"
              title="Previous Section"
            >
              <ChevronLeft className="w-5.5 h-5.5 stroke-[2.6]" />
            </button>
          )}

          {onNextSection && sectionNumber < totalSections && (
            <button
              onClick={onNextSection}
              className="sq w-[44px] h-[48px] rounded-[16px] border-2 border-black/35 bg-black/20 color-inherit grid place-items-center active:scale-95 transition-transform cursor-pointer"
              aria-label="Next section"
              title="Next Section"
            >
              <ChevronRight className="w-5.5 h-5.5 stroke-[2.6]" />
            </button>
          )}

          {onOpenGuidebook && (
            <button
              onClick={onOpenGuidebook}
              className="sq w-[44px] h-[48px] rounded-[16px] border-2 border-black/35 bg-black/20 color-inherit grid place-items-center active:scale-95 transition-transform cursor-pointer"
              aria-label="Theory"
              title="Open Theory Guidebook"
            >
              <BookOpen className="w-5.5 h-5.5 stroke-[2.2]" />
            </button>
          )}
        </div>
      </div>

      {/* Section Dropdown Overlay (.dd) - Placed OUTSIDE .sec so overflow: hidden on .sec does NOT clip it! */}
      <div className={`dd ${isDropdownOpen ? "show" : ""}`}>
        <div className="px-3.5 py-2 mb-1 text-[11px] font-mono font-bold tracking-wider uppercase text-white/80 border-b border-white/10 flex items-center justify-between">
          <span>SWITCH SECTION</span>
          {onOpenSections ? (
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onOpenSections();
              }}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>FULL CURRICULUM</span>
            </button>
          ) : (
            <span className="text-[var(--b1)] font-extrabold">SECTION {sectionNumber}/{totalSections}</span>
          )}
        </div>

        <div className="space-y-1 max-h-[280px] overflow-y-auto">
          {allSections.length > 0 ? (
            allSections.map((sec) => {
              const isCurrent = sec.sectionNumber === sectionNumber;
              const completed = sec.completedCount !== undefined ? sec.completedCount : 0;
              const total = sec.levelCount || 5;
              const isDone = completed >= total;

              return (
                <button
                  key={sec.sectionNumber}
                  onClick={() => {
                    onSelectSection?.(sec.sectionNumber);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[16px] text-left font-medium text-sm transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[rgba(var(--rgb),.3)] font-bold text-white border-2 border-[var(--bd)] shadow-[0_0_16px_rgba(var(--rgb),.4)]"
                      : "hover:bg-white/10 text-[var(--fg)] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isCurrent ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-white/30 grid place-items-center text-[10px] text-white/60 shrink-0 font-mono">
                        {sec.sectionNumber}
                      </span>
                    )}
                    <span className="truncate">
                      Section {sec.sectionNumber}: {sec.unitTitle || sec.sectionTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-white text-black shadow-sm">
                        CURRENT
                      </span>
                    )}
                    <small className="font-mono font-semibold text-[0.65rem] tracking-[0.08em] opacity-75">
                      {isDone ? "DONE (5/5)" : `${completed}/${total}`}
                    </small>
                  </div>
                </button>
              );
            })
          ) : (
            Array.from({ length: totalSections }).map((_, idx) => {
              const num = idx + 1;
              const isCurrent = num === sectionNumber;
              return (
                <button
                  key={num}
                  onClick={() => {
                    onSelectSection?.(num);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[16px] text-left font-medium text-sm transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[rgba(var(--rgb),.3)] font-bold text-white border-2 border-[var(--bd)] shadow-[0_0_16px_rgba(var(--rgb),.4)]"
                      : "hover:bg-white/10 text-[var(--fg)] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>Section {num}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-white text-black shadow-sm">
                        CURRENT
                      </span>
                    )}
                    <small className="font-mono font-semibold text-[0.65rem] tracking-[0.08em] opacity-75">
                      {isCurrent ? "ACTIVE" : "SELECT"}
                    </small>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
