import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
// import NoRequest from "./EmptyState";
import RequestView from "@/Components/PageLayoutViewController";
import List from "./Views/List";
import { BoxFormProvider } from "@/Providers/BoxFormProvider";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { SeparatorIcon } from "./icons";
import { FormProp } from "@/Utils/types";

const RequestStoragePage = () => {
    const { form = null } = usePage<{ form?: FormProp }>().props;

    return (
        <BoxFormProvider>
            <Head title="Request Storage" />
            <div className="flex flex-col gap-5">
                <div className="flex w-full">
                    <div className="flex-grow">
                        <Breadcrumbs size="lg" separator={<SeparatorIcon />}>
                            <BreadcrumbItem
                                onPress={() => {
                                    router.visit("/request/storage");
                                }}
                            >
                                <h1 className="text-2xl font-bold">
                                    Request Storage
                                </h1>
                            </BreadcrumbItem>
                            {form?.number && (
                                <BreadcrumbItem>
                                    <h1 className="text-2xl font-bold">
                                        {form.number}
                                    </h1>
                                </BreadcrumbItem>
                            )}
                        </Breadcrumbs>
                        {form?.number ? (
                            <p>Last updated {form.last_update}</p>
                        ) : (
                            <p>Easily Request and Track Document Storage</p>
                        )}
                    </div>
                    <div
                        className={
                            "flex-1 flex gap-2 justify-end content-end flex-wrap"
                        }
                    >
                        <RequestView pageId="storage" />
                    </div>
                </div>
                {/* <NoRequest /> */}
                <List />
            </div>
        </BoxFormProvider>
    );
};

export default RequestStoragePage;
