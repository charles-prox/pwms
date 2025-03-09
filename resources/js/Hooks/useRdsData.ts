import { useState, useMemo } from "react";
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

interface UseRdsDataOptions {
    fetchAll?: boolean;
}

const useRdsData = ({
    fetchAll: initialFetchAll = false,
}: UseRdsDataOptions = {}) => {
    const [pagination, setPagination] = useState({ perPage: 10, page: 1 });
    const [searchKey, setSearchKey] = useState<string>("");
    const [filters, setFilters] = useState<Filter[]>([]);
    const [fetchAll, setFetchAll] = useState<boolean>(initialFetchAll); // ✅ Set initial value from options

    // Memoize params to prevent unnecessary re-fetches
    const params = useMemo(
        () => ({
            per_page: pagination.perPage,
            page: pagination.page,
            search_key: searchKey,
            filters,
            all: fetchAll,
        }),
        [pagination, searchKey, filters, fetchAll]
    );

    // Fetch data from API
    const { data, loading, error, refetch } = useFetch<{
        success: boolean;
        data: any;
        filterable_columns: string[];
    }>(
        "/rds/get",
        { success: false, data: [], filterable_columns: [] },
        { params }
    );

    const rdsData: RdsData[] = data.success
        ? data.data.map((rds: any) => ({
              id: rds.id,
              rds_number: rds.rds_number,
              title_description: rds.title_description,
              retention_period: rds.retention_period,
              department: rds.department,
          }))
        : [];

    // Function to get RDS details by ID
    const getRdsDetailsById = (id: number) => {
        const rds = rdsData.find((r) => r.id === id);

        return rds
            ? {
                  document_title: rds.title_description,
                  retention_period: rds.retention_period,
                  rds_number: rds.rds_number,
              }
            : {
                  document_title: null,
                  retention_period: null,
                  rds_number: null,
              };
    };

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
        getRdsDetailsById,
    };
};

export default useRdsData;
