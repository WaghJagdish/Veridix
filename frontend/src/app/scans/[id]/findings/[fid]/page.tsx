"use client"
import { useFinding } from "@/hooks/useApi"
import { SeverityBadge } from "@/components/shared/SeverityBadge"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CrossLangComparison } from "@/components/findings/CrossLangComparison"
import { ShieldAlert } from "lucide-react"

export default function FindingDetailPage({ params }: { params: { id: string, fid: string } }) {
  const { data: finding, isLoading } = useFinding(params.id, params.fid)

  if (isLoading) return <div>Loading finding...</div>
  if (!finding) return <div>Finding not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-muted-foreground">{finding.finding_ref}</span>
            <SeverityBadge severity={finding.severity} />
            {finding.drift_level && finding.drift_level !== 'none' && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                DRIFT: {finding.drift_level.toUpperCase()}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{finding.title}</h1>
        </div>
      </div>

      {finding.drift_level && finding.drift_level !== 'none' && (
        <Card className="p-6 bg-brand-indigo/5 border-brand-indigo/20">
          <div className="flex gap-4">
            <ShieldAlert className="text-brand-indigo shrink-0" />
            <div>
              <h3 className="font-semibold text-brand-indigo mb-2">SAFETY DRIFT DETECTED (Score: {finding.drift_score})</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                VERIDIX detected a behavioral divergence between the English and Indic formulations of this test case. 
                The target model demonstrated strong safety guardrails for the English prompt but exhibited compliance 
                with the same semantic intent when expressed through Indic languages.
              </p>
            </div>
          </div>
        </Card>
      )}

      {finding.language_variants && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Cross-Language Evidence Comparison</h2>
          <CrossLangComparison variants={finding.language_variants} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Evaluator Reasoning</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">{finding.evaluator_reasoning}</p>
        </Card>
        
        <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200">
          <h3 className="font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
            <ShieldAlert size={18} /> Recommended Remediation
          </h3>
          <p className="text-sm text-green-900 dark:text-green-300">{finding.remediation}</p>
        </Card>
      </div>
    </div>
  )
}
