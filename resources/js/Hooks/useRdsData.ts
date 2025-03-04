import { useState } from "react";
import useFetch from "./useFetch";

interface RdsData {
    id: number;
    rds_number: string;
    title_description: string;
    retention_period: number;
    department?: string | null;
}

interface Filter {
    column: string;
    value: string;
}

const useRdsData = () => {
    const [pagination, setPagination] = useState({ perPage: 10, page: 1 });
    const [searchKey, setSearchKey] = useState<string>("");
    const [filters, setFilters] = useState<Filter[]>([]);
    const [fetchAll, setFetchAll] = useState<boolean>(false);

    // Use the fetch hook with dynamic params
    const { data, loading, error, refetch } = useFetch<{
        success: boolean;
        data: any;
        filterable_columns: string[];
    }>(
        "/rds/get",
        { success: false, data: [], filterable_columns: [] },
        {
            params: {
                per_page: pagination.perPage,
                page: pagination.page,
                search_key: searchKey,
                filters,
                all: fetchAll,
            },
        }
    );

    const rdsData = data.success
        ? data.data.map((rds: any) => ({
              id: rds.id,
              rds_number: `RDS-${rds.module} #${rds.item_no}`,
              title_description: rds.title_description,
              retention_period: Number(rds.active) + Number(rds.storage) + 1,
              department: rds.department,
          }))
        : [];

    return {
        rdsData,
        loading,
        error,
        filterableColumns: data.filterable_columns || [],
        refetch,
        setPagination,
        setSearchKey,
        setFilters,
        setFetchAll,
    };
};

export default useRdsData;
