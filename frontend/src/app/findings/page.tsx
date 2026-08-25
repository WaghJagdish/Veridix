"use client"
import { FindingsTable } from "@/components/findings/FindingsTable"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export default function FindingsPage() {
  const { data: findings, isLoading } = useQuery({
    queryKey: ['findings', 'all'],
    queryFn: () => api.findings.listByScan('all').catch(() => []) // demo mock
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Findings Explorer</h1>
        <p className="text-muted-foreground">Investigate safety violations and drift events across all scans.</p>
      </div>
      
      <div className="flex">
        {/* Placeholder for filter sidebar if needed */}
        <div className="flex-1">
          {isLoading ? <div>Loading...</div> : <FindingsTable findings={findings || []} />}
        </div>
      </div>
    </div>
  )
}
