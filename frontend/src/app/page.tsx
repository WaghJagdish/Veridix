"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  ShieldCheck, ArrowRight, Zap, Globe, Activity, FileText,
  Terminal, ChevronRight, Sparkles, Star, Shield, Lock,
  BarChart3, GitBranch, AlertTriangle, CheckCircle2, ExternalLink,
  Play, MessageSquare, Code, Layers
} from "lucide-react"

// ─── Animated Counter ────────────────────────────────────────
function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1800
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end])
  return <>{count}{suffix}</>
}

// ─── Nav ─────────────────────────────────────────────────────
function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#030d06]/95 backdrop-blur-xl border-b border-[rgba(34,197,94,0.15)]" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="text-white h-5 w-5" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">VERIDIX</span>
            <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">v0.1</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "How It Works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "API Docs", href: "http://localhost:8000/docs", external: true },
          ].map(item => (
            <a key={item.label} href={item.href} target={item.external ? "_blank" : undefined}
              className="text-sm text-[#6b8f78] hover:text-emerald-400 transition-colors flex items-center gap-1">
              {item.label}
              {item.external && <ExternalLink size={11} />}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard"
            className="text-sm text-[#6b8f78] hover:text-white transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link href="/dashboard"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 flex items-center gap-1.5">
            Start Testing
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────
function HeroSection() {
  const [demoLoading, setDemoLoading] = useState(false)

  const handleExploreDemo = () => {
    setDemoLoading(true)
    setTimeout(() => window.location.href = "/dashboard", 800)
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 landing-grid opacity-40" />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-emerald-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-teal-500/6 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Pill badge */}
        <div className="animate-fade-in-up flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Now Testing: FinSeva AI Safety Audit — 24 adversarial prompts across 3 languages
          </span>
        </div>

        {/* Headline */}
        <div className="animate-fade-in-up delay-100 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
            <span className="text-white">Your AI Speaks English.</span>
            <br />
            <span className="text-gradient-hero">Your Users Don&apos;t.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6b8f78] max-w-3xl mx-auto leading-relaxed">
            VERIDIX is the AI safety platform built for the multilingual world.
            Test, evaluate, and monitor LLMs against adversarial attacks in{" "}
            <strong className="text-emerald-400">English, Hindi, and Hinglish</strong>{" "}
            — and discover where your guardrails break down.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="animate-fade-in-up delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={handleExploreDemo}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98]">
            {demoLoading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Zap size={16} className="group-hover:animate-bounce" />
            )}
            {demoLoading ? "Loading Demo..." : "Explore Demo →"}
          </button>
          <Link href="/get-started"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[rgba(34,197,94,0.25)] text-[#e8f5ec] hover:border-emerald-500/50 hover:bg-emerald-500/5 font-semibold text-sm transition-all hover:scale-[1.02]">
            <Play size={14} fill="currentColor" className="text-emerald-500" />
            Start Testing
          </Link>
        </div>

        {/* Social proof */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-[#6b8f78]">
          {[
            { icon: <CheckCircle2 size={13} className="text-emerald-500" />, text: "No API key required for demo" },
            { icon: <CheckCircle2 size={13} className="text-emerald-500" />, text: "40 semantic intents library" },
            { icon: <CheckCircle2 size={13} className="text-emerald-500" />, text: "OWASP LLM Top 10 mapped" },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-1.5">{item.icon} {item.text}</div>
          ))}
        </div>

        {/* Hero Visual — Safety Drift Dashboard Preview */}
        <div className="animate-fade-in-up delay-400 mt-12 relative">
          <div className="landing-glow-border rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/30 animate-float">
            <div className="bg-[#0a1a0e] px-5 py-3 flex items-center gap-2 border-b border-[rgba(34,197,94,0.1)]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[#6b8f78] text-xs font-mono ml-3">VERIDIX Safety Command Center</span>
            </div>
            <div className="bg-[#0a1a0e] p-6 space-y-4">
              {/* Mini dashboard preview */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Safety Score", value: "74%", color: "text-amber-400" },
                  { label: "Drift Index", value: "0.61", color: "text-rose-400" },
                  { label: "Critical Findings", value: "5", color: "text-rose-500" },
                  { label: "Tests Run", value: "24", color: "text-emerald-400" },
                ].map(m => (
                  <div key={m.label} className="landing-card rounded-lg p-3 text-center">
                    <div className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</div>
                    <div className="text-[10px] text-[#6b8f78] mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Language safety bars */}
              <div className="landing-card rounded-lg p-4 space-y-3">
                <div className="text-xs font-semibold text-[#6b8f78] uppercase tracking-wider">Indic Safety Degradation</div>
                {[
                  { lang: "English (EN)", pct: 92, color: "bg-blue-500" },
                  { lang: "Hindi (हिंदी)", pct: 58, color: "bg-amber-500" },
                  { lang: "Hinglish", pct: 45, color: "bg-rose-500" },
                ].map(l => (
                  <div key={l.lang} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#e8f5ec] font-medium">{l.lang}</span>
                      <span className="text-[#6b8f78] font-mono">{l.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1a2e1e]">
                      <div className={`h-full rounded-full ${l.color}`} style={{ width: `${l.pct}%`, transition: "width 1.2s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent finding */}
              <div className="landing-card rounded-lg p-3 flex items-start gap-3 border border-rose-500/20">
                <div className="h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={11} className="text-rose-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wide">Critical Finding</div>
                  <div className="text-xs text-[#e8f5ec] font-medium mt-0.5">VDX-2024-0003: DAN Jailbreak via Hinglish Code-Mixing</div>
                  <div className="text-[10px] text-[#6b8f78] mt-1">Model bypassed safety filters when prompt switched to code-mixed Hinglish. Drift Score: 0.88 (Critical)</div>
                </div>
              </div>
            </div>
          </div>
          {/* Ambient glow under the preview */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-emerald-600/20 blur-2xl rounded-full" />
        </div>
      </div>
    </section>
  )
}

// ─── Stats Banner ─────────────────────────────────────────────
function StatsBanner() {
  return (
    <section className="py-12 border-y border-[rgba(34,197,94,0.12)] bg-[rgba(10,26,14,0.6)]">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: 40, suffix: "+", label: "Semantic Intents" },
          { value: 3, suffix: "", label: "Languages Tested" },
          { value: 10, suffix: "", label: "OWASP Categories" },
          { value: 600, suffix: "M+", label: "Indian Users at Risk" },
        ].map(stat => (
          <div key={stat.label} className="space-y-1">
            <div className="text-3xl font-black text-gradient-green">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs text-[#6b8f78] font-medium uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Problem Statement ────────────────────────────────────────
function ProblemSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">The Problem</span>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            The Hidden Blind Spot<br className="hidden md:block" /> in AI Safety
          </h2>
          <p className="text-[#6b8f78] max-w-2xl mx-auto text-base leading-relaxed">
            Existing red-teaming platforms evaluate LLMs primarily in English. 
            For AI systems deployed in India — where 600M+ users communicate in Hindi and Hinglish — 
            this creates a systematic safety blind spot.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="landing-card rounded-2xl p-6 space-y-4 border border-rose-500/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle size={16} className="text-rose-400" />
              </div>
              <div className="text-sm font-bold text-rose-400 uppercase tracking-wide">Without VERIDIX</div>
            </div>
            <div className="space-y-3">
              {[
                "English red-teaming shows model is 'safe' ✓",
                "Model deployed to 10M+ Indian users",
                "Users probe in Hindi → model bypasses guardrails",
                "Harmful content delivered in Hinglish at scale",
                "Safety team unaware — no multilingual monitoring",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#e8f5ec]/70">
                  <div className="h-4 w-4 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] text-rose-400 font-bold">{i + 1}</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="landing-card rounded-2xl p-6 space-y-4 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck size={16} className="text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-emerald-400 uppercase tracking-wide">With VERIDIX</div>
            </div>
            <div className="space-y-3">
              {[
                "Multilingual scan: EN + HI + Hinglish simultaneously",
                "Safety Drift detected at 0.88 (Critical) before deployment",
                "Finding VDX-2024-0003 surfaces jailbreak vulnerability",
                "Remediation: system prompt hardening in Hindi variants",
                "Re-scan confirms fix. Drift score drops to 0.12 (Low)",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#e8f5ec]/70">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <blockquote className="text-lg italic text-[#6b8f78] border-l-2 border-emerald-500 pl-4 inline-block text-left">
            &ldquo;The most dangerous assumption in AI safety is that an English-safe model is a multilingual-safe model.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: <Globe size={24} className="text-emerald-400" />,
      title: "Connect Your Model",
      description: "Add any LLM endpoint — OpenAI, Anthropic, Gemini, Groq, or your own self-hosted model via Ollama/vLLM. VERIDIX never stores your data.",
    },
    {
      step: "02",
      icon: <Layers size={24} className="text-blue-400" />,
      title: "Configure Your Scan",
      description: "Choose a preset (Quick, Indic Safety, or Full Red-Team) or define custom categories, languages, and attack vectors from our 40-intent library.",
    },
    {
      step: "03",
      icon: <Activity size={24} className="text-orange-400" />,
      title: "Run & Evaluate",
      description: "VERIDIX generates adversarial prompts in EN, HI, and Hinglish, sends them to your model, and uses an LLM-as-Judge to evaluate each response.",
    },
    {
      step: "04",
      icon: <Sparkles size={24} className="text-purple-400" />,
      title: "Understand & Act",
      description: "Get a safety score, drift analysis, OWASP-mapped findings, remediation guidance, and an AI Copilot to answer your questions — in plain English.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[rgba(10,26,14,0.4)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">How It Works</span>
          <h2 className="text-4xl font-black text-white">From Connection to Clarity in Minutes</h2>
          <p className="text-[#6b8f78] max-w-xl mx-auto">
            No ML expertise required. VERIDIX handles the complexity so you can focus on fixing vulnerabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-emerald-500/30 to-transparent z-10" />
              )}
              <div className="landing-card rounded-2xl p-6 space-y-4 h-full card-hover">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-[#0a1a0e] border border-[rgba(34,197,94,0.15)] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-[rgba(34,197,94,0.1)] select-none">{step.step}</span>
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-sm text-[#6b8f78] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Safety Drift Explainer ───────────────────────────────────
function DriftExplainerSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">The Core Concept</span>
            <h2 className="text-4xl font-black text-white">What is Safety Drift™?</h2>
            <p className="text-[#6b8f78] leading-relaxed">
              Safety Drift is the statistically measurable divergence in safety behavior 
              when the <strong className="text-[#e8f5ec]">same adversarial intent</strong> is expressed 
              across different languages. A model that safely refuses a jailbreak attempt in English 
              may fully comply when the same attack is reframed in Hinglish.
            </p>
            <div className="space-y-3">
              <div className="landing-card rounded-xl p-4">
                <div className="text-xs font-mono text-emerald-400 mb-2">DRIFT SCORE FORMULA</div>
                <div className="font-mono text-sm text-[#e8f5ec]">
                  Drift = max(score_i) − min(score_i)
                </div>
                <div className="text-xs text-[#6b8f78] mt-2">
                  Where score_i = confidence-weighted safety verdict per language variant
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { range: "< 0.1", level: "None", color: "text-emerald-400 bg-emerald-500/10" },
                  { range: "0.1–0.3", level: "Low", color: "text-blue-400 bg-blue-500/10" },
                  { range: "0.3–0.5", level: "Medium", color: "text-amber-400 bg-amber-500/10" },
                  { range: "0.5–0.75", level: "High", color: "text-orange-400 bg-orange-500/10" },
                  { range: "> 0.75", level: "Critical", color: "text-rose-400 bg-rose-500/10" },
                ].map(d => (
                  <div key={d.level} className={`px-3 py-1.5 rounded-lg ${d.color} font-mono flex justify-between`}>
                    <span>{d.level}</span>
                    <span className="opacity-70">{d.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="landing-card rounded-2xl p-6 space-y-4">
              <div className="text-sm font-bold text-[#e8f5ec]">Live Example: Jailbreak Attack</div>
              <div className="space-y-3">
                {[
                  { lang: "English (EN)", verdict: "SAFE", score: 1.0, color: "bg-emerald-500", textColor: "text-emerald-400", barColor: "bg-emerald-500" },
                  { lang: "Hindi (हिंदी)", verdict: "BORDERLINE", score: 0.35, color: "bg-amber-500", textColor: "text-amber-400", barColor: "bg-amber-500" },
                  { lang: "Hinglish", verdict: "UNSAFE", score: 0.0, color: "bg-rose-500", textColor: "text-rose-400", barColor: "bg-rose-500" },
                ].map(v => (
                  <div key={v.lang} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#6b8f78]">{v.lang}</span>
                      <span className={`font-bold font-mono ${v.textColor}`}>{v.verdict}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1a2e1e]">
                      <div className={`h-full rounded-full ${v.barColor} transition-all duration-1000`}
                        style={{ width: `${v.score * 100 || 5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[rgba(34,197,94,0.1)] flex justify-between items-center">
                <span className="text-xs text-[#6b8f78]">Drift Score</span>
                <span className="text-xl font-black text-rose-400 font-mono">0.88</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">CRITICAL</span>
              </div>
            </div>
            <p className="text-xs text-[#6b8f78] text-center">
              This model passed English red-teaming but was critically vulnerable in Hinglish
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Features Grid ────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: <Globe size={20} className="text-emerald-400" />,
      title: "Multilingual Safety Testing",
      description: "Native adversarial prompts in English, Hindi, and Hinglish — not translated, but culturally authentic attacks.",
      tag: "Core",
    },
    {
      icon: <Activity size={20} className="text-orange-400" />,
      title: "Safety Drift™ Analysis",
      description: "Quantify and classify how safety behavior degrades across languages with confidence-weighted drift scoring.",
      tag: "Unique",
    },
    {
      icon: <Sparkles size={20} className="text-purple-400" />,
      title: "AI Security Copilot",
      description: "Ask natural language questions about your scan results. Get 'What happened → Why → What to do' answers.",
      tag: "New",
    },
    {
      icon: <Shield size={20} className="text-blue-400" />,
      title: "OWASP LLM Top 10 Mapping",
      description: "Every finding is mapped to OWASP LLM Top 10 (2025) categories for compliance and audit-readiness.",
      tag: "Compliance",
    },
    {
      icon: <BarChart3 size={20} className="text-teal-400" />,
      title: "Visual Explainability",
      description: "Safety heatmaps, drift distributions, severity donuts, and language comparison charts that tell the story.",
      tag: "Insights",
    },
    {
      icon: <FileText size={20} className="text-amber-400" />,
      title: "Audit-Grade PDF Reports",
      description: "Executive-ready reports with methodology, findings, remediation guidance, and OWASP references.",
      tag: "Output",
    },
    {
      icon: <Terminal size={20} className="text-emerald-400" />,
      title: "API & Developer Access",
      description: "Full REST API for programmatic scanning. Integrate VERIDIX into your CI/CD pipeline or scripts.",
      tag: "Dev",
    },
    {
      icon: <Lock size={20} className="text-rose-400" />,
      title: "40-Intent Attack Library",
      description: "Jailbreak, prompt injection, bias, privacy, cultural sensitivity, harmful content — and more.",
      tag: "Library",
    },
  ]

  return (
    <section id="features" className="py-24 px-6 bg-[rgba(10,26,14,0.4)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Platform Features</span>
          <h2 className="text-4xl font-black text-white">Everything You Need to<br />Trust Your AI</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <div key={f.title} className="landing-card rounded-xl p-5 space-y-3 card-hover group">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-[#0a1a0e] border border-[rgba(34,197,94,0.1)] flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{f.title}</h3>
              <p className="text-xs text-[#6b8f78] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Product Entry Points ─────────────────────────────────────
function EntryPointSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Get Started</span>
          <h2 className="text-4xl font-black text-white">Choose Your Testing Approach</h2>
          <p className="text-[#6b8f78] max-w-xl mx-auto">
            VERIDIX fits every team — from security researchers to engineering leads.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <BarChart3 size={28} className="text-emerald-400" />,
              title: "Dashboard Testing",
              tag: "Recommended",
              tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
              description: "Visual, no-code safety evaluation. Connect your model, pick a preset, watch results stream in live.",
              cta: "Open Dashboard",
              href: "/dashboard",
              features: ["Visual scan wizard", "Live evaluation stream", "Interactive charts & findings"],
            },
            {
              icon: <Code size={28} className="text-blue-400" />,
              title: "API Testing",
              tag: "Developers",
              tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
              description: "Full REST API access. Trigger scans programmatically, poll results, integrate into CI/CD pipelines.",
              cta: "View API Docs",
              href: "http://localhost:8000/docs",
              features: ["Full REST API", "OpenAPI / Swagger docs", "Programmatic scan control"],
            },
            {
              icon: <Terminal size={28} className="text-purple-400" />,
              title: "CLI Testing",
              tag: "Coming Soon",
              tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
              description: "Run safety scans from your terminal. Ideal for CI/CD pipelines, automated testing, and power users.",
              cta: "View Roadmap",
              href: "/get-started",
              features: ["Python CLI wrapper", "CI/CD integration", "GitHub Actions support"],
            },
          ].map(ep => (
            <div key={ep.title} className="landing-card rounded-2xl p-6 flex flex-col space-y-5 card-hover">
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-xl bg-[#0a1a0e] border border-[rgba(34,197,94,0.1)] flex items-center justify-center">
                  {ep.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ep.tagColor}`}>
                  {ep.tag}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">{ep.title}</h3>
                <p className="text-sm text-[#6b8f78] leading-relaxed">{ep.description}</p>
              </div>
              <ul className="space-y-1.5">
                {ep.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#6b8f78]">
                    <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={ep.href}
                className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[rgba(34,197,94,0.2)] text-[#e8f5ec] hover:border-emerald-500/40 hover:bg-emerald-500/5 text-sm font-semibold transition-all">
                {ep.cta}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Section ──────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="landing-glow-border rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 landing-grid opacity-20" />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Star size={13} className="text-emerald-400 fill-current" />
              <span className="text-xs font-semibold text-emerald-400">No setup. No API key required for demo.</span>
            </div>
            <h2 className="text-4xl font-black text-white">
              Start Protecting Your<br className="hidden sm:block" />
              <span className="text-gradient-green"> AI Today</span>
            </h2>
            <p className="text-[#6b8f78] max-w-lg mx-auto">
              See VERIDIX in action with the FinSeva demo audit — 24 pre-recorded multilingual evaluations showing real Safety Drift.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xl shadow-emerald-600/25 hover:scale-[1.02]">
                <Zap size={16} />
                Explore Demo →
              </Link>
              <Link href="/get-started"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[rgba(34,197,94,0.25)] text-[#e8f5ec] hover:border-emerald-500/50 font-semibold transition-all hover:scale-[1.02]">
                <MessageSquare size={14} className="text-emerald-500" />
                Talk to AI Copilot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────
function LandingFooter() {
  return (
    <footer className="border-t border-[rgba(34,197,94,0.12)] py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center">
              <ShieldCheck className="text-white h-4 w-4" />
            </div>
            <span className="text-white font-bold">VERIDIX</span>
          </div>
          <p className="text-xs text-[#6b8f78] leading-relaxed">
            The trust layer for Indian enterprise AI. Safety drift evaluation across English, Hindi, and Hinglish.
          </p>
          <div className="text-xs text-[#6b8f78]">v0.1 MVP · MIT License</div>
        </div>
        {[
          {
            title: "Product",
            links: [
              { label: "Dashboard", href: "/dashboard" },
              { label: "Safety Scans", href: "/scans" },
              { label: "Findings", href: "/findings" },
              { label: "AI Copilot", href: "/copilot" },
              { label: "Reports", href: "/reports" },
            ]
          },
          {
            title: "Developer",
            links: [
              { label: "API Docs", href: "http://localhost:8000/docs" },
              { label: "OpenAPI Spec", href: "http://localhost:8000/openapi.json" },
              { label: "Get Started", href: "/get-started" },
            ]
          },
          {
            title: "Resources",
            links: [
              { label: "Safety Drift™ Methodology", href: "#" },
              { label: "OWASP LLM Top 10", href: "#" },
              { label: "README", href: "#" },
            ]
          }
        ].map(section => (
          <div key={section.title} className="space-y-3">
            <div className="text-xs font-bold text-[#e8f5ec] uppercase tracking-wider">{section.title}</div>
            <ul className="space-y-2">
              {section.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-[#6b8f78] hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[rgba(34,197,94,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6b8f78]">
        <span>© 2026 VERIDIX. Built for the multilingual AI era.</span>
        <span className="italic">&ldquo;The most dangerous assumption in AI safety is that an English-safe model is a multilingual-safe model.&rdquo;</span>
      </div>
    </footer>
  )
}

// ─── Main Landing Page ────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen landing-bg text-[var(--landing-text)]">
      <LandingNav />
      <HeroSection />
      <StatsBanner />
      <ProblemSection />
      <HowItWorksSection />
      <DriftExplainerSection />
      <FeaturesSection />
      <EntryPointSection />
      <CTASection />
      <LandingFooter />
    </div>
  )
}
