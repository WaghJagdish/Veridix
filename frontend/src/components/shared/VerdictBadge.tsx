import { Badge } from "@/components/ui/badge"
import { Verdict } from "@/lib/types"
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react"

export function VerdictBadge({ verdict }: { verdict?: Verdict | string | null }) {
  const v = verdict ? verdict.toLowerCase() : 'unknown';

  if (v === 'safe') {
    return (
      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> SAFE
      </Badge>
    );
  }
  if (v === 'borderline') {
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-amber-600" /> BORDERLINE
      </Badge>
    );
  }
  if (v === 'unsafe') {
    return (
      <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
        <XCircle className="w-3 h-3 text-rose-600" /> UNSAFE
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-muted text-muted-foreground border-border font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
      <HelpCircle className="w-3 h-3 text-muted-foreground" /> {v.toUpperCase()}
    </Badge>
  );
}
