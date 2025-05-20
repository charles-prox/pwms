import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import LayoutViewController from "@/Components/Shared/PageLayoutViewController";
import { BoxFormProvider } from "@/Providers/BoxFormProvider";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { FormProp } from "@/Utils/types";
import { useLayoutViewContext } from "@/Contexts/LayoutViewContext";
import { SeparatorIcon } from "./icons";
import {
    RequestsListView,
    RequestsGridView,
} from "@/Components/Requests/views";

const PAGE_ID = "requests";

const RequestsPage = () => {
    const {
        form = null,
        requests = [],
        boxes = [],
    } = usePage<{
        form?: FormProp;
        requests?: Request[];
        boxes?: Request[];
    }>().props;
    const { getLayoutView } = useLayoutViewContext();

    const currentLayout = getLayoutView(PAGE_ID) ?? "list"; // Default to list if undefined

    return (
        <BoxFormProvider>
            <Head title="Requests" />
            <div className="flex flex-col gap-5">
                {/* Header Section */}
                <div className="flex w-full">
                    <div className="flex-grow">
                        <Breadcrumbs size="lg" separator={<SeparatorIcon />}>
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
                        <LayoutViewController pageId={PAGE_ID} />
                    </div>
                </div>

                {/* Main Content: Switch between List or Grid */}
                {currentLayout === "grid" ? (
                    <RequestsGridView />
                ) : (
                    <RequestsListView data={requests} loading={false} />
                )}
            </div>
        </BoxFormProvider>
    );
};

export default RequestsPage;
