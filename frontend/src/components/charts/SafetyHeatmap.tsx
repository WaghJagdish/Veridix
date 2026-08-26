"use client"
import React from 'react';
import { HeatmapCell, Language } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SafetyHeatmap({ data }: { data: HeatmapCell[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg bg-card/50">
        <p className="text-sm">No category heatmap data available for this scan.</p>
      </div>
    );
  }

  const categories = Array.from(new Set(data.map(d => d.category)));
  const languages: { key: Language; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'hi', label: 'Hindi' },
    { key: 'hinglish', label: 'Hinglish' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-600 text-white';
    if (score >= 50) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Safe';
    if (score >= 50) return 'Degraded';
    return 'Vulnerable';
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
        <span className="font-medium text-foreground">Category Safety Index (0-100%)</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-600"></div>
            <span>Safe (≥80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span>Moderate (50-79%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-500"></div>
            <span>Critical Drift (&lt;50%)</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header Row */}
          <div className="grid grid-cols-[180px_1fr_1fr_1fr] gap-2 pb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-2">
              Attack Category
            </div>
            {languages.map(l => (
              <div key={l.key} className="text-center font-bold text-xs uppercase tracking-wider text-foreground bg-muted/60 py-1.5 rounded-md">
                {l.label}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          <div className="space-y-2 pt-1">
            {categories.map(cat => (
              <div key={cat} className="grid grid-cols-[180px_1fr_1fr_1fr] gap-2 items-center">
                <div className="text-xs font-medium capitalize text-foreground truncate pl-2" title={cat.replace(/_/g, ' ')}>
                  {cat.replace(/_/g, ' ')}
                </div>

                {languages.map(l => {
                  const cell = data.find(d => d.category === cat && (d.language === l.key || d.language === l.key.toLowerCase()));
                  const score = cell ? Math.round(cell.score) : null;

                  return (
                    <TooltipProvider key={`${cat}-${l.key}`}>
                      <Tooltip delayDuration={150}>
                        <TooltipTrigger asChild>
                          <div className={`h-11 flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 hover:scale-[1.03] shadow-xs cursor-pointer ${
                            score !== null ? getScoreColor(score) : 'bg-muted/40 text-muted-foreground'
                          }`}>
                            {score !== null ? (
                              <>
                                <span className="text-sm font-extrabold">{score}%</span>
                                <span className="text-[9px] opacity-85 font-normal">{getScoreBadge(score)}</span>
                              </>
                            ) : (
                              <span className="text-xs font-normal opacity-50">—</span>
                            )}
                          </div>
                        </TooltipTrigger>
                        {cell && (
                          <TooltipContent className="p-3 text-xs space-y-1 bg-card text-foreground border-border shadow-md">
                            <p className="font-bold capitalize text-sm">{cat.replace(/_/g, ' ')}</p>
                            <p className="text-muted-foreground">Language: <span className="font-semibold text-foreground">{l.label}</span></p>
                            <p className="text-muted-foreground">Safety Score: <span className="font-bold text-foreground">{cell.score}%</span></p>
                            <p className="text-muted-foreground">Tests Evaluated: <span className="font-semibold text-foreground">{cell.test_count}</span></p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
