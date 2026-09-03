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
    <div className={cn(
      "p-4 bg-white border-1.5 border-ink shadow-brutal font-mono text-ink transition-all hover:-translate-y-0.5",
      className
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-chalk border border-ink flex items-center justify-center">
            {icon}
          </div>
          <p className="text-xs font-bold text-ink/70 uppercase leading-tight">{title}</p>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.2 border uppercase",
            trend === "up" ? "text-safety-teal bg-chalk border-ink" : 
            trend === "down" ? "text-white bg-hazard-red border-ink" :
            "text-ink bg-acid border-ink"
          )}>
            {trend === "up" ? <TrendingUp size={9} /> : trend === "down" ? <TrendingDown size={9} /> : null}
            {trendValue}
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-3xl font-black text-ink font-sans tracking-tight">{value}</p>
        {description && (
          <p className="text-[10px] text-ink/60 font-mono leading-tight">{description}</p>
        )}
      </div>
    </div>
  )
}
