import { Progress } from "@/components/ui/progress"

export function ScanPipelineProgress({ currentStage, progress }: { currentStage: string, progress: number }) {
  const stages = [
    { id: 'generating', label: 'Generate Attacks' },
    { id: 'executing', label: 'Execute' },
    { id: 'evaluating', label: 'Evaluate' },
    { id: 'analyzing', label: 'Analyze Drift' }
  ];

  const currentIndex = stages.findIndex(s => s.id === currentStage);
  
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10" />
        
        {stages.map((stage, i) => {
          const isPast = currentIndex > i || currentStage === 'complete';
          const isActive = currentIndex === i && currentStage !== 'complete';
          
          return (
            <div key={stage.id} className="flex flex-col items-center gap-2 bg-card px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                isPast ? 'bg-brand-indigo border-brand-indigo text-white' :
                isActive ? 'border-brand-indigo text-brand-indigo shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse' :
                'bg-background border-muted text-muted-foreground'
              }`}>
                {isPast ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${isActive || isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>
      
      <Progress value={progress} className="h-2" />
    </div>
  )
}
