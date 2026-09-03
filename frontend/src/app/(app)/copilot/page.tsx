"use client"
import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, MessageSquare, ShieldAlert, Activity, Flame, ArrowRight, RotateCcw, ShieldCheck, Bot, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useScans, useScanSummary } from "@/hooks/useApi"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  links?: { label: string; href: string }[]
  modelUsed?: string
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  "Why did my model fail the Hinglish jailbreak?",
  "What is the top security vulnerability in this test?",
  "How do I fix the safety drift?",
  "Explain my overall safety score",
  "What OWASP LLM categories am I failing?",
  "How do I harden my system prompt against code-mixing?",
]

// Simple markdown → HTML renderer
function markdownToHtml(md: string): string {
  return md
    .replace(/## (.+)/g, '<h2 class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mt-2 mb-1">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-[11px] font-mono">$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto my-2"><code>$1</code></pre>')
    .replace(/\| (.+) \|/g, (m) => '<tr>' + m.split('|').filter(Boolean).map(c => `<td class="border border-border px-2 py-1">${c.trim()}</td>`).join('') + '</tr>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-xs mb-1">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-xs mb-1">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/^(?!<)(.+)$/gm, '<p>$1</p>')
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 animate-fade-in-up", isUser && "flex-row-reverse")}>
      <div className={cn(
        "h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm",
        isUser ? "bg-emerald-600 text-white" : "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"
      )}>
        {isUser ? (
          <span className="text-xs font-bold">You</span>
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>

      <div className={cn(
        "max-w-[85%] space-y-2",
        isUser && "items-end"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs",
          isUser
            ? "bg-emerald-600 text-white rounded-tr-sm"
            : "bg-card border border-border text-foreground rounded-tl-sm"
        )}>
          {isUser ? (
            message.content
          ) : (
            <div className="prose prose-sm max-w-none text-xs">
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(message.content) }} />
            </div>
          )}
        </div>

        {message.links && message.links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.links.map(link => (
              <Link key={link.label} href={link.href}
                className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-semibold transition-colors flex items-center gap-1">
                {link.label} <ArrowRight size={10} />
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
          <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {message.modelUsed && (
            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
              ⚡ {message.modelUsed}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CopilotPage() {
  const { data: scans, isLoading: isScansLoading } = useScans()
  const [selectedScanId, setSelectedScanId] = useState<string>("")
  
  // Set default scan when scans load
  useEffect(() => {
    if (scans && scans.length > 0 && !selectedScanId) {
      setSelectedScanId(scans[0].id)
    }
  }, [scans, selectedScanId])

  const selectedScan = scans?.find(s => s.id === selectedScanId) || (scans && scans.length > 0 ? scans[0] : null)
  const { data: summary } = useScanSummary(selectedScan?.id || '')

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `## Welcome to the VERIDIX AI Security Copilot ✦

I am powered by **Groq Llama-3.3-70B** with real-time access to your database.

Select any **Safety Audit Test** from the dropdown selector above to talk to me directly about that specific evaluation!

**Ask me questions like:**
- "Why did my model fail the Hinglish jailbreak in this scan?"
- "What is the top security vulnerability in this test?"
- "Give me system prompt code to fix safety drift"`,
      links: [],
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      const history = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }))

      const res = await api.copilot.chat({
        message: content.trim(),
        scan_id: selectedScan?.id,
        messages_history: history,
      })

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply,
        links: res.links,
        modelUsed: res.model_used,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `## Error Contacting Copilot Backend\n\n${err.message || 'Failed to fetch response.'}\n\nPlease check that your backend is running at http://localhost:8000.`,
          timestamp: new Date(),
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: "welcome-reset",
      role: "assistant",
      content: selectedScan 
        ? `Chat scope set to **${selectedScan.name}**. Ask me any question about this evaluation!`
        : "Chat cleared. Ask me anything about your AI safety evaluation results.",
      links: [],
      timestamp: new Date(),
    }])
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header with Test Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-600/20">
            <Sparkles className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              AI Security Copilot
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">Llama-3.3 70B</span>
            </h1>
            <p className="text-xs text-muted-foreground">Select a test scan to give the assistant exact vulnerability context</p>
          </div>
        </div>

        {/* Scan / Test Selector Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl shadow-xs">
            <Filter size={13} className="text-purple-600" />
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Active Test:</span>
            <select
              value={selectedScanId}
              onChange={e => {
                setSelectedScanId(e.target.value)
                setMessages(prev => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: `✦ **Switched Chat Scope to Scan**: \`${scans?.find(s => s.id === e.target.value)?.name}\`. You can now ask questions specifically about this evaluation.`,
                    timestamp: new Date(),
                  }
                ])
              }}
              className="h-7 text-xs bg-transparent text-foreground font-bold focus:outline-none cursor-pointer max-w-[220px] truncate"
            >
              {isScansLoading ? (
                <option value="">Loading tests...</option>
              ) : scans && scans.length > 0 ? (
                scans.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.is_demo ? "(Demo)" : "(Live)"}
                  </option>
                ))
              ) : (
                <option value="">No tests found</option>
              )}
            </select>
          </div>

          <Button variant="outline" size="sm" onClick={clearChat} className="h-9 text-xs text-muted-foreground hover:text-foreground px-3 rounded-xl border-border">
            <RotateCcw size={13} className="mr-1.5" /> Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Context Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 border-border bg-card shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center justify-between">
              <span>Active Test Context</span>
              <Bot size={13} className="text-purple-600" />
            </div>
            {selectedScan ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-foreground truncate">{selectedScan.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Safety", value: `${summary?.overall_safety_score ?? 74}%`, color: "text-amber-700" },
                    { label: "Drift", value: `${summary?.safety_drift_score ?? 61}%`, color: "text-rose-600" },
                    { label: "Critical", value: `${summary?.critical_findings ?? 5}`, color: "text-rose-600" },
                    { label: "Tests", value: `${summary?.total_tests ?? 24}`, color: "text-emerald-700" },
                  ].map(m => (
                    <div key={m.label} className="bg-muted/50 rounded-lg p-2 text-center">
                      <div className={`text-sm font-black font-mono ${m.color}`}>{m.value}</div>
                      <div className="text-[9px] text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>
                <Link href={`/scans/${selectedScan.id}`} className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold pt-1">
                  <Activity size={10} /> View Test Details <ArrowRight size={10} />
                </Link>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No test scan data selected.</p>
            )}
          </Card>

          <Card className="p-4 border-border bg-card shadow-xs space-y-2">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Direct Links</div>
            {[
              { label: "All Findings", href: "/findings", icon: <ShieldAlert size={12} className="text-rose-500" /> },
              { label: "Safety Scans", href: "/scans", icon: <Activity size={12} className="text-emerald-600" /> },
              { label: "Run New Scan", href: "/scans/new", icon: <Flame size={12} className="text-orange-500" /> },
            ].map(l => (
              <Link key={l.label} href={l.href}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted/50 transition-colors">
                {l.icon} {l.label} <ArrowRight size={10} className="ml-auto" />
              </Link>
            ))}
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
          <Card className="flex-1 flex flex-col border-border bg-card shadow-xs overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Groq Llama-3.3-70B analyzing test context...</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 3 && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-purple-50 hover:border-purple-300 text-muted-foreground hover:text-purple-900 transition-all flex items-center gap-1.5">
                    <MessageSquare size={10} className="text-purple-600" />
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-card">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask Groq Llama 70B about ${selectedScan?.name || 'test results'}...`}
                    rows={1}
                    className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all min-h-[44px] max-h-[120px]"
                    style={{ height: "auto" }}
                    onInput={(e) => {
                      const t = e.target as HTMLTextAreaElement
                      t.style.height = "auto"
                      t.style.height = Math.min(t.scrollHeight, 120) + "px"
                    }}
                  />
                </div>
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  size="sm"
                  className="h-11 w-11 p-0 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex-shrink-0">
                  <Send size={16} />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Powered by Groq Llama-3.3-70B using backend API key. Active test: <strong className="text-foreground">{selectedScan?.name || 'Latest Scan'}</strong>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
