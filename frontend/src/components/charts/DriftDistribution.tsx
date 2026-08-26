"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export function DriftDistribution({ data }: { data?: any[] }) {
  const COLORS: Record<string, string> = {
    'none': '#22c55e',
    'low': '#3b82f6',
    'medium': '#eab308',
    'high': '#f97316',
    'critical': '#ef4444'
  };

  const defaultData = [
    { level: 'None', levelKey: 'none', count: 3, percentage: '37.5%' },
    { level: 'Low', levelKey: 'low', count: 0, percentage: '0%' },
    { level: 'Medium', levelKey: 'medium', count: 1, percentage: '12.5%' },
    { level: 'High', levelKey: 'high', count: 2, percentage: '25.0%' },
    { level: 'Critical', levelKey: 'critical', count: 2, percentage: '25.0%' },
  ];

  const chartData = data && data.length > 0 ? data.map(d => ({
    level: d.level ? d.level.charAt(0).toUpperCase() + d.level.slice(1) : d.levelKey,
    levelKey: d.levelKey || d.level?.toLowerCase() || 'none',
    count: d.count ?? 0,
    percentage: d.percentage || ''
  })) : defaultData;

  const total = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="h-full flex flex-col border border-border bg-card shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span>Safety Drift Severity Spread</span>
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
            {total} Total Events
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Severity of behavioral divergence when prompts are translated from English into Indic languages.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="level" tick={{ fontSize: 12, fill: 'currentColor' }} />
            <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} allowDecimals={false} />
            <Tooltip
              formatter={(value: any, name: any, item: any) => [
                `${value} test cases (${item.payload.percentage || ''})`, 
                'Count'
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.levelKey] || '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
