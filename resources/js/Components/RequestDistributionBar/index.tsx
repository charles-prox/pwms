import React from "react";

interface RequestBarProps {
    storage: number;
    withdrawal: number;
    returnCount: number;
    disposal: number;
}

const RequestDistributionBar: React.FC<RequestBarProps> = ({
    storage,
    withdrawal,
    returnCount,
    disposal,
}) => {
    const total = storage + withdrawal + returnCount + disposal;

    const getPercent = (value: number) =>
        total > 0 ? `${(value / total) * 100}%` : "0%";

    return (
        <div className="flex h-8 w-full overflow-hidden gap-1">
            <div
                className="bg-green-400 rounded-full"
                style={{ width: getPercent(storage) }}
                title={`Storage: ${storage}`}
            />
            <div
                className="bg-yellow-400 rounded-full"
                style={{ width: getPercent(withdrawal) }}
                title={`Withdrawal: ${withdrawal}`}
            />
            <div
                className="bg-blue-400 rounded-full"
                style={{ width: getPercent(returnCount) }}
                title={`Return: ${returnCount}`}
            />
            <div
                className="bg-red-400 rounded-full"
                style={{ width: getPercent(disposal) }}
                title={`Disposal: ${disposal}`}
            />
        </div>
    );
};

export default RequestDistributionBar;
