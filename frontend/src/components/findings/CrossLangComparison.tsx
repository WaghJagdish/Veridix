"use client"
import { useState } from "react"
import { LanguageVariantDetail } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { VerdictBadge } from "@/components/shared/VerdictBadge"
import { SeverityBadge } from "@/components/shared/SeverityBadge"
import { LanguageBadge } from "@/components/shared/LanguageBadge"
import { Copy, Check, ShieldAlert, Clock, Award, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function CrossLangComparison({ variants }: { variants?: LanguageVariantDetail[] }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!variants || variants.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg bg-card/40">
        No language variant evaluations available.
      </div>
    );
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Sort order: en, hi, hinglish
  const langOrder = { en: 1, hi: 2, hinglish: 3 };
  const sortedVariants = [...variants].sort((a, b) => 
    (langOrder[a.language] || 99) - (langOrder[b.language] || 99)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {sortedVariants.map((v) => {
        const evalData = v.evaluation;
        const verdict = evalData?.verdict || v.verdict || 'unknown';
        const severity = evalData?.severity || v.severity || 'none';
        const confidence = evalData?.confidence ?? v.confidence ?? 0.85;
        const refusalQuality = Math.round((evalData?.refusal_quality ?? v.refusal_quality ?? 0.5) * 100);
        const policyAdherence = Math.round((evalData?.policy_adherence ?? v.policy_adherence ?? 0.5) * 100);

        const isUnsafe = verdict.toLowerCase() === 'unsafe';
        const isBorderline = verdict.toLowerCase() === 'borderline';
        const isSafe = verdict.toLowerCase() === 'safe';

        const borderColor = isUnsafe 
          ? 'border-rose-300 shadow-xs' 
          : isBorderline 
          ? 'border-amber-300 shadow-xs' 
          : 'border-emerald-300 shadow-xs';

        const headerBg = isUnsafe
          ? 'bg-rose-50 text-rose-950 border-rose-200'
          : isBorderline
          ? 'bg-amber-50 text-amber-950 border-amber-200'
          : 'bg-emerald-50 text-emerald-950 border-emerald-200';

        return (
          <Card key={v.language} className={`overflow-hidden flex flex-col border-2 shadow-xs transition-all duration-200 bg-card ${borderColor}`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${headerBg}`}>
              <div className="flex items-center gap-2">
                <LanguageBadge lang={v.language} />
                {v.latency_ms && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock size={11} /> {v.latency_ms}ms
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <VerdictBadge verdict={verdict} />
              </div>
            </div>

            {/* Content Body */}
            <CardContent className="p-4 space-y-4 flex-1 flex flex-col justify-between text-xs">
              <div className="space-y-3.5">
                {/* Prompt Block */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <FileText size={12} /> Test Prompt
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-emerald-50"
                      onClick={() => handleCopy(v.prompt, `p-${v.language}`)}
                      title="Copy prompt"
                    >
                      {copiedKey === `p-${v.language}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </Button>
                  </div>
                  <div className="bg-emerald-950/5 text-emerald-950 p-3 rounded-lg font-mono text-[11px] leading-relaxed border border-emerald-200/80 select-text max-h-36 overflow-y-auto">
                    {v.prompt}
                  </div>
                </div>

                {/* Model Response Block */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Award size={12} /> Model Output
                    </span>
                    {v.response && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-emerald-50"
                        onClick={() => handleCopy(v.response || '', `r-${v.language}`)}
                        title="Copy response"
                      >
                        {copiedKey === `r-${v.language}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </Button>
                    )}
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-foreground font-mono text-[11px] leading-relaxed border border-border max-h-44 overflow-y-auto select-text">
                    {v.response ? (
                      v.response
                    ) : (
                      <span className="italic text-muted-foreground">No response received (Empty or filtered)</span>
                    )}
                  </div>
                </div>

                {/* Evaluator Reasoning if available */}
                {evalData?.reasoning && (
                  <div className="bg-muted/40 p-2.5 rounded-md border border-border text-[11px] space-y-1">
                    <span className="font-semibold text-foreground">Judge Reasoning:</span>
                    <p className="text-muted-foreground leading-relaxed">{evalData.reasoning}</p>
                  </div>
                )}
              </div>

              {/* Guardrail Metrics Footer */}
              <div className="pt-3 border-t border-border space-y-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Policy Adherence:</span>
                    <span className="font-bold text-foreground">{policyAdherence}%</span>
                  </div>
                  <Progress value={policyAdherence} className="h-1.5" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Refusal Quality:</span>
                    <span className="font-bold text-foreground">{refusalQuality}%</span>
                  </div>
                  <Progress value={refusalQuality} className="h-1.5" />
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-muted-foreground">Judge Confidence:</span>
                  <span className="font-semibold text-foreground">{Math.round(confidence * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
