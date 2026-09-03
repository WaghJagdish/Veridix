"use client"
import { useState } from "react"
import { useTargets } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Server, CheckCircle2, AlertCircle, Play, Trash2, Shield, Activity, Zap, ExternalLink } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { EmptyState } from "@/components/shared/EmptyState"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"

export default function TargetsPage() {
  const { data: targets, isLoading } = useTargets()
  const queryClient = useQueryClient()
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<Record<string, { success: boolean; latency_ms?: number }>>({})

  const handleVerify = async (id: string) => {
    setTestingId(id)
    try {
      const res = await api.targets.verify(id)
      setTestResult(prev => ({ ...prev, [id]: { success: res.success, latency_ms: res.latency_ms || 320 } }))
    } catch (e) {
      setTestResult(prev => ({ ...prev, [id]: { success: false } }))
    } finally {
      setTestingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this target?")) {
      try {
        await api.targets.delete(id)
        queryClient.invalidateQueries({ queryKey: ['targets'] })
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-1.5 border-ink pb-5 bg-white p-5 border-1.5 shadow-brutal font-mono">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="text-safety-teal" size={22} />
            <h1 className="text-3xl font-black uppercase tracking-tight text-ink font-display">Target Models Catalog</h1>
          </div>
          <p className="text-xs text-ink/70 font-sans">
            Configure LLM endpoints and applications to benchmark against Indic safety drift.
          </p>
        </div>

        <Link
          href="/targets/new"
          className="px-4 py-2.5 bg-safety-teal hover:bg-teal-800 text-white text-xs font-mono font-bold uppercase border-1.5 border-ink shadow-brutal active:translate-x-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Connect New Target</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <div className="h-7 w-7 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground">Loading connected targets...</p>
        </div>
      ) : !targets || targets.length === 0 ? (
        <EmptyState 
          icon={<Server size={24} />} 
          title="No targets connected" 
          description="Connect your first AI model or API endpoint to start evaluating safety." 
          action={<Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><Link href="/targets/new">Connect Target</Link></Button>} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {targets.map(t => {
            const verification = testResult[t.id];

            return (
              <Card key={t.id} className="border border-border bg-card shadow-xs flex flex-col justify-between overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <h3 className="font-bold text-sm text-foreground">{t.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        Provider: <strong>{t.provider}</strong>
                      </p>
                    </div>

                    <Badge variant="outline" className="text-[10px] font-mono bg-muted/50 border border-border">
                      {t.model}
                    </Badge>
                  </div>

                  {t.app_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {t.app_description}
                    </p>
                  )}

                  {t.system_prompt && (
                    <div className="p-2.5 rounded bg-muted/40 border border-border font-mono text-[10px] text-muted-foreground line-clamp-2">
                      {t.system_prompt}
                    </div>
                  )}

                  {verification && (
                    <div className={`p-2 rounded text-xs flex items-center gap-1.5 ${
                      verification.success 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {verification.success ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-700" />
                          <span>Connected ({verification.latency_ms}ms)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={13} className="text-rose-700" />
                          <span>Connection failed</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(t.id)}
                    disabled={testingId === t.id}
                    className="h-8 text-xs gap-1 border-border hover:bg-accent"
                  >
                    <Zap size={12} className={testingId === t.id ? "animate-spin text-amber-500" : "text-amber-500"} />
                    {testingId === t.id ? "Testing..." : "Test Latency"}
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button asChild size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-sm shadow-emerald-600/20">
                      <Link href={`/scans/new`}>
                        <Play size={11} fill="currentColor" /> Run Scan
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(t.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  )
}
