"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BettrTokenLogo from "./BettrTokenLogo";
import {
  Search,
  Bell,
  Send,
  Plus,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Shield,
  Zap,
  Gift,
  Calendar,
  LogOut,
  LayoutDashboard,
  Home,
  User,
  ChevronRight,
  GraduationCap,
  FileText,
  CheckCircle,
  Percent,
  Bot,
  Shirt,
  Award,
  Music,
  BookOpen,
  Quote,
  Users,
  Sun,
  Moon,
  Coffee,
  Dumbbell,
  Wind,
  Library,
  X,
  Loader2,
} from "lucide-react";

const FEED_TABS = ["All", "Photos", "Videos", "Text"] as const;
const APP_TABS = [
  { id: "feed" as const, label: "Feed", icon: Home },
  { id: "algorithms" as const, label: "Algorithms", icon: Zap },
  { id: "scheduler" as const, label: "Curriculum", icon: Calendar },
  { id: "wellness" as const, label: "Wellness", icon: Sun },
  { id: "university" as const, label: "University", icon: GraduationCap },
  { id: "hub" as const, label: "Hub", icon: Gift },
  { id: "me" as const, label: "Me", icon: User },
];

const AD_THEMES = ["Tech", "Fashion", "Health & fitness", "Music", "Books & reading", "Food & diet", "Travel", "Education", "Wellness", "Sustainability"];
const MUSIC_STYLES = ["Pop", "Indie", "Classical", "Lo-fi", "Jazz", "Electronic", "Acoustic", "Focus / study"];
const WELLNESS_BY_TIME = [
  { time: "Morning (6–12)", label: "Exercise", desc: "Running, fitness, swimming. Start your day active.", icon: Dumbbell },
  { time: "Afternoon (12–17)", label: "Good diet", desc: "Healthy meals, hydration, mindful eating.", icon: Coffee },
  { time: "Evening (17–21)", label: "Walking", desc: "Gentle walks, nature, wind down.", icon: Sun },
  { time: "Night (21–6)", label: "Relaxation", desc: "Sleep, meditation, calm. Rest well.", icon: Moon },
];
const MOTIVATIONAL_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Reading is essential for those who seek to rise above the ordinary.", author: "Jim Rohn" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Calm mind brings inner strength and self-confidence.", author: "Dalai Lama" },
];
const MOCK_LIBRARIES = [
  { name: "Central City Library", books: ["The Alchemist", "Atomic Habits", "Deep Work"], address: "1 High Street" },
  { name: "Campus Main Library", books: ["Introduction to Algorithms", "Clean Code", "Deep Work"], address: "University Campus" },
  { name: "North Branch", books: ["Atomic Habits", "The Alchemist"], address: "45 North Ave" },
];
const MOCK_GROUPS = [
  { name: "Morning Runners", members: 120, desc: "Share runs and motivation" },
  { name: "Book Club", members: 89, desc: "Monthly reads and discussions" },
  { name: "Study Buddies", members: 240, desc: "Focus sessions together" },
  { name: "Wellness Circle", members: 56, desc: "Mindfulness and relaxation" },
];

const MOCK_DMS = [
  { id: "1", from: "Study Buddies", preview: "Reminder: focus session tomorrow 10am", time: "2m ago", unread: true },
  { id: "2", from: "Campus Café", preview: "Your 2-for-1 is ready to redeem in the Hub", time: "1h ago", unread: true },
  { id: "3", from: "Alex R.", preview: "Want to join the library run this weekend?", time: "3h ago", unread: false },
  { id: "4", from: "Book Club", preview: "This month's pick: Atomic Habits — discussion Fri", time: "Yesterday", unread: false },
];

