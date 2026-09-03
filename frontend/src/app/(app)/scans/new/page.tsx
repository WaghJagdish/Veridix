"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Loader2, Sparkles, Check, Server, Shield, Globe, ArrowRight, ArrowLeft, Settings2, Key, Info } from "lucide-react"
import { useTargets } from "@/hooks/useApi"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function NewScanPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [targetId, setTargetId] = useState<string>("")
  const [scanName, setScanName] = useState<string>("Indic Safety Evaluation — Audit Run")
  const [preset, setPreset] = useState<string>("indic")
  
  // Custom categories & languages
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en", "hi", "hinglish"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "harmful_content",
    "jailbreak",
    "cultural_sensitivity",
    "bias",
    "privacy",
    "unsafe_advice"
  ])

  // Judge Provider Configuration (Default: VERIDIX Groq GPT-OSS-120B)
  const [isAdvancedJudge, setIsAdvancedJudge] = useState<boolean>(false)
  const [judgeProvider, setJudgeProvider] = useState<string>("groq")
  const [judgeModel, setJudgeModel] = useState<string>("openai/gpt-oss-120b")
  const [judgeApiKey, setJudgeApiKey] = useState<string>("")
  const [judgeEndpoint, setJudgeEndpoint] = useState<string>("")

  const { data: targets, isLoading: isTargetsLoading } = useTargets()

  useEffect(() => {
    if (targets && targets.length > 0 && !targetId) {
      setTargetId(targets[0].id)
    }
  }, [targets, targetId])

  const availableLanguages = [
    { id: "en", label: "English (EN)", desc: "Baseline safety benchmark" },
    { id: "hi", label: "Hindi (हिंदी)", desc: "Devanagari script evaluation" },
    { id: "hinglish", label: "Hinglish (Code-Mixed)", desc: "Colloquial Latin-script Hindi-English" },
  ]

  const availableCategories = [
    { id: "jailbreak", label: "Jailbreak & System Prompt Extraction", owasp: "LLM01" },
    { id: "harmful_content", label: "Harmful & Dangerous Content", owasp: "LLM02" },
    { id: "cultural_sensitivity", label: "Indic Cultural & Religious Nuance", owasp: "LLM09" },
    { id: "bias", label: "Stereotyping & Demographic Bias", owasp: "LLM06" },
    { id: "privacy", label: "PII & Data Leakage (Aadhaar/PAN/OTP)", owasp: "LLM06" },
    { id: "unsafe_advice", label: "Financial / Medical Unsafe Advice", owasp: "LLM09" },
    { id: "prompt_injection", label: "Direct & Indirect Prompt Injection", owasp: "LLM01" },
    { id: "misinformation", label: "Hallucination & Misinformation", owasp: "LLM09" },
  ]

  const handleLaunch = async () => {
    setLoading(true)
    try {
      let scanId = ""
      try {
        const res = await api.scans.create({
          target_id: targetId,
          name: scanName || `Indic Safety Scan - ${new Date().toLocaleDateString()}`,
          preset: preset,
          languages: selectedLanguages,
          categories: selectedCategories,
          judge_provider: isAdvancedJudge ? judgeProvider : "groq",
          judge_model: isAdvancedJudge ? judgeModel : "openai/gpt-oss-120b",
          judge_api_key: isAdvancedJudge ? judgeApiKey : undefined,
          judge_endpoint: isAdvancedJudge ? judgeEndpoint : undefined,
          is_demo: false,
        })
        scanId = res.id
      } catch (e) {
        console.warn("API scan creation fallback for demo mode", e)
        const scans = await api.scans.list()
        if (scans && scans.length > 0) {
          scanId = scans[0].id
        }
      }
      if (scanId) {
        router.push(`/scans/${scanId}`)
      } else {
        router.push('/scans')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = (langId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(langId) ? prev.filter(l => l !== langId) : [...prev, langId]
    )
  }

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  const selectedTarget = targets?.find(t => t.id === targetId)

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Configure AI Safety Scan</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Set up automated adversarial test generation, multilingual execution, and safety drift evaluation.
        </p>
      </div>

      {/* Stepper Wizard */}
      <div className="flex items-center justify-between border-y border-border py-3 text-xs">
        <div className="flex items-center gap-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 1 ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
          }`}>1</span>
          <span className={`font-semibold ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
            Target Selection
          </span>
        </div>

        <ArrowRight size={14} className="text-muted-foreground/50" />

        <div className="flex items-center gap-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 2 ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
          }`}>2</span>
          <span className={`font-semibold ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
            Languages & Threat Vectors
          </span>
        </div>

        <ArrowRight size={14} className="text-muted-foreground/50" />

        <div className="flex items-center gap-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 3 ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
          }`}>3</span>
          <span className={`font-semibold ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
            Judge Config & Launch
          </span>
        </div>
      </div>

      {/* STEP 1: TARGET SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Scan / Audit Title
            </Label>
            <Input 
              value={scanName}
              onChange={e => setScanName(e.target.value)}
              placeholder="e.g. FinSeva Production Safety Audit v1.0"
              className="text-xs font-medium"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Target Model to Evaluate
              </Label>
              <Link href="/targets/new" className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
                + Connect New Target Model
              </Link>
            </div>

            {isTargetsLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground border rounded-xl">Loading target models...</div>
            ) : !targets || targets.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-xl bg-card space-y-3">
                <Server className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <div>
                  <p className="text-xs font-bold">No connected targets found</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Add an OpenAI, Gemini, Anthropic, or custom endpoint target first.</p>
                </div>
                <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                  <Link href="/targets/new">Connect Target Model →</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setTargetId(t.id)}
                    className={`p-4 rounded-xl border cursor-pointer space-y-2 transition-all card-hover ${
                      targetId === t.id ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600' : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        <span className="text-xs font-bold text-foreground">{t.name}</span>
                      </div>
                      {targetId === t.id && (
                        <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check size={11} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-semibold">{t.model}</span>
                      <span>·</span>
                      <span className="capitalize">{t.provider}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{t.app_description || "Customer-facing AI application"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => setStep(2)} 
              disabled={!targetId}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Continue to Languages & Vectors <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: LANGUAGES & VECTORS */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Evaluation Preset
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: "quick", name: "Quick Check", tests: "~12 tests", desc: "Fast baseline check in English & Hinglish" },
                { id: "indic", name: "Indic Safety Scan ★", tests: "~24 tests", desc: "Recommended. Complete EN + HI + Hinglish drift evaluation", badge: "Recommended" },
                { id: "full", name: "Full Red-Team Audit", tests: "~60 tests", desc: "Comprehensive audit across all 8 attack vectors" },
              ].map(p => (
                <div
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer space-y-1.5 transition-all ${
                    preset === p.id ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600' : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">{p.name}</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">{p.tests}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Languages Selector */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Target Languages ({selectedLanguages.length} selected)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {availableLanguages.map(l => (
                <div 
                  key={l.id} 
                  onClick={() => toggleLanguage(l.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    selectedLanguages.includes(l.id) ? 'border-emerald-600 bg-emerald-50/80' : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">{l.label}</span>
                    <p className="text-[10px] text-muted-foreground">{l.desc}</p>
                  </div>
                  <Checkbox checked={selectedLanguages.includes(l.id)} />
                </div>
              ))}
            </div>
          </div>

          {/* Categories Selector */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Threat Vectors & Attack Categories ({selectedCategories.length} selected)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {availableCategories.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    selectedCategories.includes(cat.id) ? 'border-emerald-600 bg-emerald-50/80' : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedCategories.includes(cat.id)} />
                    <span className="font-medium text-foreground">{cat.label}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono text-muted-foreground border-border">
                    {cat.owasp}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)} className="text-xs">
              <ArrowLeft size={14} className="mr-1.5" /> Back
            </Button>
            <Button onClick={() => setStep(3)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
              Review & Judge Config <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: JUDGE CONFIG & LAUNCH */}
      {step === 3 && (
        <div className="space-y-6">
          <Card className="p-6 border-border bg-card shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground">Safety Judge Model Configuration</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The target model being evaluated and the evaluator model (Safety Judge) are completely independent.
                </p>
              </div>
            </div>

            {/* Independent Architecture Explanation */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-start gap-3 text-xs">
              <Info size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-muted-foreground">
                <span className="font-bold text-foreground">Independent Target vs Judge Architecture:</span>
                <p>
                  Target Model: <strong className="text-foreground">{selectedTarget?.name || 'Selected Model'} ({selectedTarget?.model || 'Target'})</strong> — the application being tested.<br />
                  Safety Judge: <strong className="text-foreground">{isAdvancedJudge ? `${judgeModel} (${judgeProvider})` : 'Groq (openai/gpt-oss-120b)'}</strong> — the LLM scoring refusal quality and safety drift.
                </p>
              </div>
            </div>

            {/* Basic vs Advanced Configuration Toggle */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Default Mode */}
                <div
                  onClick={() => setIsAdvancedJudge(false)}
                  className={`p-4 rounded-xl border cursor-pointer space-y-2 transition-all ${
                    !isAdvancedJudge ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600' : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles size={14} className="text-emerald-700" />
                      VERIDIX Default Judge
                    </span>
                    <Badge className="bg-emerald-600 text-white text-[9px]">Zero Setup</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Uses pre-configured <strong>GPT-OSS-120B via Groq</strong>. High speed, audit-grade accuracy, no additional API keys required.
                  </p>
                </div>

                {/* Advanced Mode */}
                <div
                  onClick={() => setIsAdvancedJudge(true)}
                  className={`p-4 rounded-xl border cursor-pointer space-y-2 transition-all ${
                    isAdvancedJudge ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600' : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Settings2 size={14} className="text-purple-700" />
                      Advanced Custom Judge
                    </span>
                    <Badge variant="outline" className="text-purple-700 border-purple-300 text-[9px]">Custom Provider</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Select your own judge provider (Groq, OpenAI, Gemini, Anthropic, OpenRouter, Custom HTTP) and pass custom API keys.
                  </p>
                </div>
              </div>

              {/* Advanced Controls Form */}
              {isAdvancedJudge && (
                <div className="p-4 rounded-xl bg-muted/40 border border-purple-200/80 space-y-4 animate-fade-in-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Judge Provider</Label>
                      <select
                        value={judgeProvider}
                        onChange={e => {
                          setJudgeProvider(e.target.value)
                          if (e.target.value === "groq") setJudgeModel("openai/gpt-oss-120b")
                          else if (e.target.value === "openai") setJudgeModel("gpt-4o-mini")
                          else if (e.target.value === "gemini") setJudgeModel("gemini-1.5-flash")
                          else if (e.target.value === "anthropic") setJudgeModel("claude-3-5-sonnet-20241022")
                          else if (e.target.value === "openrouter") setJudgeModel("openai/gpt-4o-mini")
                        }}
                        className="w-full h-9 px-3 text-xs bg-background border border-input rounded-lg font-medium text-foreground focus:outline-none"
                      >
                        <option value="groq">Groq Cloud (Fast)</option>
                        <option value="openai">OpenAI</option>
                        <option value="gemini">Google Gemini</option>
                        <option value="anthropic">Anthropic Claude</option>
                        <option value="openrouter">OpenRouter</option>
                        <option value="custom">Custom OpenAI-Compatible Endpoint</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Judge Model Identifier</Label>
                      <Input
                        value={judgeModel}
                        onChange={e => setJudgeModel(e.target.value)}
                        placeholder="e.g. gpt-4o-mini, claude-3-5-sonnet, gemini-1.5-flash"
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1">
                        <Key size={11} className="text-purple-600" />
                        Judge API Key (Optional override)
                      </Label>
                      <Input
                        type="password"
                        value={judgeApiKey}
                        onChange={e => setJudgeApiKey(e.target.value)}
                        placeholder="Leave blank to use backend .env default"
                        className="h-9 text-xs font-mono"
                      />
                    </div>

                    {judgeProvider === "custom" && (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Custom Endpoint URL</Label>
                        <Input
                          value={judgeEndpoint}
                          onChange={e => setJudgeEndpoint(e.target.value)}
                          placeholder="http://localhost:11434/v1"
                          className="h-9 text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Review Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Audit Title</span>
                <strong className="text-foreground font-semibold truncate block">{scanName}</strong>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Target App</span>
                <strong className="text-foreground font-semibold truncate block">{selectedTarget?.name || 'Target'}</strong>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Languages</span>
                <strong className="text-foreground uppercase font-semibold">{selectedLanguages.join(', ')}</strong>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Selected Judge</span>
                <strong className="text-emerald-700 font-semibold truncate block">
                  {isAdvancedJudge ? judgeModel : "GPT-OSS-120B (Groq)"}
                </strong>
              </div>
            </div>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setStep(2)} className="text-xs">
              <ArrowLeft size={14} className="mr-1.5" /> Back
            </Button>
            <Button 
              size="lg" 
              onClick={handleLaunch} 
              disabled={loading} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-8 shadow-sm shadow-emerald-600/20"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Launching Evaluation..." : "Start Safety Scan"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
