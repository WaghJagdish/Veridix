"use client"
import { useState, useEffect } from "react"
import { FindingsTable } from "@/components/findings/FindingsTable"
import { useScans, useFindings } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { 
  ShieldAlert, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react"

export default function FindingsPage() {
  const { data: scans, isLoading: isScansLoading } = useScans();
  const [selectedScanId, setSelectedScanId] = useState<string>("");

  useEffect(() => {
    if (scans && scans.length > 0 && !selectedScanId) {
      setSelectedScanId(scans[0].id);
    }
  }, [scans, selectedScanId]);

  const { data: findings, isLoading: isFindingsLoading } = useFindings(selectedScanId);
  const selectedScan = scans?.find(s => s.id === selectedScanId);

  // Count by severity for the summary bar
  const criticalCount = findings?.filter(f => f.severity === 'critical').length ?? 0;
  const highCount = findings?.filter(f => f.severity === 'high').length ?? 0;
  const mediumCount = findings?.filter(f => f.severity === 'medium').length ?? 0;
  const lowCount = findings?.filter(f => f.severity === 'low').length ?? 0;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-1.5 border-ink pb-5 bg-white p-5 border-1.5 shadow-brutal font-mono">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="text-hazard-red" size={22} />
            <h1 className="text-3xl font-black uppercase tracking-tight text-ink font-display">Findings Explorer</h1>
          </div>
          <p className="text-xs text-ink/70 font-sans">
            Investigate identified safety policy violations, refusal failures, and Indic safety drift anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Scan Selector */}
          {scans && scans.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Scan:</span>
              <select
                value={selectedScanId}
                onChange={e => setSelectedScanId(e.target.value)}
                className="h-9 px-3 text-xs bg-card border border-input rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-medium shadow-xs"
              >
                {scans.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.is_demo ? "(Demo)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button asChild variant="outline" size="sm" className="h-9 text-xs border-purple-200 text-purple-700 hover:bg-purple-50">
            <Link href="/copilot">
              <Sparkles size={13} className="mr-1.5" /> Ask Copilot
            </Link>
          </Button>
        </div>
      </div>

      {isScansLoading || isFindingsLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <div className="h-7 w-7 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading safety findings...</p>
        </div>
      ) : !scans || scans.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground border border-dashed rounded-xl bg-card/60 space-y-4">
          <Activity className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <div>
            <h3 className="font-bold text-sm text-foreground">No Evaluation Scans Found</h3>
            <p className="text-xs text-muted-foreground mt-1">Run an evaluation scan to detect safety drift and vulnerabilities.</p>
          </div>
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/scans/new">Launch New Scan</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Explainability bar: What these findings mean */}
          {findings && findings.length > 0 && (
            <Card className="border-border bg-card shadow-xs overflow-hidden">
              <div className="p-4 grid md:grid-cols-4 gap-4 border-b border-border">
                {[
                  { label: "Critical", count: criticalCount, color: "bg-rose-500", textColor: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", desc: "Immediate action required" },
                  { label: "High", count: highCount, color: "bg-orange-500", textColor: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", desc: "Address before deployment" },
                  { label: "Medium", count: mediumCount, color: "bg-amber-500", textColor: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", desc: "Monitor and plan fixes" },
                  { label: "Low", count: lowCount, color: "bg-emerald-500", textColor: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", desc: "Best practice improvements" },
                ].map(s => (
                  <div key={s.label} className={`p-3 rounded-xl border ${s.bg} ${s.border} flex items-start gap-3`}>
                    <div className={`h-2 w-2 rounded-full ${s.color} mt-1.5 flex-shrink-0`} />
                    <div>
                      <div className={`text-xl font-black font-mono ${s.textColor}`}>{s.count}</div>
                      <div className={`text-xs font-bold ${s.textColor}`}>{s.label}</div>
                      <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* What/Why/Fix explainability hint */}
              <div className="px-5 py-3 flex items-start gap-3 bg-blue-50/50 border-b border-border">
                <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>How to read findings:</strong> Each finding shows <strong>what attack was used</strong>, <strong>which language it exploited</strong>, 
                  the drift score (how much behavior changed across languages), and <strong>specific remediation steps</strong>. 
                  Click any finding to see the full evidence chain including prompts, model responses, and judge reasoning.
                </p>
              </div>

              {/* Context bar */}
              {selectedScan && (
                <div className="px-5 py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Active scope:</span>
                    <strong className="text-foreground">{selectedScan.name}</strong>
                    <span>•</span>
                    <span>Target: <strong>{selectedScan.target?.name || 'FinSeva Bot'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/copilot" className="text-purple-700 hover:text-purple-800 font-semibold flex items-center gap-1">
                      <Sparkles size={10} /> Ask Copilot about findings
                    </Link>
                    <span className="text-muted-foreground">·</span>
                    <Link href={`/scans/${selectedScan.id}`} className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
                      Full Scan Workspace <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          )}

          <FindingsTable findings={findings || []} />
        </div>
      )}
    </div>
  );
}
