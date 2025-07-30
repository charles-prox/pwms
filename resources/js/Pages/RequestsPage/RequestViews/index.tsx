import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import PageLayoutViewController from "@/Components/PageLayoutViewController";
import { Breadcrumbs, BreadcrumbItem, Button } from "@heroui/react";
import { BoxFormState, FormDetails, FormProp } from "@/Utils/types";
import { useLayoutViewContext } from "@/Contexts/LayoutViewContext";
import {
    RequestsListView,
    RequestsGridView,
} from "@/Pages/RequestsPage/RequestViews/views";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import FormPreview from "../../../Components/FormPreview";
import RequestDetails from "../RequestDetails";
import { useSelectedBoxes } from "@/Contexts/SelectedBoxesContext";

const PAGE_ID = "requests";

const RequestsPage = () => {
    const {
        form = null,
        requests = [],
        show_form = false,
        form_details = null,
    } = usePage<{
        form?: FormProp;
        requests?: FormProp[];
        show_form?: boolean;
        form_details?: FormDetails;
    }>().props;
    const url = usePage().url;
    const { setBoxes } = useBoxForm();
    const { bulkAddBoxes } = useSelectedBoxes();
    const { getLayoutView } = useLayoutViewContext();
    const currentLayout = getLayoutView(PAGE_ID) ?? "list"; // Default to list

    const hasFormAndBoxes = form && !!form.boxes;
    const hasRequests = !!requests;

    // If saved boxes are present, sync them to local unsaved state
    React.useEffect(() => {
        if (form && form.boxes.length > 0) {
            if (form.request_type.toLowerCase() === "withdrawal") {
                bulkAddBoxes(form.boxes);
                localStorage.setItem(
                    "selectedBoxes",
                    JSON.stringify(form.boxes)
                ); // optional
            } else {
                setBoxes(form.boxes); // For storage requests, or others
                localStorage.setItem("boxes", JSON.stringify(form.boxes)); // optional
            }
        }
    }, [form]);

    const renderContent = () => {
        if (show_form && form_details)
            return (
                <FormPreview previewMode={true} form_details={form_details} />
            );

        if (hasFormAndBoxes) {
            return <RequestDetails form={form} />;
        }

        if (hasRequests) {
            return currentLayout === "grid" ? (
                <RequestsGridView data={requests} loading={!!!requests} />
            ) : (
                <RequestsListView data={requests} loading={!!!requests} />
            );
        }

        return <div className="text-gray-500">No data available.</div>;
    };

    return (
        <>
            <Head title="Requests" />
            <Breadcrumbs
                className="mb-3"
                onAction={(key) => router.visit(key as string)}
            >
                <BreadcrumbItem key="/">Dashboard</BreadcrumbItem>
                <BreadcrumbItem isCurrent={url === "/request"} key="/request">
                    Requests
                </BreadcrumbItem>
                {url.includes("print") ? (
                    <BreadcrumbItem isCurrent={url !== "/request"}>
                        Print
                    </BreadcrumbItem>
                ) : (
                    url !== "/request" && (
                        <BreadcrumbItem isCurrent={url !== "/request"}>
                            Details
                        </BreadcrumbItem>
                    )
                )}
            </Breadcrumbs>
            <div className="flex flex-col gap-5">
                {/* Header Section */}
                <div className="flex w-full">
                    <div className="flex-grow">
                        {url === "/request" ? (
                            <>
                                <h1 className="text-xl font-bold">
                                    Requests Management
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Easily Create and Track Requests
                                </p>
                            </>
                        ) : url.includes("print") ? (
                            <div className="flex flex-row items-end gap-2">
                                <div className=" flex-grow">
                                    <h1 className="text-xl font-bold">
                                        Print Request Form
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Print 3 copies—one for the regional
                                        document custodian, one for the
                                        requesting office, and one for warehouse
                                        personnel.
                                    </p>
                                </div>
                                <Button
                                    size="md"
                                    color="primary"
                                    onPress={() => router.visit("/request")}
                                >
                                    Done
                                </Button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-xl font-bold">
                                    Request Details
                                </h1>
                                <p className="text-sm text-gray-500">
                                    View and Manage Request Details
                                </p>
                            </>
                        )}
                    </div>
                    {url === "/request" && (
                        <div className="flex gap-2 justify-end items-end flex-wrap">
                            <PageLayoutViewController pageId={PAGE_ID} />
                        </div>
                    )}
                </div>

                {/* Main Content */}
                {renderContent()}
            </div>
        </>
    );
};

export default RequestsPage;
