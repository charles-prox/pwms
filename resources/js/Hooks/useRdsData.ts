import useFetch from "./useFetch";

interface RdsData {
    id: number;
    rds_number: string;
    document_title: string;
    retention_period: number;
    department?: string | null;
}

const useRdsData = () => {
    // Fetch data from API
    const { data, loading, error, refetch } = useFetch<{
        success: boolean;
        data: any;
        filterable_columns: string[];
    }>("/rds/all", { success: false, data: [], filterable_columns: [] });

    const rdsData: RdsData[] = data.success
        ? data.data.map((rds: any) => ({
              id: rds.id,
              rds_number: rds.rds_number,
              document_title: rds.document_title,
              retention_period: rds.retention_period,
              department: rds.department,
          }))
        : [];

    // Function to get RDS details by ID
    const getRdsDetailsById = (id: number) => {
        const rds = rdsData.find((r) => r.id === id);

        return rds
            ? {
                  id: rds.id,
                  document_title: rds.document_title,
                  retention_period: rds.retention_period,
                  rds_number: rds.rds_number,
              }
            : {
                  id: null,
                  document_title: null,
                  retention_period: null,
                  rds_number: null,
              };
    };

    return {
        rdsData,
        loading,
        error,
        refetch,
        getRdsDetailsById,
    };
};

export default useRdsData;
