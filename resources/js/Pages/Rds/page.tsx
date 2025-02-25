import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import ListViewLayout from "@/Layouts/ListViewLayout";
import { columns } from "./columns";
import UploadForm from "./forms/UploadForm";
import { axiosInstance } from "@/Utils/axios";
import { useTableOptions } from "@/Contexts/TableOptionsContext";

interface RdsItem {
    id: number;
    module: string;
    item_no: number;
    title_description: string;
    active?: string;
    storage?: string;
    remarks?: string;
    department?: string;
}

const TABLE_ID = "rds_management"; // Unique table identifier

const RdsPage: React.FC = () => {
    const [isFileUploadOpen, setIsFileUploadOpen] = useState<boolean>(false);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const { getTableOptions, updateTableOptions } = useTableOptions();

    // Get the table options for this specific table
    const tableOptions = getTableOptions(TABLE_ID);
    const { current_page, per_page, search_key, filters } = tableOptions;

    const [rdsItems, setRdsItems] = useState<RdsItem[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalRdsItems, setTotalRdsItems] = useState<number>(0);

    const fetchRdsItems = async (): Promise<void> => {
        setIsDataLoading(true);
        try {
            const response = await axiosInstance.get<{
                success: boolean;
                data: {
                    current_page: number;
                    data: RdsItem[];
                    total: number;
                };
            }>("/rds/get", {
                params: {
                    page: current_page,
                    per_page: per_page,
                    search_key: search_key,
                    filters: filters,
                },
            });
            // console.log("response: ", response.data.data);

            setRdsItems(response.data.data.data);
            setTotalPages(
                Math.ceil(response.data.data.total / parseInt(per_page))
            );
            setTotalRdsItems(response.data.data.total);
        } catch (error: unknown) {
            console.error("Error fetching RDS items", error);
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        fetchRdsItems();
    }, [current_page, per_page, search_key, filters]);

    useEffect(() => {
        setIsDataLoading(false);
    }, [rdsItems]);

    return (
        <div>
            <Head title="RDS Management" />
            <div className="flex flex-col gap-10">
                <div>
                    <h1 className="text-2xl font-bold">RDS Management</h1>
                    <p>
                        Manage Records Disposition Schedule (RDS) for all
                        documents used in the office.
                    </p>
                </div>
                <div className="w-full">
                    <ListViewLayout
                        tableid={TABLE_ID}
                        columns={columns}
                        rows={rdsItems}
                        pages={totalPages}
                        totalRows={totalRdsItems}
                        onOpenUploadForm={() =>
                            setIsFileUploadOpen(!isFileUploadOpen)
                        }
                        onOpenAddNewForm={() => {}}
                        isDataLoading={isDataLoading}
                    />
                </div>
            </div>
            <UploadForm
                isOpen={isFileUploadOpen}
                onClose={() => setIsFileUploadOpen(false)}
            />
        </div>
    );
};

export default RdsPage;
