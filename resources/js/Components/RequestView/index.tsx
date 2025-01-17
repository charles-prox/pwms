import React from "react";
import { RequestViewProvider } from "@/Providers/RequestViewProvider";
import ViewButton from "./ViewButton";

interface RequestViewProps {
    pageId: string;
}

export default function RequestView({ pageId }: RequestViewProps) {
    return (
        <RequestViewProvider>
            <ViewButton pageId={pageId} />
        </RequestViewProvider>
    );
}
