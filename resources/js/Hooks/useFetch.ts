import { axiosInstance } from "@/Utils/axios";
import { useState, useEffect, useCallback } from "react";
import qs from "query-string";

type UseFetchResponse<T> = {
    data: T;
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

type FetchOptions = {
    method?: "GET" | "POST";
    body?: Record<string, unknown> | null;
    params?: Record<string, unknown>;
    autoFetch?: boolean; // 👈 new flag
};

const useFetch = <T>(
    url: string,
    defaultValue: T = [] as T,
    options: FetchOptions = {}
): UseFetchResponse<T> => {
    const {
        method = "GET",
        body = null,
        params = {},
        autoFetch = true, // 👈 default behavior unchanged
    } = options;

    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState<boolean>(autoFetch);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const queryString = qs.stringify(params, { skipNull: true });
            const requestUrl = queryString ? `${url}?${queryString}` : url;

            const response =
                method === "POST" && body
                    ? await axiosInstance.post(requestUrl, body)
                    : await axiosInstance.get(requestUrl);

            setData(response.data ?? defaultValue);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            setData(defaultValue);
        } finally {
            setLoading(false);
        }
    }, [url, method, body, JSON.stringify(params)]);

    // 👇 Only auto-fetch when explicitly allowed
    useEffect(() => {
        if (autoFetch) fetchData();
    }, [fetchData, autoFetch]);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;
