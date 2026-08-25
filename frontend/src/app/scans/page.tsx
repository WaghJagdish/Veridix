"use client"
import { useScans } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import { Plus, Activity } from "lucide-react"
import Link from "next/link"
import { RecentScansTable } from "@/components/dashboard/RecentScansTable"
import { EmptyState } from "@/components/shared/EmptyState"

export default function ScansPage() {
  const { data: scans, isLoading } = useScans()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scans</h1>
          <p className="text-muted-foreground">Monitor and analyze AI safety evaluations.</p>
        </div>
        <Button asChild>
          <Link href="/scans/new"><Plus className="mr-2 h-4 w-4" /> New Scan</Link>
        </Button>
      </div>

      {isLoading ? (
        <div>Loading scans...</div>
      ) : !scans || scans.length === 0 ? (
        <EmptyState 
          icon={<Activity size={24} />} 
          title="No scans found" 
          description="Run your first evaluation to start testing." 
          action={<Button asChild><Link href="/scans/new">Configure Scan</Link></Button>} 
        />
      ) : (
        <RecentScansTable scans={scans} />
      )}
    </div>
  )
}
