"use client"
import { useState } from "react"
import { useScans } from "@/hooks/useApi"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Flame,
  Award,
  Layers,
  FileCheck
} from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function ReportsPage() {
  const { data: scans, isLoading } = useScans()
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [reportMap, setReportMap] = useState<Record<string, string>>({})
  const [errorMap, setErrorMap] = useState<Record<string, string>>({})

  const handleGenerate = async (scanId: string) => {
    setGeneratingId(scanId)
    setErrorMap(prev => ({ ...prev, [scanId]: "" }))
    try {
      const res = await api.reports.generate(scanId)
      setReportMap(prev => ({ ...prev, [scanId]: res.id }))
    } catch (e: any) {
      setErrorMap(prev => ({ ...prev, [scanId]: e.message || "PDF generation error" }))
    } finally {
      setGeneratingId(null)
    }
  }

  const completedScans = scans?.filter(s => s.status === 'completed') || []

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="text-emerald-700" size={22} />
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Audit Reports & Compliance</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate, preview, and download formal Indian enterprise AI safety audit reports and OWASP Top 10 mappings.
          </p>
        </div>
      </div>

      {/* Compliance Overview Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-border bg-card space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <FileCheck size={14} className="text-emerald-600" /> OWASP GenAI Top 10 (2025)
          </div>
          <p className="text-xs text-muted-foreground">
            All test cases and findings are structured against LLM01–LLM10 threat vectors.
          </p>
        </Card>

        <Card className="p-4 border border-border bg-card space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} className="text-emerald-600" /> Indic Linguistic Parity
          </div>
          <p className="text-xs text-muted-foreground">
            Measures safety guardrail consistency across English, Devanagari Hindi, and Hinglish.
          </p>
        </Card>

        <Card className="p-4 border border-border bg-card space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Award size={14} className="text-amber-600" /> Executive PDF Export
          </div>
          <p className="text-xs text-muted-foreground">
            Ready for CISO, safety governance, and regulatory compliance reviews.
          </p>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <div className="h-7 w-7 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading audit records...</p>
        </div>
      ) : completedScans.length === 0 ? (
        <EmptyState 
          icon={<FileText size={24} />} 
          title="No completed audits found" 
          description="Complete an evaluation scan to generate downloadable PDF reports." 
          action={<Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><Link href="/scans/new">Launch Safety Scan</Link></Button>} 
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Completed Safety Audits ({completedScans.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {completedScans.map(scan => {
              const reportId = reportMap[scan.id];
              const error = errorMap[scan.id];
              const isGenerating = generatingId === scan.id;

              return (
                <Card key={scan.id} className="border border-border bg-card shadow-xs flex flex-col justify-between overflow-hidden">
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="text-emerald-700" size={16} />
                          <h3 className="font-bold text-sm text-foreground">{scan.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Target: <strong className="text-foreground">{scan.target?.name || 'FinSeva Bot'}</strong>
                        </p>
                      </div>

                      {scan.is_demo && (
                        <Badge variant="outline" className="text-[9px] uppercase font-bold bg-amber-100 text-amber-800 border-amber-300">
                          Demo Audit
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-muted/40 rounded-lg border border-border">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Languages</span>
                        <strong className="text-foreground uppercase text-[11px]">{scan.languages?.join(', ') || 'EN, HI'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Evaluations</span>
                        <strong className="text-foreground text-[11px]">{scan.total_tests || 24} Tests</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Date</span>
                        <strong className="text-foreground text-[11px]">{formatDate(scan.created_at)}</strong>
                      </div>
                    </div>

                    {error && (
                      <div className="text-xs text-rose-800 bg-rose-50 p-2 rounded border border-rose-200 flex items-center gap-1.5">
                        <AlertTriangle size={13} className="text-rose-600" /> {error}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-muted/30 border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs border-border hover:bg-accent text-foreground">
                      <Link href={`/scans/${scan.id}/report`}>
                        <ExternalLink size={12} className="mr-1.5" /> Interactive Report
                      </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleGenerate(scan.id)}
                        disabled={isGenerating}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20"
                      >
                        {isGenerating ? (
                          <>Generating...</>
                        ) : (
                          <><FileText size={12} className="mr-1.5" /> Generate PDF</>
                        )}
                      </Button>

                      {reportId && (
                        <Button variant="outline" size="sm" asChild className="h-8 text-xs text-emerald-800 border-emerald-300 bg-emerald-100 hover:bg-emerald-200">
                          <a href={api.reports.download(reportId)} target="_blank" rel="noopener noreferrer">
                            <Download size={12} className="mr-1" /> Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
