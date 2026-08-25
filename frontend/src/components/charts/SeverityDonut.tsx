import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SeverityDonut({ data }: { data: { critical: number, high: number, medium: number, low: number } }) {
  const chartData = [
    { name: 'Critical', value: data.critical },
    { name: 'High', value: data.high },
    { name: 'Medium', value: data.medium },
    { name: 'Low', value: data.low }
  ].filter(d => d.value > 0);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center relative min-h-[250px]">
        {total === 0 ? (
          <div className="text-muted-foreground text-sm">No findings available</div>
        ) : (
          <div className="w-full h-full absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-2xl font-bold">{total}</span>
              <span className="text-xs text-muted-foreground">Findings</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
