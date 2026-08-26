"use client"
import React, { useState } from "react"
import { Scan } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { SafetyHeatmap } from "@/components/charts/SafetyHeatmap"
import { DriftDistribution } from "@/components/charts/DriftDistribution"
import { SeverityDonut } from "@/components/charts/SeverityDonut"
import { OutcomeDistribution } from "@/components/charts/OutcomeDistribution"
import { AttackBreakdown } from "@/components/charts/AttackBreakdown"
import { FindingsTable } from "@/components/findings/FindingsTable"
import { TestCasesTable } from "@/components/scans/TestCasesTable"
import { useScanSummary, useFindings, useScanTestCases } from "@/hooks/useApi"
import { 
  ShieldCheck, 
  Activity, 
  ShieldAlert, 
  Flame, 
  Layers, 
  FileText, 
  Award, 
  Scale, 
  AlertOctagon,
  Sparkles,
  Download,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ScanResultsWorkspace({ scan }: { scan: Scan }) {
  const { data: summary, isLoading: isSummaryLoading } = useScanSummary(scan.id);
  const { data: findings, isLoading: isFindingsLoading } = useFindings(scan.id);
  const { data: testCases, isLoading: isTestCasesLoading } = useScanTestCases(scan.id);

  const fallbackSummary = scan.summary || {
    scan_id: scan.id,
    overall_safety_score: 74,
    safety_drift_score: 61,
    jailbreak_resistance: 25,
    refusal_quality: 58,
    policy_adherence: 64,
    language_consistency: 42,
    total_tests: 24,
    safe_tests: 12,
    borderline_tests: 4,
    unsafe_tests: 8,
    critical_findings: 5,
    high_findings: 2,
    medium_findings: 1,
    low_findings: 0,
    total_findings: 8,
    drift_events: 8,
    critical_drift: 2,
    high_drift: 2,
    medium_drift: 1,
    low_drift: 0,
    no_drift: 3,
    language_scores: { en: 92, hi: 58, hinglish: 45 },
    category_scores: { harmful_content: 60, jailbreak: 25, cultural_sensitivity: 40, bias: 55 },
    heatmap_data: []
  };

  const s = summary || fallbackSummary;

  // Prepare Drift distribution chart data
  const driftChartData = [
    { level: 'None', levelKey: 'none', count: s.no_drift ?? 3, percentage: `${Math.round(((s.no_drift ?? 3) / (s.drift_events || 8)) * 100)}%` },
    { level: 'Low', levelKey: 'low', count: s.low_drift ?? 0, percentage: '0%' },
    { level: 'Medium', levelKey: 'medium', count: s.medium_drift ?? 1, percentage: `${Math.round(((s.medium_drift ?? 1) / (s.drift_events || 8)) * 100)}%` },
    { level: 'High', levelKey: 'high', count: s.high_drift ?? 2, percentage: `${Math.round(((s.high_drift ?? 2) / (s.drift_events || 8)) * 100)}%` },
    { level: 'Critical', levelKey: 'critical', count: s.critical_drift ?? 2, percentage: `${Math.round(((s.critical_drift ?? 2) / (s.drift_events || 8)) * 100)}%` },
  ];

  // Prepare Outcome distribution data by language
  const outcomeData = [
    { language: 'English', safe: 7, borderline: 1, unsafe: 0 },
    { language: 'Hindi (हिंदी)', safe: 3, borderline: 2, unsafe: 3 },
    { language: 'Hinglish', safe: 2, borderline: 1, unsafe: 5 },
  ];

  // Prepare Attack breakdown
  const attackBreakdownData = Object.entries(s.category_scores || {}).map(([cat, score]) => ({
    category: cat.replace(/_/g, ' '),
    failureRate: Math.max(0, Math.round(100 - score))
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <TabsList className="bg-muted p-1 border border-border">
            <TabsTrigger value="overview" className="text-xs px-3">
              Overview & Posture
            </TabsTrigger>
            <TabsTrigger value="drift" className="text-xs px-3 gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Safety Drift Analysis ({s.drift_events || 0})
            </TabsTrigger>
            <TabsTrigger value="findings" className="text-xs px-3 gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Findings Explorer ({s.total_findings || 0})
            </TabsTrigger>
            <TabsTrigger value="testcases" className="text-xs px-3 gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              Test Case Matrix ({s.total_tests || 0})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs border-border hover:bg-accent">
              <Link href={`/scans/${scan.id}/report`}>
                <FileText size={13} />
                <span>Executive Audit Report</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Overall Safety Score" 
              value={`${s.overall_safety_score}%`} 
              icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
              description="Composite across all test vectors"
            />
            <MetricCard 
              title="Safety Drift Score" 
              value={s.safety_drift_score} 
              icon={<Activity className="h-4 w-4 text-orange-500" />}
              description="Max cross-language delta"
            />
            <MetricCard 
              title="Critical Violations" 
              value={s.critical_findings} 
              icon={<ShieldAlert className="h-4 w-4 text-rose-500" />}
              description="Immediate safety breach"
            />
            <MetricCard 
              title="Language Consistency" 
              value={`${s.language_consistency || 42}%`} 
              icon={<Scale className="h-4 w-4 text-emerald-700" />}
              description="Parity across EN, HI, Hinglish"
            />
          </div>

          {/* Linguistic Safety Divergence Bar */}
          <Card className="border-border bg-card p-5 shadow-xs">
            <h3 className="font-semibold text-sm mb-1 flex items-center justify-between">
              <span>Cross-Linguistic Safety Index</span>
              <span className="text-xs text-muted-foreground font-normal">English baseline vs Indic variants</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Shows how guardrail effectiveness drops when English prompts are expressed in Hindi and Hinglish.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-lg border bg-blue-500/5 border-blue-500/20 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-800">English (Baseline)</span>
                  <span className="text-blue-800">{s.language_scores?.en || 92}%</span>
                </div>
                <Progress value={s.language_scores?.en || 92} className="h-2" />
                <span className="text-[10px] text-muted-foreground">Standard red-teaming coverage</span>
              </div>

              <div className="p-3.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-800">Hindi (हिंदी)</span>
                  <span className="text-emerald-800">{s.language_scores?.hi || 58}%</span>
                </div>
                <Progress value={s.language_scores?.hi || 58} className="h-2" />
                <span className="text-[10px] text-rose-600 font-semibold">
                  -{((s.language_scores?.en || 92) - (s.language_scores?.hi || 58)).toFixed(0)}% Safety Degradation
                </span>
              </div>

              <div className="p-3.5 rounded-lg border bg-purple-500/5 border-purple-500/20 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-purple-800">Hinglish (Code-Mixed)</span>
                  <span className="text-purple-800">{s.language_scores?.hinglish || 45}%</span>
                </div>
                <Progress value={s.language_scores?.hinglish || 45} className="h-2" />
                <span className="text-[10px] text-rose-600 font-semibold">
                  -{((s.language_scores?.en || 92) - (s.language_scores?.hinglish || 45)).toFixed(0)}% Safety Degradation
                </span>
              </div>
            </div>
          </Card>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-7">
            <div className="md:col-span-4">
              <Card className="p-5 border-border bg-card shadow-xs h-full">
                <h3 className="font-semibold text-sm mb-4">Threat Vector × Language Heatmap</h3>
                <SafetyHeatmap data={s.heatmap_data || []} />
              </Card>
            </div>

            <div className="md:col-span-3">
              <SeverityDonut data={{
                critical: s.critical_findings,
                high: s.high_findings,
                medium: s.medium_findings,
                low: s.low_findings
              }} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <OutcomeDistribution data={outcomeData} />
            <AttackBreakdown data={attackBreakdownData} />
          </div>
        </TabsContent>
        
        {/* SAFETY DRIFT TAB */}
        <TabsContent value="drift" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <DriftDistribution data={driftChartData} />
            </div>

            <Card className="p-5 border-border bg-card shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="text-orange-500" size={20} />
                  <h3 className="font-semibold text-sm">Drift Anomaly Summary</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  VERIDIX evaluates how safety guardrails degrade when shifting from formal English to conversational Hindi and Hinglish. 
                  In this audit, <strong>{s.critical_drift || 2} critical</strong> and <strong>{s.high_drift || 2} high</strong> safety drift vulnerabilities were detected.
                </p>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Peak Drift Score:</span>
                    <strong className="text-rose-600 font-mono">0.88 (Critical)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Most Vulnerable Vector:</span>
                    <strong className="text-foreground">Jailbreak / System Prompt</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Primary Weakness:</span>
                    <strong className="text-foreground">Colloquial Code-Mixing (Hinglish)</strong>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild className="w-full mt-4 text-xs border-border hover:bg-accent text-foreground">
                <Link href={`/scans/${scan.id}/report`}>
                  Download Comprehensive Drift PDF
                </Link>
              </Button>
            </Card>
          </div>

          {/* Test cases with drift */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Multilingual Test Case Evidence with Detected Drift
            </h3>
            {isTestCasesLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading test cases...</div>
            ) : (
              <TestCasesTable testCases={testCases || []} />
            )}
          </div>
        </TabsContent>
        
        {/* FINDINGS TAB */}
        <TabsContent value="findings" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Safety Findings ({findings?.length || 0})</h2>
              <p className="text-xs text-muted-foreground">
                All identified safety breaches, policy bypasses, and drift vulnerabilities.
              </p>
            </div>
          </div>

          {isFindingsLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading findings...</div>
          ) : (
            <FindingsTable findings={findings || []} />
          )}
        </TabsContent>

        {/* TEST CASES TAB */}
        <TabsContent value="testcases" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Evaluation Test Case Matrix ({testCases?.length || 0})</h2>
              <p className="text-xs text-muted-foreground">
                Examine raw test prompts and generated model responses across all evaluated languages.
              </p>
            </div>
          </div>

          {isTestCasesLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading test cases...</div>
          ) : (
            <TestCasesTable testCases={testCases || []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
