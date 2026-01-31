"use client";

/**
 * Bettr Token (BTR) logo — Brave BAT–style currency icon.
 */
export default function BettrTokenLogo({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="14" fill="url(#btr-grad)" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      <text x="16" y="19" textAnchor="middle" fill="#0a0a0a" fontSize="9" fontWeight="800" fontFamily="system-ui, sans-serif">
        BTR
      </text>
      <defs>
        <linearGradient id="btr-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8FF00" />
          <stop offset="0.6" stopColor="#8ee000" />
          <stop offset="1" stopColor="#6bb800" />
        </linearGradient>
      </defs>
    </svg>
  );
}
