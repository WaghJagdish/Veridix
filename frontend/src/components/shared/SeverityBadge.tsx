import { Badge } from "@/components/ui/badge"
import { Severity } from "@/lib/types"

const severityColors: Record<string, string> = {
  critical: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
  high: "bg-orange-100 text-orange-800 border-orange-300 font-bold",
  medium: "bg-amber-100 text-amber-800 border-amber-300 font-bold",
  low: "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold",
  none: "bg-emerald-50 text-emerald-700 border-emerald-200 font-normal",
}

export function SeverityBadge({ severity }: { severity?: Severity | string | null }) {
  const s = severity ? severity.toLowerCase() : 'none';
  const colorClass = severityColors[s] || severityColors.none;

  return (
    <Badge variant="outline" className={`uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${colorClass}`}>
      {s}
    </Badge>
  )
}
