import { Scan } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { SafetyHeatmap } from "@/components/charts/SafetyHeatmap"
import { DriftDistribution } from "@/components/charts/DriftDistribution"
import { ShieldCheck, Activity } from "lucide-react"

export function ScanResultsWorkspace({ scan }: { scan: Scan }) {
  const summary = scan.summary || {
    overall_safety_score: 74,
    safety_drift_score: 61,
    heatmap_data: []
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="drift">Safety Drift</TabsTrigger>
        <TabsTrigger value="findings">Findings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard 
            title="Overall Safety Score" 
            value={`${summary.overall_safety_score}%`} 
            icon={<ShieldCheck className="h-4 w-4 text-green-500" />}
          />
          <MetricCard 
            title="Safety Drift Score" 
            value={summary.safety_drift_score} 
            icon={<Activity className="h-4 w-4 text-orange-500" />}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border p-4 rounded-lg bg-card">
            <h3 className="font-semibold mb-4">Language × Category Heatmap</h3>
            <SafetyHeatmap data={summary.heatmap_data || []} />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="drift" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <DriftDistribution data={[]} />
        </div>
      </TabsContent>
      
      <TabsContent value="findings">
        <div className="p-4 border rounded text-center text-muted-foreground">Findings Explorer goes here</div>
      </TabsContent>
    </Tabs>
  )
}
