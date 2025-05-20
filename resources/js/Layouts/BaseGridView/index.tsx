// components/BaseGridView.tsx
import React from "react";

interface BaseGridViewProps<T> {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    columns?: number; // number of columns, default 3
    gap?: string; // gap between items, default "1rem"
    emptyMessage?: string;
    loading?: boolean;
}

export default function BaseGridView<T>({
    data,
    renderItem,
    columns = 3,
    gap = "1rem",
    emptyMessage = "No data available",
    loading = false,
}: BaseGridViewProps<T>) {
    if (loading) {
        return <div>Loading...</div>;
    }

    if (data.length === 0) {
        return <div>{emptyMessage}</div>;
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap,
            }}
        >
            {data.map((item, index) => (
                <div key={index}>{renderItem(item)}</div>
            ))}
        </div>
    );
}
