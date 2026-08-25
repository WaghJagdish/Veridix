"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function NewTargetPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<string>("openai")
  const [formData, setFormData] = useState({
    name: "My App Production",
    model: "gpt-4o",
    api_key: "",
    system_prompt: ""
  })

  const providers = [
    { id: 'openai', name: 'OpenAI' },
    { id: 'anthropic', name: 'Anthropic' },
    { id: 'gemini', name: 'Google Gemini' },
    { id: 'groq', name: 'Groq' },
    { id: 'custom', name: 'Custom Endpoint' }
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.targets.create({
        name: formData.name,
        provider: provider as any,
        model: formData.model,
        api_key_masked: "***", // Demo stub
        system_prompt: formData.system_prompt
      })
      router.push('/targets')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connect Target</h1>
        <p className="text-muted-foreground">Configure the AI system you want to evaluate.</p>
      </div>

      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span className={step >= 1 ? "text-brand-indigo font-bold" : ""}>1. Provider</span>
        <span>→</span>
        <span className={step >= 2 ? "text-brand-indigo font-bold" : ""}>2. Configuration</span>
        <span>→</span>
        <span className={step >= 3 ? "text-brand-indigo font-bold" : ""}>3. Verify</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {providers.map(p => (
              <Card 
                key={p.id} 
                className={`p-6 cursor-pointer hover:border-brand-indigo transition-colors ${provider === p.id ? 'border-brand-indigo bg-brand-indigo/5' : ''}`}
                onClick={() => setProvider(p.id)}
              >
                <h3 className="font-medium text-center">{p.name}</h3>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Target Name</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <Label>Model</Label>
              <Input value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
            </div>
            <div>
              <Label>API Key</Label>
              <Input type="password" value={formData.api_key} onChange={e => setFormData({...formData, api_key: e.target.value})} />
            </div>
            <div>
              <Label>System Prompt (Optional)</Label>
              <Textarea placeholder="You are a helpful assistant..." value={formData.system_prompt} onChange={e => setFormData({...formData, system_prompt: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Card className="p-6 bg-slate-50 dark:bg-slate-900 border-dashed">
            <h3 className="font-medium mb-4">Connection Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground w-32 inline-block">Provider:</span> {providers.find(p=>p.id===provider)?.name}</p>
              <p><span className="text-muted-foreground w-32 inline-block">Model:</span> {formData.model}</p>
              <p><span className="text-muted-foreground w-32 inline-block">Name:</span> {formData.name}</p>
            </div>
          </Card>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Connection & Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
