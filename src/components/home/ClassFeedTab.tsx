import React, { useState, useEffect } from "react";
import { Flame, Heart, Sparkles, Users, Award, MessageSquare, ThumbsUp, Send } from "lucide-react";
import {
  ClassFeedPost,
  ClassStreakBoardStats,
  getStoredClassFeedPosts,
  toggleLikeClassFeedPost,
  addReactionToClassFeedPost,
  getClassStreakBoardStats,
} from "../../services/classFeedService";
import { auth } from "../../firebase";

interface ClassFeedTabProps {
  onShowToast?: (msg: string) => void;
}

export const ClassFeedTab: React.FC<ClassFeedTabProps> = ({ onShowToast }) => {
  const [posts, setPosts] = useState<ClassFeedPost[]>(getStoredClassFeedPosts);
  const [stats, setStats] = useState<ClassStreakBoardStats>(getClassStreakBoardStats);
  const currentUid = auth.currentUser?.uid || "guest_user";

  const handleLike = (postId: string) => {
    const updated = toggleLikeClassFeedPost(postId);
    setPosts(updated);
    onShowToast?.("❤️ Liked classmate victory!");
  };

  const handleReaction = (postId: string, emoji: string) => {
    const updated = addReactionToClassFeedPost(postId, emoji);
    setPosts(updated);
    onShowToast?.(`Sent ${emoji} encouragement!`);
  };

  return (
    <div className="w-full space-y-6 select-none text-left">
      {/* 1. LIVE CLASS STREAK BOARD BANNER */}
      <div className="rounded-[32px] p-5 sm:p-6 bg-[#121418] border-2 border-amber-400/40 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white uppercase font-kanit tracking-wide">
              {stats.className}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
            CLASS PARTICIPATION: {stats.completionPercentage}%
          </span>
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
              Completed Today
            </span>
            <span className="text-lg font-black font-mono text-emerald-400">
              🔥 {stats.todayCompletedCount} / {stats.totalStudents}
            </span>
          </div>

          <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
              In Progress
            </span>
            <span className="text-lg font-black font-mono text-sky-400">
              ⚡ {stats.todayInProgressCount} Students
            </span>
          </div>

          <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
              Top Active Streak
            </span>
            <span className="text-lg font-black font-mono text-amber-300">
              🔥 {stats.topStreaks[0]?.currentStreak || 15} Days
            </span>
          </div>

          <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
              Total Class XP Today
            </span>
            <span className="text-lg font-black font-mono text-purple-400">
              ✨ {stats.todayTotalClassXp} XP
            </span>
          </div>
        </div>

        {/* Top 3 Longest Active Streaks Podium */}
        <div className="bg-[#161a22] border border-white/10 rounded-2xl p-3.5 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 block">
            🏆 CLASS STREAK LEADERBOARD
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {stats.topStreaks.map((m, idx) => (
              <div
                key={m.uid}
                className="p-2.5 rounded-xl bg-[#0c0e12] border border-white/10 flex items-center gap-2.5"
              >
                <span className="text-base font-bold">
                  {idx === 0 ? "👑" : idx === 1 ? "🥈" : "🥉"}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0"
                  style={{ backgroundColor: m.avatarBg }}
                >
                  {m.studentName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-white truncate block font-kanit">
                    {m.studentName}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    🔥 {m.currentStreak} Days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CLASSROOM ACHIEVEMENT FEED */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm sm:text-base font-black text-white uppercase font-kanit tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>STUDENT VICTORY FEED ({posts.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">CLASSROOM UPDATES</span>
        </div>

        {posts.map((post) => {
          const isLiked = Boolean(post.likesMap && post.likesMap[currentUid]);

          return (
            <div
              key={post.postId}
              className="rounded-3xl p-5 sm:p-6 bg-[#121418] border-2 border-white/15 shadow-xl space-y-4 transition-all hover:border-amber-400/40"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0 border border-white/20 shadow-md"
                    style={{ backgroundColor: post.avatarBg || "#0284c7" }}
                  >
                    {post.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white font-kanit">
                      {post.studentName}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400 font-bold block">
                      🔥 {post.streakCount}-DAY STREAK VICTORY
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(post.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Achievement Card Body */}
              <div className="bg-[#161a22] border border-amber-400/30 rounded-2xl p-4 text-center space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest font-mono">
                  AI PIONEERS · DAILY VICTORY
                </span>
                <div className="flex items-center justify-center gap-2 text-3xl font-black font-kanit text-amber-300">
                  <span>🔥</span>
                  <span>{post.streakCount} DAY STREAK</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-300">
                  <span>✅ {post.questsCompleted}/5 Quests</span>
                  <span>⏱️ {post.learningMinutes} Mins</span>
                  <span className="text-amber-300 font-bold">+{post.xpEarned} XP</span>
                </div>
              </div>

              {/* Like & Encouragement Reactions Bar */}
              <div className="flex items-center justify-between pt-2 gap-2 flex-wrap">
                <button
                  onClick={() => handleLike(post.postId)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isLiked
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-400 text-rose-400" : ""}`} />
                  <span>{post.likesCount || 0} Likes</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {["🔥", "👏", "🚀", "💡"].map((emoji) => {
                    const count = post.reactions?.[emoji] || 0;
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(post.postId, emoji)}
                        className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <span>{emoji}</span>
                        {count > 0 && (
                          <span className="text-[10px] font-mono text-slate-400">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
