"use client"
import { FindingsTable } from "@/components/findings/FindingsTable"
import { useFindings } from "@/hooks/useApi"

export default function ScanFindingsPage({ params }: { params: { id: string } }) {
  const { data: findings, isLoading } = useFindings(params.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scan Findings</h1>
      </div>
      {isLoading ? <div>Loading...</div> : <FindingsTable findings={findings || []} />}
    </div>
  )
}
