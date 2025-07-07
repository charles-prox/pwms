// pages/RequestsPage/page.tsx
import RequestsPage from "@/Pages/RequestsPage/RequestViews";
import { BoxFormProvider } from "@/Providers/BoxFormProvider";
import { LayoutViewProvider } from "@/Providers/LayoutViewProvider";
import { SelectedBoxesProvider } from "@/Providers/SelectedBoxesProvider";
import React from "react";

export default function Page() {
    return (
        <LayoutViewProvider>
            <SelectedBoxesProvider>
                <BoxFormProvider>
                    <RequestsPage />
                </BoxFormProvider>
            </SelectedBoxesProvider>
        </LayoutViewProvider>
    );
}
