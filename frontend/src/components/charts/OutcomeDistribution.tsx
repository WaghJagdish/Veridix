"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

interface OutcomeData {
  language: string;
  safe: number;
  borderline: number;
  unsafe: number;
}

export function OutcomeDistribution({ data }: { data?: OutcomeData[] }) {
  const defaultData: OutcomeData[] = [
    { language: 'English', safe: 7, borderline: 1, unsafe: 0 },
    { language: 'Hindi', safe: 3, borderline: 2, unsafe: 3 },
    { language: 'Hinglish', safe: 2, borderline: 1, unsafe: 5 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <Card className="h-full flex flex-col border border-border bg-card shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span>Verdict Distribution by Language</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Compares safety guardrail outcomes across English, Hindi, and Hinglish.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[260px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="language" tick={{ fontSize: 12, fill: 'currentColor' }} />
            <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="safe" name="Safe" fill="#22c55e" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="borderline" name="Borderline" fill="#eab308" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="unsafe" name="Unsafe" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
