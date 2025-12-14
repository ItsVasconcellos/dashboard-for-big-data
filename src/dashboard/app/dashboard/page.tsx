"use client"
import { Bar, BarChart, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { useMemo } from "react"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const rawPieData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]


const chartConfig = {
} satisfies ChartConfig

export default function Dashboard() {
    const pieChartData = useMemo(() => {
        return rawPieData.map((item, index) => ({
        ...item,
        fill: "var(--chart-"+ ((index % 6) + 1)+ ")", 
        }))
    }, [])
    return(
     <div className="flex flex-col max-w-3xl items-center gap-6 sm:items-start">
            <Card className=" p-6">
              <CardContent>
                <h2 className="mb-2 text-2xl font-bold">Welcome to the Dashboard</h2>
                <p className="text-muted-foreground">
                  This is your dashboard where you can monitor key metrics and performance indicators.
                </p>
              </CardContent>
            </Card>
            <div className="flex flew-row items-center gap-4">
              {/* sales throught the months */}
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                {/*  Bar chart for the different brands */}
                <PieChart accessibilityLayer>
                  <Pie 
                    data={pieChartData} 
                    dataKey="desktop" 
                    nameKey="month" 
                    radius={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
            </div>
             <div className="flex flew-row items-center gap-4">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              {/* Accident severity */}
                <BarChart accessibilityLayer data={chartData}>
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            {/* Sales distribution throught the cities */}
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <PieChart accessibilityLayer>
                  <Pie 
                    data={pieChartData} 
                    dataKey="desktop" 
                    nameKey="month" 
                    radius={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
            </div>
            
            </div>
    );
}