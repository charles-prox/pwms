import React from "react";
import { Button } from "@heroui/react";
import { Head } from "@inertiajs/react";
import KpiCard from "@/Components/KpiCard";
import { Download } from "lucide-react";
import { RequestsDashboard } from "@/Components/RequestsDashboard";
import WarehouseUsageCharts from "@/Components/WarehouseUsageCharts";
import { DashboardPageProps } from "@/Utils/types";

const DashboardPage: React.FC<DashboardPageProps> = ({
    kpiCards,
    requestsSummary,
}) => {
    console.log("DashboardPage props:", kpiCards, requestsSummary);
    return (
        <div>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p>Overview of Your Account and Activity</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <MonthYearDropdown /> */}
                        <Button
                            // variant="flat"
                            color="primary"
                            // className="text-foreground"
                            startContent={<Download className="w-4 h-4" />}
                        >
                            Export
                        </Button>
                    </div>
                </div>
                <div className="w-full gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                    <KpiCard
                        title="Total Boxes"
                        data={kpiCards.total_boxes.count}
                        delta={kpiCards.total_boxes.added_this_month}
                        description="Added this month"
                        positiveTrend={true}
                        highlight={true}
                    />
                    <KpiCard
                        title="Total Documents"
                        data={kpiCards.total_documents.count}
                        delta={kpiCards.total_documents.added_this_month}
                        description="Added this month"
                        positiveTrend={true}
                    />
                    <KpiCard
                        title="Boxes Due for Disposal"
                        data={kpiCards.boxes_due_for_disposal.count}
                        delta={kpiCards.boxes_due_for_disposal.added_this_month}
                        description="Added this month"
                        positiveTrend={true}
                    />
                    <KpiCard
                        title="Boxes for Returns"
                        data={kpiCards.boxes_for_return.count}
                        delta={kpiCards.boxes_for_return.added_this_month}
                        description="Added this month"
                        positiveTrend={true}
                    />
                    <KpiCard
                        title="Pending Requests"
                        data={kpiCards.pending_requests.count}
                        delta={kpiCards.pending_requests.added_this_month}
                        description="Added this month"
                        positiveTrend={true}
                    />
                    <KpiCard
                        title="Completed Requests"
                        data={kpiCards.completed_requests.count}
                        delta={kpiCards.completed_requests.added_this_month}
                        description="Added this month"
                        positiveTrend={true}
                    />
                </div>
                <div className="w-full">
                    <RequestsDashboard
                        requestsSummary={requestsSummary.request_metrics}
                    />
                </div>
                <div>
                    <WarehouseUsageCharts
                        totalCapacity={1000}
                        offices={[
                            { office: "Office A", used: 200, capacity: 300 },
                            { office: "Office B", used: 100, capacity: 150 },
                            { office: "Office C", used: 300, capacity: 400 },
                            { office: "Office D", used: 50, capacity: 150 },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
