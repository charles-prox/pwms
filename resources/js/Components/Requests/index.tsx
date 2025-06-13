import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import PageLayoutViewController from "@/Components/PageLayoutViewController";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { BoxFormState, FormDetails, FormProp } from "@/Utils/types";
import { useLayoutViewContext } from "@/Contexts/LayoutViewContext";
import {
    RequestsListView,
    RequestsGridView,
} from "@/Components/Requests/views";
import Icon from "../Icon";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import FormPreview from "../FormPreview";
import RequestDetails from "./RequestDetails";

const PAGE_ID = "requests";

const RequestsPage = () => {
    const {
        form = null,
        requests = [],
        boxes: savedBoxes = [],
        show_form = false,
        form_details = null,
    } = usePage<{
        form?: FormProp;
        requests?: Request[];
        boxes?: BoxFormState[];
        show_form?: boolean;
        form_details?: FormDetails;
    }>().props;
    const url = usePage().url;
    const { setBoxes } = useBoxForm();
    const { getLayoutView } = useLayoutViewContext();
    const currentLayout = getLayoutView(PAGE_ID) ?? "list"; // Default to list

    const hasFormAndBoxes = form && savedBoxes;
    const hasRequests = !!requests;

    // If saved boxes are present, sync them to local unsaved state
    React.useEffect(() => {
        setBoxes(savedBoxes);
        sessionStorage.setItem("boxes", JSON.stringify(savedBoxes)); // optional
    }, []);

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
                            {(form?.form_number ||
                                form_details?.request?.form_number) && (
                                <BreadcrumbItem
                                    onPress={() =>
                                        router.visit(
                                            "/request/" +
                                                (form?.form_number ||
                                                    form_details?.request
                                                        ?.form_number)
                                        )
                                    }
                                >
                                    <h1 className="text-2xl font-bold">
                                        Details
                                    </h1>
                                </BreadcrumbItem>
                            )}
                            {form_details?.request?.form_number && (
                                <BreadcrumbItem>
                                    <h1 className="text-2xl font-bold">
                                        Print Request
                                    </h1>
                                </BreadcrumbItem>
                            )}
                        </Breadcrumbs>
                        {url === "/request" && (
                            <p className="text-sm text-gray-500">
                                Easily Create and Track Requests
                            </p>
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
