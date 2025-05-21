import { Card, CardBody } from "@heroui/react";
import React from "react";

interface BaseGridViewProps<T> {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    minWidthClass?: string; // e.g., 'sm:w-1/2 md:w-1/3 xl:w-1/4'
    gap?: string; // Tailwind spacing class, e.g. 'gap-4'
    emptyMessage?: string;
    loading?: boolean;
}

export default function BaseGridView<T>({
    data,
    renderItem,
    minWidthClass = "sm:w-1/2 md:w-1/3 xl:w-1/4",
    gap = "gap-4",
    emptyMessage = "No data available",
    loading = false,
}: BaseGridViewProps<T>) {
    if (loading) {
        return <div className="text-gray-500">Loading...</div>;
    }

    if (data.length === 0) {
        return <div className="text-gray-400 italic">{emptyMessage}</div>;
    }

    return (
        <Card>
            <CardBody>
                <div className={`flex flex-wrap ${gap} p-4`}>
                    {data.map((item, index) => (
                        <Card isPressable key={index}>
                            <CardBody>
                                <div key={index} className="w-40">
                                    {renderItem(item)}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
