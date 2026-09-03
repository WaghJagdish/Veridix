"use client"
import Link from "next/link"
import { BarChart3, Code, Terminal, CheckCircle2, ArrowRight, Zap, Shield, Globe, ExternalLink, ChevronRight, Play, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CURL_EXAMPLE = `# Create a new safety scan
curl -X POST http://localhost:8000/api/scans \\
  -H "Content-Type: application/json" \\
  -d '{
    "target_id": "YOUR_TARGET_ID",
    "name": "My Indic Safety Scan",
    "preset": "indic",
    "languages": ["en", "hi", "hinglish"],
    "categories": ["jailbreak", "harmful_content"]
  }'

# Get scan results + summary
curl http://localhost:8000/api/scans/{scan_id}/summary

# List all findings
curl http://localhost:8000/api/scans/{scan_id}/findings`

export default function GetStartedPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2 bg-white p-5 border-1.5 border-ink shadow-brutal font-mono text-ink">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-safety-teal" size={24} />
          <h1 className="text-3xl font-black uppercase tracking-tight text-ink font-display">Get Started with VERIDIX</h1>
        </div>
        <p className="text-xs text-ink/70 font-sans">
          Choose how you want to test your AI model&apos;s safety. All approaches use the same backend engine.
        </p>
      </div>

      {/* Entry Point Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: <BarChart3 size={28} className="text-emerald-600" />,
            title: "Dashboard Testing",
            tag: "Recommended",
            tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
            description: "Visual, no-code evaluation. Perfect for security researchers, product managers, and AI teams.",
            steps: [
              "Connect a model target (OpenAI, Anthropic, Gemini, or custom)",
              "Choose a scan preset (Quick, Indic Safety, or Full Red-Team)",
              "Watch results stream in real-time",
              "Explore findings, drift analysis, and generate PDF reports",
            ],
            cta: "Open Dashboard",
            ctaHref: "/dashboard",
            ctaStyle: "bg-emerald-600 hover:bg-emerald-700 text-white",
          },
          {
            icon: <Code size={28} className="text-blue-600" />,
            title: "API Testing",
            tag: "Developers",
            tagColor: "bg-blue-100 text-blue-800 border-blue-300",
            description: "Full REST API for programmatic scanning. Integrate VERIDIX into your pipelines and scripts.",
            steps: [
              "Create a target via POST /api/targets",
              "Launch a scan via POST /api/scans",
              "Poll scan status via GET /api/scans/{id}",
              "Retrieve findings via GET /api/scans/{id}/findings",
            ],
            cta: "View API Docs",
            ctaHref: "http://localhost:8000/docs",
            ctaStyle: "bg-blue-600 hover:bg-blue-700 text-white",
          },
          {
            icon: <Terminal size={28} className="text-purple-600" />,
            title: "CLI Testing",
            tag: "Coming Soon",
            tagColor: "bg-purple-100 text-purple-800 border-purple-300",
            description: "Run safety scans from your terminal. Ideal for CI/CD pipelines and automated testing workflows.",
            steps: [
              "pip install veridix-cli (coming soon)",
              "veridix scan --preset indic --model gpt-4o",
              "veridix findings --scan-id {id}",
              "veridix report --format pdf",
            ],
            cta: "View Roadmap",
            ctaHref: "/settings",
            ctaStyle: "bg-purple-600 hover:bg-purple-700 text-white",
          },
        ].map(ep => (
          <Card key={ep.title} className="p-6 border-border bg-card shadow-xs flex flex-col space-y-4 card-hover">
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center">
                {ep.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ep.tagColor}`}>
                {ep.tag}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{ep.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">{ep.description}</p>
            </div>
            <ol className="space-y-2 flex-1">
              {ep.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="font-mono text-[11px]">{step}</span>
                </li>
              ))}
            </ol>
            <Link href={ep.ctaHref}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${ep.ctaStyle}`}>
              {ep.cta}
              <ArrowRight size={14} />
            </Link>
          </Card>
        ))}
      </div>

      {/* API Quick Reference */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={16} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-foreground">API Quick Reference</h2>
          </div>
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer"
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
            Full Swagger Docs <ExternalLink size={11} />
          </a>
        </div>
        <div className="p-5">
          <pre className="bg-muted/50 rounded-xl p-4 text-xs font-mono overflow-x-auto text-foreground leading-relaxed">
            {CURL_EXAMPLE}
          </pre>
        </div>
      </Card>

      {/* System Requirements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 border-border bg-card shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={15} className="text-emerald-700" />
            <h3 className="text-sm font-bold text-foreground">Supported Providers</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "OpenAI", models: "GPT-4o, GPT-4o-mini" },
              { name: "Anthropic", models: "Claude 3.5 Sonnet/Haiku" },
              { name: "Google Gemini", models: "Gemini 1.5 Flash/Pro" },
              { name: "Groq", models: "Llama 3.1, Mixtral" },
              { name: "Ollama", models: "Any local model" },
              { name: "vLLM", models: "Self-hosted inference" },
            ].map(p => (
              <div key={p.name} className="p-2.5 rounded-lg bg-muted/50 border border-border">
                <div className="text-xs font-bold text-foreground">{p.name}</div>
                <div className="text-[10px] text-muted-foreground">{p.models}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-border bg-card shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-emerald-700" />
            <h3 className="text-sm font-bold text-foreground">Language Coverage</h3>
          </div>
          <div className="space-y-2">
            {[
              { lang: "English (EN)", status: "Available", desc: "Baseline adversarial testing", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              { lang: "Hindi (हिंदी)", status: "Available", desc: "Native Devanagari script attacks", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              { lang: "Hinglish", status: "Available", desc: "Code-mixed Roman script attacks", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              { lang: "22 Indian Languages", status: "Roadmap", desc: "Marathi, Tamil, Telugu, Bengali...", color: "text-amber-700 bg-amber-50 border-amber-200" },
            ].map(l => (
              <div key={l.lang} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/30">
                <div>
                  <div className="text-xs font-semibold text-foreground">{l.lang}</div>
                  <div className="text-[10px] text-muted-foreground">{l.desc}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${l.color}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="sm" className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex-1">
          <Link href="/targets/new">
            <Zap size={14} className="mr-2" /> Connect Your First Target
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="h-10 border-border flex-1">
          <Link href="/scans/new">
            <Play size={14} className="mr-2" fill="currentColor" /> Launch a Scan
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="h-10 border-border flex-1">
          <Link href="/dashboard">
            <ChevronRight size={14} className="mr-2" /> Explore Demo Data
          </Link>
        </Button>
      </div>
    </div>
  )
}
