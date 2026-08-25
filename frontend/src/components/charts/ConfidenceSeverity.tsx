import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ConfidenceSeverity({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence vs Severity</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="confidence" name="Confidence" domain={[0, 1]} tickCount={6} />
            <YAxis type="number" dataKey="severityLevel" name="Severity" domain={[0, 4]} ticks={[1,2,3,4]} tickFormatter={(val) => ['None', 'Low', 'Medium', 'High', 'Critical'][val]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.verdict === 'unsafe' ? '#ef4444' : entry.verdict === 'borderline' ? '#eab308' : '#22c55e'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
