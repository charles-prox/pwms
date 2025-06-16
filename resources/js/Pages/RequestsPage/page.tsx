// pages/RequestsPage/page.tsx
import RequestsPage from "@/Pages/RequestsPage/RequestViews";
import { BoxFormProvider } from "@/Providers/BoxFormProvider";
import { LayoutViewProvider } from "@/Providers/LayoutViewProvider";
import React from "react";

export default function Page() {
    return (
        <LayoutViewProvider>
            <BoxFormProvider>
                <RequestsPage />
            </BoxFormProvider>
        </LayoutViewProvider>
    );
}
