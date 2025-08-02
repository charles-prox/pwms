import React from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardHeader } from "@heroui/react";
import { useTheme } from "@/Contexts/ThemeContext";
import { WarehouseSummary } from "@/Utils/types";

interface WarehouseUsageChartsProps {
    warehouseSummary: WarehouseSummary;
}

const WarehouseUsageCharts: React.FC<WarehouseUsageChartsProps> = ({
    warehouseSummary,
}) => {
    const {
        stored_boxes,
        total_capacity,
        remaining_space,
        occupying_offices_count,
        ground_used,
        ground_capacity,
        mezzanine_used,
        mezzanine_capacity,
        office_usage,
    } = warehouseSummary;

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const usedPercent = total_capacity
        ? Math.round((stored_boxes / total_capacity) * 100)
        : 0;

    const offices = office_usage.map((o) => ({
        office: o.office.acronym || o.office.name,
        used: o.occupied_locations * 18, // 9 positions * 2 boxes per position
        capacity: o.occupied_locations * 18,
    }));

    const pieOption = {
        backgroundColor: "transparent",
        textStyle: {
            color: isDark ? "#d1d5db" : "#374151",
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
                data: [
                    {
                        value: stored_boxes,
                        name: "Used",
                        itemStyle: {
                            color: "#22c55e",
                        },
                    },
                    {
                        value: remaining_space,
                        name: "Remaining",
                        itemStyle: {
                            color: isDark ? "#1f2937" : "#d1fae5",
                        },
                    },
                ],
            },
        ],
    };

    const greenShades = [
        "#bbf7d0",
        "#86efac",
        "#4ade80",
        "#22c55e",
        "#16a34a",
        "#15803d",
        "#166534",
        "#14532d",
        "#064e3b",
        "#022c22",
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
            data: [100],
            barGap: "10%",
            itemStyle: {
                color: greenShades[i % greenShades.length],
                borderRadius: [10, 10, 0, 0],
            },
            label: {
                show: true,
                position: "top",
                formatter: "100%",
                color: isDark ? "#f3f4f6" : "#111827",
            },
        })),
    };

    const averagePerOffice = occupying_offices_count
        ? Math.round(stored_boxes / occupying_offices_count)
        : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Pie Chart Card */}
            <div className="col-span-1 lg:col-span-5">
                <Card className="p-2 h-full">
                    <CardHeader>
                        <h2 className="text-lg">Warehouse Usage</h2>
                    </CardHeader>
                    <div className="p-4 flex flex-col gap-4 md:flex-row">
                        <div className="grid grid-cols-2 gap-2 text-sm w-full md:w-1/2">
                            <div>
                                <p className="text-4xl font-bold text-green-500">
                                    {stored_boxes}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Stored Boxes
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-green-600">
                                    {total_capacity}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Warehouse Capacity
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-green-700">
                                    {occupying_offices_count}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Offices Using
                                </p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-green-800">
                                    {remaining_space}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Remaining Space
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
                                            {ground_used} / {ground_capacity}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">
                                            Mezzanine
                                        </p>
                                        <p className="font-medium text-green-600">
                                            {mezzanine_used} /{" "}
                                            {mezzanine_capacity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/6">
                                <h2 className="text-5xl text-green-800">
                                    {averagePerOffice}
                                </h2>
                                <p className="text-xs">Avg boxes per office</p>
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
