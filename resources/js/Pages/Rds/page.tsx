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
    const { getTableOptions, updateTableOptions } = useTableOptions();

    // Get the table options for this specific table
    const tableOptions = getTableOptions(TABLE_ID);
    const { current_page, per_page, search_key } = tableOptions;

    const [rdsItems, setRdsItems] = useState<RdsItem[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchRdsItems = async (): Promise<void> => {
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
                },
            });

            setRdsItems(response.data.data.data);
            setTotalPages(
                Math.ceil(response.data.data.total / parseInt(per_page))
            );
        } catch (error: unknown) {
            console.error("Error fetching RDS items", error);
        }
    };

    useEffect(() => {
        fetchRdsItems();
    }, [current_page, per_page, search_key]);

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
                        columns={columns}
                        rows={rdsItems}
                        page={parseInt(current_page)}
                        pages={totalPages}
                        setPage={(newPage) =>
                            updateTableOptions(TABLE_ID, {
                                current_page: newPage.toString(),
                            })
                        }
                        rowsPerPage={parseInt(per_page)}
                        setRowsPerPage={(newRowsPerPage) =>
                            updateTableOptions(TABLE_ID, {
                                per_page: newRowsPerPage.toString(),
                            })
                        }
                        setSearchKey={(key) =>
                            updateTableOptions(TABLE_ID, {
                                search_key: key,
                                current_page: "1",
                            })
                        }
                        onOpenUploadForm={() =>
                            setIsFileUploadOpen(!isFileUploadOpen)
                        }
                        onOpenAddNewForm={() => {}}
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
