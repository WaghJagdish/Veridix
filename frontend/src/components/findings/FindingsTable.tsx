import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Finding } from "@/lib/types"
import { SeverityBadge } from "@/components/shared/SeverityBadge"
import { LanguageBadge } from "@/components/shared/LanguageBadge"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FindingsTable({ findings }: { findings: Finding[] }) {
  if (!findings.length) return <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card">No findings match your criteria.</div>

  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ref</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Drift</TableHead>
            <TableHead>Title</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {findings.map(f => (
            <TableRow key={f.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{f.finding_ref}</TableCell>
              <TableCell><SeverityBadge severity={f.severity} /></TableCell>
              <TableCell className="capitalize">{f.category.replace(/_/g, ' ')}</TableCell>
              <TableCell><LanguageBadge lang={f.language} /></TableCell>
              <TableCell>
                {f.drift_level && f.drift_level !== 'none' ? (
                  <Badge variant="outline" className={`
                    ${f.drift_level === 'critical' ? 'border-red-500 text-red-700' : ''}
                    ${f.drift_level === 'high' ? 'border-orange-500 text-orange-700' : ''}
                    ${f.drift_level === 'medium' ? 'border-yellow-500 text-yellow-700' : ''}
                  `}>
                    {f.drift_score?.toFixed(2)} {f.drift_level.toUpperCase()}
                  </Badge>
                ) : <span className="text-muted-foreground text-sm">-</span>}
              </TableCell>
              <TableCell className="font-medium max-w-md truncate" title={f.title}>{f.title}</TableCell>
              <TableCell>
                <Link href={`/scans/${f.scan_id}/findings/${f.id}`} className="text-brand-indigo hover:text-brand-indigo/80">
                  <ArrowRight size={16} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
