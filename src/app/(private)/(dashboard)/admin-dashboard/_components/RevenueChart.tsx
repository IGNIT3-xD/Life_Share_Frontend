"use client";

import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { useAdminRevenueMetrics } from "@/hooks/useAnalytics";

const formatCurrency = (value: number) => {
    return `৳${value.toLocaleString("en-BD")}`;
};

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function RevenueChart() {
    const { data: revenueData, isPending, error } = useAdminRevenueMetrics();

    if (isPending) {
        return (
            <Card className="h-112.5 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </Card>
        );
    }

    if (error || !revenueData) {
        return (
            <Card className="h-112.5 flex items-center justify-center text-slate-500">
                Failed to load revenue data.
            </Card>
        );
    }

    const chartData = revenueData.monthly.map((item) => ({
        ...item,
        label: `${item.month.slice(0, 3)} ${item.year}`,
    }));

    const thisMonth = revenueData.thisMonth?.revenue || 0;
    const lastMonth = revenueData.lastMonth?.revenue || 0;
    const difference = thisMonth - lastMonth;
    const percentChange = lastMonth === 0 ? 100 : (difference / lastMonth) * 100;
    const isPositive = difference >= 0;

    return (
        <Card className="flex flex-col h-full shadow-sm">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue generated from platform services</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="h-75 w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.split(" ")[0]}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `৳${value / 1000}k`}
                            width={60}
                        />
                        <ChartTooltip
                            cursor={{ fill: "rgba(0,0,0,0.05)" }}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name, item) => (
                                        <div className="flex flex-col gap-1 w-full">
                                            <span className="font-semibold text-slate-900">
                                                {item.payload.label}
                                            </span>
                                            <span className="text-slate-600 font-bold">
                                                {formatCurrency(Number(value))}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {item.payload.transactions} transactions
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <Bar
                            dataKey="revenue"
                            fill="var(--color-revenue)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm pt-6 border-t mt-6">
                <div className="flex gap-2 leading-none font-medium">
                    {isPositive ? "Trending up" : "Trending down"} by{" "}
                    {Math.abs(percentChange).toFixed(1)}% this month{" "}
                    {isPositive ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                </div>
                <div className="leading-none text-muted-foreground flex gap-1">
                    Total lifetime revenue:
                    <strong className="text-slate-900">{formatCurrency(revenueData.totalRevenue)}</strong>
                </div>
            </CardFooter>
        </Card>
    );
}