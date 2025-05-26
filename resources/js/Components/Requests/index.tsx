import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import PageLayoutViewController from "@/Components/PageLayoutViewController";
import { BoxFormProvider } from "@/Providers/BoxFormProvider";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { BoxFormState, FormProp } from "@/Utils/types";
import { useLayoutViewContext } from "@/Contexts/LayoutViewContext";
import {
    RequestsListView,
    RequestsGridView,
    RequestDetailsListView,
    RequestDetailsGridView,
} from "@/Components/Requests/views";
import Icon from "../Icon";
import { useBoxForm } from "@/Contexts/BoxFormContext";

const PAGE_ID = "requests";

const RequestsPage = () => {
    const {
        form = null,
        requests = [],
        boxes: savedBoxes = [],
    } = usePage<{
        form?: FormProp;
        requests?: Request[];
        boxes?: BoxFormState[];
    }>().props;
    const { setBoxes } = useBoxForm();
    const { getLayoutView } = useLayoutViewContext();
    const currentLayout = getLayoutView(PAGE_ID) ?? "list"; // Default to list

    const hasFormAndBoxes = form && savedBoxes;
    const hasRequests = !!requests;

    // If saved boxes are present, sync them to local unsaved state
    React.useEffect(() => {
        setBoxes(savedBoxes);
        sessionStorage.setItem("boxes", JSON.stringify(savedBoxes)); // optional
    }, [savedBoxes, setBoxes]);

    const renderContent = () => {
        if (hasFormAndBoxes) {
            return currentLayout === "grid" ? (
                <RequestDetailsGridView data={[]} loading={false} />
            ) : (
                <RequestDetailsListView loading={false} />
            );
        } else if (hasRequests) {
            return currentLayout === "grid" ? (
                <RequestsGridView data={requests} loading={false} />
            ) : (
                <RequestsListView data={requests} loading={false} />
            );
        } else {
            return <div className="text-gray-500">No data available.</div>;
        }
    };

    return (
        <BoxFormProvider>
            <Head title="Requests" />
            <div className="flex flex-col gap-5">
                {/* Header Section */}
                <div className="flex w-full">
                    <div className="flex-grow">
                        <Breadcrumbs
                            size="lg"
                            separator={<Icon name="chevron-right" size={18} />}
                        >
                            <BreadcrumbItem
                                onPress={() => router.visit("/request")}
                            >
                                <h1 className="text-2xl font-bold">Requests</h1>
                            </BreadcrumbItem>
                            {form?.number && (
                                <BreadcrumbItem>
                                    <h1 className="text-2xl font-bold">
                                        {form.number}
                                    </h1>
                                </BreadcrumbItem>
                            )}
                        </Breadcrumbs>
                        <p className="text-sm text-gray-500">
                            {form?.number
                                ? `Last updated ${form.last_update}`
                                : "Easily Create and Track Requests"}
                        </p>
                    </div>

                    <div className="flex gap-2 justify-end items-end flex-wrap">
                        <PageLayoutViewController pageId={PAGE_ID} />
                    </div>
                </div>

                {/* Main Content */}
                {renderContent()}
            </div>
        </BoxFormProvider>
    );
};

export default RequestsPage;
