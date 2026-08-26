"use client"
import React, { useState } from "react"
import { TestCaseDetail, LanguageVariantDetail } from "@/lib/types"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VerdictBadge } from "@/components/shared/VerdictBadge"
import { LanguageBadge } from "@/components/shared/LanguageBadge"
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Layers
} from "lucide-react"

export function TestCasesTable({ testCases }: { testCases?: TestCaseDetail[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  if (!testCases || testCases.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground border border-dashed rounded-xl bg-card/40">
        <Layers className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="font-medium">No test cases found for this scan.</p>
        <p className="text-xs text-muted-foreground mt-1">Run an evaluation scan to generate multilingual test cases.</p>
      </div>
    )
  }

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAll = () => {
    const allExpanded = testCases.every(tc => expandedIds[tc.id])
    if (allExpanded) {
      setExpandedIds({})
    } else {
      const newExpanded: Record<string, boolean> = {}
      testCases.forEach(tc => { newExpanded[tc.id] = true })
      setExpandedIds(newExpanded)
    }
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const categories = Array.from(new Set(testCases.map(tc => tc.attack_category)))

  const filtered = testCases.filter(tc => {
    const matchesSearch = 
      tc.semantic_intent.toLowerCase().includes(search.toLowerCase()) ||
      tc.base_prompt_en.toLowerCase().includes(search.toLowerCase()) ||
      (tc.owasp_ref && tc.owasp_ref.toLowerCase().includes(search.toLowerCase())) ||
      tc.attack_category.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === "all" || tc.attack_category === selectedCategory;

    return matchesSearch && matchesCat;
  })

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search intent, prompt, or OWASP ref..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="h-9 px-3 text-xs bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Threat Categories ({testCases.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleAll}
            className="h-9 text-xs"
          >
            {testCases.every(tc => expandedIds[tc.id]) ? "Collapse All" : "Expand All"}
          </Button>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Semantic Intent & Category</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">OWASP Ref</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Safety Drift</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-right">Multilingual Verdicts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(tc => {
              const isExpanded = !!expandedIds[tc.id]
              const hasDrift = tc.drift_level && tc.drift_level !== 'none'

              return (
                <React.Fragment key={tc.id}>
                  <TableRow 
                    className={`cursor-pointer hover:bg-muted/40 transition-colors ${isExpanded ? 'bg-muted/30' : ''}`}
                    onClick={() => toggleExpand(tc.id)}
                  >
                    <TableCell className="pl-4">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                          <span>{tc.semantic_intent}</span>
                          <span className="capitalize text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                            {tc.attack_category.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono truncate max-w-xl">
                          {tc.base_prompt_en}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {tc.owasp_ref ? (
                        <Badge variant="outline" className="text-[10px] font-mono border-emerald-300 text-emerald-800 bg-emerald-100">
                          {tc.owasp_ref}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {hasDrift ? (
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] font-bold uppercase ${
                            tc.drift_level === 'critical' ? 'border-rose-300 text-rose-800 bg-rose-100' :
                            tc.drift_level === 'high' ? 'border-orange-300 text-orange-800 bg-orange-100' :
                            'border-amber-300 text-amber-800 bg-amber-100'
                          }`}
                        >
                          <ShieldAlert className="w-3 h-3 mr-1" />
                          {tc.drift_level} Drift ({tc.drift_score?.toFixed(2)})
                        </Badge>
                      ) : (
                        <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Consistent
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {tc.variants.map(v => {
                          const verdict = v.evaluation?.verdict || v.verdict || 'unknown'
                          return (
                            <span key={v.language} className="inline-flex items-center gap-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{v.language}:</span>
                              <VerdictBadge verdict={verdict} />
                            </span>
                          )
                        })}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Multilingual Detail Row */}
                  {isExpanded && (
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableCell colSpan={5} className="p-4 pl-12">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-border">
                            <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                              Cross-Language Execution Variants ({tc.variants.length})
                            </span>
                            {tc.attack_strategy && (
                              <span className="text-xs text-muted-foreground">
                                Strategy: <strong className="text-foreground">{tc.attack_strategy}</strong>
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {tc.variants.map(v => {
                              const evalData = v.evaluation
                              const verdict = evalData?.verdict || v.verdict || 'unknown'
                              const promptKey = `tc-${tc.id}-${v.language}`

                              return (
                                <div 
                                  key={v.language} 
                                  className="p-3.5 rounded-lg border border-border bg-card space-y-2.5 shadow-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <LanguageBadge lang={v.language} />
                                    <VerdictBadge verdict={verdict} />
                                  </div>

                                  <div>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase mb-1">
                                      <span>Prompt</span>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleCopy(v.prompt, promptKey); }}
                                        className="text-muted-foreground hover:text-foreground p-0.5"
                                        title="Copy prompt"
                                      >
                                        {copiedKey === promptKey ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                                      </button>
                                    </div>
                                    <div className="bg-emerald-950/5 text-emerald-950 p-2.5 rounded font-mono text-[11px] leading-relaxed max-h-24 overflow-y-auto border border-emerald-200/80">
                                      {v.prompt}
                                    </div>
                                  </div>

                                  <div>
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase mb-1">
                                      <span>Model Response</span>
                                    </div>
                                    <div className="bg-muted/50 p-2.5 rounded font-mono text-[11px] leading-relaxed max-h-28 overflow-y-auto text-foreground border border-border">
                                      {v.response || <span className="italic text-muted-foreground">No response</span>}
                                    </div>
                                  </div>

                                  {evalData?.reasoning && (
                                    <div className="text-[10px] text-muted-foreground bg-muted/40 p-2 rounded border border-border">
                                      <strong>Judge:</strong> {evalData.reasoning}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
