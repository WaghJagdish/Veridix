"use client"
import { ShieldAlert, Target, ShieldCheck, Activity } from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { RecentScansTable } from "@/components/dashboard/RecentScansTable"
import { SeverityDonut } from "@/components/charts/SeverityDonut"
import { useScans } from "@/hooks/useApi"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data: scans, isLoading } = useScans()

  if (isLoading) return <div className="p-6">Loading dashboard...</div>

  // Mock aggregates for demo
  const mockMetrics = {
    overallSafety: 74,
    safetyDrift: 10,
    criticalFindings: 3,
    testsRun: 45
  }

  const mockSeverity = {
    critical: 3,
    high: 8,
    medium: 12,
    low: 4
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your AI systems' safety posture.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Overall Safety Score" 
          value={`${mockMetrics.overallSafety}%`} 
          icon={<ShieldCheck className="h-4 w-4 text-green-500" />}
          description="Average across all targets"
        />
        <MetricCard 
          title="Safety Drift Events" 
          value={mockMetrics.safetyDrift}
          icon={<Activity className="h-4 w-4 text-orange-500" />}
          description="Cross-language divergence"
        />
        <MetricCard 
          title="Critical Findings" 
          value={mockMetrics.criticalFindings}
          icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
          description="Requires immediate attention"
        />
        <MetricCard 
          title="Total Tests Run" 
          value={mockMetrics.testsRun}
          icon={<Target className="h-4 w-4 text-slate-500" />}
          description="In the last 30 days"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentScansTable scans={scans || []} />
        </div>
        <div className="col-span-3">
          <SeverityDonut data={mockSeverity} />
        </div>
      </div>
    </div>
  )
}
