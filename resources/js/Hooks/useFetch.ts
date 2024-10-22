import { axiosInstance } from "@/Utils/axios";
import { useState, useEffect } from "react";

const useFetch = <T>(url: string) => {
    const [data, setData] = useState<Iterable<T> | T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get<T>(url);
            if (response.data && Array.isArray(response.data)) {
                setData(response.data); // If the response is an array, set the data
            } else {
                setData([]); // If not, ensure that it's an empty array to maintain an iterable state
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;
