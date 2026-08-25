"use client"
import { useTargets } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Server } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { EmptyState } from "@/components/shared/EmptyState"

export default function TargetsPage() {
  const { data: targets, isLoading } = useTargets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Targets</h1>
          <p className="text-muted-foreground">Manage AI models and endpoints to evaluate.</p>
        </div>
        <Button asChild>
          <Link href="/targets/new"><Plus className="mr-2 h-4 w-4" /> Connect Target</Link>
        </Button>
      </div>

      {isLoading ? (
        <div>Loading targets...</div>
      ) : !targets || targets.length === 0 ? (
        <EmptyState 
          icon={<Server size={24} />} 
          title="No targets connected" 
          description="Connect your first AI model to start running safety evaluations." 
          action={<Button asChild><Link href="/targets/new">Connect Target</Link></Button>} 
        />
      ) : (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="capitalize">{t.provider}</TableCell>
                  <TableCell><code className="px-1.5 py-0.5 bg-muted rounded text-xs">{t.model}</code></TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(t.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
