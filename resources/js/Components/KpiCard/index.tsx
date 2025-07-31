import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { ArrowUp, ArrowUpRight, ArrowDown } from "lucide-react";
import clsx from "clsx";
import React from "react";
import { useTheme } from "@/Contexts/ThemeContext";

interface KpiCardProps {
    title: string;
    data: string | number;
    delta?: number;
    description?: string;
    positiveTrend?: boolean;
    highlight?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
    title,
    data,
    delta = 0,
    description = "Compared to last month",
    positiveTrend = true,
    highlight = false,
}) => {
    const TrendIcon = positiveTrend ? ArrowUp : ArrowDown;
    const { theme } = useTheme();

    const isDark = theme === "dark";

    const trendColor = clsx({
        "text-green-200": highlight && positiveTrend,
        "text-red-300": highlight && !positiveTrend,
        "text-green-600": !highlight && positiveTrend,
        "text-red-600": !highlight && !positiveTrend,
    });

    const titleTextColor = clsx({
        "text-gray-100": highlight,
        "text-gray-900": !highlight && !isDark,
        "text-gray-200": !highlight && isDark,
    });

    const dataTextColor = clsx({
        "text-gray-100": highlight,
        "text-gray-900": !highlight && !isDark,
        "text-gray-200": !highlight && isDark,
    });

    const cardClasses = clsx(
        "p-2 rounded-xl min-w-[250px]",
        highlight
            ? "bg-gradient-to-b from-green-950 via-green-850 to-green-700 shadow-md"
            : isDark
            ? "bg-gray-900 border border-gray-700"
            : "bg-white border border-gray-200"
    );

    return (
        <Card className={cardClasses}>
            <CardHeader className="flex justify-between items-center">
                <h2 className={clsx("text-md font-semibold", titleTextColor)}>
                    {title}
                </h2>
                <Button
                    isIconOnly
                    radius="full"
                    className={clsx(
                        "transition-colors",
                        highlight
                            ? isDark
                                ? "bg-gray-300"
                                : "bg-gray-100"
                            : isDark
                            ? "border border-gray-500"
                            : "border border-black"
                    )}
                    size="sm"
                    variant={highlight ? "flat" : "bordered"}
                    aria-label="View Details"
                >
                    <ArrowUpRight
                        className={clsx(
                            "h-4 w-4",
                            highlight
                                ? isDark
                                    ? "text-green-900"
                                    : "text-green-950"
                                : isDark
                                ? "text-white"
                                : "text-black"
                        )}
                    />
                </Button>
            </CardHeader>

            <CardBody className="overflow-visible py-2">
                <div className={clsx("text-5xl font-bold pb-2", dataTextColor)}>
                    {data}
                </div>
                <div
                    className={clsx(
                        "flex items-center space-x-1 text-xs",
                        trendColor
                    )}
                >
                    <div className="flex items-center space-x-1">
                        <span className="font-semibold">
                            {positiveTrend ? "+" : "-"}
                            {Math.abs(delta)}
                        </span>
                        <TrendIcon className="h-3 w-3" />
                    </div>
                    <span>{description}</span>
                </div>
            </CardBody>
        </Card>
    );
};

export default KpiCard;
