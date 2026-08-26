import { Badge } from "@/components/ui/badge"
import { Language } from "@/lib/types"

const langStyles: Record<string, { label: string; className: string }> = {
  en: { 
    label: "English", 
    className: "bg-blue-100 text-blue-800 border-blue-300" 
  },
  hi: { 
    label: "Hindi (हिंदी)", 
    className: "bg-emerald-100 text-emerald-800 border-emerald-300" 
  },
  hinglish: { 
    label: "Hinglish", 
    className: "bg-purple-100 text-purple-800 border-purple-300" 
  },
}

export function LanguageBadge({ lang }: { lang?: Language | string }) {
  const l = lang ? lang.toLowerCase() : 'en';
  const style = langStyles[l] || { label: l.toUpperCase(), className: "bg-muted text-muted-foreground border-border" };

  return (
    <Badge variant="outline" className={`font-semibold text-[11px] px-2 py-0.5 rounded-full ${style.className}`}>
      {style.label}
    </Badge>
  )
}
