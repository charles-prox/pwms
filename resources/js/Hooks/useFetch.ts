import { axiosInstance } from "@/Utils/axios";
import { useState, useEffect } from "react";
import qs from "query-string"; // Helps with query parameter serialization

type UseFetchResponse<T> = {
    data: T;
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

type FetchOptions = {
    method?: "GET" | "POST";
    body?: Record<string, unknown> | null;
    params?: Record<string, unknown>; // Allows dynamic query params
};

const useFetch = <T>(
    url: string,
    defaultValue: T = [] as T,
    options: FetchOptions = {}
): UseFetchResponse<T> => {
    const { method = "GET", body = null, params = {} } = options;
    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (): Promise<void> => {
        setLoading(true);

        try {
            const queryString = qs.stringify(params, { skipNull: true });
            const requestUrl = queryString ? `${url}?${queryString}` : url;

            let response;
            if (method === "POST" && body) {
                response = await axiosInstance.post(requestUrl, body);
            } else {
                response = await axiosInstance.get(requestUrl);
            }

            setData(response.data ?? defaultValue);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            setData(defaultValue);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url, JSON.stringify(params)]); // Re-fetch when params change

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;
