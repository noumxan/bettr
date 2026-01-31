"use client";

import { useState } from "react";
import { Search, Bell, Send, Plus, MoreHorizontal, Heart, MessageCircle, Share2, Play } from "lucide-react";

const tabs = ["All", "Photos", "Videos", "Text"] as const;
const stories = [
  { name: "Ruffles", avatar: "🐕" },
  { name: "sabanok...", avatar: "🐱" },
  { name: "blue_y", avatar: "🐕" },
  { name: "waggles", avatar: "🐶" },
  { name: "steve.lov", avatar: "🐕" },
];

export default function StudentFeedPreview() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");

  return (
    <div className="flex h-full min-h-[560px] flex-col bg-white text-slate-900">
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1 text-xs text-slate-600">
        <span>8:30</span>
        <div className="flex items-center gap-1">
          <span>99%</span>
        </div>
      </div>

      {/* Header: logo, search, icons */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
        <span className="shrink-0 text-lg font-bold text-bettr-forest">Bettr</span>
        <div className="flex flex-1 items-center rounded-lg bg-slate-100 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="ml-2 text-xs text-slate-400">Search</span>
        </div>
        <button type="button" className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100">
          <Bell className="h-4 w-4" />
        </button>
        <button type="button" className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100">
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Stories row */}
      <div className="flex gap-3 overflow-x-auto border-b border-slate-100 px-3 py-3">
        <div className="flex shrink-0 flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-bettr-sage bg-bettr-mint/30 text-bettr-forest">
            <Plus className="h-5 w-5" />
          </div>
          <span className="mt-1 max-w-[64px] truncate text-[10px] text-slate-600">Your story</span>
        </div>
        {stories.map((s) => (
          <div key={s.name} className="flex shrink-0 flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-bettr-sage bg-slate-100 text-lg">
              {s.avatar}
            </div>
            <span className="mt-1 max-w-[64px] truncate text-[10px] text-slate-600">{s.name}</span>
          </div>
        ))}
      </div>

      {/* Post input */}
      <div className="border-b border-slate-100 px-3 py-2">
        <div className="rounded-xl bg-slate-100 px-3 py-2.5 text-xs text-slate-500">
          What&apos;s on your mind?
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium ${
              activeTab === tab
                ? "border-b-2 border-bettr-forest text-bettr-forest"
                : "text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed posts */}
      <div className="flex-1 overflow-y-auto">
        {/* Photo post - Sam House */}
        <div className="border-b border-slate-100 p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
                SH
              </div>
              <span className="text-xs font-semibold text-slate-900">Sam House</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-200">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 text-white/80">
              <span className="text-[10px]">City skyline</span>
            </div>
          </div>
          <div className="mt-2 flex gap-4">
            <button type="button" className="flex items-center gap-1 text-slate-600">
              <Heart className="h-4 w-4" />
              <span className="text-[10px]">Like</span>
            </button>
            <button type="button" className="flex items-center gap-1 text-slate-600">
              <MessageCircle className="h-4 w-4" />
              <span className="text-[10px]">Comment</span>
            </button>
            <button type="button" className="flex items-center gap-1 text-slate-600">
              <Share2 className="h-4 w-4" />
              <span className="text-[10px]">Share</span>
            </button>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            <span className="font-semibold text-slate-800">Sam House</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit... <span className="text-bettr-forest">more</span>
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">6 minutes ago</p>
        </div>

        {/* Video post - Jennifer Gabin */}
        <div className="border-b border-slate-100 p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
                JG
              </div>
              <span className="text-xs font-semibold text-slate-900">Jennifer Gabin</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg bg-slate-200">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400 text-amber-900/80">
              <span className="text-[10px]">Autumn path</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-bettr-forest">
                <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="mt-2 flex gap-4">
            <button type="button" className="flex items-center gap-1 text-slate-600">
              <Heart className="h-4 w-4" />
              <span className="text-[10px]">Like</span>
            </button>
            <button type="button" className="flex items-center gap-1 text-slate-600">
              <MessageCircle className="h-4 w-4" />
              <span className="text-[10px]">Comment</span>
            </button>
            <button type="button" className="flex items-center gap-1 text-slate-600">
              <Share2 className="h-4 w-4" />
              <span className="text-[10px]">Share</span>
            </button>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            <span className="font-semibold text-slate-800">Jennifer Gabin</span> Lorem ipsum dolor sit amet...
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">12 minutes ago</p>
        </div>
      </div>
    </div>
  );
}
