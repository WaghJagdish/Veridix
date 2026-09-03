import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function MetricCard({ title, value, icon, description, trend, trendValue, className }: MetricCardProps) {
  return (
    <Card className={cn(
      "p-4 border-border bg-card shadow-xs transition-all hover:shadow-sm card-hover",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
            {icon}
          </div>
          <p className="text-xs font-semibold text-muted-foreground leading-tight">{title}</p>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
            trend === "up" ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : 
            trend === "down" ? "text-rose-700 bg-rose-50 border border-rose-200" :
            "text-amber-700 bg-amber-50 border border-amber-200"
          )}>
            {trend === "up" ? <TrendingUp size={9} /> : trend === "down" ? <TrendingDown size={9} /> : null}
            {trendValue}
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">{value}</p>
        {description && (
          <p className="text-[10px] text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
    </Card>
  )
}
