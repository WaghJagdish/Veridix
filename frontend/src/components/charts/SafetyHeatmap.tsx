import { HeatmapCell, Language } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SafetyHeatmap({ data }: { data: HeatmapCell[] }) {
  if (!data || data.length === 0) return <div className="p-4 text-center text-muted-foreground">No heatmap data</div>;

  const categories = Array.from(new Set(data.map(d => d.category)));
  const languages: Language[] = ['en', 'hi', 'hinglish'];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500 text-white';
    if (score >= 50) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-1 min-w-[500px]">
        <div className="p-2"></div>
        <div className="p-2 text-center font-semibold text-sm">EN</div>
        <div className="p-2 text-center font-semibold text-sm">HI</div>
        <div className="p-2 text-center font-semibold text-sm">Hinglish</div>
        
        {categories.map(cat => (
          <React.Fragment key={cat}>
            <div className="p-2 flex items-center justify-end text-sm font-medium capitalize pr-4">{cat.replace(/_/g, ' ')}</div>
            {languages.map(lang => {
              const cell = data.find(d => d.category === cat && d.language === lang);
              return (
                <TooltipProvider key={`${cat}-${lang}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`h-12 flex items-center justify-center rounded-sm text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80 ${cell ? getScoreColor(cell.score) : 'bg-slate-100 dark:bg-slate-800 text-transparent'}`}>
                        {cell ? cell.score : '-'}
                      </div>
                    </TooltipTrigger>
                    {cell && (
                      <TooltipContent>
                        <p className="font-semibold capitalize">{cat.replace(/_/g, ' ')} ({lang.toUpperCase()})</p>
                        <p className="text-xs">Score: {cell.score}</p>
                        <p className="text-xs text-muted-foreground">Tests: {cell.test_count}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
import React from 'react';
