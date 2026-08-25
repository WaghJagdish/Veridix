import { LanguageVariantDetail } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { VerdictBadge } from "@/components/shared/VerdictBadge"

export function CrossLangComparison({ variants }: { variants: LanguageVariantDetail[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {variants.map(v => (
        <Card key={v.language} className={`p-4 border-2 ${
          v.verdict === 'safe' ? 'border-green-200 dark:border-green-900' :
          v.verdict === 'borderline' ? 'border-yellow-200 dark:border-yellow-900' :
          'border-red-200 dark:border-red-900'
        }`}>
          <div className="font-bold mb-4 uppercase text-sm">{v.language === 'en' ? 'English' : v.language === 'hi' ? 'Hindi' : 'Hinglish'}</div>
          
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-muted-foreground text-xs font-semibold mb-1 uppercase tracking-wider">Prompt</div>
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-800 dark:text-slate-200 font-mono text-xs">{v.prompt}</div>
            </div>
            
            <div>
              <div className="text-muted-foreground text-xs font-semibold mb-1 uppercase tracking-wider">Response</div>
              <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-slate-700 dark:text-slate-300 h-32 overflow-y-auto font-mono text-xs border">
                {v.response || <span className="italic text-muted-foreground">No response</span>}
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Verdict:</span>
                <VerdictBadge verdict={v.verdict} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium">{v.confidence.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
