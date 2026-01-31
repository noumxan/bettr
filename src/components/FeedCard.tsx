"use client";

import type { FeedItem } from "@/lib/types";
import { FileText, Video, Newspaper, MessageCircle } from "lucide-react";

const typeIcons = {
  "long-form": FileText,
  "short-video": Video,
  journalism: Newspaper,
  "community-note": MessageCircle,
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

export default function FeedCard({ item }: { item: FeedItem }) {
  const Icon = typeIcons[item.contentType];

  return (
    <article className="rounded-lg border border-bettr-sage/30 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bettr-mint text-bettr-forest">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-bettr-navy">{item.author}</span>
            <span className="text-bettr-navy/60">{item.authorHandle}</span>
            <span className="text-bettr-navy/50">· {formatTime(item.timestamp)}</span>
            {item.focusArea && (
              <span className="rounded bg-bettr-sage/30 px-1.5 py-0.5 text-xs text-bettr-forest">
                {item.focusArea.replace(/-/g, " ")}
              </span>
            )}
          </div>
          {item.title && (
            <h3 className="mt-1 font-medium text-bettr-forest">{item.title}</h3>
          )}
          <p className="mt-1 text-bettr-navy/90">{item.body}</p>
          <div className="mt-2 flex gap-4 text-sm text-bettr-navy/60">
            <span>❤️ {item.likes}</span>
            <span>💬 {item.comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
