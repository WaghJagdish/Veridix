"use client"
import { useState, useEffect } from "react"
import { FindingsTable } from "@/components/findings/FindingsTable"
import { useScans, useFindings } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ShieldAlert, 
  Activity, 
  Filter, 
  Flame, 
  PlusCircle, 
  Layers,
  Sparkles
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="text-rose-500" size={22} />
            <h1 className="text-2xl font-extrabold tracking-tight">Findings Explorer</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Investigate identified safety policy violations, refusal failures, and Indic safety drift anomalies.
          </p>
        </div>

        {/* Scan Selector */}
        {scans && scans.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Audit Scan:</span>
            <select
              value={selectedScanId}
              onChange={e => setSelectedScanId(e.target.value)}
              className="h-9 px-3 text-xs bg-card border border-input rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-medium shadow-xs"
            >
              {scans.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.is_demo ? "Demo" : "Live"})
                </option>
              ))}
            </select>
          </div>
        )}
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
          {selectedScan && (
            <div className="flex items-center justify-between bg-muted/50 px-4 py-2.5 rounded-lg border border-border text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Active Scope:</span>
                <strong className="text-foreground">{selectedScan.name}</strong>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Target: <strong>{selectedScan.target?.name || 'FinSeva Bot'}</strong></span>
              </div>
              <Link 
                href={`/scans/${selectedScan.id}`} 
                className="text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                View Full Scan Workspace →
              </Link>
            </div>
          )}

          <FindingsTable findings={findings || []} />
        </div>
      )}
    </div>
  );
}
