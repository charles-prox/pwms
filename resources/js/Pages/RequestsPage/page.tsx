// pages/RequestsPage/page.tsx
import RequestsPage from "@/Components/Requests";
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
