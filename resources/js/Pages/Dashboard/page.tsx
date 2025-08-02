import React from "react";
import { Button } from "@heroui/react";
import { Head, usePage } from "@inertiajs/react";
import KpiCard from "@/Components/KpiCard";
import { Download } from "lucide-react";
import { RequestsDashboard } from "@/Components/RequestsDashboard";
import WarehouseUsageCharts from "@/Components/WarehouseUsageCharts";
import { DashboardPageProps } from "@/Utils/types";

const DashboardPage: React.FC<DashboardPageProps> = ({
    kpiCards,
    requestsSummary,
    warehouseUsageSummary,
}) => {
    const { auth } = usePage<any>().props;
    const userRoles = auth.user.roles;

    const hasElevatedAccess =
        userRoles.includes("super-admin") ||
        userRoles.includes("regional-document-custodian");

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
                {/* Conditional Content for Elevated Roles */}
                {hasElevatedAccess && (
                    <>
                        <div>
                            <WarehouseUsageCharts
                                warehouseSummary={warehouseUsageSummary}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
