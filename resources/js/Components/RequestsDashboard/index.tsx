import React from "react";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import RequestDistributionBar from "../RequestDistributionBar";
import clsx from "clsx";

const typeColorMap: Record<string, string> = {
    storage: "bg-green-400",
    withdrawal: "bg-yellow-400",
    return: "bg-blue-400",
    disposal: "bg-red-400",
};

type RequestsSummary = {
    storage: {
        title: string;
        value: number;
        change: number;
        isIncrease: boolean;
    };
    withdrawal: {
        title: string;
        value: number;
        change: number;
        isIncrease: boolean;
    };
    return: {
        title: string;
        value: number;
        change: number;
        isIncrease: boolean;
    };
    disposal: {
        title: string;
        value: number;
        change: number;
        isIncrease: boolean;
    };
};

type Metric = {
    title: string;
    type: keyof RequestsSummary;
    value: number;
    change: number;
    isIncrease: boolean;
};

export function RequestsDashboard({
    requestsSummary,
}: {
    requestsSummary: RequestsSummary;
}) {
    const metrics: Metric[] = (
        ["storage", "withdrawal", "return", "disposal"] as const
    ).map((type) => {
        const metric = requestsSummary[type];
        return {
            title: metric.title,
            type,
            value: metric.value,
            change: metric.change,
            isIncrease: metric.isIncrease,
        };
    });

    const totalRequests = metrics.reduce((sum, m) => sum + m.value, 0);
    const totalChange = metrics.reduce((sum, m) => sum + m.change, 0);

    return (
        <Card className="p-2 rounded-xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <h2 className="text-xl">Requests</h2>
            </CardHeader>

            <CardBody>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-end gap-3">
                            <h2 className="text-5xl font-bold">
                                {totalRequests.toLocaleString()}
                            </h2>
                            {totalChange > 0 ? (
                                <div className="flex gap-1 bg-green-100 text-green-600 p-1 text-xs rounded items-center">
                                    <p>+{totalChange}</p>
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            ) : (
                                <div className="flex gap-1 bg-muted text-muted-foreground p-1 text-xs rounded items-center">
                                    <p>No new activity</p>
                                    <TrendingDown className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {totalRequests > 0 ? (
                                <>
                                    Looks like{" "}
                                    <strong className="text-green-700">
                                        {totalChange}
                                    </strong>{" "}
                                    fresh requests just landed this month.
                                </>
                            ) : (
                                "No requests submitted yet this month."
                            )}
                        </p>
                    </div>

                    <RequestDistributionBar
                        storage={requestsSummary.storage.value}
                        withdrawal={requestsSummary.withdrawal.value}
                        returnCount={requestsSummary.return.value}
                        disposal={requestsSummary.disposal.value}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((metric) => {
                            const isZero = metric.value === 0;
                            return (
                                <Card key={metric.title} className="p-1">
                                    <CardHeader className="flex flex-col items-start">
                                        <div className="flex gap-2 items-end">
                                            <div
                                                className={clsx(
                                                    "rounded-full h-5 w-5 flex items-center justify-center",
                                                    typeColorMap[metric.type]
                                                )}
                                            />
                                            <h2 className="text-sm font-medium">
                                                {metric.title}
                                            </h2>
                                        </div>
                                        <p
                                            className={clsx(
                                                "my-1 text-2xl font-bold",
                                                isZero &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {metric.value.toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            {!isZero && (
                                                <>
                                                    <Plus
                                                        className={clsx(
                                                            "h-4 w-4",
                                                            isZero
                                                                ? "text-muted-foreground"
                                                                : "text-green-600"
                                                        )}
                                                    />
                                                    <span
                                                        className={clsx(
                                                            "font-semibold",
                                                            isZero
                                                                ? "text-muted-foreground"
                                                                : "text-green-600"
                                                        )}
                                                    >
                                                        {metric.change}
                                                    </span>
                                                </>
                                            )}
                                            <span>
                                                {isZero
                                                    ? "No new requests"
                                                    : "new requests this month"}
                                            </span>
                                        </div>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
