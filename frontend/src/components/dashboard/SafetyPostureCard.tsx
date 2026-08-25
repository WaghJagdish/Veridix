import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export function SafetyPostureCard({ score }: { score: number }) {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remainder', value: 100 - score }
  ];
  
  const COLORS = [score > 80 ? '#22c55e' : score > 60 ? '#eab308' : '#ef4444', '#f1f5f9'];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Overall Safety Posture</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center relative">
        <div className="h-32 w-full max-w-[12rem]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
          <span className="text-3xl font-bold">{score}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
