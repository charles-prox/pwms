import Icon from "@/Components/Icon";
import BaseGridView from "@/Layouts/BaseGridView";
import { FormProp } from "@/Utils/types";
import { Button } from "@heroui/react";
import React from "react";

interface RequestsGridViewProps {
    data: FormProp[];
    loading?: boolean;
}
const RequestsGridView = ({ data, loading = false }: RequestsGridViewProps) => {
    return (
        <BaseGridView
            data={data}
            loading={loading}
            gap="gap-6"
            minWidthClass="sm:w-1/2 md:w-1/3 xl:w-1/4"
            renderItem={(item: any) => (
                <div>
                    <div className="flex justify-between items-center">
                        <p className="text-md font-semibold ">
                            {item.form_number}
                        </p>
                        <Button size="sm" isIconOnly variant="flat">
                            <Icon name="navi-menu-dot" size={20} />
                        </Button>
                    </div>
                    <Icon name="file-req" size={160} />
                </div>
            )}
        />
    );
};

export default RequestsGridView;
