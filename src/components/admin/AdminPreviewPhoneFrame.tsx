"use client";

import { ReactNode } from "react";

interface AdminPreviewPhoneFrameProps {
  children?: ReactNode;
  title?: string;
  /** When true, embeds the live student app (/app) in an iframe so admin changes appear in real time */
  live?: boolean;
}

export default function AdminPreviewPhoneFrame({
  children,
  title = "Student App Preview",
  live = true,
}: AdminPreviewPhoneFrameProps) {
  return (
    <div className="shrink-0">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        {live && (
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-bettr-forest hover:underline"
            >
              Open main app →
            </a>
        )}
      </div>
      <div className="relative mx-auto w-[320px] rounded-[2.5rem] border-[14px] border-slate-800 bg-slate-800 shadow-xl">
        <div className="absolute -top-1 left-1/2 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-slate-800" />
        <div className="overflow-hidden rounded-[1.5rem] bg-white" style={{ minHeight: "560px" }}>
          {live ? (
            <iframe
              src="/?embed=1"
              title="Main app live preview"
              className="h-[560px] w-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
