// pages/RequestsPage/page.tsx
import RequestsPage from "@/Components/Requests";
import { LayoutViewProvider } from "@/Providers/LayoutViewProvider";
import React from "react";

export default function Page() {
    return (
        <LayoutViewProvider>
            <RequestsPage />
        </LayoutViewProvider>
    );
}
