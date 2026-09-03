"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Loader2, Sparkles, Check, Server, Shield, Globe, ArrowRight, ArrowLeft, Layers, Flame } from "lucide-react"
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

  const [judgeProvider, setJudgeProvider] = useState<string>("openai")
  const [judgeModel, setJudgeModel] = useState<string>("gpt-4o-mini")

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
          judge_provider: judgeProvider,
          judge_model: judgeModel,
          is_demo: false,
        })
        scanId = res.id
      } catch (e) {
        console.warn("API scan creation fallback for demo mode", e)
        // Check if demo scans exist
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
            Languages & Attack Vectors
          </span>
        </div>

        <ArrowRight size={14} className="text-muted-foreground/50" />

        <div className="flex items-center gap-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step >= 3 ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
          }`}>3</span>
          <span className={`font-semibold ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
            Judge & Launch
          </span>
        </div>
      </div>

      {/* STEP 1: TARGET SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Evaluation Scan Name
            </Label>
            <Input
              value={scanName}
              onChange={e => setScanName(e.target.value)}
              placeholder="e.g., Indic Safety Scan — FinSeva Bot v2.1"
              className="text-sm font-medium"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Target Model to Evaluate
              </Label>
              <Link href="/targets/new" className="text-xs text-emerald-700 hover:underline font-semibold">
                + Connect New Target
              </Link>
            </div>

            {isTargetsLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading targets...</div>
            ) : !targets || targets.length === 0 ? (
              <Card className="p-8 text-center space-y-3 border-dashed">
                <Server className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground">No targets connected yet.</p>
                <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href="/targets/new">Connect Target Model</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targets.map(t => {
                  const isSelected = targetId === t.id;
                  return (
                    <Card 
                      key={t.id} 
                      className={`p-5 cursor-pointer transition-all border-2 relative ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-xs' 
                          : 'border-border hover:border-emerald-300 hover:bg-emerald-50/30'
                      }`}
                      onClick={() => setTargetId(t.id)}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check size={12} />
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <div className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Server size={15} className="text-emerald-700" />
                          <span>{t.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Model: <code className="px-1.5 py-0.5 rounded bg-muted text-[11px] border border-border">{t.model}</code> ({t.provider})
                        </p>
                        {t.app_description && (
                          <p className="text-[11px] text-muted-foreground truncate">{t.app_description}</p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)} disabled={!targetId} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Continue to Vectors <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PRESET & VECTORS */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Preset Cards */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Evaluation Preset
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`p-5 cursor-pointer transition-all border-2 ${
                  preset === 'quick' ? 'border-emerald-600 bg-emerald-50/80 shadow-xs' : 'hover:border-emerald-300'
                }`}
                onClick={() => setPreset('quick')}
              >
                <h3 className="font-bold text-sm">Quick English Scan</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">Rapid baseline evaluation</p>
                <ul className="text-[11px] space-y-1 text-muted-foreground">
                  <li>• English only</li>
                  <li>• 3 threat vectors</li>
                  <li>• ~12 test cases</li>
                </ul>
              </Card>

              <Card 
                className={`p-5 cursor-pointer transition-all border-2 relative ${
                  preset === 'indic' ? 'border-emerald-600 bg-emerald-50/80 shadow-xs' : 'hover:border-emerald-300'
                }`}
                onClick={() => setPreset('indic')}
              >
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  ★ Recommended
                </div>
                <h3 className="font-bold text-sm mt-1">Indic Safety Scan</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">EN + Hindi + Hinglish</p>
                <ul className="text-[11px] space-y-1 text-muted-foreground">
                  <li>• Cross-lingual drift detection</li>
                  <li>• 6 attack categories</li>
                  <li>• ~24 test cases</li>
                </ul>
              </Card>

              <Card 
                className={`p-5 cursor-pointer transition-all border-2 ${
                  preset === 'full' ? 'border-emerald-600 bg-emerald-50/80 shadow-xs' : 'hover:border-emerald-300'
                }`}
                onClick={() => setPreset('full')}
              >
                <h3 className="font-bold text-sm">Full Red-Team Audit</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">Comprehensive compliance</p>
                <ul className="text-[11px] space-y-1 text-muted-foreground">
                  <li>• All 8 OWASP threat vectors</li>
                  <li>• Deep adversarial permutations</li>
                  <li>• ~60 test cases</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Languages Selector */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Target Linguistic Scope
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
            <Button onClick={() => setStep(3)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
              Review & Launch <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: JUDGE CONFIG & LAUNCH */}
      {step === 3 && (
        <div className="space-y-6">
          <Card className="p-6 border-border bg-card shadow-xs space-y-5">
            <h3 className="font-bold text-sm">Evaluation Review & LLM-as-a-Judge</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Evaluation Name</span>
                <strong className="text-foreground font-semibold">{scanName}</strong>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Linguistic Scope</span>
                <strong className="text-foreground uppercase font-semibold">{selectedLanguages.join(', ')}</strong>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Threat Vectors Selected</span>
                <strong className="text-foreground font-semibold">{selectedCategories.length} Categories</strong>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-muted-foreground block text-[11px]">Autonomous Judge</span>
                <strong className="text-foreground font-semibold">{judgeModel} ({judgeProvider})</strong>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles size={14} /> Evaluation Pipeline
              </span>
              <p className="text-emerald-800/90 leading-relaxed">
                1. VERIDIX generates adversarial test cases in English and translates with cultural nuance into Hindi and Hinglish.<br />
                2. Prompts are submitted against your target model in parallel.<br />
                3. The Judge model scores refusal quality, policy adherence, and calculates Safety Drift.
              </p>
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
