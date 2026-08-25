"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download executive summaries.</p>
        </div>
      </div>

      <EmptyState 
        icon={<FileText size={24} />} 
        title="No reports generated" 
        description="Go to a completed scan to generate a PDF report." 
      />
    </div>
  )
}
