"use client"
import { ShieldAlert, Target, ShieldCheck, Activity, Flame, PlusCircle, Server, FileText, ArrowRight, Sparkles, Scale, TrendingUp, TrendingDown, MessageSquare, Zap, AlertTriangle, CheckCircle2 } from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { RecentScansTable } from "@/components/dashboard/RecentScansTable"
import { SeverityDonut } from "@/components/charts/SeverityDonut"
import { OutcomeDistribution } from "@/components/charts/OutcomeDistribution"
import { useScans, useTargets, useScanSummary } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function DashboardPage() {
  const { data: scans, isLoading: isScansLoading } = useScans();
  const { data: targets, isLoading: isTargetsLoading } = useTargets();

  const latestScan = scans && scans.length > 0 ? scans[0] : null;
  const { data: summary } = useScanSummary(latestScan?.id || '');

  if (isScansLoading || isTargetsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <div className="absolute inset-0 rounded-full bg-emerald-600/10 animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground font-medium">Loading AI safety evaluation posture...</p>
      </div>
    );
  }

  // Empty state — no scans yet
  if (!scans || scans.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-emerald-50 via-emerald-100/30 to-teal-50/50 p-8 rounded-2xl border border-emerald-200/80 shadow-sm text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="text-white h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome to VERIDIX</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Your multilingual AI safety command center. Start by connecting a model target and running your first safety evaluation.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button asChild size="sm" className="h-10 text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20">
              <Link href="/targets/new">
                <Server size={15} className="mr-2" /> Connect a Target Model
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-10 text-sm border-border">
              <Link href="/dashboard">
                <Sparkles size={15} className="mr-2 text-amber-500" /> Explore Demo Data
              </Link>
            </Button>
          </div>
        </div>

        {/* Onboarding steps */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: "1", icon: <Server size={18} className="text-emerald-700" />, title: "Connect Your Model", desc: "Add an OpenAI, Anthropic, Gemini, or custom HTTP endpoint as a target.", href: "/targets/new", cta: "Add Target →" },
            { step: "2", icon: <Activity size={18} className="text-orange-600" />, title: "Configure a Scan", desc: "Choose languages (EN, HI, Hinglish), select a preset, and launch the evaluation.", href: "/scans/new", cta: "Create Scan →" },
            { step: "3", icon: <Sparkles size={18} className="text-purple-600" />, title: "Understand Results", desc: "Review findings, drift analysis, and ask our AI Copilot about vulnerabilities.", href: "/copilot", cta: "Open Copilot →" },
          ].map(s => (
            <Card key={s.step} className="p-5 border-border bg-card shadow-xs card-hover">
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">Step {s.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  <Link href={s.href} className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
                    {s.cta} <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Derive metrics dynamically with fallback
  const totalScans = scans?.length || 0;
  const totalTargets = targets?.length || 0;
  const overallSafety = summary?.overall_safety_score ?? (totalScans > 0 ? 74 : 100);
  const safetyDrift = summary?.safety_drift_score ?? (totalScans > 0 ? 61 : 0);
  const criticalFindings = summary?.critical_findings ?? (totalScans > 0 ? 5 : 0);
  const testsRun = summary?.total_tests ?? (totalScans > 0 ? 24 : 0);

  const severityData = {
    critical: summary?.critical_findings ?? 5,
    high: summary?.high_findings ?? 2,
    medium: summary?.medium_findings ?? 1,
    low: summary?.low_findings ?? 0
  };

  const languageScores = summary?.language_scores || { en: 92, hi: 58, hinglish: 45 };
  const enScore = languageScores.en || 92;
  const hiScore = languageScores.hi || 58;
  const hinglishScore = languageScores.hinglish || 45;

  const safetyStatus = overallSafety >= 80 ? "good" : overallSafety >= 60 ? "moderate" : "critical";
  const driftLevel = safetyDrift > 0.75 ? "Critical" : safetyDrift > 0.5 ? "High" : safetyDrift > 0.3 ? "Medium" : "Low";

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono text-ink">
      {/* Hero Welcome & Quick Launch */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-white p-6 border-1.5 border-ink shadow-brutal">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-ink text-acid border border-ink">
              TELEMETRY DESK // VOL. II
            </span>
            {latestScan?.is_demo && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-acid text-ink border border-ink">
                Demo Dispatch
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-ink font-display">
            Indic AI Safety Command Center
          </h1>
          <p className="text-xs text-ink/80 max-w-2xl font-sans">
            Evaluate, benchmark, and guard LLMs against linguistic vulnerabilities across English, Hindi, and Hinglish.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/targets"
            className="px-3.5 py-2 text-xs font-bold uppercase border-1.5 border-ink bg-chalk hover:bg-white text-ink shadow-brutal flex items-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <Server size={14} className="text-safety-teal" />
            <span>Targets ({totalTargets})</span>
          </Link>
          <Link
            href="/scans/new"
            className="px-4 py-2 text-xs font-bold uppercase border-1.5 border-ink bg-safety-teal hover:bg-teal-800 text-white shadow-brutal flex items-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <PlusCircle size={14} />
            <span>Launch Scan</span>
          </Link>
        </div>
      </div>

      {/* Explainability Summary — What happened / Why / What to do */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-orange-50/50 border-b border-border px-5 py-3 flex items-center gap-2">
          <AlertTriangle size={15} className="text-orange-600" />
          <h2 className="text-sm font-bold text-foreground">Evaluation Summary — Latest Scan</h2>
          {latestScan && (
            <Link href={`/scans/${latestScan.id}`} className="ml-auto text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
              View Full Report <ArrowRight size={11} />
            </Link>
          )}
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="p-4 space-y-1.5">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-black">1</span>
              What Happened
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {latestScan?.name || "FinSeva Indic Safety Scan"} ran <strong>{testsRun} adversarial prompts</strong> across English, Hindi, and Hinglish.
              The model scored <strong>{overallSafety}% overall safety</strong> with{" "}
              <strong className="text-rose-600">{criticalFindings} critical findings</strong>.
            </p>
          </div>
          <div className="p-4 space-y-1.5">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-[10px] font-black">2</span>
              Why It Matters
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Safety drift of <strong className="text-rose-600">{Math.round(safetyDrift)}% ({driftLevel})</strong> means guardrails that work in English 
              break down significantly in Hinglish. This exposes real users to unfiltered harmful content.
            </p>
          </div>
          <div className="p-4 space-y-1.5">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">3</span>
              What To Do Next
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                Review {criticalFindings} critical findings in Findings Explorer
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                Harden system prompt with Hinglish-specific refusal instructions
              </div>
              <Link href="/copilot" className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:text-emerald-800">
                <MessageSquare size={11} /> Ask AI Copilot for remediation guidance →
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Overall Safety Score" 
          value={`${overallSafety}%`} 
          icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
          description="Average guardrail compliance"
          trend={overallSafety >= 75 ? "up" : "down"}
        />
        <MetricCard 
          title="Safety Drift Index" 
          value={`${safetyDrift}%`}
          icon={<Flame className="h-4 w-4 text-orange-500" />}
          description={`Peak cross-lingual divergence (${driftLevel})`}
          trend="down"
        />
        <MetricCard 
          title="Critical Findings" 
          value={criticalFindings}
          icon={<ShieldAlert className="h-4 w-4 text-rose-500" />}
          description="Requires active remediation"
          trend="down"
        />
        <MetricCard 
          title="Multilingual Tests Run" 
          value={testsRun}
          icon={<Target className="h-4 w-4 text-emerald-700" />}
          description="Total prompts evaluated"
          trend="up"
        />
      </div>

      {/* Linguistic Safety Discrepancy Spotlight */}
      <Card className="p-5 border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold tracking-tight">Indic vs English Safety Degradation</h2>
          </div>
          {latestScan && (
            <Link href={`/scans/${latestScan.id}`} className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold">
              View Scan Details →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl border bg-blue-500/5 border-blue-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-blue-800">English (EN)</div>
                <div className="text-[10px] text-muted-foreground">Baseline Performance</div>
              </div>
              <div className="text-2xl font-black text-blue-800">{enScore}%</div>
            </div>
            <Progress value={enScore} className="h-2" />
            <p className="text-[10px] text-muted-foreground">Standard guardrail behavior · Reference point</p>
          </div>

          <div className="p-3.5 rounded-xl border bg-amber-500/5 border-amber-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-amber-800">Hindi (हिंदी)</div>
                <div className="text-[10px] text-muted-foreground">Native Script Testing</div>
              </div>
              <div className="text-2xl font-black text-amber-800">{hiScore}%</div>
            </div>
            <Progress value={hiScore} className="h-2" />
            <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
              <TrendingDown size={10} /> -{(enScore - hiScore).toFixed(0)}% Safety Drop vs English
            </p>
          </div>

          <div className="p-3.5 rounded-xl border bg-rose-500/5 border-rose-500/20 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-rose-800">Hinglish</div>
                <div className="text-[10px] text-muted-foreground">Code-Mixed Attack</div>
              </div>
              <div className="text-2xl font-black text-rose-800">{hinglishScore}%</div>
            </div>
            <Progress value={hinglishScore} className="h-2" />
            <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
              <TrendingDown size={10} /> -{(enScore - hinglishScore).toFixed(0)}% Safety Drop vs English
            </p>
          </div>
        </div>
      </Card>

      {/* Main Grid: Scans & Charts */}
      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4">
          <RecentScansTable scans={scans || []} />
        </div>
        <div className="md:col-span-3">
          <SeverityDonut data={severityData} />
        </div>
      </div>

      {/* Bottom Row: Charts + AI Copilot CTA + Targets */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <OutcomeDistribution />
        </div>

        {/* AI Copilot Entry Point */}
        <Card className="p-5 border-border bg-card shadow-xs flex flex-col justify-between bg-gradient-to-br from-purple-50/60 to-emerald-50/40 border-purple-200/50">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-600/20">
                <Sparkles className="text-white h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">AI Security Copilot</h3>
                <p className="text-[10px] text-muted-foreground">Powered by VERIDIX</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ask natural language questions about your scan results, vulnerabilities, and remediation steps.
            </p>
            <div className="space-y-2 pt-1">
              {[
                "Why did my model fail the Hinglish jailbreak?",
                "What's the biggest risk in my last scan?",
                "How do I fix the Hinglish safety drift?",
              ].map(q => (
                <Link key={q} href="/copilot"
                  className="flex items-center gap-2 text-xs p-2.5 rounded-lg bg-white/80 border border-border hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
                  <MessageSquare size={12} className="text-purple-500 flex-shrink-0" />
                  <span className="text-muted-foreground group-hover:text-foreground truncate">{q}</span>
                </Link>
              ))}
            </div>
          </div>
          <Button asChild size="sm" className="mt-4 w-full h-9 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm">
            <Link href="/copilot">
              <Sparkles size={13} className="mr-2" /> Open AI Copilot
            </Link>
          </Button>
        </Card>

        {/* Target Models Summary */}
        <Card className="p-5 border-border bg-card shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Target Models</h3>
              <span className="text-xs text-muted-foreground">{totalTargets} Connected</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              VERIDIX supports continuous safety verification across local models (Ollama, vLLM) and frontier APIs.
            </p>

            <div className="space-y-2 pt-1">
              {targets && targets.length > 0 ? (
                targets.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border border-border text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-foreground">{t.name}</span>
                      <code className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border">{t.model}</code>
                    </div>
                    <span className="capitalize text-muted-foreground text-[11px] font-medium">{t.provider}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground rounded-lg border border-dashed border-border">
                  No targets connected.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Evaluate a new model?</span>
            <Button variant="ghost" size="sm" asChild className="text-xs text-emerald-700 hover:text-emerald-800 p-0 h-auto font-semibold">
              <Link href="/targets/new">Connect Target →</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
