import Icon from "@/Components/Icon";
import React from "react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: string; // HeroUI icon name
    action?: React.ReactNode;
}

export default function EmptyState({
    title = "Nothing found",
    description = "There's nothing here yet.",
    icon = "gui-folder-open",
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <Icon name={icon} size={300} className="mb-4 text-gray-400" />
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm mt-1">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
