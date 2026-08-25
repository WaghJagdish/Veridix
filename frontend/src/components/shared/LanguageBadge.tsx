import { Badge } from "@/components/ui/badge"
import { Language } from "@/lib/types"

const langMap = {
  en: "English",
  hi: "Hindi",
  hinglish: "Hinglish"
}

export function LanguageBadge({ lang }: { lang: Language }) {
  return (
    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
      {langMap[lang]}
    </Badge>
  )
}
