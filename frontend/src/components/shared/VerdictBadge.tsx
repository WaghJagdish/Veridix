import { Badge } from "@/components/ui/badge"
import { Verdict } from "@/lib/types"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  if (verdict === 'safe') {
    return <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-900/50 flex gap-1"><CheckCircle2 className="w-3 h-3" /> SAFE</Badge>
  }
  if (verdict === 'borderline') {
    return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50 flex gap-1"><AlertTriangle className="w-3 h-3" /> BORDERLINE</Badge>
  }
  return <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-900/50 flex gap-1"><XCircle className="w-3 h-3" /> UNSAFE</Badge>
}
