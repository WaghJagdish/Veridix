"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useTargets } from "@/hooks/useApi"

export default function NewScanPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [targetId, setTargetId] = useState<string>("")
  const [preset, setPreset] = useState<string>("indic")
  
  const { data: targets } = useTargets()

  const handleLaunch = async () => {
    setLoading(true)
    try {
      // In demo mode, we just push to a known demo scan ID if creation fails
      let scanId = "demo-scan-123"
      try {
        const res = await api.scans.create({
          target_id: targetId,
          preset: preset as any,
          name: `${preset.charAt(0).toUpperCase() + preset.slice(1)} Scan - ${new Date().toLocaleDateString()}`
        })
        scanId = res.id
      } catch (e) {
        console.warn("Using demo scan ID due to API failure")
      }
      router.push(`/scans/${scanId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configure Scan</h1>
        <p className="text-muted-foreground">Set up a new safety evaluation.</p>
      </div>

      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span className={step >= 1 ? "text-brand-indigo font-bold" : ""}>1. Target</span>
        <span>→</span>
        <span className={step >= 2 ? "text-brand-indigo font-bold" : ""}>2. Preset</span>
        <span>→</span>
        <span className={step >= 3 ? "text-brand-indigo font-bold" : ""}>3. Launch</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targets?.map(t => (
              <Card 
                key={t.id} 
                className={`p-6 cursor-pointer hover:border-brand-indigo transition-colors ${targetId === t.id ? 'border-brand-indigo bg-brand-indigo/5' : ''}`}
                onClick={() => setTargetId(t.id)}
              >
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.model} ({t.provider})</p>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!targetId}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={`p-6 cursor-pointer ${preset === 'quick' ? 'border-brand-indigo ring-1 ring-brand-indigo' : ''}`} onClick={() => setPreset('quick')}>
              <h3 className="font-bold mb-2">Quick Safety Scan</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>English only</li>
                <li>3 categories</li>
                <li>~15 tests</li>
                <li>~2 min</li>
              </ul>
            </Card>
            <Card className={`p-6 cursor-pointer relative ${preset === 'indic' ? 'border-brand-indigo ring-1 ring-brand-indigo' : ''}`} onClick={() => setPreset('indic')}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-indigo text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">★ Recommended</div>
              <h3 className="font-bold mb-2 mt-2">Indic Safety Scan</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>EN + HI + Hinglish</li>
                <li>4 categories</li>
                <li>~45 tests</li>
                <li>~5 min</li>
              </ul>
            </Card>
            <Card className={`p-6 cursor-pointer ${preset === 'full' ? 'border-brand-indigo ring-1 ring-brand-indigo' : ''}`} onClick={() => setPreset('full')}>
              <h3 className="font-bold mb-2">Full Red-Team Scan</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>All languages</li>
                <li>All categories</li>
                <li>~120 tests</li>
                <li>~15 min</li>
              </ul>
            </Card>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Card className="p-8 text-center space-y-4">
            <h3 className="text-xl font-medium">Ready to Launch</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              VERIDIX will generate test cases, execute them against your target model, and analyze the results using an independent judge model.
            </p>
            <Button size="lg" onClick={handleLaunch} disabled={loading} className="mt-4">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Launch Evaluation
            </Button>
          </Card>
          <div className="flex justify-start">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
          </div>
        </div>
      )}
    </div>
  )
}
