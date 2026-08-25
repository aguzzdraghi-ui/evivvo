import type { LucideIcon } from "lucide-react"

interface TrustChip {
  icon: LucideIcon
  label: string
}

interface TrustChipsProps {
  items: TrustChip[]
  className?: string
}

export function TrustChips({ items, className = "" }: TrustChipsProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-2 text-xs font-medium text-muted-foreground md:text-sm"
        >
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </span>
      ))}
    </div>
  )
}
