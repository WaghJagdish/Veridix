"use client"
import { useScan } from "@/hooks/useApi"
import { useScanEvents } from "@/hooks/useScanEvents"
import { ScanPipelineProgress } from "@/components/scans/ScanPipelineProgress"
import { LiveEventLog } from "@/components/scans/LiveEventLog"
import { ScanResultsWorkspace } from "@/components/scans/ScanResultsWorkspace"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { 
  FileText, 
  ArrowLeft, 
  RotateCw, 
  Sparkles, 
  Server, 
  Languages, 
  ShieldCheck, 
  Flame,
  Clock
} from "lucide-react"

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  const { data: scan, isLoading, refetch } = useScan(params.id)
  
  const isRunning = scan ? ['pending', 'running'].includes(scan.status) : false;
  const { events, currentStage, progress } = useScanEvents(params.id, isRunning)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground">Loading safety evaluation workspace...</p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="max-w-md mx-auto text-center p-8 border border-border rounded-xl bg-card space-y-4 mt-12 shadow-xs">
        <h2 className="text-lg font-bold">Evaluation Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested scan ID does not exist or has been deleted.</p>
        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Link href="/scans">Back to Scans</Link>
        </Button>
      </div>
    );
  }

  const isComplete = scan.status === 'completed' || currentStage === 'complete';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-emerald-50">
              <Link href="/scans">
                <ArrowLeft size={13} className="mr-1" /> Scans
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-mono text-muted-foreground">{scan.id.slice(0, 8)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{scan.name}</h1>
            <Badge 
              variant="outline" 
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isComplete 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-teal-100 text-teal-800 border-teal-300 animate-pulse'
              }`}
            >
              {isComplete ? 'Completed' : 'Running Evaluation'}
            </Badge>

            {scan.is_demo && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] uppercase font-bold">
                Demo Evaluation
              </Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-4 pt-0.5">
            <span className="flex items-center gap-1.5">
              <Server size={13} className="text-emerald-700" />
              Target: <strong className="text-foreground">{scan.target?.name || 'FinSeva Customer Bot'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Languages size={13} className="text-emerald-700" />
              Languages: <strong className="text-foreground uppercase">{scan.languages?.join(', ') || 'EN, HI, HINGLISH'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-muted-foreground" />
              Created: <strong className="text-foreground">{formatDate(scan.created_at)}</strong>
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 gap-1 text-xs border-border hover:bg-accent">
            <RotateCw size={12} /> Refresh
          </Button>

          {isComplete && (
            <Button size="sm" asChild className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20">
              <Link href={`/scans/${scan.id}/report`}>
                <FileText size={13} /> Audit Report
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Live Pipeline or Results */}
      {!isComplete ? (
        <div className="space-y-6">
          <ScanPipelineProgress currentStage={currentStage} progress={progress} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LiveEventLog events={events} />
            </div>
            <div className="border border-border rounded-xl p-6 bg-card shadow-xs space-y-5">
              <h3 className="font-bold text-sm">Real-time Execution Metrics</h3>
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Execution Progress</div>
                  <div className="text-2xl font-extrabold text-emerald-700">{progress}%</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Evaluations Run</div>
                  <div className="text-xl font-bold">{scan.tests_completed} / {scan.total_tests || 24}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Judge Model</div>
                  <div className="text-sm font-semibold">{scan.judge_model} ({scan.judge_provider})</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ScanResultsWorkspace scan={scan} />
      )}
    </div>
  )
}
