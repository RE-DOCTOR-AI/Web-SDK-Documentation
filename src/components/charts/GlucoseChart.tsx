import { GlucoseResult } from '@redoctor/sdk'
import { Line, LineChart, ReferenceArea, ResponsiveContainer, YAxis } from 'recharts'
import { ChartConfig, ChartContainer } from '@/components/ui/chart.tsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StoredResult } from '@/types/stored-result.ts'

export function GlucoseChart({ results }: { results: StoredResult[] }) {
  if (results.length === 0) {
    return <div className="text-gray-500">No data</div>
  }

  // Format data for the chart
  const glucoseData = results.map(({ timestamp, result }) => ({
    timestamp: new Date(timestamp).toLocaleString(),
    glucose: new GlucoseResult(result.glucose.glucoseMin, result.glucose.glucoseMax).getMean(),
  }))

  // Calculate min/max values for the chart
  const minGlucose = Math.min(...glucoseData.map(d => d.glucose), 70) // Minimum at least 70 for visibility
  const maxGlucose = Math.max(...glucoseData.map(d => d.glucose), 150) // Maximum at least 150 for visibility

  // Find the x-axis range for the reference areas
  const xMin = 0
  const xMax = glucoseData.length > 0 ? glucoseData.length - 1 : 0

  const chartConfig: ChartConfig = {}

  return (
    <Card className="border-1 shadow-none pb-0 pt-3 gap-2 overflow-hidden">
      <CardHeader className="font-bold">Glucose</CardHeader>

      <CardContent className="p-0 relative">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={glucoseData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <YAxis domain={[minGlucose, maxGlucose]} hide={true} />

              <ReferenceArea
                y1={126}
                y2={maxGlucose}
                x1={xMin}
                x2={xMax}
                fill="#FFCDD2" // Red
                fillOpacity={0.3}
              />
              <ReferenceArea
                y1={100}
                y2={126}
                x1={xMin}
                x2={xMax}
                fill="#FFE0B2" // Orange
                fillOpacity={0.3}
              />
              <ReferenceArea
                y1={minGlucose}
                y2={100}
                x1={xMin}
                x2={xMax}
                fill="#C8E6C9" // Green
                fillOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="glucose"
                stroke="#666696"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Subtle labels for ranges */}
        <div
          className="absolute inset-0 flex flex-col justify-between pointer-events-none"
          style={{ paddingTop: '4px', paddingBottom: '4px' }}
        >
          <div className="text-right pr-2">
            <span className="text-xs text-red-600 opacity-40">Critical</span>
          </div>
          <div className="text-right pr-2">
            <span className="text-xs text-amber-600 opacity-50">Warning</span>
          </div>
          <div className="text-right pr-2">
            <span className="text-xs text-green-600 opacity-45">Normal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
