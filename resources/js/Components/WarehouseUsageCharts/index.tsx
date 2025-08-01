import React from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardHeader } from "@heroui/react";
import { useTheme } from "@/Contexts/ThemeContext";

interface OfficeUsage {
    office: string;
    used: number;
    capacity: number;
}

interface WarehouseUsageChartsProps {
    totalCapacity: number;
    offices: OfficeUsage[];
}

// Dummy data
const totalUsed = 420;
const totalCapacity = 1000;
const groundUsed = 250;
const groundCapacity = 500;
const mezzanineUsed = 170;
const mezzanineCapacity = 500;

const offices = [
    { office: "Office A", used: 70, capacity: 100 },
    { office: "Office B", used: 40, capacity: 100 },
    { office: "Office C", used: 90, capacity: 100 },
    { office: "Office D", used: 60, capacity: 100 },
    { office: "Office E", used: 80, capacity: 100 },
    { office: "Office F", used: 50, capacity: 100 },
    { office: "Office G", used: 75, capacity: 100 },
    { office: "Office H", used: 30, capacity: 100 },
    { office: "Office I", used: 65, capacity: 100 },
    { office: "Office J", used: 95, capacity: 100 },
    { office: "Office K", used: 85, capacity: 100 },
];

const WarehouseUsageCharts: React.FC<WarehouseUsageChartsProps> = () => {
    const totalUsed = offices.reduce((sum, o) => sum + o.used, 0);
    const remaining = Math.max(totalCapacity - totalUsed, 0);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const usedPercent =
        totalUsed && totalCapacity
            ? Math.round((totalUsed / totalCapacity) * 100)
            : 0;

    const pieOption = {
        backgroundColor: "transparent",
        textStyle: {
            color: isDark ? "#d1d5db" : "#374151", // light gray or dark gray
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
        },
        series: [
            {
                name: "Capacity",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: isDark ? "#18181b" : "#fff",
                    borderWidth: 5,
                },
                label: {
                    show: true,
                    position: "center",
                    formatter: `${usedPercent}%`,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: isDark ? "#f9fafb" : "#1f2937",
                },
                // Prevent label from changing or disappearing on hover
                data: [
                    {
                        value: totalUsed,
                        name: "Used",
                        itemStyle: {
                            color: "#22c55e", // emerald-500
                        },
                    },
                    {
                        value: remaining,
                        name: "Remaining",
                        itemStyle: {
                            color: isDark ? "#1f2937" : "#d1fae5", // dark: gray-800, light: green-100
                        },
                    },
                ],
            },
        ],
    };

    const blueShades = [
        "#93c5fd",
        "#60a5fa",
        "#3b82f6",
        "#2563eb",
        "#1d4ed8",
        "#1e40af",
        "#1e3a8a",
        "#172554",
        "#0c4a6e",
        "#075985",
    ];

    const greenShades = [
        "#bbf7d0", // green-200
        "#86efac", // green-300
        "#4ade80", // green-400
        "#22c55e", // green-500
        "#16a34a", // green-600
        "#15803d", // green-700
        "#166534", // green-800
        "#14532d", // green-900
        "#064e3b", // emerald-900
        "#022c22", // near black green
    ];

    const barOption = {
        backgroundColor: "transparent",
        textStyle: {
            color: isDark ? "#d1d5db" : "#374151",
        },
        tooltip: {
            trigger: "item",
            formatter: "{a}<br />Usage: {c}%",
        },
        legend: {
            data: offices.map((o) => o.office),
            bottom: "0%",
            type: "scroll",
            textStyle: {
                color: isDark ? "#d1d5db" : "#374151",
            },
        },
        grid: {
            left: "5%",
            right: "5%",
            bottom: "20%",
            top: "10%",
            containLabel: true,
        },
        xAxis: {
            type: "category",
            data: ["Usage"],
            axisLabel: { show: false },
            axisLine: {
                lineStyle: {
                    color: isDark ? "#6b7280" : "#d1d5db",
                },
            },
        },
        yAxis: {
            type: "value",
            max: 100,
            axisLabel: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: isDark ? "#6b7280" : "#d1d5db",
                },
            },
            splitLine: {
                show: false,
            },
        },
        series: offices.map((o, i) => ({
            name: o.office,
            type: "bar",
            data: [Math.round((o.used / o.capacity) * 100)],
            barGap: "10%",
            itemStyle: {
                color: greenShades[i % greenShades.length],
                borderRadius: [10, 10, 0, 0],
            },
            label: {
                show: true,
                position: "top",
                formatter: "{c}%",
                color: isDark ? "#f3f4f6" : "#111827",
            },
        })),
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Pie Chart Card */}
            <div className="col-span-1 lg:col-span-5">
                <Card className="p-2 h-full">
                    <CardHeader>
                        <h2 className="text-lg">Warehouse Usage</h2>
                    </CardHeader>
                    <div className="p-4 flex flex-col gap-6 md:flex-row">
                        {/* KPI Summary */}
                        <div className="grid grid-cols-2 gap-4 text-sm w-full md:w-1/2">
                            <div>
                                <p className="text-4xl font-bold text-green-500">
                                    {totalUsed}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Stored Boxes
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-green-600">
                                    {totalCapacity}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Warehouse Capacity
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-green-800">
                                    {totalCapacity - totalUsed}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Remaining Space
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-green-700">
                                    {offices.length}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Offices Using
                                </p>
                            </div>
                            <div className="col-span-2 border-t pt-2">
                                <p className="text-gray-500 text-sm font-semibold mb-1">
                                    Breakdown by Area
                                </p>
                                <div className="text-xs grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-gray-500">Ground</p>
                                        <p className="font-medium text-green-600">
                                            {groundUsed} / {groundCapacity}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">
                                            Mezzanine
                                        </p>
                                        <p className="font-medium text-green-600">
                                            {mezzanineUsed} /{" "}
                                            {mezzanineCapacity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="w-full md:w-1/2">
                            <ReactECharts
                                option={pieOption}
                                style={{ height: 300 }}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bar Chart Card */}
            <div className="col-span-1 lg:col-span-7">
                <Card className="p-2 h-full">
                    <CardHeader>
                        <h2 className="text-lg">Office-wise Usage</h2>
                    </CardHeader>

                    <div className="p-4">
                        {/* Responsive Metric + Chart Layout */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/6">
                                <h2 className="text-5xl text-green-800">200</h2>
                                <p className="text-xs">
                                    Average boxes stored per office
                                </p>
                            </div>
                            <div className="md:w-5/6">
                                <ReactECharts
                                    option={barOption}
                                    style={{ height: 300 }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default WarehouseUsageCharts;
