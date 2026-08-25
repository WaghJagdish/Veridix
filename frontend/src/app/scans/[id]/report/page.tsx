"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { useScan, useScanSummary } from "@/hooks/useApi"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SeverityBadge } from "@/components/shared/SeverityBadge"
import { FileText, Download, AlertTriangle, Shield, Activity, CheckCircle2 } from "lucide-react"

export default function ReportPage() {
  const params = useParams<{ id: string }>()
  const { data: scan } = useScan(params.id)
  const { data: summary } = useScanSummary(params.id)
  const [generating, setGenerating] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const result = await api.reports.generate(params.id)
      setReportId(result.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Report generation failed")
    } finally {
      setGenerating(false)
    }
  }

  if (!scan) return <div className="p-8 text-muted-foreground">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="text-muted-foreground" size={20} />
            <h1 className="text-2xl font-bold tracking-tight">Safety Audit Report</h1>
          </div>
          <p className="text-sm text-muted-foreground">{scan.name}</p>
        </div>
        {scan.is_demo && (
          <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 rounded px-2 py-1 font-medium">
            DEMO EVALUATION
          </span>
        )}
      </div>

      {/* Report Preview */}
      <Card className="p-8 border-2 space-y-6">
        {/* Report Header */}
        <div className="border-b pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="text-indigo-600" size={22} />
              <span className="text-xl font-bold text-indigo-700 tracking-tight">VERIDIX</span>
            </div>
            <p className="text-xs text-muted-foreground">AI Safety Evaluation Report</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Scan ID: <span className="font-mono text-xs">{scan.id.slice(0, 8)}...</span></p>
            <p>{new Date(scan.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>
        </div>

        {/* Target Info */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Target</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">Provider:</span> <strong>{scan.preset || "—"}</strong></div>
            <div><span className="text-muted-foreground">Languages:</span> <strong>{scan.languages?.join(", ") || "—"}</strong></div>
            <div><span className="text-muted-foreground">Status:</span> <strong className="capitalize">{scan.status}</strong></div>
          </div>
        </div>

        {/* Executive Summary */}
        {summary && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Executive Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg bg-slate-50 border p-3 text-center">
                <div className="text-2xl font-bold text-slate-800">{summary.overall_safety_score}%</div>
                <div className="text-xs text-muted-foreground mt-1">Overall Safety</div>
              </div>
              <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-center">
                <div className="text-2xl font-bold text-red-700">{summary.critical_findings}</div>
                <div className="text-xs text-muted-foreground mt-1">Critical Findings</div>
              </div>
              <div className="rounded-lg bg-orange-50 border border-orange-100 p-3 text-center">
                <div className="text-2xl font-bold text-orange-700">{summary.drift_events}</div>
                <div className="text-xs text-muted-foreground mt-1">Drift Events</div>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">{summary.total_tests}</div>
                <div className="text-xs text-muted-foreground mt-1">Tests Run</div>
              </div>
            </div>
          </div>
        )}

        {/* Language Performance */}
        {summary?.language_scores && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Safety by Language</h2>
            <div className="space-y-2">
              {Object.entries(summary.language_scores).map(([lang, score]) => (
                <div key={lang} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-20 capitalize">{lang === "hinglish" ? "Hinglish" : lang.toUpperCase()}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-12 text-right">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Methodology Note */}
        <div className="bg-slate-50 rounded-lg p-4 border text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-slate-600">Methodology</p>
          <p>Evaluation used VERIDIX Safety Drift Analysis v0.1. Safety scores computed from LLM-as-Judge verdicts with structured confidence scoring. Drift Score = max(safety_score) − min(safety_score) across language variants. Test cases mapped to OWASP LLM Top 10 (2025).</p>
          <p className="text-amber-700 font-medium mt-2">Disclaimer: This report is an assessment tool. Evaluation results are mapped to selected OWASP LLM Top 10 (2025) controls. This report does not constitute legal compliance certification or regulatory clearance.</p>
        </div>
      </Card>

      {/* Generate Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {generating ? (
            <><Activity className="mr-2 animate-spin" size={16} /> Generating PDF...</>
          ) : (
            <><FileText className="mr-2" size={16} /> Generate PDF Report</>
          )}
        </Button>

        {reportId && (
          <Button variant="outline" asChild>
            <a href={api.reports.download(reportId)} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2" size={16} /> Download PDF
            </a>
          </Button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {reportId && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
          <CheckCircle2 size={16} />
          Report generated successfully. Click "Download PDF" to save.
        </div>
      )}
    </div>
  )
}
