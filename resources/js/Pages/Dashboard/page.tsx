import React from "react";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
import { Head } from "@inertiajs/react";
import KpiCard from "@/Components/KpiCard";
import { MonthYearDropdown } from "@/Components/MothYearDropdown";
import { Download } from "lucide-react";

const DashboardPage = () => {
    return (
        <div>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p>Overview of Your Account and Activity</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <MonthYearDropdown />
                        <Button
                            variant="flat"
                            className="text-foreground"
                            startContent={<Download className="w-4 h-4" />}
                        >
                            Export
                        </Button>
                    </div>
                </div>
                <div className="w-full gap-3 grid grid-cols-12">
                    <div className="col-span-4 sm:col-span-4">
                        <KpiCard
                            title="Active Requests"
                            data={42}
                            delta={5}
                            description="Increased from last month"
                            positiveTrend={true}
                            highlight={true}
                        />
                    </div>
                    <div className="col-span-4 sm:col-span-4">
                        <KpiCard
                            title="Overdue Returns"
                            data={8}
                            delta={2}
                            description="More than last period"
                            positiveTrend={false}
                        />
                    </div>
                    <div className="col-span-4 sm:col-span-4">
                        <KpiCard
                            title="Overdue Returns"
                            data={8}
                            delta={2}
                            description="More than last period"
                            positiveTrend={false}
                        />
                    </div>
                    <div className="col-span-4 sm:col-span-4">
                        <KpiCard
                            title="Overdue Returns"
                            data={8}
                            delta={2}
                            description="More than last period"
                            positiveTrend={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
