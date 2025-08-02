import React from "react";
import { TrendingUp, TrendingDown, Plus, ArrowUp } from "lucide-react";
import { Card, CardBody, CardHeader, Chip, Tooltip } from "@heroui/react";
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
        averageTatDays: number | null;
    };
    withdrawal: {
        title: string;
        value: number;
        change: number;
        isIncrease: boolean;
        averageTatDays: number | null;
    };
    return: {
        title: string;
        value: number;
        change: number;
        isIncrease: boolean;
        averageTatDays: number | null;
    };
    disposal: {
        title: string;
        value: number;
        change: number;
        isIncrease: boolean;
        averageTatDays: number | null;
    };
};

type Metric = {
    title: string;
    type: keyof RequestsSummary;
    value: number;
    change: number;
    isIncrease: boolean;
    averageTatDays: number | null;
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
            averageTatDays: metric.averageTatDays,
        };
    });

    const totalRequests = metrics.reduce((sum, m) => sum + m.value, 0);
    const totalChange = metrics.reduce((sum, m) => sum + m.change, 0);
    const validTats = metrics
        .map((metric) => metric.averageTatDays)
        .filter((tat) => tat !== null);

    const overallAverageTat =
        validTats.length > 0
            ? (
                  validTats.reduce((sum, tat) => sum + tat, 0) /
                  validTats.length
              ).toFixed(2)
            : "N/A";

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
                                <Tooltip
                                    content={
                                        <div>
                                            <p>
                                                Looks like{" "}
                                                <strong className="text-green-700">
                                                    {totalChange}
                                                </strong>{" "}
                                                fresh requests just landed this
                                                month.
                                            </p>
                                        </div>
                                    }
                                    placement="right"
                                >
                                    <div className="flex gap-1 bg-green-100 text-green-600 p-1 text-xs rounded items-center">
                                        <p>+{totalChange}</p>
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                </Tooltip>
                            ) : (
                                <div className="flex gap-1 bg-muted text-muted-foreground p-1 text-xs rounded items-center">
                                    <p>No new activity</p>
                                    <TrendingDown className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Overall Avg. TAT:{" "}
                            <strong className="text-primary-700">
                                {overallAverageTat}{" "}
                                {overallAverageTat === "1.00"
                                    ? "business day"
                                    : "business days"}
                            </strong>
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
                            const tatDisplay =
                                metric.averageTatDays !== null
                                    ? `${metric.averageTatDays} ${
                                          metric.averageTatDays === 1
                                              ? "business day"
                                              : "business days"
                                      }`
                                    : "N/A";

                            return (
                                <Card key={metric.title} className="p-1">
                                    <CardHeader className="flex flex-col items-start">
                                        <div className="flex flex-row justify-between w-full">
                                            <div className="flex flex-grow gap-2 items-end ">
                                                <div
                                                    className={clsx(
                                                        "rounded-full h-5 w-5 flex items-center justify-center",
                                                        typeColorMap[
                                                            metric.type
                                                        ]
                                                    )}
                                                />
                                                <h2 className="text-sm font-medium">
                                                    {metric.title}
                                                </h2>
                                            </div>
                                            <div>
                                                {!isZero && (
                                                    <Tooltip
                                                        content={
                                                            <p className="text-xs">
                                                                <span className="font-semibold text-green-600">
                                                                    {
                                                                        metric.change
                                                                    }
                                                                </span>
                                                                <span>
                                                                    {
                                                                        " new requests this month"
                                                                    }
                                                                </span>
                                                            </p>
                                                        }
                                                    >
                                                        <Chip
                                                            size="sm"
                                                            variant="flat"
                                                            color="primary"
                                                        >
                                                            <div className="flex items-center gap-0">
                                                                <Plus
                                                                    className={clsx(
                                                                        "h-2 w-2",
                                                                        "text-green-700"
                                                                    )}
                                                                />
                                                                <span className="font-semibold text-green-600">
                                                                    {
                                                                        metric.change
                                                                    }
                                                                </span>
                                                                {/* <span>
                                                    {isZero
                                                        ? "No new requests"
                                                        : "new requests this month"}
                                                </span> */}
                                                            </div>
                                                        </Chip>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 my-1 ">
                                            <p
                                                className={clsx(
                                                    "text-2xl font-bold",
                                                    isZero &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {metric.value.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Insert TAT here */}
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Avg. TAT:{" "}
                                            <strong className="text-blue-700">
                                                {tatDisplay}
                                            </strong>
                                        </p>
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
