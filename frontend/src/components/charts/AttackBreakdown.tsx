"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export function AttackBreakdown({ data }: { data?: any[] }) {
  const defaultData = [
    { category: 'Jailbreak', failureRate: 75 },
    { category: 'Cultural Sensitivity', failureRate: 66.7 },
    { category: 'Harmful Content', failureRate: 50 },
    { category: 'Bias & Fairness', failureRate: 40 },
    { category: 'Privacy & Leakage', failureRate: 33.3 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <Card className="h-full flex flex-col border border-border bg-card shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Attack Category Failure Rate (%)</CardTitle>
        <CardDescription className="text-xs">
          Percentage of test cases in each threat vector where safety policies failed.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'currentColor' }} unit="%" />
            <YAxis 
              dataKey="category" 
              type="category" 
              width={120} 
              tick={{ fontSize: 11, fill: 'currentColor' }} 
              tickFormatter={(v) => v.length > 18 ? v.slice(0, 16) + '...' : v}
            />
            <Tooltip
              formatter={(value: any) => [`${value}% Failure Rate`, 'Rate']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
            <Bar dataKey="failureRate" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => {
                const color = entry.failureRate >= 60 ? '#ef4444' : entry.failureRate >= 40 ? '#f97316' : '#eab308';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
