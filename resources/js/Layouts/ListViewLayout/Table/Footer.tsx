import React from "react";
import { Pagination } from "@heroui/react";
import { useTableOptions } from "@/Contexts/TableOptionsContext";

interface FooterContentProps {
    tableid: string; // Adjust type based on your data structure
    pages: number;
}

const FooterContent: React.FC<FooterContentProps> = ({ tableid, pages }) => {
    const { getTableOptions, updateTableOptions } = useTableOptions();

    // Get the table options for this specific table
    const tableOptions = getTableOptions(tableid);
    const { current_page } = tableOptions;

    return (
        <div className="py-2 px-2 flex justify-center items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={parseInt(current_page)}
                total={pages}
                onChange={(page) =>
                    updateTableOptions(tableid, {
                        current_page: page.toString(),
                    })
                }
            />
        </div>
    );
};

export default FooterContent;
