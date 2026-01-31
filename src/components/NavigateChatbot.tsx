"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME = "Hi! I’m your Bettr guide. Ask me how to find something—e.g. “Where do I redeem BTR?” or “How do I change my feed algorithm?”";

export default function NavigateChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    setError(null);
    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setMessages((m) => m.slice(0, -1));
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.message ?? "" }]);
    } catch {
      setError("Network error. Try again.");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const showWelcome = messages.length === 0;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-bettr-lime text-black shadow-lg hover:bg-bettr-lime/90 focus:outline-none focus:ring-2 focus:ring-bettr-lime focus:ring-offset-2 focus:ring-offset-bettr-dark"
        aria-label="Open navigation assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[99] flex w-[min(100vw-3rem,380px)] flex-col rounded-2xl border border-white/10 bg-bettr-dark shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="font-semibold text-white">Bettr guide</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex max-h-[320px] min-h-[200px] flex-1 flex-col overflow-y-auto p-4">
            {showWelcome && (
              <div className="rounded-2xl border border-bettr-lime/30 bg-bettr-lime/10 px-4 py-3 text-sm text-zinc-200">
                {WELCOME}
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mt-2 max-w-[90%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-bettr-lime text-black"
                    : "bg-white/10 text-zinc-200"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            )}
            {error && (
              <div className="mt-2 rounded-2xl bg-amber-500/20 px-4 py-2.5 text-sm text-amber-200">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask how to find something…"
              disabled={loading}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-bettr-lime/50 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bettr-lime text-black hover:bg-bettr-lime/90 disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
