import { ScanEvent } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LiveEventLog({ events }: { events: ScanEvent[] }) {
  return (
    <div className="border border-border rounded-xl bg-card text-foreground font-mono text-xs overflow-hidden h-[400px] flex flex-col shadow-xs">
      <div className="px-4 py-2.5 bg-muted/60 border-b border-border text-foreground font-sans font-semibold text-sm flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Event Stream
        </span>
        <span className="text-[11px] font-normal text-muted-foreground">Realtime Telemetry</span>
      </div>
      <ScrollArea className="flex-1 p-4 bg-muted/20">
        {events.length === 0 ? (
          <div className="text-muted-foreground italic">Waiting for events...</div>
        ) : (
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={i} className="flex gap-3 text-[11px] leading-relaxed">
                <span className="text-muted-foreground shrink-0">{new Date(e.timestamp || Date.now()).toLocaleTimeString()}</span>
                <span className={`${
                  e.stage === 'error' ? 'text-rose-600 font-semibold' :
                  e.stage === 'evaluating' ? 'text-emerald-700 font-semibold' :
                  e.stage === 'analyzing' ? 'text-teal-700 font-semibold' :
                  'text-foreground'
                }`}>
                  {e.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
