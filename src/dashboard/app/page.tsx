"use client"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, Pie, PieChart, AreaChart, Area } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { salesByCity } from "@/api/dealers/queries"
import { getAccidentSeverity } from "@/api/vehicles/accidents"
import { getServiceFrequency } from "@/api/vehicles/services"


const chartConfig = {
} satisfies ChartConfig

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [manufacturer, setManufacturer] = useState("Toyota");

    useEffect(() => {
      queryClient.invalidateQueries({ queryKey: ["accidentSeverity", manufacturer] });
    }, [manufacturer, queryClient]);

    const {data: salesByMonthData} = useQuery({
      queryKey: ["salesByMonth"],
      queryFn: async () => salesByCity(),
      }
    );

    const salesPieChartData = useMemo(() => {
        return salesByMonthData?.map((item, index) => ({
        ...item,
        fill: "var(--chart-"+ ((index % 6) + 1)+ ")", 
        }))
    }, [salesByMonthData])


    const {data: accidentSeverity} = useQuery({
      queryKey: ["accidentSeverity", manufacturer],
      queryFn: async () => getAccidentSeverity(manufacturer),
    });
  
    const accidentSeverityBarChartData = useMemo(() => {
        return accidentSeverity?.map((item, index) => ({
        ...item,
        fill: "var(--chart-"+ ((index % 6) + 1)+ ")", 
        }))
    }, [accidentSeverity])

    // const {data: servicesFrequency} = useQuery({
    //   queryKey: ["servicesFrequency"],
    //   queryFn: async () => getServiceFrequency(),
    // });

    // const inverseServicesFrequency = useMemo(() => {
    //   return servicesFrequency?.slice().reverse();
    // }, [servicesFrequency]);

    // type ChartDataPoint = {
    //   date: string;
    //   [key: string]: string | number; 
    // };
    
    // const servicesFrequencyAreaChart = useMemo(() => {
    //   if (!inverseServicesFrequency) return [];

    //   // 1. Explicitly type the reducer accumulator as a Record
    //   const groupedData = inverseServicesFrequency.reduce<Record<string, ChartDataPoint>>((acc, curr) => {
    //     const dateKey = curr._id.date;
    //     const type = curr._id.fuelType;
    //     const count = curr.count;

    //     // If this date hasn't been seen yet, initialize it
    //     if (!acc[dateKey]) {
    //       acc[dateKey] = { date: dateKey };
    //     }

    //     // Now TS knows 'type' is a valid key because of the index signature
    //     acc[dateKey][type] = count;

    //     return acc;
    //   }, {});

    //   // 2. Convert back to an array
    //   const chartData = Object.values(groupedData);

    //   // 3. Sort by date using .getTime() (safest for TS arithmetic)
    //   return chartData.sort((a, b) => 
    //     new Date(a.date).getTime() - new Date(b.date).getTime()
    //   );

    // }, [inverseServicesFrequency]);
  
    // console.log("accidentSeverityBarChartData:", servicesFrequencyAreaChart);


    // const AreaChartConfig = {
    // Diesel: { label: "Diesel", color: "hsl(var(--chart-1))" },
    // Petrol: { label: "Petrol", color: "hsl(var(--chart-2))" },
    // Hybrid: { label: "Hybrid", color: "hsl(var(--chart-3))" },
    // };


    
    return(
     <div className="flex flex-col items-center p-6">
        <Card className=" p-6">
              <CardContent>
                <h2 className="mb-2 text-2xl font-bold">Welcome to the Dashboard</h2>
                <p className="text-muted-foreground">
                  This is your dashboard where you can monitor key metrics and performance indicators.
                </p>
              </CardContent>
            </Card>
            <div className="flex flew-row items-center gap-4 my-10 ">
              {/* sales throught the months */}

          <div className="flex flex-col items-center p-6">
            {/* <Card className="p-6 w-full">
              <CardHeader className="items-center pb-0">
                <CardTitle>Services per type of fuel</CardTitle>
                <CardDescription>Last 30 days available</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={AreaChartConfig} // Fixed: matches the variable name above
                  className="aspect-auto h-[250px] w-full"
                >
                  <AreaChart data={servicesFrequencyAreaChart} className="w-full">
                    <defs>
                      <linearGradient id="fillPetrol" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-Petrol)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-Petrol)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillHybrid" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-Hybrid)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-Hybrid)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>

                      <linearGradient id="fillDiesel" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-Diesel)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-Diesel)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            });
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    
                    
                    {/*
                    <Area
                      dataKey="Petrol"
                      type="natural"
                      stackId="a"
                      fill="var(--color-Petrol)"
                      stroke="var(--color-Petrol)"
                    />
                    <Area
                      dataKey="Hybrid"
                      type="natural"
                      stackId="a"
                      fill="var(--color-Hybrid)"
                      stroke="var(--color-Hybrid)"
                    />
                    <Area
                      dataKey="Diesel"
                      type="natural"
                      stackId="a"
                      fill="var(--color-Diesel)"
                      stroke="var(--color-Diesel)"
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card> */}
            </div>
              {/* <Card>
                <CardHeader className="items-center pb-0">
                  <CardTitle>Severity of accidents per manufacturer </CardTitle>
                  <CardDescription>Manufacturer: {manufacturer}</CardDescription>
                </CardHeader>
                <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                {/*  Bar chart for the different brands */}
                {/* <PieChart accessibilityLayer>
                  <Pie 
                    data={salesPieChartData || []} 
                    dataKey="desktop" 
                    nameKey="month" 
                    radius={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
              </CardContent>
              </Card> */}
            </div>
             <div className="flex flew-row items-center gap-4">
              <Card>
                <CardHeader className="items-center pb-0">
                  <CardTitle>Severity of accidents per manufacturer </CardTitle>
                  <CardDescription>Manufacturer: {manufacturer}</CardDescription>
                  <Select defaultValue="Toyota" onValueChange={setManufacturer}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toyota" key="Toyota" >Toyota</SelectItem>
                      <SelectItem value="VW" key="VW">VW</SelectItem>
                      <SelectItem value="BMW" key="BMW">BMW</SelectItem>
                      <SelectItem value="Ford" key="Ford">Ford</SelectItem>
                      <SelectItem value="Porsche" key="Porsche">Porsche</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              {/* Accident severity */}
                <BarChart accessibilityLayer data={accidentSeverityBarChartData || []} className=" w-8/9">
                 <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="severity"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) =>
                    chartConfig[value as keyof typeof chartConfig]?.label || value
                    }
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-1)"
                    strokeWidth={2}
                    radius={8}
                    activeIndex={2}
                    activeBar={({ ...props }) => {
                    return (
                      <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                      />
                    )
                    }}
                  />
                  </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            {/* Sales distribution throught the cities */}
              <Card className="min-h-[470px]">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Sales per city - Top 10 </CardTitle>
                  <CardDescription>Period: All time</CardDescription>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                  <PieChart accessibilityLayer>
                    <Pie 
                      data={salesPieChartData || []} 
                      dataKey="total_sales_value" 
                      nameKey="name" 
                      radius={80}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  </PieChart>
                </ChartContainer>
                </CardContent>
              </Card>
            </div>
      </div>
    );
}