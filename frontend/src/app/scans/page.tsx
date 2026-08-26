"use client"
import { useState } from "react"
import { useScans } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import { Plus, Activity, Search, ShieldCheck, Flame, FileText, ArrowRight, Layers } from "lucide-react"
import Link from "next/link"
import { EmptyState } from "@/components/shared/EmptyState"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ScansPage() {
  const { data: scans, isLoading } = useScans()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = scans?.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.preset && s.preset.toLowerCase().includes(search.toLowerCase())) ||
      (s.target?.name && s.target.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-emerald-700" size={22} />
            <h1 className="text-2xl font-extrabold tracking-tight">Safety Scans</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Multilingual red-teaming evaluations and cross-language safety drift monitors.
          </p>
        </div>

        <Button asChild size="sm" className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20">
          <Link href="/scans/new">
            <Plus className="mr-1.5 h-4 w-4" /> Launch New Scan
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scans by name or target..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-card border border-input rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Statuses ({scans?.length || 0})</option>
            <option value="completed">Completed</option>
            <option value="running">Running / Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <div className="h-7 w-7 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading evaluation scans...</p>
        </div>
      ) : !scans || scans.length === 0 ? (
        <EmptyState 
          icon={<Activity size={24} />} 
          title="No safety scans found" 
          description="Configure your target model and run your first Indic safety evaluation." 
          action={<Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><Link href="/scans/new">Configure Scan</Link></Button>} 
        />
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase tracking-wider pl-4">Scan Name</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Target Model</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Preset & Languages</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Tests Run</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Created</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                    No scans match your search filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(s => {
                  const isComplete = s.status === 'completed';
                  const isRunning = s.status === 'running' || s.status === 'pending';

                  return (
                    <TableRow key={s.id} className="hover:bg-muted/40 transition-colors group">
                      <TableCell className="pl-4">
                        <div className="space-y-0.5">
                          <Link 
                            href={`/scans/${s.id}`} 
                            className="font-bold text-xs text-foreground group-hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                          >
                            {s.name}
                            {s.is_demo && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                DEMO
                              </span>
                            )}
                          </Link>
                          <span className="font-mono text-[10px] text-muted-foreground">{s.id.slice(0, 8)}...</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-medium text-foreground">
                        {s.target?.name || 'FinSeva Bot (gpt-4o-mini)'}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-[10px] capitalize font-semibold border-border">
                            {s.preset || 'Indic'} Scan
                          </Badge>
                          <div className="text-[10px] text-muted-foreground font-mono uppercase">
                            {s.languages?.join(', ') || 'EN, HI, HINGLISH'}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] uppercase font-bold tracking-wider ${
                            isComplete 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : isRunning
                              ? 'bg-teal-100 text-teal-800 border-teal-300 animate-pulse'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {isComplete ? 'Completed' : isRunning ? 'Running' : s.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-mono font-medium text-foreground">
                          {s.tests_completed} / {s.total_tests || 24}
                        </span>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(s.created_at)}
                      </TableCell>

                      <TableCell className="text-right pr-4 space-x-1">
                        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs hover:bg-emerald-50 hover:text-emerald-800">
                          <Link href={`/scans/${s.id}/report`} title="View PDF Report">
                            <FileText size={13} className="text-muted-foreground hover:text-emerald-800" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs hover:bg-emerald-50 hover:text-emerald-800">
                          <Link href={`/scans/${s.id}`} title="View Workspace">
                            <ArrowRight size={13} className="text-muted-foreground group-hover:text-emerald-700" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
