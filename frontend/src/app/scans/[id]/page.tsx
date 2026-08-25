"use client"
import { useScan } from "@/hooks/useApi"
import { useScanEvents } from "@/hooks/useScanEvents"
import { ScanPipelineProgress } from "@/components/scans/ScanPipelineProgress"
import { LiveEventLog } from "@/components/scans/LiveEventLog"
import { ScanResultsWorkspace } from "@/components/scans/ScanResultsWorkspace"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  const { data: scan, isLoading } = useScan(params.id)
  
  // Is running or pending
  const isRunning = scan ? ['pending', 'running'].includes(scan.status) : false;
  
  const { events, currentStage, progress } = useScanEvents(params.id, isRunning)

  if (isLoading) return <div>Loading scan...</div>
  if (!scan) return <div>Scan not found</div>

  const isComplete = scan.status === 'completed' || currentStage === 'complete';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{scan.name}</h1>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {isComplete ? 'Completed' : 'Running'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-4">
            <span>Target: {scan.target?.name || 'Unknown'}</span>
            <span>Started: {formatDate(scan.created_at)}</span>
          </div>
        </div>
      </div>

      {!isComplete ? (
        <div className="space-y-6">
          <ScanPipelineProgress currentStage={currentStage} progress={progress} />
          
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <LiveEventLog events={events} />
            </div>
            <div className="col-span-1 border rounded-lg p-6 bg-card">
              <h3 className="font-semibold mb-4">Live Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Progress</div>
                  <div className="text-2xl font-bold">{progress}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Tests Completed</div>
                  <div className="text-xl">{scan.tests_completed} / {scan.total_tests}</div>
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
