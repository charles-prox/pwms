import React from "react";
import { Pagination } from "@nextui-org/react";

interface FooterContentProps {
    page: number;
    pages: number;
    setPage: (page: number) => void;
    selectedKeys?: any[]; // Adjust type based on your data structure
    itemsLength?: number;
    hasSearchFilter?: boolean;
}

const FooterContent: React.FC<FooterContentProps> = ({
    page,
    pages,
    setPage,
    selectedKeys,
    itemsLength,
    hasSearchFilter,
}) => {
    return (
        <div className="py-2 px-2 flex justify-center items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
            />
        </div>
    );
};

export default FooterContent;
