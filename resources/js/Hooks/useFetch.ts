import { axiosInstance } from "@/Utils/axios";
import { useState, useEffect } from "react";

// Define a generic type for the data that will be returned (it defaults to an empty array).
type UseFetchResponse<T> = {
    data: T;
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

const useFetch = <T>(
    url: string,
    defaultValue: T = [] as T, // Default value is an empty array of type T
    method: "GET" | "POST" = "GET", // Method can either be GET or POST
    body: Record<string, unknown> | null = null // Body should be an object or null
): UseFetchResponse<T> => {
    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (): Promise<void> => {
        setLoading(true);

        try {
            let response;
            if (method === "POST" && body) {
                response = await axiosInstance.post(url, body);
            } else {
                response = await axiosInstance.get(url);
            }

            if (response.data) {
                setData(response.data); // Set the data if the response contains data
            } else {
                setData(defaultValue); // Otherwise, use the default value
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            console.log("Error: ", err instanceof Error ? err.message : err);
            setData(defaultValue);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;
