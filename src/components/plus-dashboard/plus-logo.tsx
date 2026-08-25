interface PlusLogoProps {
  className?: string
}

/** Vector wordmark — never a rasterized screenshot, always renders crisp at any DPI. */
export function PlusLogo({ className = "" }: PlusLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="112" height="28" viewBox="0 0 112 28" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="evivvo">
        <defs>
          <linearGradient id="plus-logo-e" x1="0" y1="0" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5B8DFF" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <text x="0" y="21" fontFamily="var(--font-nunito-sans), sans-serif" fontWeight="800" fontSize="22" fill="url(#plus-logo-e)">
          e
        </text>
        <text x="15" y="21" fontFamily="var(--font-nunito-sans), sans-serif" fontWeight="800" fontSize="22" fill="currentColor">
          vivvo
        </text>
      </svg>
      <span className="rounded-full bg-gradient-to-r from-primary to-purple-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        Plus
      </span>
    </span>
  )
}
