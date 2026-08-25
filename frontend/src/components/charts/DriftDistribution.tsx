import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function DriftDistribution({ data }: { data: any[] }) {
  const COLORS: Record<string, string> = {
    'none': '#22c55e',
    'low': '#3b82f6',
    'medium': '#eab308',
    'high': '#f97316',
    'critical': '#ef4444'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drift Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="level" tick={{ fontSize: 12 }} textAnchor="middle" />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.level] || '#000'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
