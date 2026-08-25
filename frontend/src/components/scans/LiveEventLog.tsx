import { ScanEvent } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LiveEventLog({ events }: { events: ScanEvent[] }) {
  return (
    <div className="border rounded-lg bg-slate-950 text-slate-300 font-mono text-xs overflow-hidden h-[400px] flex flex-col shadow-inner">
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 font-sans font-semibold text-sm">
        Live Event Stream
      </div>
      <ScrollArea className="flex-1 p-4">
        {events.length === 0 ? (
          <div className="text-slate-500 italic">Waiting for events...</div>
        ) : (
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-slate-500 shrink-0">{new Date(e.timestamp || Date.now()).toLocaleTimeString()}</span>
                <span className={`${
                  e.stage === 'error' ? 'text-red-400' :
                  e.stage === 'evaluating' ? 'text-blue-400' :
                  e.stage === 'analyzing' ? 'text-purple-400' :
                  'text-slate-300'
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
