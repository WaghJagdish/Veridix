"use client"
import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Finding, Severity, Language } from "@/lib/types"
import { SeverityBadge } from "@/components/shared/SeverityBadge"
import { LanguageBadge } from "@/components/shared/LanguageBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { 
  ArrowRight, 
  Search, 
  Filter, 
  ShieldAlert, 
  ExternalLink,
  Flame,
  AlertTriangle,
  FileCode2
} from "lucide-react"

export function FindingsTable({ findings }: { findings: Finding[] }) {
  const [search, setSearch] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedLang, setSelectedLang] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  if (!findings || findings.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground border border-dashed rounded-xl bg-card/50">
        <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="font-semibold text-sm">No safety findings detected.</p>
        <p className="text-xs text-muted-foreground mt-1">All evaluated prompts passed their respective safety guardrails.</p>
      </div>
    );
  }

  const categories = Array.from(new Set(findings.map(f => f.category)));

  const filtered = findings.filter(f => {
    const matchesSearch = 
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.finding_ref.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase()) ||
      f.prompt.toLowerCase().includes(search.toLowerCase()) ||
      (f.owasp_ref && f.owasp_ref.toLowerCase().includes(search.toLowerCase()));

    const matchesSeverity = selectedSeverity === "all" || f.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchesLang = selectedLang === "all" || f.language.toLowerCase() === selectedLang.toLowerCase();
    const matchesCat = selectedCategory === "all" || f.category === selectedCategory;

    return matchesSearch && matchesSeverity && matchesLang && matchesCat;
  });

  const severityCounts = {
    all: findings.length,
    critical: findings.filter(f => f.severity === 'critical').length,
    high: findings.filter(f => f.severity === 'high').length,
    medium: findings.filter(f => f.severity === 'medium').length,
    low: findings.filter(f => f.severity === 'low').length,
  };

  return (
    <div className="space-y-4">
      {/* Filtering Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search findings, attack prompts, refs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="h-9 px-3 text-xs bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.replace(/_/g, ' ').toUpperCase()}</option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={selectedLang}
            onChange={e => setSelectedLang(e.target.value)}
            className="h-9 px-3 text-xs bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Languages</option>
            <option value="en">English (EN)</option>
            <option value="hi">Hindi (HI)</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>
      </div>

      {/* Severity Tabs Pill Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => {
          const count = severityCounts[sev];
          const isSelected = selectedSeverity === sev;

          return (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSelected 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <span className="capitalize">{sev}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-card text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-24 text-xs font-bold uppercase tracking-wider">Ref ID</TableHead>
              <TableHead className="w-28 text-xs font-bold uppercase tracking-wider">Severity</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Category</TableHead>
              <TableHead className="w-28 text-xs font-bold uppercase tracking-wider">Language</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Safety Drift</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Finding Title & Prompt Snippet</TableHead>
              <TableHead className="w-16 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  No findings match the active search and filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(f => {
                const hasDrift = f.drift_level && f.drift_level !== 'none';

                return (
                  <TableRow key={f.id} className="hover:bg-muted/40 transition-colors group">
                    <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                      {f.finding_ref}
                    </TableCell>

                    <TableCell>
                      <SeverityBadge severity={f.severity} />
                    </TableCell>

                    <TableCell className="capitalize text-xs font-medium text-foreground">
                      {f.category.replace(/_/g, ' ')}
                    </TableCell>

                    <TableCell>
                      <LanguageBadge lang={f.language} />
                    </TableCell>

                    <TableCell>
                      {hasDrift ? (
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] font-bold uppercase ${
                            f.drift_level === 'critical' ? 'border-rose-300 text-rose-800 bg-rose-100' :
                            f.drift_level === 'high' ? 'border-orange-300 text-orange-800 bg-orange-100' :
                            'border-amber-300 text-amber-800 bg-amber-100'
                          }`}
                        >
                          <Flame className="w-3 h-3 mr-1" />
                          {f.drift_level} ({f.drift_score?.toFixed(2)})
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5 max-w-md">
                        <div className="font-semibold text-xs text-foreground truncate group-hover:text-emerald-700 transition-colors">
                          {f.title}
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono truncate">
                          &quot;{f.prompt}&quot;
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 hover:bg-emerald-50 hover:text-emerald-800">
                        <Link href={`/scans/${f.scan_id}/findings/${f.id}`} title="Inspect finding">
                          <ArrowRight size={15} className="text-muted-foreground group-hover:text-emerald-700 transition-colors" />
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
    </div>
  );
}
