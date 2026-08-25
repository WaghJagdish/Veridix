import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scan } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export function RecentScansTable({ scans }: { scans: Scan[] }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Preset</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scans.slice(0, 5).map(scan => (
              <TableRow key={scan.id}>
                <TableCell className="font-medium text-brand-indigo hover:underline">
                  <Link href={`/scans/${scan.id}`}>{scan.name}</Link>
                </TableCell>
                <TableCell>{scan.target?.name || 'Unknown'}</TableCell>
                <TableCell className="capitalize">{scan.preset}</TableCell>
                <TableCell>
                  <Badge variant={
                    scan.status === 'completed' ? 'default' : 
                    scan.status === 'running' ? 'secondary' : 
                    scan.status === 'failed' ? 'destructive' : 'outline'
                  } className={scan.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                    {scan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(scan.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
