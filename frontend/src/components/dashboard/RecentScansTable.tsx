import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scan } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, Activity, CheckCircle2, Clock, Flame, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecentScansTable({ scans }: { scans: Scan[] }) {
  return (
    <Card className="h-full flex flex-col border-border bg-card shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Safety Evaluation Scans</CardTitle>
          <CardDescription className="text-xs">
            Recent Indic red-teaming and safety drift scans.
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
          <Link href="/scans">View All ({scans.length}) →</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        {scans.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No scans recorded yet. Launch your first Indic scan to begin.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase tracking-wider pl-4">Scan Name</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Preset</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Tests</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-right pr-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.slice(0, 6).map(scan => {
                const isComplete = scan.status === 'completed';
                const isRunning = scan.status === 'running' || scan.status === 'pending';

                return (
                  <TableRow key={scan.id} className="hover:bg-muted/40 transition-colors group">
                    <TableCell className="pl-4">
                      <div className="space-y-0.5">
                        <Link 
                          href={`/scans/${scan.id}`} 
                          className="font-semibold text-xs text-foreground group-hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                        >
                          {scan.name}
                          {scan.is_demo && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                              DEMO
                            </span>
                          )}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDate(scan.created_at)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize font-medium border-border">
                        {scan.preset || 'Indic'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] uppercase font-bold tracking-wider ${
                          isComplete 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : isRunning
                            ? 'bg-teal-100 text-teal-800 border-teal-300 animate-pulse'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {isComplete ? 'Completed' : isRunning ? 'Running' : scan.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono font-medium text-foreground">
                        {scan.tests_completed} / {scan.total_tests || 24}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-4">
                      <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                        <Link href={`/scans/${scan.id}`}>
                          <ArrowRight size={13} className="text-muted-foreground group-hover:text-emerald-700 transition-colors" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
