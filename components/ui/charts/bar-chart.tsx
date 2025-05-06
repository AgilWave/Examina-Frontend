"use client"

import * as React from "react"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

interface BarChartProps {
  data: any[]
  categories: string[]
  index: string
  colors?: string[]
  yAxisWidth?: number
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  tooltip?: boolean
  className?: string
}

export function BarChart({
  data,
  categories,
  index,
  colors = ["#1EBFBF"],
  yAxisWidth = 40,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  tooltip = true,
  className,
}: BarChartProps) {
  // Create a configuration object for the chart
  const chartConfig = React.useMemo(() => {
    return categories.reduce((acc, category, i) => {
      return {
        ...acc,
        [category]: {
          label: category,
          color: colors[i % colors.length],
        },
      }
    }, {})
  }, [categories, colors])

  return (
    <ChartContainer className={className} config={chartConfig}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 0,
          bottom: 5,
        }}
      >
        {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        {showXAxis && <XAxis 
          dataKey={index} 
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={8}
          tick={{ fontSize: 12 }}
        />}
        {showYAxis && <YAxis 
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={8}
          tick={{ fontSize: 12 }}
        />}
        {tooltip && <ChartTooltip content={<ChartTooltipContent />} />}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
            barSize={38}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  )
}