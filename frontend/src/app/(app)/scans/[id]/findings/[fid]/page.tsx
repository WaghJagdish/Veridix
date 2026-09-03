"use client"
import { useState } from "react"
import { useFinding } from "@/hooks/useApi"
import { SeverityBadge } from "@/components/shared/SeverityBadge"
import { LanguageBadge } from "@/components/shared/LanguageBadge"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CrossLangComparison } from "@/components/findings/CrossLangComparison"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ShieldAlert, 
  ArrowLeft, 
  Flame, 
  Copy, 
  Check, 
  CheckCircle2, 
  FileCode, 
  Lightbulb, 
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function FindingDetailPage({ params }: { params: { id: string, fid: string } }) {
  const { data: finding, isLoading } = useFinding(params.id, params.fid)
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground">Loading finding evidence...</p>
      </div>
    );
  }

  if (!finding) {
    return (
      <div className="max-w-md mx-auto text-center p-8 border border-border rounded-xl bg-card space-y-4 mt-12 shadow-xs">
        <h2 className="text-lg font-bold">Finding Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested finding ID was not found in this evaluation scan.</p>
        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Link href={`/scans/${params.id}`}>Back to Scan</Link>
        </Button>
      </div>
    );
  }

  const hasDrift = finding.drift_level && finding.drift_level !== 'none'
  const remediationCode = `// Indic Safety Guardrail Filter\n// Applied for Category: ${finding.category}\nif (detectCodeMixedDivergence(userPrompt, language="${finding.language}")) {\n  return enforcePolicyStrictRefusal(\n    reason="${finding.title}",\n    intent="${finding.attack_type}"\n  );\n}`

  const handleCopyRemediation = () => {
    navigator.clipboard.writeText(remediationCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-emerald-50">
            <Link href={`/scans/${params.id}`}>
              <ArrowLeft size={13} className="mr-1" /> Back to Scan Workspace
            </Link>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Detected: <strong className="text-foreground">{formatDate(finding.created_at)}</strong>
        </div>
      </div>

      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            {finding.finding_ref}
          </span>
          <SeverityBadge severity={finding.severity} />
          <LanguageBadge lang={finding.language} />
          {finding.owasp_ref && (
            <Badge variant="outline" className="text-[10px] font-mono border-emerald-300 text-emerald-800 bg-emerald-100">
              {finding.owasp_ref}
            </Badge>
          )}
          {hasDrift && (
            <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-xs font-bold flex items-center gap-1">
              <Flame size={12} className="text-rose-600" />
              DRIFT: {finding.drift_level?.toUpperCase()} ({finding.drift_score?.toFixed(2)})
            </Badge>
          )}
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{finding.title}</h1>
        <p className="text-xs text-muted-foreground">
          Threat Category: <strong className="capitalize text-foreground">{finding.category.replace(/_/g, ' ')}</strong>
          {finding.attack_strategy && <> • Strategy: <strong className="text-foreground">{finding.attack_strategy}</strong></>}
        </p>
      </div>

      {/* Safety Drift Alert Card */}
      {hasDrift && (
        <Card className="p-6 bg-rose-50/70 border-rose-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <Flame size={22} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <span>Critical Safety Drift Detected (Divergence Score: {finding.drift_score?.toFixed(2)})</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {finding.drift_explanation || (
                  `VERIDIX detected that this model adheres strictly to safety policies when tested in English, but bypasses its refusal guardrail when the exact same malicious or harmful semantic intent is expressed in ${finding.language === 'hi' ? 'Hindi' : 'Hinglish'}.`
                )}
              </p>
              {finding.contributing_factors && finding.contributing_factors.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Linguistic Vulnerability Factors:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {finding.contributing_factors.map((factor, idx) => (
                      <span key={idx} className="text-[10px] bg-card px-2 py-0.5 rounded border border-border text-foreground font-medium shadow-2xs">
                        • {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Multilingual Evidence Comparison */}
      {finding.language_variants && finding.language_variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers size={14} className="text-emerald-700" />
              Cross-Language Evidence Matrix (Side-by-Side)
            </h2>
            <span className="text-xs text-muted-foreground">Evaluated by LLM Judge</span>
          </div>
          <CrossLangComparison variants={finding.language_variants} />
        </div>
      )}

      {/* Evaluator Reasoning & Remediation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card shadow-xs space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
            <AlertTriangle size={16} className="text-amber-600" /> Evaluator Analysis & Reasoning
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {finding.evaluator_reasoning || "The model provided compliance and detailed actionable output for the unsafe request without triggering standard refusal patterns."}
          </p>
          <div className="pt-3 border-t border-border text-[11px] text-muted-foreground">
            Attack Type: <strong className="text-foreground">{finding.attack_type}</strong>
          </div>
        </Card>
        
        <Card className="p-6 border-emerald-300 bg-emerald-50/50 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
              <Lightbulb size={16} className="text-emerald-700" /> Recommended Remediation
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyRemediation}
              className="h-7 text-xs text-emerald-800 hover:bg-emerald-100"
            >
              {copied ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
              {copied ? "Copied" : "Copy Blueprint"}
            </Button>
          </div>
          <p className="text-xs text-emerald-950 leading-relaxed">
            {finding.remediation}
          </p>

          <div className="bg-emerald-950/5 text-emerald-950 p-3 rounded-lg font-mono text-[11px] leading-relaxed border border-emerald-200">
            {remediationCode}
          </div>
        </Card>
      </div>
    </div>
  )
}