const STOCK_STORIES = [
  { name: "Ruffles", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop" },
  { name: "sabanok", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop" },
  { name: "blue_y", img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop" },
  { name: "waggles", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop" },
  { name: "steve.lov", img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=200&h=200&fit=crop" },
];

const FEED_IMAGES = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop",
];

// Education content — shown first when Vocational Upskilling (study intent) is active
const EDUCATION_IMAGES = [
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop", // maths
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop", // education
  "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=600&fit=crop", // study
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop", // formulas
  "https://images.unsplash.com/photo-1582719478250-c89c6d9cba28?w=800&h=600&fit=crop", // books
];

const WORKAROUNDS = [
  { title: "Vocational Upskilling vs Social Discovery", desc: "Schedule Vocational Upskilling for weekday mornings and Social Discovery for evening. Content Curriculum auto-switches to combat doomscrolling.", icon: Calendar },
  { title: "WAYF — Find your university", desc: "Discovery Service: sign in with your institution (Jisc, OpenAthens, Shibboleth). eduPersonPrincipalName & eduPersonScopedAffiliation for verified, GDPR-friendly onboarding.", icon: Shield },
  { title: "Algorithm Marketplace", desc: "Select and make your own feed: Global News, Peer Highlights, Vocational Upskilling, Social Discovery. AT Protocol feed generators, IPFS/Arweave metadata.", icon: Zap },
  { title: "Bettr Monetization (BTR)", desc: "Earn Bettr Tokens for engagement. Solana Pay, Token-2022. Use BTR for student discounts.", icon: Gift },
  { title: "Curriculum of Content → Digital Asset Hub", desc: "Badges and rewards from Curriculum (Bounty 5) appear in your Digital Asset Hub (Bounty 6). Open Badges v3, W3C VC, FORGE, ESCO.", icon: CheckCircle },
  { title: "AI Assistants & creator fashion", desc: "Academic Mentor, Exam Prep, Nutrition. Creator-made digital fashion (Metaplex DAS, MPL Core, SPL-404).", icon: User },
];

type User = { id: string; displayName: string; email?: string; isVerified: boolean; university?: string };
type Algorithm = { id: string; name: string; description: string; intent: string; popularity: number; trustScore: number };
type RewardSummary = { balance: number; history: { reason: string; points: number }[] };
type ScheduleBlock = { id: string; label?: string; algorithm: { name: string; id: string }; dayOfWeek: number; startHour: number; endHour: number };
type Course = { id: string; title: string; description?: string | null; type: string; _count?: { enrollments: number; topics: number } };
type Discount = { id: string; name: string; description?: string | null; btrCost: number; partnerName?: string | null; category: string };
type AIAssistant = { id: string; name: string; description: string; skillFocus: string; pricing?: string | null };
type DigitalAsset = { id: string; name: string; type: string; metaplexUri?: string | null };
type UserBadge = { userId: string; badgeId: string; earnedAt?: string; badge: { name: string; focusArea?: string | null } };

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isInFocusBlock(block: ScheduleBlock): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return block.dayOfWeek === day && hour >= block.startHour && hour < block.endHour;
}

const MOCK_ASSIGNMENTS = [
  { id: "1", title: "Week 1 Quiz – Intro to Algorithms", course: "CS 101", due: "Feb 2", done: true },
  { id: "2", title: "Essay: Feed ranking ethics", course: "CS 101", due: "Feb 8", done: false },
  { id: "3", title: "Lab 2 – Scheduler API", course: "Bettr Dev", due: "Feb 5", done: false },
];

export default function StudentApp() {
  const searchParams = useSearchParams();
  const embed = searchParams?.get("embed") === "1";
  const { user: authUser, logout, isAdmin } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [activeAlgorithmId, setActiveAlgorithmId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<RewardSummary | null>(null);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [aiAssistants, setAIAssistants] = useState<AIAssistant[]>([]);
  const [digitalAssets, setDigitalAssets] = useState<DigitalAsset[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [apiUserId, setApiUserId] = useState<string | null>(null);
  const [appTab, setAppTab] = useState<"feed" | "algorithms" | "scheduler" | "university" | "wellness" | "hub" | "me">("feed");
  const [feedTab, setFeedTab] = useState<typeof FEED_TABS[number]>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [btrToast, setBtrToast] = useState<number | null>(null);
  const [timetablePreset, setTimetablePreset] = useState<"normal" | "standard" | "exam" | "relaxed" | "intensive" | "balance">("standard");
  const [curriculumCalendarView, setCurriculumCalendarView] = useState<"weekly" | "monthly">("weekly");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState(false);
  const [curriculumMonthOffset, setCurriculumMonthOffset] = useState(0);
  const [selectedAdThemes, setSelectedAdThemes] = useState<Set<string>>(new Set(AD_THEMES.slice(0, 3)));
  const [selectedMusicStyle, setSelectedMusicStyle] = useState<string>(MUSIC_STYLES[0]);
  const [librarySearch, setLibrarySearch] = useState("");
  const [breathPhase, setBreathPhase] = useState<"idle" | "in" | "hold" | "out">("idle");
  const [dmOpen, setDmOpen] = useState(false);
  const [openAssistantChat, setOpenAssistantChat] = useState<AIAssistant | null>(null);
  const [assistantChatMessages, setAssistantChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [assistantChatInput, setAssistantChatInput] = useState("");
  const [assistantChatLoading, setAssistantChatLoading] = useState(false);
  const assistantChatBottomRef = useRef<HTMLDivElement>(null);

  const fetchDemoUser = useCallback(async () => {
    try {
      const res = await fetch("/api/demo-user");
      const data = await res.json();
      const uid = data.id ?? "demo";
      setApiUserId(uid);
      setUser({
        ...data,
        displayName: authUser?.username ? authUser.username.charAt(0).toUpperCase() + authUser.username.slice(1) : (data.displayName ?? "Demo"),
      });
      return uid;
    } catch {
      setUser({
        id: "demo",
        displayName: authUser?.username ? authUser.username.charAt(0).toUpperCase() + authUser.username.slice(1) : "Demo",
        isVerified: false,
      });
      return "demo";
    }
  }, [authUser?.username]);

  const fetchAlgorithms = useCallback(async (uid?: string) => {
    try {
      const [listRes, activeRes] = await Promise.all([
        fetch("/api/algorithms"),
        uid ? fetch(`/api/algorithms/active?userId=${encodeURIComponent(uid)}`) : null,
      ]);
      const list = await listRes.json();
      let activeId: string | null = null;
      if (activeRes) {
        const activeData = await activeRes.json();
        activeId = activeData.algorithmId ?? null;
      }
      if (Array.isArray(list)) {
        setAlgorithms(list);
        setActiveAlgorithmId((prev) => {
          if (activeId) return activeId;
          if (list.length && !prev) return list[0].id;
          return prev;
        });
      }
    } catch {
      setAlgorithms([]);
    }
  }, []);

  const fetchRewards = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`/api/rewards?userId=${encodeURIComponent(uid)}`);
      const data = await res.json();
      setRewards(data);
    } catch {
      setRewards(null);
    }
  }, []);

  const fetchSchedule = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`/api/scheduler?userId=${encodeURIComponent(uid)}`);
      const data = await res.json();
      setSchedule(Array.isArray(data) ? data : []);
    } catch {
      setSchedule([]);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([]);
    }
  }, []);

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await fetch("/api/discounts");
      const data = await res.json();
      setDiscounts(Array.isArray(data) ? data : []);
    } catch {
      setDiscounts([]);
    }
  }, []);

  const fetchHubData = useCallback(async (uid: string) => {
    try {
      const [aiRes, assetsRes, badgesRes] = await Promise.all([
        fetch("/api/ai-assistants"),
        fetch("/api/digital-assets"),
        fetch(`/api/badges?userId=${encodeURIComponent(uid)}`),
      ]);
      const [aiData, assetsData, badgesData] = await Promise.all([aiRes.json(), assetsRes.json(), badgesRes.json()]);
      setAIAssistants(Array.isArray(aiData) ? aiData : []);
      setDigitalAssets(Array.isArray(assetsData) ? assetsData : []);
      setUserBadges(Array.isArray(badgesData) ? badgesData : []);
    } catch {
      setAIAssistants([]);
      setDigitalAssets([]);
      setUserBadges([]);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = await fetchDemoUser();
      await Promise.all([
        fetchAlgorithms(uid),
        fetchRewards(uid),
        fetchSchedule(uid),
        fetchCourses(),
        fetchDiscounts(),
        fetchHubData(uid),
      ]);
    } catch (e) {
      setError("Could not load. Check that the database is set up.");
    } finally {
      setLoading(false);
    }
  }, [fetchDemoUser, fetchAlgorithms, fetchRewards, fetchSchedule, fetchCourses, fetchDiscounts, fetchHubData]);

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    assistantChatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [assistantChatMessages, assistantChatLoading]);

  useEffect(() => {
    const t = setInterval(() => {
      if (apiUserId) {
        fetchAlgorithms(apiUserId);
        fetchRewards(apiUserId);
        fetchSchedule(apiUserId);
      }
    }, 30000);
    return () => clearInterval(t);
  }, [apiUserId, fetchAlgorithms, fetchRewards, fetchSchedule]);

  const handleLike = useCallback(async (postId: string, category: "education" | "maths" | "social" | "news") => {
    if (!apiUserId || likedPosts.has(postId)) return;
    try {
      const res = await fetch("/api/engagement/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: apiUserId, postId, category }),
      });
      const data = await res.json();
      if (data.ok && data.btrEarned > 0) {
        setLikedPosts((prev) => new Set(prev).add(postId));
        setRewards((r) => r ? { ...r, balance: (r.balance ?? 0) + data.btrEarned } : { balance: data.btrEarned, history: [] });
        setBtrToast(data.btrEarned);
        setTimeout(() => setBtrToast(null), 2000);
        if (apiUserId) fetchRewards(apiUserId);
      } else if (data.ok) {
        setLikedPosts((prev) => new Set(prev).add(postId));
      }
    } catch {
      // ignore
    }
  }, [apiUserId, likedPosts, fetchRewards]);

  const sendAssistantMessage = useCallback(async () => {
    if (!openAssistantChat || !assistantChatInput.trim() || assistantChatLoading) return;
    const text = assistantChatInput.trim();
    setAssistantChatInput("");
    const userMsg = { role: "user" as const, content: text };
    setAssistantChatMessages((m) => [...m, userMsg]);
    setAssistantChatLoading(true);
    try {
      const history = [...assistantChatMessages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistantId: openAssistantChat.id,
          assistantName: openAssistantChat.name,
          skillFocus: openAssistantChat.skillFocus,
          messages: history,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAssistantChatMessages((m) => m.slice(0, -1));
        return;
      }
      setAssistantChatMessages((m) => [...m, { role: "assistant" as const, content: data.message ?? "" }]);
    } catch {
      setAssistantChatMessages((m) => m.slice(0, -1));
    } finally {
      setAssistantChatLoading(false);
    }
  }, [openAssistantChat, assistantChatInput, assistantChatMessages, assistantChatLoading]);

  const handleChangeBlockAlgorithm = useCallback(async (blockId: string, algorithmId: string) => {
    try {
      const res = await fetch(`/api/scheduler/${blockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ algorithmId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSchedule((prev) => prev.map((b) => (b.id === blockId ? { ...b, algorithm: updated.algorithm } : b)));
      }
    } catch {
      // keep UI state
    }
  }, []);

  const fetchAiSuggestion = useCallback(async () => {
    setAiSuggestionLoading(true);
    setAiSuggestion(null);
    try {
      const res = await fetch("/api/curriculum/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset: timetablePreset }),
      });
      const data = await res.json();
      if (res.ok && data.suggestion) setAiSuggestion(data.suggestion);
    } catch {
      setAiSuggestion("Could not load suggestion.");
    } finally {
      setAiSuggestionLoading(false);
    }
  }, [timetablePreset]);

  const handleToggleAlgorithm = useCallback(async (algorithmId: string) => {
    const uid = apiUserId ?? (await fetchDemoUser());
    const newActive = activeAlgorithmId !== algorithmId ? algorithmId : null;
    try {
      await fetch("/api/algorithms/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, algorithmId, active: !!newActive }),
      });
      setActiveAlgorithmId(newActive ?? null);
    } catch {
      // keep UI state
    }
  }, [apiUserId, activeAlgorithmId, fetchDemoUser]);

  // Focus block: auto-switch algorithm when in scheduled time
  useEffect(() => {
    if (!schedule.length || !algorithms.length || !apiUserId) return;
    const activeBlock = schedule.find((b) => isInFocusBlock(b as ScheduleBlock));
    if (activeBlock && (activeBlock.algorithm as { id?: string })?.id && activeAlgorithmId !== (activeBlock.algorithm as { id: string }).id) {
      const algId = (activeBlock.algorithm as { id: string }).id;
      setActiveAlgorithmId(algId);
      handleToggleAlgorithm(algId);
    }
  }, [schedule, algorithms, activeAlgorithmId, apiUserId, handleToggleAlgorithm]);

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bettr-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-bettr-lime border-t-transparent" />
      </div>
    );
  }

  const activeAlg = algorithms.find((a) => a.id === activeAlgorithmId);

  return (
    <div className="min-h-screen bg-bettr-dark text-white pb-20">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-bettr-dark/95 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-white" style={{ textShadow: "0 0 20px rgba(168,255,0,0.4)" }}>Bettr</span>
            {user?.isVerified && (
              <span className="flex items-center gap-1 rounded-full bg-bettr-lime/20 px-2 py-0.5 text-xs font-medium text-bettr-lime">
                <Shield className="h-3 w-3" /> Verified
              </span>
            )}
          </Link>
          <div className="flex flex-1 items-center rounded-xl bg-white/10 px-3 py-2 max-w-md">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <span className="ml-2 text-sm text-zinc-400">Search</span>
          </div>
          <button type="button" className="relative rounded-full p-2 text-zinc-300 hover:bg-white/10 hover:text-white transition" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDmOpen((o) => !o)}
              className="relative rounded-full p-2 text-zinc-300 hover:bg-white/10 hover:text-white transition"
              aria-label="Messages"
            >
              <Send className="h-5 w-5" />
              {MOCK_DMS.some((d) => d.unread) && (
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-bettr-lime" title="Unread messages" />
              )}
            </button>
            {dmOpen && (
              <>
                <div className="fixed inset-0 z-40" aria-hidden onClick={() => setDmOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-2xl border border-white/10 bg-bettr-dark shadow-xl overflow-hidden">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="font-semibold text-white">Messages</p>
                    <p className="text-xs text-zinc-500">{MOCK_DMS.length} conversations</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {MOCK_DMS.map((dm) => (
                      <button
                        key={dm.id}
                        type="button"
                        onClick={() => setDmOpen(false)}
                        className="flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left hover:bg-white/5 transition"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bettr-lime/20 text-bettr-lime font-semibold text-sm">
                          {dm.from.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium ${dm.unread ? "text-white" : "text-zinc-400"}`}>{dm.from}</p>
                          <p className="truncate text-xs text-zinc-500">{dm.preview}</p>
                          <p className="text-[10px] text-zinc-600 mt-0.5">{dm.time}</p>
                        </div>
                        {dm.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-bettr-lime mt-2" />}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/10 px-4 py-2">
                    <p className="text-center text-xs text-zinc-500">Open a conversation to reply</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4">
        {/* Feed tab */}
        {appTab === "feed" && (
          <>
            <section className="border-b border-white/10 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-bettr-lime" />
                <span className="text-sm font-semibold text-zinc-200">Algorithm Marketplace</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {algorithms.length === 0 && <span className="text-sm text-zinc-500">No algorithms yet.</span>}
                {algorithms.map((alg) => (
                  <button
                    key={alg.id}
                    type="button"
                    onClick={() => handleToggleAlgorithm(alg.id)}
                    className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                      activeAlgorithmId === alg.id ? "bg-bettr-lime text-black" : "bg-white/10 text-zinc-300 hover:bg-white/15"
                    }`}
                  >
                    {alg.name}
                  </button>
                ))}
              </div>
              {activeAlgorithmId && (
                <p className="mt-1.5 text-xs text-zinc-500">Ordered by: {activeAlg?.name ?? "—"}</p>
              )}
            </section>
            <section className="grid grid-cols-2 gap-3 py-3">
              <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-3">
                <div className="flex items-center gap-2 text-zinc-400">
                  <BettrTokenLogo size={18} className="text-bettr-lime" />
                  <span className="text-sm font-medium">Bettr Tokens</span>
                </div>
                <p className="mt-1 text-lg font-bold text-bettr-lime flex items-center gap-1.5">{rewards?.balance ?? 0} <span className="text-sm font-medium">BTR</span></p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-3">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="h-4 w-4 text-bettr-lime" />
                  <span className="text-sm font-medium">Schedule</span>
                </div>
                <p className="mt-1 text-sm text-zinc-200">{schedule.length} block{schedule.length !== 1 ? "s" : ""} this week</p>
              </div>
            </section>
            <section className="flex gap-3 overflow-x-auto border-b border-white/10 py-3 scrollbar-hide">
              <div className="shrink-0 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-bettr-lime bg-bettr-dark-card text-bettr-lime">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="mt-1.5 text-xs text-zinc-400">Your story</span>
              </div>
              {STOCK_STORIES.map((s) => (
                <div key={s.name} className="shrink-0 flex flex-col items-center">
                  <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-bettr-lime/50 p-0.5">
                    <img src={s.img} alt="" className="h-full w-full rounded-full object-cover" width={56} height={56} />
                  </div>
                  <span className="mt-1.5 max-w-[64px] truncate text-xs text-zinc-400">{s.name}</span>
                </div>
              ))}
            </section>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-zinc-500 my-3">What&apos;s on your mind?</div>
            <div className="flex border-b border-white/10">
              {FEED_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFeedTab(tab)}
                  className={`flex-1 py-2.5 text-sm font-medium transition ${feedTab === tab ? "border-b-2 border-bettr-lime text-bettr-lime" : "text-zinc-500"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="space-y-4 pt-4">
              {(() => {
                const isStudyMode = activeAlg?.intent === "study";
                const eduPosts = [
                  { id: "edu-1", author: "Maths Hub", img: EDUCATION_IMAGES[0], time: "2 min ago", isVideo: false, category: "maths" as const, caption: "Quadratic equations — practice set" },
                  { id: "edu-2", author: "Study Tips", img: EDUCATION_IMAGES[1], time: "15 min ago", isVideo: false, category: "education" as const, caption: "Best study techniques for exams" },
                  { id: "edu-3", author: "Campus Library", img: EDUCATION_IMAGES[2], time: "1 hr ago", isVideo: false, category: "education" as const, caption: "New maths resources available" },
                ];
                const socialPosts = [
                  { id: "soc-1", author: "Sam House", img: FEED_IMAGES[0], time: "6 min ago", isVideo: false, category: "social" as const },
                  { id: "soc-2", author: "Jennifer Gabin", img: FEED_IMAGES[1], time: "12 min ago", isVideo: true, category: "social" as const },
                  { id: "soc-3", author: "Alex Rivera", img: FEED_IMAGES[2], time: "1 hr ago", isVideo: false, category: "social" as const },
                ];
                const posts = isStudyMode ? [...eduPosts, ...socialPosts] : [...socialPosts, ...eduPosts];
                return posts.map((post, i) => (
                  <article key={post.id} className="rounded-2xl border border-white/10 bg-bettr-dark-card overflow-hidden">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-bettr-lime/30">
                          <img src={STOCK_STORIES[i % STOCK_STORIES.length].img} alt="" className="h-full w-full object-cover" width={36} height={36} />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{post.author}</p>
                          <p className="text-xs text-zinc-500">{post.time}{"caption" in post && post.caption ? ` · ${post.caption}` : ""}</p>
                        </div>
                      </div>
                      <button type="button" className="text-zinc-400 hover:text-white p-2"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                    <div className="relative aspect-[4/3] w-full bg-black">
                      <img src={post.img} alt="" className="h-full w-full object-cover" width={800} height={600} />
                      {post.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bettr-lime/90 text-black">
                            <Play className="h-6 w-6 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      )}
                      {(post.category === "education" || post.category === "maths") && (
                        <span className="absolute top-2 left-2 rounded-lg bg-bettr-lime/90 px-2 py-0.5 text-xs font-semibold text-black">+5 BTR on like</span>
                      )}
                    </div>
                    <div className="flex gap-4 p-3">
                      <button
                        type="button"
                        onClick={() => handleLike(post.id, post.category)}
                        className={`flex items-center gap-1.5 text-sm transition ${likedPosts.has(post.id) ? "text-red-400" : "text-zinc-400 hover:text-red-400"}`}
                      >
                        <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} /> Like
                      </button>
                      <button type="button" className="flex items-center gap-1.5 text-zinc-400 hover:text-bettr-lime text-sm"><MessageCircle className="h-4 w-4" /> Comment</button>
                      <button type="button" className="flex items-center gap-1.5 text-zinc-400 hover:text-bettr-lime text-sm"><Share2 className="h-4 w-4" /> Share</button>
                    </div>
                  </article>
                ));
              })()}
            </div>
            {btrToast !== null && (
              <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-bettr-lime px-4 py-2 text-black font-semibold shadow-lg animate-pulse">
                <BettrTokenLogo size={20} /> +{btrToast} BTR earned!
              </div>
            )}
          </>
        )}

        {/* Algorithm Marketplace — select and make your own (Bounty 2) */}
        {appTab === "algorithms" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-bettr-lime" />
              <h2 className="text-lg font-semibold text-white">Algorithm Marketplace</h2>
            </div>
            <p className="text-sm text-zinc-400">Select and make your own feed. Toggle algorithms in real time — Global News, Peer Highlights, Vocational Upskilling, Social Discovery. AT Protocol feed generators.</p>
            {activeAlgorithmId && (
              <div className="rounded-2xl border border-bettr-lime/30 bg-bettr-lime/5 p-4">
                <p className="text-xs font-medium text-bettr-lime uppercase tracking-wider">Currently active</p>
                <p className="mt-1 font-semibold text-white">{activeAlg?.name ?? "—"}</p>
                {activeAlg?.description && <p className="mt-2 text-sm text-zinc-400">{activeAlg.description}</p>}
              </div>
            )}
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-300">Available algorithms</p>
              {algorithms.length === 0 && <p className="text-sm text-zinc-500">No algorithms available.</p>}
              {algorithms.map((alg) => (
                <div
                  key={alg.id}
                  className={`rounded-2xl border p-4 transition ${
                    activeAlgorithmId === alg.id ? "border-bettr-lime bg-bettr-lime/10" : "border-white/10 bg-bettr-dark-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{alg.name}</p>
                      {alg.description && <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{alg.description}</p>}
                      <p className="mt-2 text-xs text-zinc-500">Trust score: {alg.trustScore} · Popularity: {alg.popularity}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleAlgorithm(alg.id)}
                      className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                        activeAlgorithmId === alg.id ? "bg-bettr-lime text-black" : "bg-white/10 text-zinc-300 hover:bg-white/15"
                      }`}
                    >
                      {activeAlgorithmId === alg.id ? "Active" : "Use"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Curriculum — Scheduler (Bounty 3): timetables, calendar, change algorithm, AI suggest */}
        {appTab === "scheduler" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-bettr-lime" />
              <h2 className="text-lg font-semibold text-white">Content Curriculum</h2>
            </div>
            <p className="text-sm text-zinc-400">Schedule algorithms by time to combat doomscrolling. Choose a timetable preset, change algorithm per block, and use the Moodle-like calendar to manage your week and month.</p>

            {/* How to manage with social media algorithm change — big overview */}
            <div className="rounded-2xl border border-bettr-lime/20 bg-bettr-lime/5 p-4">
              <p className="text-sm font-semibold text-white mb-2">How to manage with social media algorithm change</p>
              <p className="text-xs text-zinc-300 mb-2">A huge overview: take back control of your feed and time.</p>
              <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                <li><strong className="text-zinc-200">Schedule by intent:</strong> Use Vocational Upskilling for study blocks and Social Discovery for breaks so the feed matches your goal.</li>
                <li><strong className="text-zinc-200">Presets:</strong> Normal schedule, Exam week, Relaxed — pick a preset and tweak blocks below.</li>
                <li><strong className="text-zinc-200">Change algorithm per block:</strong> Each time block can use a different algorithm; your feed auto-switches.</li>
                <li><strong className="text-zinc-200">Calendar:</strong> Weekly and monthly views show classes and algorithm blocks in one place (Moodle-style).</li>
                <li><strong className="text-zinc-200">AI suggest:</strong> Get a tailored timetable suggestion based on your preset and goals.</li>
              </ul>
            </div>

            {/* Timetable preset — extra presets: Normal schedule, Standard, Exam, Relaxed, Intensive, Balance */}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">Timetable preset (algorithm by timetable)</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "normal" as const, label: "Normal schedule" },
                  { id: "standard" as const, label: "Standard week" },
                  { id: "exam" as const, label: "Exam week" },
                  { id: "relaxed" as const, label: "Relaxed" },
                  { id: "intensive" as const, label: "Intensive study" },
                  { id: "balance" as const, label: "Balance" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTimetablePreset(id)}
                    className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                      timetablePreset === id ? "bg-bettr-lime text-black" : "bg-white/10 text-zinc-300 hover:bg-white/15"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {timetablePreset === "normal" && "Balanced week: mix of study and social blocks."}
                {timetablePreset === "standard" && "Vocational Upskilling mornings, Social Discovery evening."}
                {timetablePreset === "exam" && "More focus blocks; Vocational Upskilling extended. Less social time."}
                {timetablePreset === "relaxed" && "More Social Discovery and Peer Highlights; lighter study blocks."}
                {timetablePreset === "intensive" && "Maximum study blocks; minimal social. For crunch time."}
                {timetablePreset === "balance" && "50/50 study and social across the week."}
              </p>
            </div>

            {/* AI: Suggest my timetable */}
            <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4">
              <p className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2"><Bot className="h-4 w-4 text-bettr-lime" /> AI: Suggest my timetable</p>
              <p className="text-xs text-zinc-500 mb-3">Get a tailored weekly schedule suggestion based on your preset. Sweet.</p>
              <button
                type="button"
                onClick={fetchAiSuggestion}
                disabled={aiSuggestionLoading}
                className="rounded-xl bg-bettr-lime/20 px-4 py-2 text-sm font-medium text-bettr-lime hover:bg-bettr-lime/30 disabled:opacity-50 flex items-center gap-2"
              >
                {aiSuggestionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {aiSuggestionLoading ? "Thinking…" : "Suggest my timetable"}
              </button>
              {aiSuggestion && (
                <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-zinc-300 whitespace-pre-wrap">{aiSuggestion}</div>
              )}
            </div>

            {/* Moodle-like calendar: weekly / monthly */}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">Calendar — weekly & monthly overview</p>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setCurriculumCalendarView("weekly")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${curriculumCalendarView === "weekly" ? "bg-bettr-lime text-black" : "bg-white/10 text-zinc-400 hover:bg-white/15"}`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setCurriculumCalendarView("monthly")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${curriculumCalendarView === "monthly" ? "bg-bettr-lime text-black" : "bg-white/10 text-zinc-400 hover:bg-white/15"}`}
                >
                  Monthly
                </button>
              </div>
              {curriculumCalendarView === "weekly" && (
                <div className="rounded-2xl border border-white/10 bg-bettr-dark-card overflow-x-auto">
                  <div className="grid grid-cols-8 text-xs min-w-[320px]">
                    <div className="p-2 border-b border-r border-white/10 bg-white/5 font-medium text-zinc-400">Time</div>
                    {DAYS.map((d) => (
                      <div key={d} className="p-2 border-b border-white/10 bg-white/5 font-medium text-zinc-400 text-center">{d}</div>
                    ))}
                    {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => (
                      <React.Fragment key={hour}>
                        <div className="p-1.5 border-r border-white/10 text-zinc-500 text-[10px]">{hour}:00</div>
                        {(Array.from({ length: 7 }, (_, i) => i) as number[]).map((day) => {
                          const block = schedule.find((b) => b.dayOfWeek === day && b.startHour <= hour && b.endHour > hour);
                          return (
                            <div key={`${day}-${hour}`} className="p-1 border-b border-r border-white/5 min-h-[32px]">
                              {block && (
                                <div className="rounded bg-bettr-lime/20 text-bettr-lime text-[10px] px-1 py-0.5 truncate" title={block.algorithm.name}>
                                  {block.algorithm.name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              {curriculumCalendarView === "monthly" && (() => {
                const now = new Date();
                const y = now.getFullYear();
                const m = now.getMonth() + curriculumMonthOffset;
                const first = new Date(y, m, 1);
                const last = new Date(y, m + 1, 0);
                const startPad = first.getDay();
                const daysInMonth = last.getDate();
                const weeks: (number | null)[][] = [];
                let week: (number | null)[] = Array(startPad).fill(null);
                for (let d = 1; d <= daysInMonth; d++) {
                  week.push(d);
                  if (week.length === 7) { weeks.push(week); week = []; }
                }
                if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }
                const monthName = first.toLocaleString("default", { month: "long", year: "numeric" });
                return (
                  <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <button type="button" onClick={() => setCurriculumMonthOffset((o) => o - 1)} className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-white/10">←</button>
                      <span className="text-sm font-medium text-white">{monthName}</span>
                      <button type="button" onClick={() => setCurriculumMonthOffset((o) => o + 1)} className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-white/10">→</button>
                    </div>
                    <div className="grid grid-cols-7 text-[10px] text-zinc-500 mb-1">
                      {DAYS.map((d) => <div key={d} className="text-center">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 text-xs">
                      {weeks.flat().map((d, i) => {
                        const dayOfWeek = d != null ? new Date(y, m, d).getDay() : -1;
                        const hasBlock = d != null && schedule.some((b) => b.dayOfWeek === dayOfWeek);
                        return (
                          <div key={i} className="aspect-square rounded-lg bg-white/5 flex flex-col items-center justify-center p-0.5">
                            {d != null ? <span className="text-zinc-300">{d}</span> : null}
                            {hasBlock ? <span className="w-1.5 h-1.5 rounded-full bg-bettr-lime mt-0.5" title="Schedule block" /> : null}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">Dots indicate days with schedule blocks. Weekly view shows blocks by hour.</p>
                  </div>
                );
              })()}
            </div>

            {/* This week — change algorithm per block */}
            <div className="rounded-2xl border border-bettr-lime/30 bg-bettr-lime/5 p-4">
              <p className="text-xs font-medium text-bettr-lime uppercase tracking-wider">This week — based on curriculum</p>
              <p className="text-xs text-zinc-500 mt-1">Change algorithm for any block below. Your feed auto-switches by time.</p>
              {schedule.length === 0 && <p className="mt-2 text-sm text-zinc-500">No blocks yet. Add blocks in admin Scheduler.</p>}
              <ul className="mt-2 space-y-2">
                {schedule.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                    <span className="text-zinc-300 shrink-0">{DAYS[b.dayOfWeek]} {b.startHour}:00–{b.endHour}:00</span>
                    <select
                      value={b.algorithm.id}
                      onChange={(e) => handleChangeBlockAlgorithm(b.id, e.target.value)}
                      className="rounded-lg border border-white/10 bg-bettr-dark px-2 py-1 text-xs text-white focus:border-bettr-lime/50 focus:outline-none"
                    >
                      {algorithms.map((alg) => (
                        <option key={alg.id} value={alg.id}>{alg.name}</option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4">
              <p className="text-sm font-medium text-zinc-300 mb-2">Switch algorithm by timetable</p>
              <p className="text-xs text-zinc-500">Your feed auto-switches to the algorithm for the current time block. Change presets or use the dropdown above to pick a different algorithm per block; curriculum links algorithms to your courses.</p>
            </div>
          </div>
        )}

        {/* Wellness — Calm-like: healthy lifestyle by time, ad themes, music, quotes, reading, library, community */}
        {appTab === "wellness" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-bettr-lime" />
              <h2 className="text-lg font-semibold text-white">Wellness</h2>
            </div>
            <p className="text-sm text-zinc-400">Mental-health friendly: healthy lifestyle by time, calm breathing, quotes, reading, and community. Choose ad themes and music for your preferences.</p>

            {/* Calm-like: breathing */}
            <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4">
              <p className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2"><Wind className="h-4 w-4" /> Breathe</p>
              <p className="text-xs text-zinc-500 mb-3">Take a moment. Inhale 4s, hold 4s, exhale 6s.</p>
              <button
                type="button"
                onClick={() => setBreathPhase(breathPhase === "idle" ? "in" : "idle")}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  breathPhase !== "idle" ? "bg-bettr-lime/20 text-bettr-lime" : "bg-white/10 text-zinc-300 hover:bg-white/15"
                }`}
              >
                {breathPhase === "idle" ? "Start breathing exercise" : "Stop"}
              </button>
            </div>

            {/* Healthy lifestyle by time */}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">Healthy lifestyle by time</p>
              <div className="space-y-2">
                {WELLNESS_BY_TIME.map((w) => (
                  <div key={w.time} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bettr-lime/20 text-bettr-lime shrink-0">
                      <w.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{w.time} — {w.label}</p>
                      <p className="text-sm text-zinc-400">{w.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational quotes with author */}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2"><Quote className="h-4 w-4" /> Quotes</p>
              <div className="space-y-2">
                {MOTIVATIONAL_QUOTES.slice(0, 4).map((q, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4">
                    <p className="text-sm text-zinc-200">&ldquo;{q.text}&rdquo;</p>
                    <p className="text-xs text-bettr-lime mt-2">— {q.author}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading / books awareness */}
            <div className="rounded-2xl border border-bettr-lime/20 bg-bettr-lime/5 p-4">
              <p className="text-sm font-medium text-white flex items-center gap-2"><BookOpen className="h-4 w-4 text-bettr-lime" /> Reading for a better life</p>
              <p className="text-xs text-zinc-400 mt-1">Highlighting the importance of reading books. Search city libraries below to find and borrow books.</p>
            </div>

            {/* Library search — city library databases */}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2"><Library className="h-4 w-4" /> City libraries</p>
              <p className="text-xs text-zinc-500 mb-2">Search which books are available in which library, then go and borrow.</p>
              <input
                type="text"
                placeholder="Search books..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-bettr-lime/50 focus:outline-none"
              />
              <div className="mt-3 space-y-2">
                {MOCK_LIBRARIES.filter((lib) => !librarySearch || lib.books.some((b) => b.toLowerCase().includes(librarySearch.toLowerCase()))).map((lib) => (
                  <div key={lib.name} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4">
                    <p className="font-medium text-white">{lib.name}</p>
                    <p className="text-xs text-zinc-500">{lib.address}</p>
                    <p className="text-sm text-zinc-400 mt-1">Books: {lib.books.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad themes — wide range of choices */}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">Ad themes (choose what you see)</p>
              <p className="text-xs text-zinc-500 mb-2">Select themes for advertisements from a wide range of choices.</p>
              <div className="flex flex-wrap gap-2">
                {AD_THEMES.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setSelectedAdThemes((prev) => {
                      const next = new Set(prev);
                      if (next.has(theme)) next.delete(theme); else next.add(theme);
                      return next;
                    })}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                      selectedAdThemes.has(theme) ? "bg-bettr-lime text-black" : "bg-white/10 text-zinc-400 hover:bg-white/15"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Music style — for your taste (singers pay for promotion) */}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2"><Music className="h-4 w-4" /> Music for your taste</p>
              <p className="text-xs text-zinc-500 mb-2">Promoting music to your preferences. Artists can promote their songs here.</p>
              <div className="flex flex-wrap gap-2">
                {MUSIC_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedMusicStyle(style)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                      selectedMusicStyle === style ? "bg-bettr-lime text-black" : "bg-white/10 text-zinc-400 hover:bg-white/15"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Community — choose groups, get to know people */}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Community</p>
              <p className="text-xs text-zinc-500 mb-2">Choose groups to join and get to know other people.</p>
              <div className="space-y-2">
                {MOCK_GROUPS.map((g) => (
                  <div key={g.name} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{g.name}</p>
                      <p className="text-sm text-zinc-400">{g.desc}</p>
                      <p className="text-xs text-zinc-500">{g.members} members</p>
                    </div>
                    <button type="button" className="rounded-xl bg-bettr-lime/20 px-3 py-1.5 text-xs font-medium text-bettr-lime hover:bg-bettr-lime/30 transition">Join</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* University / Moodle tab */}
        {appTab === "university" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-bettr-lime" />
              <h2 className="text-lg font-semibold text-white">University & Moodle</h2>
            </div>
            <p className="text-sm text-zinc-400">Courses and assignments linked with your institution.</p>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-3">My courses</p>
              {courses.length === 0 && <p className="text-sm text-zinc-500">No courses yet. Enroll from your Moodle or admin.</p>}
              <div className="space-y-2">
                {courses.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-white">{c.title}</p>
                      {c.description && <p className="text-sm text-zinc-400 line-clamp-1 mt-0.5">{c.description}</p>}
                      <p className="text-xs text-zinc-500 mt-1">{c.type} · {c._count?.enrollments ?? 0} enrolled</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-3">Assignments</p>
              <div className="space-y-2">
                {MOCK_ASSIGNMENTS.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center gap-3">
                    {a.done ? <CheckCircle className="h-5 w-5 text-bettr-lime shrink-0" /> : <FileText className="h-5 w-5 text-zinc-500 shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium ${a.done ? "text-zinc-400 line-through" : "text-white"}`}>{a.title}</p>
                      <p className="text-xs text-zinc-500">{a.course} · Due {a.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Digital Asset Hub (Bounty 5 rewards + Bounty 6: AI assistants, creator fashion, Student discounts) */}
        {appTab === "hub" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-bettr-lime" />
              <h2 className="text-lg font-semibold text-white">Digital Asset Hub</h2>
            </div>
            <p className="text-sm text-zinc-400">Bounty 6: AI Assistant & Digital Asset Marketplace — specialized AI for mental health, academic support, and vocational upskilling; creator-made digital fashion. Metaplex DAS · MPL Core · LangGraph/CrewAI · SPL-404.</p>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2"><BettrTokenLogo size={18} /> Bettr Tokens (BTR)</p>
              <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center justify-between">
                <span className="text-zinc-400">Balance</span>
                <span className="text-xl font-bold text-bettr-lime">{rewards?.balance ?? 0} BTR</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2"><Percent className="h-4 w-4 text-bettr-lime" /> Student discounts (redeem BTR)</p>
              {discounts.length === 0 && <p className="text-sm text-zinc-500">No discounts yet. Earn BTR by liking education posts!</p>}
              <div className="space-y-3">
                {discounts.map((d) => (
                  <div key={d.id} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{d.name}</p>
                      {d.description && <p className="text-sm text-zinc-400">{d.description}</p>}
                      {d.partnerName && <p className="text-xs text-zinc-500 mt-0.5">via {d.partnerName}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <BettrTokenLogo size={20} />
                      <span className="font-semibold text-bettr-lime">{d.btrCost} BTR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2"><Award className="h-4 w-4" /> Curriculum rewards (Open Badges v3)</p>
              {userBadges.length === 0 && <p className="text-sm text-zinc-500">No badges yet. Complete curriculum to earn.</p>}
              <div className="space-y-2">
                {userBadges.map((ub) => (
                  <div key={`${ub.userId}-${ub.badgeId}`} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center gap-3">
                    <Award className="h-5 w-5 text-bettr-lime shrink-0" />
                    <div>
                      <p className="font-medium text-white">{ub.badge?.name ?? "Badge"}</p>
                      <p className="text-xs text-zinc-500">{ub.badge?.focusArea ?? ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2"><Bot className="h-4 w-4" /> AI Assistants (LangGraph / CrewAI)</p>
              <p className="text-xs text-zinc-500 mb-2">Bounty 6: Personalized mentorship. Click an assistant to chat — study tips, exam prep, nutrition, career. Metaplex DAS · MPL Core · SPL-404.</p>
              {aiAssistants.length === 0 && <p className="text-sm text-zinc-500">No assistants yet.</p>}
              <div className="space-y-2">
                {aiAssistants.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setOpenAssistantChat(a);
                      setAssistantChatMessages([]);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center justify-between text-left hover:border-bettr-lime/30 hover:bg-white/5 transition"
                  >
                    <div>
                      <p className="font-medium text-white">{a.name}</p>
                      <p className="text-sm text-zinc-400">{a.description}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{a.skillFocus} · {a.pricing ?? "Free"}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2"><Shirt className="h-4 w-4" /> Creator fashion (Metaplex DAS / MPL Core / SPL-404)</p>
              {digitalAssets.length === 0 && <p className="text-sm text-zinc-500">No assets yet.</p>}
              <div className="space-y-2">
                {digitalAssets.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{a.name}</p>
                      <p className="text-xs text-zinc-500">{a.type}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Me tab */}
        {appTab === "me" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-bettr-lime/20 flex items-center justify-center text-2xl font-bold text-bettr-lime">
                {user?.displayName?.charAt(0) ?? "?"}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{user?.displayName ?? "Student"}</p>
                <p className="text-sm text-zinc-400">@{authUser?.username ?? "student"}</p>
                {user?.isVerified && (
                  <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-bettr-lime/20 px-2 py-0.5 text-xs font-medium text-bettr-lime">
                    <Shield className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4">
                <BettrTokenLogo size={24} className="mb-2" />
                <p className="text-2xl font-bold text-bettr-lime flex items-center gap-1">{rewards?.balance ?? 0} <span className="text-sm">BTR</span></p>
                <p className="text-xs text-zinc-500">Bettr Tokens</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-bettr-dark-card p-4">
                <Calendar className="h-5 w-5 text-bettr-lime mb-2" />
                <p className="text-2xl font-bold text-white">{schedule.length}</p>
                <p className="text-xs text-zinc-500">Focus blocks</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">Student discounts</p>
              <p className="text-xs text-zinc-500 mb-2">Redeem BTR in Digital Asset Hub for Campus Café, Student Beans, UNiDAYS, Campus Books, StudyPro and more.</p>
              <button type="button" onClick={() => setAppTab("hub")} className="flex items-center gap-2 rounded-xl bg-bettr-lime/20 px-4 py-2.5 text-sm font-medium text-bettr-lime hover:bg-bettr-lime/30 transition">
                <Gift className="h-4 w-4" /> Open Digital Asset Hub <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {schedule.length > 0 && (
              <div>
                <p className="text-sm font-medium text-zinc-300 mb-2">Content Curriculum (this week)</p>
                <ul className="space-y-2">
                  {schedule.slice(0, 5).map((b) => (
                    <li key={b.id} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-300">
                      {DAYS[b.dayOfWeek]} {b.startHour}:00–{b.endHour}:00 — {b.algorithm.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">Testing</p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/reset-student", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: apiUserId ?? undefined }),
                    });
                    const data = await res.json();
                    if (res.ok && data.ok) {
                      const uid = apiUserId ?? (await fetchDemoUser());
                      if (uid) await fetchRewards(uid);
                      setLikedPosts(new Set());
                      setRewards({ balance: 0, history: [] });
                    }
                  } catch {
                    // ignore
                  }
                }}
                className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-500/20 transition"
              >
                Reset BTR & likes (for testing) — earn BTR again by liking pics
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-2">Tips & integrations</p>
              <div className="space-y-2">
                {WORKAROUNDS.slice(0, 4).map((w, i) => (
                  <div key={i} className="rounded-xl bg-white/5 px-3 py-2">
                    <p className="font-medium text-white text-sm">{w.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {!embed && (
              <div className="space-y-2 pt-4 border-t border-white/10">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-bettr-lime hover:bg-white/10 transition"
                  >
                    <span className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Admin Dashboard</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => { logout(); window.location.href = "/login"; }}
                  className="flex items-center gap-2 w-full rounded-xl bg-white/5 px-4 py-3 text-zinc-300 hover:bg-white/10 transition"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            {error} Run <code className="rounded bg-white/10 px-1">npm run setup</code> and refresh.
          </div>
        )}
      </div>

      {/* AI Assistant mentor chat modal (Bounty 6: LangGraph / CrewAI) */}
      {openAssistantChat && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-bettr-dark">
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-bettr-dark/98 px-4 py-3">
            <div>
              <p className="font-semibold text-white">{openAssistantChat.name}</p>
              <p className="text-xs text-zinc-500">{openAssistantChat.description} · {openAssistantChat.skillFocus}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpenAssistantChat(null)}
              className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {assistantChatMessages.length === 0 && (
              <div className="rounded-2xl border border-bettr-lime/20 bg-bettr-lime/5 px-4 py-3 text-sm text-zinc-300">
                Hi! I&apos;m your {openAssistantChat.name}. Ask me anything — study tips, resources, or questions. I use LangGraph/CrewAI-style workflows to help you solve problems.
              </div>
            )}
            {assistantChatMessages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "ml-auto bg-bettr-lime text-black" : "bg-white/10 text-zinc-200"
                }`}
              >
                {m.content}
              </div>
            ))}
            {assistantChatLoading && (
              <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            )}
            <div ref={assistantChatBottomRef} />
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); sendAssistantMessage(); }}
            className="flex gap-2 border-t border-white/10 p-3 bg-bettr-dark"
          >
            <input
              type="text"
              value={assistantChatInput}
              onChange={(e) => setAssistantChatInput(e.target.value)}
              placeholder="Ask for study tips, resources, or help…"
              disabled={assistantChatLoading}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-bettr-lime/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={assistantChatLoading || !assistantChatInput.trim()}
              className="shrink-0 rounded-xl bg-bettr-lime px-4 py-2.5 text-sm font-medium text-black hover:bg-bettr-lime/90 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Bottom app nav */}
      {!embed && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-bettr-dark/98 backdrop-blur-xl safe-area-pb">
          <div className="flex items-center justify-around h-14 max-w-4xl mx-auto px-2">
            {APP_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAppTab(id)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition ${
                  appTab === id ? "text-bettr-lime" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
