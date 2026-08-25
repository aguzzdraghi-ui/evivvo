import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"

interface DashboardActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  badge?: number | null
}

export function DashboardActionCard({ icon: Icon, title, description, href, badge }: DashboardActionCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-primary" />
        {!!badge && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {badge}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}
